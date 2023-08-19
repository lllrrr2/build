#!/bin/sh
. /usr/bin/softwarecenter/lib_functions.sh
website_list=/opt/wwwroot/website_list

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

handle_website() {
    get_env
    config_get port "$1" port
    config_get website_name "$1" website_name
    config_get redis_enabled "$1" redis_enabled
    config_get website_select "$1" website_select
    config_get website_enabled "$1" website_enabled
    config_get autodeploy_enable "$1" autodeploy_enable
    local name="${website_name%% *}"
    [ "$autodeploy_enable" = 1 ] || append delete_list "$name"
    [ -n "$delete_list" -a "$website_select" = 11 ] && delete_website
    if [ "$autodeploy_enable" = 1 ] && ! ls "$dir_vhost" | grep -q "^${name}\.conf"; then
        install_${name//-/_} "$website_select" "$port"
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

install_tz() {
    filelink="https://raw.githubusercontent.com/WuSiYu/PHP-Probe/master/tz.php"
    local istar="php"
    web_installer "tz" "tz" || return 1
    local index_php="index tz.php;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_phpMyAdmin() {
    filelink=$(curl -ksSL https://www.phpmyadmin.net | grep -oP '(?<=download_popup" href=")[^"]*')
    web_installer "phpMyAdmin-*-languages" || return 1
    cp /opt/wwwroot/$name/config.sample.inc.php /opt/wwwroot/$name/config.inc.php
    chmod 644 /opt/wwwroot/$name/config.inc.php
    # 取消-p参数，必须要求webdir创建才可创建文件夹，为部署检测做准备
    make_dir /opt/wwwroot/$name/tmp
    sed -i "s/.*blowfish_secret.*/\$cfg['blowfish_secret'] = 'softwarecentersoftwarecentersoftwarecenter';/g" /opt/wwwroot/$name/config.inc.php
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "phpMyaAdmin的用户、密码就是数据库用户：$user 密码：$pass"
}

install_WordPress() {
    filelink="https://cn.wordpress.org/latest-zh_CN.zip"
    web_installer "wordpress" || return 1
    local otherconf="include /opt/etc/nginx/conf/wordpress.conf;"
    add_vhost
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

install_owncloud() {
    filelink="https://download.owncloud.com/server/stable/owncloud-complete-latest.zip"
    web_installer "owncloud" || return 1
    local otherconf="include /opt/etc/nginx/conf/owncloud.conf;"
    add_vhost
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "安装好之后可以点击左上角三条杠进入market安装丰富的插件，比如在线预览图片、视频等"
    echo_time "需要先在web界面配置完成后，才能使用开启Redis"
}

install_nextcloud() {
    filelink="https://download.nextcloud.com/server/releases/nextcloud-27.0.2.zip"
    web_installer "nextcloud" || return 1
    local otherconf="include /opt/etc/nginx/conf/nextcloud.conf;"
    add_vhost
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "需要先在 web 界面配置完成后，才能使用开启Redis"
}

install_h5ai() {
    filelink="https://release.larsjung.de/h5ai/h5ai-0.30.0.zip"
    web_installer "_h5ai" "_h5ai" || return 1
    cp /opt/wwwroot/$name/_h5ai/README.md /opt/wwwroot/$name/
    local index_php="index /_h5ai/public/index.php;"
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

install_Lychee() {
    filelink="https://github.com/electerious/Lychee/archive/master.zip"
    web_installer "Lychee-master" || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "首次打开会要配置数据库信息"
    echo_time "地址：127.0.0.1 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "下面的可以不配置，然后下一步创建个用户就可以用了"
}

install_Kodexplorer() {
    filelink="https://static.kodcloud.com/update/download/kodbox.1.43.zip"
    web_installer "kodexplorer" "kodexplorer" || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_Typecho() {
    filelink=$(curl -ksSL https://api.github.com/repos/typecho/typecho/releases | jq -r '.[0].assets[].browser_download_url')
    web_installer "typecho" "typecho" || return 1
    local otherconf="include /opt/etc/nginx/conf/typecho.conf;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

install_Z_Blog() {
    filelink=$(curl -ksSL https://api.github.com/repos/zblogcn/zblogphp/releases | jq -r '.[0].assets[].browser_download_url')
    web_installer "zblogphp" "zblogphp" || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
}

install_DzzOffice() {
    # local latest_tag=$(curl -ksSL https://api.github.com/repos/zyx0814/dzzoffice/releases | jq -r '.[0].tag_name')
    filelink="https://codeload.github.com/zyx0814/dzzoffice/zip/master"
    web_installer "dzzoffice-master" || return 1
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
    echo_time "DzzOffice应用市场中，某些应用无法自动安装的，请自行参看官网给的手动安装教程"
}

install_x_prober() {
    filelink="https://github.com/kmvan/x-prober/raw/master/dist/prober.php"
    local istar="php"
    web_installer "x-prober" "x-prober" || return 1
    local index_php="index x-prober.php;"
    add_vhost "include /opt/etc/nginx/conf/php-fpm.conf;"
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
