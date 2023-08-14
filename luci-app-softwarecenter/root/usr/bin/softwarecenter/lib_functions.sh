#!/bin/sh
. /lib/functions.sh
export PATH="/opt/bin:/opt/sbin:/usr/sbin:/usr/bin:/sbin:/bin"
log="/tmp/log/softwarecenter.log"

load_config() {
    get_config="delaytime cpu_model deploy_mysql deploy_nginx disk_mount download_dir entware_enable mysql_enabled nginx_enabled partition_disk pass old_pass swap_enabled swap_path swap_size webui_name webui_pass am_port ar_port de_port rt_port qb_port tr_port old_ar_port old_am_port old_de_port old_qb_port old_rt_port old_tr_port"
    config_load softwarecenter
    for rt in $get_config; do
        config_get_bool $rt main $rt
        config_get $rt main $rt
    done
}

_info() {
    logger -st 'softwarecenter' -p 'daemon.info' "$*"
}

uci_get_type() {
    uci_get softwarecenter "main" "$1" "$2"
}

uci_set_type() {
    uci_set softwarecenter "${3:-main}" "$1" "$2"
    uci_commit softwarecenter
}

make_dir() {
    for p in $@; do
        [ -n "$p" -a ! -d "$p" ] && mkdir -m 777 -p "$p"
    done
    return 0
}

_pidof() {
    if ps | grep "$1" | grep -q "opt"; then
        echo_time "$1 已经运行"
        return 0
    fi
    echo_time "$1 没有运行"
    return 1
}

echo_time() {
    echo -e "[ $(date +"%m月%d日 %H:%M:%S") ] $@" | sed '/\\\033/d'
}

status() {
    exit_code="$?"
    if [ "$exit_code" = "0" ]; then
        echo "   成功"
        return 0
    else
        echo "   失败"
        return 1
    fi
}

check_url() {
    local url="$1" ping_file="/tmp/ping"
    if wget -S --no-check-certificate --spider --tries=3 "$url" 2>&1 | grep -q 'HTTP/1.1 200 OK'; then
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
    local exists _old_port
    [ -n "$1" ] && eval "old_port=\"\${$1}\"" || old_port=$port
    local website_name=${1:-$website_name}

    while [ -z "${old_port}" ] || lsof -i:"${old_port}" >/dev/null 2>&1; do
        _old_port=${_old_port:-$old_port}
        old_port=$(($(tr -dc '0-9' < /dev/urandom | head -c 4) + 1024))
        exists=1
    done

    port="$old_port"
    if [ -n "$exists" -a -n "$_old_port" ]; then
        available_name=$(lsof -i:"$_old_port" | awk 'NR==2 {print $1}')
        echo_time "$website_name 设定的 $_old_port 端口已在 $available_name 中使用，使用没有占用的端口 $port"
        if [ -n "$1" ]; then
            uci_set_type "$website_name" "$port"
        else
            uci_set_type "port" "$port" "@website[$website_select]"
        fi
    fi
}

modify_port() {
    if [ -x "/opt/bin/amuled" -a -n "$am_port" ]; then
        old_am_port=${old_am_port:-$(awk -F "=" '/\[WebServer\]/{flag=1;next} flag && /Port/{print $2;flag=0}' /opt/var/amule/amule.conf)}
        if [ "$old_am_port" != "$am_port" ]; then
            check_port_usage am_port
            [ -n "$port" ] && {
                uci_set_type old_am_port "$port"
                sed -i "s/Port=$old_am_port/Port=$port/" /opt/var/amule/amule.conf
                /opt/etc/*/S57am* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/aria2c" -a -n "$ar_port" ]; then
        old_ar_port=${old_ar_port:-$(grep -oP 'rpc-listen-port=\K\d+' /opt/etc/aria2/aria2.conf)}
        if [ "$old_ar_port" != "$ar_port" ]; then
            check_port_usage ar_port
            [ -n "$port" ] && {
                uci_set_type old_ar_port "$port"
                sed -i "/rpc-listen-port=/s/=.*/=$port/" /opt/etc/aria2/aria2.conf
                /opt/etc/*/S81aria2 restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/deluged" -a -n "$de_port" ]; then
        old_de_port=${old_de_port:-$(grep -oP '(?<=-p )\d+' /opt/etc/*/S81deluge-web)}
        if [ "$old_de_port" != "$de_port" ]; then
            check_port_usage de_port
            [ -n "$port" ] && {
                uci_set_type old_de_port "$port"
                sed -i "s/-p $old_de_port/-p $port/" /opt/etc/*/S81deluge-web
                /opt/etc/*/S80de* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/qbittorrent-nox" -a -n "$qb_port" ]; then
        old_qb_port=${old_qb_port:-$(grep -oP '(?<=webui-port=)\d+' /opt/etc/*/S89qb*)}
        if [ "$old_qb_port" != "$qb_port" ]; then
            check_port_usage qb_port
            [ -n "$port" ] && {
                uci_set_type old_qb_port "$port"
                sed -i "s/port=$old_qb_port/port=$port/" /opt/etc/*/S89qb*
                /opt/etc/*/S89qb* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/rtorrent" -a -n "$rt_port" ]; then
        old_rt_port=${old_rt_port:-$(grep -oP '^server.port=\s*\K\d+' /opt/etc/*/*/99-rtor*)}
        if [ "$old_rt_port" != "$rt_port" ]; then
            check_port_usage rt_port
            [ -n "$port" ] && {
                uci_set_type old_rt_port "$port"
                sed -i "s/port=$old_rt_port/port=$port/" /opt/etc/*/*/99-rtor*
                /opt/etc/*/S80lig* restart >/dev/null 2>&1
            }
        fi
    fi

    if [ -x "/opt/bin/transmission-daemon" -a -n "$tr_port" ]; then
        old_tr_port=${old_tr_port:-$(grep -oP "(?<=--port )\d+" /opt/etc/*/S88tran*)}
        if [ "$old_tr_port" != "$tr_port" ]; then
            check_port_usage tr_port
            [ -n "$port" ] && {
                uci_set_type old_tr_port "$port"
                sed -i "s/\(--port \)[0-9]\+/\1$port/" /opt/etc/*/S88tran*
                /opt/etc/*/S88tran* restart >/dev/null 2>&1
            }
        fi
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
        if [ "$(/opt/bin/opkg list 2>/dev/null | awk '{print $1}' | grep -w $ipk)" ]; then
            if which "$ipk" | grep -q opt; then
                echo_time "$ipk 已经安装  $(which $ipk | grep -q opt)"
            else
                echo_time "正在安装  $ipk\c"
                $time_out /opt/bin/opkg install $ipk --force-maintainer --force-reinstall >/dev/null 2>&1
                status || {
                    [ x"$time_out" = "x" ] && {
                        echo_time "强制安装  $ipk\c"
                        /opt/bin/opkg install $ipk --force-depends --force-overwrite >/dev/null 2>&1
                        status
                    }
                }
            fi
        else
            echo_time "$ipk 不在 Entware 软件源，跳过安装！"
            return 1
        fi
    done
}

# 软件包安装 参数: $@:安装列表
install_soft() {
    check_url "bin.entware.net"
    /opt/bin/opkg update >/dev/null 2>&1
    for ipk in $@; do
        which "$ipk" >/dev/null 2>&1 && {
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

entware_set() {
    [ -x /etc/init.d/entware ] && entware_unset
    [ -n "$2" ] || { echo_time "未选择安装路径！"; exit 1; }
    [ -n "$1" ] || { echo_time "未选择CPU架构！"; exit 1; }
    system_check "$2"
    make_dir "$2/opt" /opt
    mount -o bind "$2/opt" /opt

    case $1 in
        x86)     arch="x86-k2.6" ;;
        x86_64)  arch="x64-k3.2" ;;
        mips)    arch="mipssf-k3.4" ;;
        armv5)   arch="armv5sf-k3.2" ;;
        armv7)   arch="armv7sf-k3.2" ;;
        mipsel)  arch="mipselsf-k3.4" ;;
        aarch64) arch="aarch64-k3.10" ;;
        *)  echo_time "抱歉，不支持您的设备！"
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
	START=51

	get_entware_path() {
	    for mount_point in $(mount | awk '/mnt/{print $3}'); do
	        [ -e "$mount_point/opt/etc/init.d/rc.unslung" ] && {
	            echo "$mount_point"
	            break
	        }
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
	ENTWARE

    chmod +x /etc/init.d/entware
    /etc/init.d/entware enable
    sed -i 's|PATH="/|PATH="/opt/bin:/opt/sbin:/|' /etc/profile

    # if wget -qcNO- -t5 "https://bin.entware.net/other/i18n_glib231.tar.gz" | tar xz -C /opt/share/; then
    #     /opt/bin/localedef.new -c -f UTF-8 -i zh_CN zh_CN.UTF-8
    #     sed -i 's/en_US.UTF-8/zh_CN.UTF-8/g' /opt/etc/profile
    #     ln -sf /opt/share/zoneinfo/Asia/Shanghai /opt/etc/localtime
    # fi

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
    sleep 5
    /etc/init.d/entware disable >/dev/null 2>&1
    rm /etc/init.d/entware
    sed -i "s|/opt/bin:/opt/sbin:||" /etc/profile
    source /etc/profile >/dev/null 2>&1
    umount -lf /opt
    rm -rf /opt $(get_entware_path)/opt
}

# 磁盘分区挂载
system_check() {
    local partition_disk="$1"
    grep -q $partition_disk /proc/mounts && {
        filesystem="$(grep "${partition_disk} " /proc/mounts | awk '{print $3}')"
        lo=`lsblk | grep $partition_disk | awk '{print $4}' | sed 's/G//'`
        if [ "$filesystem" = "ext4" ]; then
            [ "${lo%%.*}" -gt 2 ] && {
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
        # partition_disk=`uci get softwarecenter.main.partition_disk`
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

config_swap() {
    local path="${1:-/opt}/.swap" size="$2"
    if [ "$#" -eq 2 ]; then
        grep -q "$path" /proc/swaps && return 0
        echo_time "正在$path生成 $size MB 的交换分区，请耐心等待..."
        install_soft fallocate >/dev/null 2>&1
        fallocate -l ${size}M $path >/dev/null 2>&1
        # dd if=/dev/zero of=$path bs=1M count=$size >/dev/null 2>&1
        mkswap "$path"
        chmod 0600 "$path"
        swapon "$path" && echo_time "$path 交换分区已启用\n"
    elif [ "$#" -eq 1 ]; then
        swapoff $path
        rm -f $path
        echo_time "$path 交换分区已删除！\n"
    fi
}

SOFTWARECENTER() {
    source /etc/profile >/dev/null 2>&1
    if [ "$entware_enable" = 1 ]; then
        if [ ! -e /etc/init.d/entware ]; then
            echo_time "========= 开始部署entware环境 ========="
            entware_set $cpu_model $disk_mount
            source /etc/profile >/dev/null 2>&1
        fi
    else
        if [ -x /etc/init.d/entware ]; then
            entware_unset
            echo_time "entware环境已删除！"
        fi
        return 0
    fi

    if [ "$deploy_nginx" = 1 ]; then
        [ ! -x /opt/etc/init.d/S80nginx ] && echo_time "========= 开始安装Nginx =========" && init_nginx
        if [ "$nginx_enabled" = 1 ]; then
            pidof nginx &> /dev/null || nginx_manage start
        else
            nginx_manage stop
        fi
    else
        [ -x /opt/etc/init.d/S80nginx ] && echo_time "========= 卸载Nginx相关的软件包 =========" && del_nginx
    fi

    if [ "$deploy_mysql" = 1 ]; then
        [ ! -x /opt/etc/init.d/S70mysqld ] && echo_time "========= 开始安装MySQL =========" && init_mysql
        if [ "$mysql_enabled" = 1 ]; then
            if pidof mysqld &> /dev/null; then
                pass=${pass:-123456}
                [ -z "$old_pass" ] && uci_set_type old_pass "$pass"
                if [ "$pass" != "$old_pass" ]; then
                    uci_set_type old_pass "$pass"
                    mysqladmin -u root password "$pass"
                fi
            else
                /opt/etc/init.d/S70mysqld start >/dev/null 2>&1
            fi
        else
            /opt/etc/init.d/S70mysqld stop >/dev/null 2>&1
        fi
    else
        [ -x /opt/etc/init.d/S70mysqld ] && echo_time "========= 卸载MySQL相关的软件包 =========" && del_mysql
    fi

    if ls /opt/etc/nginx/vhost/* &> /dev/null || ls /opt/etc/nginx/no_use/* &> /dev/null; then
        pidof nginx &> /dev/null && config_foreach handle_website website
    fi

    ls /opt/etc/config/* &> /dev/null && modify_port
    [ "$swap_enabled" = 1 ] && config_swap $swap_path $swap_size || config_swap $swap_path

    [ -x /etc/init.d/entware ] || return 0
    for package_name in $(grep -Po "(?<=option )\w+(?=_boot)" /etc/config/softwarecenter); do
        if [ "$(uci_get_type ${package_name}_boot)" = 1 ]; then
            init=$(find /opt/etc/init.d/ -name "*$package_name*")
            if [ ! -x "$init" ]; then
                echo_time "=========== 开始安装 $package_name ==========="
                case "$package_name" in
                    amule) install_amule >> "$log" ;;
                    aria2) install_aria2 >> "$log" ;;
                    deluged) install_deluge >> "$log" ;;
                    rtorrent) install_rtorrent >> "$log" ;;
                    qbittorrent) install_qbittorrent >> "$log" ;;
                    transmission) install_transmission 4 >> "$log" ;;
                    *) break ;;
                esac
                echo_time "=========== $package_name 安装完成 ===========\n"
            elif ! _pidof "$package_name" >/dev/null 2>&1; then
                if $init start >/dev/null 2>&1; then
                    echo_time "$package_name 启动成功"
                else
                    echo_time "$package_name 启动失败"
                fi
                [ $delaytime ] && sleep $delaytime
            fi
        fi
    done
}

get_env() {
    username=${USER:-$(id -un)}
    localhost=$(ip addr show br-lan | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
    localhost=${localhost:-"你的路由器IP"}
}
load_config
