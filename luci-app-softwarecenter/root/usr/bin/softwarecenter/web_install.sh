#!/bin/sh
. /usr/bin/softwarecenter/lib_functions.sh
website_list=/opt/wwwroot/website_list

# 网站程序安装 参数： $1:安装目标 $2:端口号
install_website() {
    unset dirname port hookdir istar fpmconf otherconf index_php
    [ -n $2 ] && port=$2
    case $1 in
        0)  install_tz ;;
        1)  install_phpmyadmin ;;
        2)  install_wordpress ;;
        3)  install_owncloud ;;
        4)  install_nextcloud ;;
        5)  install_h5ai ;;
        6)  install_lychee ;;
        7)  install_kodexplorer ;;
        8)  install_typecho ;;
        9)  install_zblog ;;
        10) install_dzzoffice ;;
        11) install_x_prober ;;
        *)  break ;;
    esac
}

website_name_link() {
    case "$website_select" in
        0)  # (0) tz（雅黑PHP探针）
            name="tz"
            filelink="https://raw.githubusercontent.com/WuSiYu/PHP-Probe/master/tz.php" ;;
        1)  # (1) phpMyAdmin（数据库管理工具）
            name="phpMyAdmin"
            filelink="https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip" ;;
        2)  # (2) WordPress（使用最广泛的CMS）
            name="WordPress"
            filelink="https://cn.wordpress.org/latest-zh_CN.zip" ;;
        3)  # (3) Owncloud（经典的私有云）
            name="Owncloud"
            filelink="https://download.owncloud.com/server/stable/owncloud-complete-latest.zip" ;;
        4)  # (4) Nextcloud（Owncloud团队的新作，美观强大的个人云盘）
            name="Nextcloud"
            filelink="https://download.nextcloud.com/server/releases/nextcloud-27.0.2.zip" ;;
        5)  # (5) h5ai（优秀的文件目录）
            name="h5ai"
            filelink="https://release.larsjung.de/h5ai/h5ai-0.30.0.zip" ;;
        6)  # (6) Lychee（一个很好看，易于使用的Web相册）
            name="Lychee"
            filelink="https://github.com/electerious/Lychee/archive/master.zip" ;;
        7)  # (7) Kodexplorer（可道云aka芒果云在线文档管理器）
            name="Kodexplorer"
            filelink="https://static.kodcloud.com/update/download/kodbox.1.43.zip" ;;
        8)  # (8) Typecho (流畅的轻量级开源博客程序)
            name="Typecho"
            filelink="https://github.com/typecho/typecho/releases/download/v1.2.1/typecho.zip" ;;
        9)  # (9) Z-Blog (体积小，速度快的PHP博客程序)
            name="Zblog"
            filelink="https://update.zblogcn.com/zip/Z-BlogPHP_1_7_3_3290_Finch.zip" ;;
        10) # (10) DzzOffice (开源办公平台)
            name="DzzOffice"
            filelink="https://codeload.github.com/zyx0814/dzzoffice/zip/master" ;;
        11) # (11) x-prober (X探針)
            name="x-prober"
            filelink="https://github.com/kmvan/x-prober/raw/master/dist/prober.php" ;;
        *) break ;;
    esac
}

# WEB程序安装器
web_installer() {
    echo -e "\n================================================"
    echo -e "***********************    WEB程序安装器    ***********************"
    echo -e "================================================\n"

    dirname="$1" hookdir="$2" suffix=${istar:-zip}
    echo_time "开始安装 $name"
    [ -d "/opt/wwwroot/$name" ] && {
        rm -rf /opt/wwwroot/"$name"* /opt/tmp/"$name"* /opt/etc/nginx/*/$name.conf
        echo_time "已删除以前的 $name 文件"
    }

    echo_time "正在下载安装包 $name.$suffix 请耐心等待..."
    wget -qO /opt/tmp/$name.$suffix "$filelink" && {
        make_dir /opt/wwwroot/$hookdir
        mv /opt/tmp/$name.$suffix /opt/wwwroot/ >/dev/null 2>&1

        echo_time "正在解压 $name.$suffix..."
        if [ "$istar" = "tar" ]; then
            tar -xzf /opt/wwwroot/$name.$suffix -C /opt/wwwroot/$hookdir
        elif [ "$istar" = "php" ]; then
            cp /opt/wwwroot/$name.$suffix /opt/wwwroot/$dirname/
        else
            unzip -oq /opt/wwwroot/$name.$suffix -d /opt/wwwroot/$hookdir
        fi
        mv /opt/wwwroot/$dirname /opt/wwwroot/$name >/dev/null 2>&1
        ls -A /opt/wwwroot/$name >/dev/null 2>&1 && {
            echo_time "$name.$suffix 解压完成..."
            chmod -R 777 "/opt/wwwroot/$name"
            echo_time "正在配置 $name..."
            check_port_usage
        } || {
            echo_time "$name 安装失败，回滚操作"
            rm /opt/wwwroot/"$name"*
            return 1
        }
    } || {
        echo_time "$name 下载失败，检查网络。"
        rm /opt/tmp/$name.$suffix
        return 1
    }
}

add_vhost() {
    local ext=".bak"
    [ -n "$1" ] && fpmconf="$1"
    [ "$website_enabled" = 1 ] && {
        ext=""
        echo "$name $localhost:$port " >> $website_list
    }
	cat >"$dir_vhost/$name.conf$ext"<<-EOF
	server {
	    listen $port;
	    server_name localhost;
	    root /opt/wwwroot/$name;
	    ${index_php:-"index index.html index.htm index.php;"}
	    ${fpmconf:-"#"}
	    ${otherconf:-"#"}
	}
	EOF
}

# 恢复网站查端口
port_custom() {
    port=$(grep -oP 'listen \K\d+' "$1" 2>/dev/null)
    name_old_port="$port"
    check_port_usage
    [ "$name_old_port" != "$port" ] && sed -i "s|$name_old_port|$port|" "$1"
    echo "$name $localhost:$port " >> $website_list 
    echo_time "$name 已启用"
    /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
}

# 端口修改
update_port() {
    old_port=$(grep -oP 'listen \K\d+' "$1" 2>/dev/null)
    if [ -n "$port" -a "$old_port" != "$port" ]; then
        check_port_usage
        sed -i "s|listen.*|listen $port;|" "$1"
        sed -i "/$name/s/:.*/:$port /" $website_list
        /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
    fi
}

delete_website() {
    for site in $delete_list; do
        if ls "$dir_vhost" | grep -q "^${site}\.conf"; then
            rm -rf $dir_vhost/"$site"* /opt/wwwroot/"$site"*
            sed -i "/$site/d" "$website_list"
            echo_time "$site 已删除"
            local xx=1
        fi
    done
    [ -n "$xx" ] && /opt/etc/init.d/S80nginx reload > /dev/null 2>&1
    unset xx
}

# 网站迭代处理，本函数迭代的配置网站（处理逻辑也许可以更好的优化？）
handle_website() {
    get_env
    config_get port "$1" port
    config_get redis_enabled "$1" redis_enabled
    config_get website_select "$1" website_select
    config_get website_enabled "$1" website_enabled
    config_get autodeploy_enable "$1" autodeploy_enable
    website_name_link
    [ "$autodeploy_enable" = 1 ] || append delete_list "$name"
    [ -n "$delete_list" -a "$website_select" = 11 ] && delete_website
    if [ "$autodeploy_enable" = 1 ] && ! ls "$dir_vhost" | grep -q "^${name}\.conf"; then
        install_website "$website_select" "$port"
        if [ -f "$dir_vhost/$name.conf" ]; then
            echo_time "$name 安装完成"
            echo_time "浏览器地址栏输入：$localhost:$port 即可访问"
            /opt/etc/init.d/S80nginx reload > /dev/null 2>&1
        elif [ -f "$dir_vhost/$name.conf.bak" ]; then
            echo_time "$name 安装完成，但没有开启！\n"
        else
            echo_time "$name 安装失败"
        fi
    fi

    if [ "$website_enabled" = 1 ]; then
        update_port "$dir_vhost/$name.conf"
        if [ -f "$dir_vhost/$name.conf.bak" ] && ! list_contains delete_list "$name"; then
            echo_time "准备启用 $name"
            mv "$dir_vhost/$name.conf.bak" "$dir_vhost/$name.conf"
            port_custom "$dir_vhost/$name.conf"
        fi

        # if [ "$autodeploy_enable" = 1 -a "$name" = "Nextcloud" -o "$name" = "Owncloud" ]; then
        #     if [ "$redis_enabled" = 1 ]; then
        #         if [ ! -f /opt/wwwroot/$name/redis_enabled ]; then
        #             touch "/opt/wwwroot/$name/redis_enabled"
        #             redis "/opt/wwwroot/$name"
        #         fi
        #     else
        #         rm -rf /opt/wwwroot/$name/config/config.php
        #         rm -rf /opt/wwwroot/$name/redis_enabled
        #     fi
        # fi
    else
        if [ -f "$dir_vhost/$name.conf" ]; then
            mv "$dir_vhost/$name.conf" "$dir_vhost/$name.conf.bak"
            sed -i "/$name/d" "$website_list"
            /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
            echo_time "已关闭 $name"
        fi
    fi
}

install_x_prober() {
    istar="php"
    web_installer "x-prober" "x-prober"
    [ $? = 0 ] || return 1
    index_php="index x-prober.php;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_tz() {
    istar="php"
    web_installer "tz" "tz"
    [ $? = 0 ] || return 1
    index_php="index tz.php;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_phpmyadmin() {
    web_installer "phpMyAdmin-*-languages"
    [ $? = 0 ] || return 1
    cp /opt/wwwroot/$name/config.sample.inc.php /opt/wwwroot/$name/config.inc.php
    chmod 644 /opt/wwwroot/$name/config.inc.php
    # 取消-p参数，必须要求webdir创建才可创建文件夹，为部署检测做准备
    make_dir /opt/wwwroot/$name/tmp
    sed -i "s/.*blowfish_secret.*/\$cfg['blowfish_secret'] = 'softwarecentersoftwarecentersoftwarecenter';/g" /opt/wwwroot/$name/config.inc.php
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "phpMyaAdmin的用户、密码就是数据库用户：$user 密码：$pass"
}

install_wordpress() {
    web_installer "wordpress"
    [ $? = 0 ] || return 1
    otherconf="include /opt/etc/nginx/conf/wordpress.conf;"
    add_vhost
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

install_h5ai() {
    web_installer "_h5ai" "_h5ai"
    [ $? = 0 ] || return 1
    cp /opt/wwwroot/$name/_h5ai/README.md /opt/wwwroot/$name/
    index_php="index /_h5ai/public/index.php;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    sed -i '{
        /show/ {s|false|true|}
        s|googleapis.com|loli.net|
        /enabled/ {s|false|true|g}
        /lang/ {s|: ".*"|: "zh-cn"|}
        /alwaysVisible/ {s|false|true|}
    }' /opt/wwwroot/h5ai/_h5ai/private/conf/options.json
    ln -s /etc/config /opt/wwwroot/h5ai
    rm -rf /opt/usr/php/session/*
    echo_time "配置文件在/opt/wwwroot/$name/_h5ai/private/conf/options.json"
    echo_time "你可以通过修改它来获取更多功能"
}

install_lychee() {
    web_installer "Lychee-master"
    [ $? = 0 ] || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "首次打开会要配置数据库信息"
    echo_time "地址：127.0.0.1 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "下面的可以不配置，然后下一步创建个用户就可以用了"
}

install_kodexplorer() {
    web_installer "kodexplorer" "kodexplorer"
    [ $? = 0 ] || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_typecho() {
    web_installer "build" "build"
    [ $? = 0 ] || return 1
    otherconf="include /opt/etc/nginx/conf/typecho.conf;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

install_zblog() {
    web_installer "Z-BlogPHP" "Z-BlogPHP"
    [ $? = 0 ] || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_dzzoffice() {
    web_installer "dzzoffice-master"
    [ $? = 0 ] || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "DzzOffice应用市场中，某些应用无法自动安装的，请自行参看官网给的手动安装教程"
}

install_owncloud() {
    web_installer "owncloud"
    [ $? = 0 ] || return 1
    otherconf="include /opt/etc/nginx/conf/owncloud.conf;"
    add_vhost
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "安装好之后可以点击左上角三条杠进入market安装丰富的插件，比如在线预览图片、视频等"
    echo_time "需要先在web界面配置完成后，才能使用开启Redis"
}

install_nextcloud() {
    web_installer "nextcloud"
    [ $? = 0 ] || return 1
    otherconf="include /opt/etc/nginx/conf/nextcloud.conf;"
    add_vhost
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "需要先在 web 界面配置完成后，才能使用开启Redis"
}

redis() {
    cp $1/config/config.php $1/config/config.php.bak
    sed -i "/);/d" $1/config/config.php
	cat >>"$1/config/config.php" <<-\EOF
	'memcache.locking' => '\OC\Memcache\Redis',
	'memcache.local' => '\OC\Memcache\Redis',
	'redis' => array(
	    'host' => '/opt/var/run/redis.sock',
	    'port' => 0,
	    ),
	);
	EOF
    echo_time "$name 已开启Redis"
}

# 自定义部署通用函数 参数：$1:文件目录 $2:端口号
install_custom() {
    webdir=$1
    check_port_usage
    echo_time "正在配置 $webdir ..."

    # 目录检查
    if [ ! -d /opt/wwwroot/$webdir ]; then
        echo_time "目录不存在，部署中断"
        exit 1
    fi
    chmod -R 777 /opt/wwwroot/$webdir

    # 添加到虚拟主机
    fpm="include /opt/etc/nginx/conf/php-fpm.conf;"
    add_vhost $port $webdir
    echo_time "$webdir 安装完成"
}
