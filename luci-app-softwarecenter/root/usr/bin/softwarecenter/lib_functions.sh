#!/bin/sh
export PATH="/opt/bin:/opt/sbin:/usr/sbin:/usr/bin:/sbin:/bin"
log="/tmp/log/softwarecenter.log"

uci_get_type() {
    local ret=$(uci -q get softwarecenter.main."$1")
    echo ${ret:-$2}
}


get_config() {
    while [ $# != 0 ]; do
        eval "${1}"=$(uci -q get softwarecenter.main.${1})
        shift
    done
}

uci_set_type() {
    uci -q set softwarecenter.main."$1"="$2" && \
    uci -q commit softwarecenter
}

make_dir() {
    for p in "$@"; do
        [ -d "$p" ] || mkdir -m 777 -p $p
    done
    return 0
}

_pidof() {
    for g in $@; do
        if ps | /opt/bin/grep $g | /opt/bin/grep -q opt; then
            echo_time "$g 已经运行"
            return 0
        fi
    done
    echo_time "$1 没有运行"
    return 1
}

echo_time() {
    echo -e "[ $(date +"%m月%d日 %H:%M:%S") ]  $@" | sed '/\\\033/d'
}

status() {
    local pf=$?
    # echo -en "\\033[40G[ "
    if [ "$pf" = "0" ]; then
        # echo -e "\\033[1;33m成功\\033[0;39m ]"
        echo "   成功"
        return 0
    else
        # echo -e "\\033[1;31m失败\\033[0;39m ]"
        echo "   失败"
        return 1
    fi
}

check_url() {
    local ping_file="/tmp/ping"
    local url="$1"

    if wget -S --no-check-certificate --spider --tries=3 "$url" 2>&1 | /opt/bin/grep -q 'HTTP/1.1 200 OK'; then
        if [ ! -e "$ping_file" ]; then
            local response_time=$(ping -c 3 "$url" | awk -F'/' '/avg/{print $4}')
            if [ -n "$response_time" ]; then
                echo_time "$url 网络平均响应时间 ${response_time}毫秒"
                echo "$response_time" > "$ping_file"
            else
                echo_time "无法获取 $url 的网络平均响应时间"
            fi
        fi
        return 0
    else
        echo_time "$url 连接失败！"
        [ -e "$ping_file" ] && rm "$ping_file"
        exit 1
    fi
}

check_port_usage() {
    local exists=false
    local old_port=${1:-port}
    local usage=$(/opt/bin/lsof -i:${old_port} 2>/dev/null | wc -l)
    while [[ ${usage} -ne 0 ]]; do
        new_port=$(head /dev/urandom | tr -dc '0-9' | fold -w 4 | head -n 1)
        usage=$(/opt/bin/lsof -i:${new_port} 2>/dev/null | wc -l)
        exists=true
    done

    port=${new_port:-$old_port}
    if [ "$exists" = true -a -n "$2" ]; then
        uci_set_type $2 $port
        echo_time "$2 设定的 $old_port 端口已在使用，查找到可用端口 $port"
    fi
}

modify_port() {

    if [ -x "/opt/bin/amuled" -a -n "$am_port" ]; then
        old_am_port=$(awk -F "=" '/\[WebServer\]/{flag=1;next} flag && /Port/{print $2;flag=0}' /opt/var/amule/amule.conf)
        if [ "$old_am_port" != "$am_port" ]; then
            check_port_usage "$am_port" am_port
            [ -n "$port" ] && {
                sed -i "s/Port=$old_am_port/Port=$port/" /opt/var/amule/amule.conf
                /opt/etc/*/S57am* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/deluged" -a -n "$de_port" ]; then
        old_de_port=$(/opt/bin/grep -oP '(?<=-p )\d+' /opt/etc/*/S81deluge-web)
        if [ "$old_de_port" != "$de_port" ]; then
            check_port_usage "$de_port" de_port
            [ -n "$port" ] && {
                sed -i "s/-p $old_de_port/-p $port/" /opt/etc/*/S81deluge-web
                /opt/etc/*/S80de* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/qbittorrent-nox" -a -n "$qb_port" ]; then
        old_qb_port=$(/opt/bin/grep -oP '(?<=webui-port=)\d+' /opt/etc/*/S89qb*)
        if [ "$old_qb_port" != "$qb_port" ]; then
            check_port_usage "$qb_port" qb_port
            [ -n "$port" ] && {
                sed -i "s/port=$old_qb_port/port=$port/" /opt/etc/*/S89qb*
                /opt/etc/*/S89qb* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/rtorrent" -a -n "$rt_port" ]; then
        old_rt_port=$(/opt/bin/grep -oP '^server.port=\s*\K\d+' /opt/etc/*/*/99-rtor*)
        if [ "$old_rt_port" != "$rt_port" ]; then
            check_port_usage "$rt_port" rt_port
            [ -n "$port" ] && {
                sed -i "s/port=$old_rt_port/port=$port/" /opt/etc/*/*/99-rtor*
                /opt/etc/*/S80lig* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/transmission-daemon" -a -n "$tr_port" ]; then
        old_tr_port=$(/opt/bin/grep -oP "(?<=--port )\d+" /opt/etc/*/S88tran*)
        if [ "$old_tr_port" != "$tr_port" ]; then
            check_port_usage "$tr_port" tr_port
            [ -n "$port" ] && {
                sed -i "s/\(--port \)[0-9]\+/\1$port/" /opt/etc/*/S88tran*
                /opt/etc/*/S88tran* restart >/dev/null 2>&1
            }
        fi
    fi
}

port_settings() {
    local name=$website_name
    find_port() {
        for f in `seq 2100 2120`; do
            /opt/bin/lsof -i:$f >/dev/null 2>&1 || {
                port=$f
                break
            }
        done
    }

    if [ -n "$port" ]; then
        /opt/bin/lsof -i:$port >/dev/null 2>&1 && {
            echo_time "$name 设置的端口 $port 已在用，查找可用端口。"
            find_port
            echo_time "$name 使用空闲 $port 的端口"
        } || {
            echo_time "$name 使用自定义 $port 的端口"
        }
    else
        echo_time "$name 没有设置端口，查找可用端口。"
        find_port
        echo_time "$name 使用空闲 $port 的端口"
    fi
}

# 应用安装 参数: $@:安装列表
opkg_install() {
    check_url "bin.entware.net"
    [ -e /opt/var/opkg-lists/entware ] || {
        echo_time "更新软件源中"
        source /etc/profile >/dev/null 2>&1 && \
        /opt/bin/opkg update >/dev/null 2>&1
    }

    for ipk in $@; do
        if [ "$(/opt/bin/opkg list 2>/dev/null | awk '{print $1}' | /opt/bin/grep -w $ipk)" ]; then
            if which $ipk | /opt/bin/grep -q opt; then
                echo_time "$ipk    已经安装 $(which $ipk | /opt/bin/grep -q opt)"
            else
                echo_time "正在安装  $ipk\c"
                $time_out /opt/bin/opkg install $ipk --force-maintainer --force-reinstall >/dev/null 2>&1
                status || {
                    [ "x$time_out" = "x" ] && {
                        echo_time "强制安装  $ipk\c"
                        /opt/bin/opkg install $ipk --force-depends --force-overwrite >/dev/null 2>&1
                        status
                    }
                }
            fi
        else
            echo_time "$ipk 不在 Entware 软件源，跳过安装！"
        fi
    done
}

# 软件包安装 参数: $@:安装列表
install_soft() {
    check_url "bin.entware.net"
    /opt/bin/opkg update >/dev/null 2>&1
    for ipk in $@; do
        which $ipk >/dev/null 2>&1 && {
            echo_time "$ipk    已经安装 $(which $ipk)"
        } || {
            echo_time "正在安装  $ipk\c"
            /opt/bin/opkg install $ipk >/dev/null 2>&1
            status || {
                echo_time "强制安装  $ipk\c"
                $time_out /opt/bin/opkg install $ipk --force-depends --force-overwrite >/dev/null 2>&1
                status
            }
        }
    done
}

# 软件包卸载 参数: $1:卸载列表 说明：本函数将负责强制卸载指定的软件包
remove_soft() {
    for ipk in $@; do
        echo_time "正在卸载 ${ipk}\c"
        /opt/bin/opkg remove $ipk --autoremove --force-depends >/dev/null 2>&1
        status
    done
}

# entware环境设定 参数：$1:安装位置 $2:设备底层架构 说明：此函数用于写入新配置
entware_set() {
    entware_unset

    if [ -z "$1" ]; then
        echo_time "未选择安装路径！"
        exit 1
    fi
    disk_mount="$1"
    system_check "$disk_mount"
    make_dir "$disk_mount/opt" /opt
    mount -o bind "$disk_mount/opt" /opt

    case $2 in
        x86_64)  arch="x64-k3.2" ;;
        x86)     arch="x86-k2.6" ;;
        armv5)   arch="armv5sf-k3.2" ;;
        mipsel)  arch="mipselsf-k3.4" ;;
        mips)    arch="mipssf-k3.4" ;;
        aarch64) arch="aarch64-k3.10" ;;
        armv7)   arch="armv7sf-k3.2" ;;
        *)
            echo_time "抱歉，不支持您的设备！"
            exit 1
            ;;
    esac

    check_url "bin.entware.net"
    echo_time "开始安装 Entware"
    wget -qO- "https://bin.entware.net/$arch/installer/generic.sh" | sh >/dev/null 2>&1 || {
        echo_time "安装 Entware 出错，请重试！"
        exit 1
    }

	cat <<-\ENTWARE >/etc/init.d/entware
	#!/bin/sh /etc/rc.common
	START=50

	get_entware_path() {
	    for mount_point in $(mount | awk '/mnt/{print $3}'); do
	        [ -e "$mount_point/opt/etc/init.d/rc.unslung" ] && echo "$mount_point" && return
	    done
	}

	start() {
	    [ -d opt ] || mkdir -p opt
	    entware_path=$(get_entware_path)
	    [ -z "$entware_path" ] && entware_path=$(uci get softwarecenter.main.disk_mount)
	    mount -o bind "$entware_path/opt" /opt
	}

	stop() {
	    /opt/etc/init.d/rc.unslung stop
	    umount -lf /opt
	    rm -rf /opt
	}

	restart() {
	    stop
	    start
	}
	ENTWARE

    chmod +x /etc/init.d/entware
    /etc/init.d/entware enable
    sed -i 's|PATH="/|PATH="/opt/bin:/opt/sbin:/|' /etc/profile

    if wget -qcNO- -t5 "https://bin.entware.net/other/i18n_glib231.tar.gz" | tar xz -C /opt/share/; then
        /opt/bin/localedef.new -c -f UTF-8 -i zh_CN zh_CN.UTF-8
        sed -i 's/en_US.UTF-8/zh_CN.UTF-8/g' /opt/etc/profile
        ln -sf /opt/share/zoneinfo/Asia/Shanghai /opt/etc/localtime
    fi

    sed -i '/^ansi/d' /opt/etc/init.d/rc.func
    /opt/bin/opkg install e2fsprogs lsof coreutils-timeout jq >/dev/null 2>&1
    echo_time "Entware 安装成功！\n"
}

get_entware_path() {
    for mount_point in $(mount | awk '/mnt/{print $3}'); do
        [ -e "$mount_point/opt/etc/init.d/rc.unslung" ] && echo "$mount_point" && return
    done
}

# entware环境解除 说明：此函数用于删除OPKG配置设定
entware_unset() {
    /etc/init.d/entware stop >/dev/null 2>&1
    /etc/init.d/entware disable >/dev/null 2>&1
    rm /etc/init.d/entware
    sed -i "s|/opt/bin:/opt/sbin:||" /etc/profile
    source /etc/profile >/dev/null 2>&1
    umount -lf /opt
    rm -rf /opt $(get_entware_path)/opt
}

# 磁盘分区挂载
system_check() {
    partition_disk="$1"
    /opt/bin/grep -q $partition_disk /proc/mounts && {
        filesystem="$(/opt/bin/grep "${partition_disk} " /proc/mounts | awk '{print $3}')"
        lo=`lsblk | /opt/bin/grep $partition_disk | awk '{print $4}' | sed 's/G//'`
        if [ "$filesystem" = "ext4" ]; then
            [[ "${lo%%.*}" -gt 2 ]] && {
                echo_time "磁盘 $1 符合安装要求"
            } || {
                echo_time "磁盘 $1 小于2G"
                exit 1
            }
        else
            echo_time "磁盘 $partition_disk 原是 $filesystem 重新格式化ext4。"
            umount -l "$partition_disk"
            echo y | mkfs.ext4 ${partition_disk/mnt/dev}
            mount ${partition_disk/mnt/dev} "$partition_disk"
        fi
    } || {
        partition_disk=`uci get softwarecenter.main.partition_disk`
        echo_time "磁盘$partition_disk没有分区，进行分区并格式化ext4。"
        parted -s "$partition_disk" mklabel msdos
        parted -s "$partition_disk" mklabel gpt \
        mkpart primary ext4 512s 100%
        sync
        sleep 2
        echo y | mkfs.ext4 "$partition_disk"1
        make_dir ${partition_disk/dev/mnt}1
        mount "$partition_disk"1 ${partition_disk/dev/mnt}1
    }
}

# 配置交换分区文件 参数: $1:交换空间大小(M) $2:交换分区挂载点
config_swap_init() {
    local size="$1" path="${2:-/opt}/.swap"

    if /opt/bin/grep -q "$path" /proc/swaps; then
        # echo_time "$path 交换分区已存在"
        return
    fi

    echo_time "正在$path生成 $size MB 的交换分区，请耐心等待..."
    install_soft fallocate >/dev/null 2>&1
    fallocate -l ${size}M $path >/dev/null 2>&1
    # dd if=/dev/zero of=$path bs=1M count=$size >/dev/null 2>&1
    mkswap "$path"
    chmod 0600 "$path"
    swapon "$path" && echo_time "$path 交换分区已启用\n"
}

# 删除交换分区文件 参数: $1:交换分区挂载点
config_swap_del() {
    path="${1:-/opt}/.swap"
    [ -e $path ] && {
        swapoff $path
        rm -f $path
        echo_time "$path 交换分区已删除！\n"
    }
}

# 获取通用环境变量
get_env() {
    username=${USER:-$(id -un)}
    localhost=$(ip addr show br-lan | /opt/bin/grep -oP '(?<=inet\s)\d+(\.\d+){3}')
    localhost=${localhost:-"你的路由器IP"}
}
