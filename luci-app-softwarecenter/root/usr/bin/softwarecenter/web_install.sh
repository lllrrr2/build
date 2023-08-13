#!/bin/sh
. /usr/bin/softwarecenter/lib_functions.sh
website_list=/opt/wwwroot/website_list

# (0) tz（雅黑PHP探针）
url_tz="https://raw.githubusercontent.com/WuSiYu/PHP-Probe/master/tz.php"
# (1) phpMyAdmin（数据库管理工具）
url_phpMyAdmin="https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip"
# (2) WordPress（使用最广泛的CMS）
url_WordPress="https://cn.wordpress.org/latest-zh_CN.zip"
# (3) Owncloud（经典的私有云）
url_Owncloud="https://download.owncloud.com/server/stable/owncloud-complete-latest.zip"
# (4) Nextcloud（Owncloud团队的新作，美观强大的个人云盘）
url_Nextcloud="https://download.nextcloud.com/server/releases/nextcloud-27.0.2.zip"
# (5) h5ai（优秀的文件目录）
url_h5ai="https://release.larsjung.de/h5ai/h5ai-0.30.0.zip"
# (6) Lychee（一个很好看，易于使用的Web相册）
url_Lychee="https://github.com/electerious/Lychee/archive/master.zip"
# (7) Kodexplorer（可道云aka芒果云在线文档管理器）
url_Kodexplorer="https://static.kodcloud.com/update/download/kodbox.1.43.zip"
# (8) Typecho (流畅的轻量级开源博客程序)
url_Typecho="https://github.com/typecho/typecho/releases/download/v1.2.1/typecho.zip"
# (9) Z-Blog (体积小，速度快的PHP博客程序)
url_Zblog="https://update.zblogcn.com/zip/Z-BlogPHP_1_7_3_3290_Finch.zip"
# (10) DzzOffice (开源办公平台)
url_DzzOffice="https://codeload.github.com/zyx0814/dzzoffice/zip/master"
# (11) x-prober (X探針)
url_x="https://github.com/kmvan/x-prober/raw/master/dist/prober.php"

# 网站程序安装 参数： $1:安装目标 $2:端口号
install_website() {
    unset -v filelink name dirname port hookdir istar
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

# 网站名称映射 参数；$1:网站选项
website_name_mapping() {
    case $1 in
        0)  echo "tz" ;;
        1)  echo "phpMyAdmin" ;;
        2)  echo "WordPress" ;;
        3)  echo "Owncloud" ;;
        4)  echo "Nextcloud" ;;
        5)  echo "h5ai" ;;
        6)  echo "Lychee" ;;
        7)  echo "Kodexplorer" ;;
        8)  echo "Typecho" ;;
        9)  echo "Zblog" ;;
        10) echo "DzzOffice" ;;
        11) echo "x" ;;
        *) break ;;
    esac
}

# WEB程序安装器
web_installer() {
    echo -e "\n================================================"
    echo -e "***********************    WEB程序安装器    ***********************"
    echo -e "================================================\n"

    # 获取用户自定义设置
    suffix=${istar:-zip}
    echo_time "开始安装 $name"
    [ -d "/opt/wwwroot/$name" ] && {
        rm -rf /opt/wwwroot/${name}* /opt/tmp/${name}* /opt/etc/nginx/*/$name.conf
        echo_time "已删除以前的 $name 文件"
    }

    # 下载程序并解压
    echo_time "正在下载安装包 $name.$suffix 请耐心等待..."
    wget -qO /opt/tmp/$name.$suffix $filelink && {
        make_dir /opt/wwwroot/$hookdir
        mv /opt/tmp/$name.* /opt/wwwroot/

        echo_time "正在解压 $name.$suffix..."
        if [ "$istar" = "tar" ]; then
            tar -xzf /opt/wwwroot/$name.$suffix -C /opt/wwwroot/$hookdir
        elif [ "$istar" = "php" ]; then
            cp /opt/wwwroot/$name.$suffix /opt/wwwroot/$dirname/
        else
            unzip -oq /opt/wwwroot/$name.$suffix -d /opt/wwwroot/$hookdir
        fi
        mv /opt/wwwroot/$dirname /opt/wwwroot/$name
        ls -A /opt/wwwroot/$name >/dev/null 2>&1 && {
            echo_time "$name.$suffix 解压完成..."
            chmod -R 777 /opt/wwwroot/$name
            echo_time "正在配置 $name..."
            check_port_usage
        } || {
            echo_time "$name 安装失败，回滚操作"
            rm /opt/wwwroot/${name}*
            return 1
        }
    } || {
        echo_time "$name 下载失败，检查网络。"
        rm /opt/tmp/$name.$suffix
        return 1
    }
}

add_vhost() {
    vhost_type="no_use"
    [ "$website_enabled" = 1 ] && vhost_type="vhost" && echo "$name $localhost:$port " >> $website_list
	cat >"/opt/etc/nginx/$vhost_type/$name.conf"<<-EOF
	server {
	    listen $port;
	    server_name localhost;
	    root /opt/wwwroot/$name;
	    index index.html index.htm index.php;
	    #php-fpm
	    #otherconf
	}
	EOF
}

# 恢复网站查端口
port_custom() {
    port=$(grep -oP 'listen \K\d+' "$1")
    name_old_port="$port"
    check_port_usage
    [ "$name_old_port" != "$port" ] && sed -i "s|listen .*|listen $port;|" "$1"
    echo "$website_name $localhost:$port " >> $website_list 
    echo_time "$website_name 已启用\n"
    /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
}

# 端口修改
update_port() {
    old_port=$(grep -oP 'listen \K\d+' "$1") 2>/dev/null
    if [ -n "$port" -a "$old_port" != "$port" ]; then
        check_port_usage
        sed -i "s|listen.*|listen $port;|" "$1"
        sed -i "/$website_name/s/:.*/:$port /" $website_list
        echo_time "$website_name 端口修改完成\n"
        /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
    fi
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
    echo_time "$name已开启Redis"
}

delete_website() {
    for site in $delete_config_list; do
        if [ -n "$(find /opt/etc/nginx/vhost /opt/etc/nginx/no_use -name "$site.conf")" ]; then
            echo_time "$site 已删除"
            rm -rf /opt/etc/nginx/*/"$site".conf /opt/wwwroot/"$site"*
            sed -i "/$site /d" $website_list
        fi
    done
    /opt/etc/init.d/S80nginx reload > /dev/null 2>&1
}

# 网站迭代处理，本函数迭代的配置网站（处理逻辑也许可以更好的优化？）
handle_website() {
    config_get port "$1" port
    config_get redis_enabled "$1" redis_enabled
    config_get website_select "$1" website_select
    config_get website_enabled "$1" website_enabled
    config_get autodeploy_enable "$1" autodeploy_enable
    website_name=$(website_name_mapping $website_select)
    # website_enabled=$(uci -q get "softwarecenter.@website[$website_select].website_enabled")
    # autodeploy_enable=$(uci -q get "softwarecenter.@website[$website_select].autodeploy_enable")
    get_env
    if [ "$autodeploy_enable" = 1 -a -z "$(find /opt/etc/nginx/vhost /opt/etc/nginx/no_use -name "$website_name.conf")" ]; then
        install_website $website_select $port
        if [ "$website_enabled" = 1 ]; then
            echo_time " $name 安装完成"
            echo_time "浏览器地址栏输入：$localhost:$port 即可访问"
        else
            echo_time " $name 安装完成，但没有开启！\n"
        fi
    fi

    if [ "$website_enabled" = 1 ]; then
        update_port "/opt/etc/nginx/vhost/$website_name.conf"
        if [ -f /opt/etc/nginx/no_use/$website_name.conf ]; then
            echo_time "准备启用 $website_name "
            mv /opt/etc/nginx/no_use/$website_name.conf /opt/etc/nginx/vhost/$website_name.conf
            port_custom "/opt/etc/nginx/vhost/$website_name.conf"
        fi

        if [ "$autodeploy_enable" = 1 ] && [ "$website_name" = "Nextcloud" -o "$website_name" = "Owncloud" ]; then
            if [ "$redis_enabled" = 1 ]; then
                if [ -d /opt/wwwroot/$website_name ] && [ ! -f /opt/wwwroot/$website_name/redis_enabled ]; then
                    touch /opt/wwwroot/$website_name/redis_enabled
                    redis "/opt/wwwroot/$website_name"
                fi
            else
                rm -rf /opt/wwwroot/$website_name/config/config.php
                rm -rf /opt/wwwroot/$website_name/redis_enabled
            fi
        fi
    else
        if [ -f /opt/etc/nginx/vhost/$website_name.conf ]; then
            mv /opt/etc/nginx/vhost/$website_name.conf /opt/etc/nginx/no_use/$website_name.conf
            sed -i "/$website_name /d" $website_list
            /opt/etc/init.d/S80nginx reload >/dev/null 2>&1
            echo_time " 已关闭 $website_name\n"
        fi
    fi
    [ "$autodeploy_enable" = 1 ] || delete_config_list="$delete_config_list $website_name"
    [ -n "$delete_config_list" ] && delete_website
}

install_x_prober() {
    filelink=$url_x
    name="x"
    istar="php"
    dirname="x-prober"
    hookdir=$dirname
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "{
        s|index.php;|index.php x.php;|
        s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|
    }" /opt/etc/nginx/*/$name.conf
}

install_tz() {
    filelink=$url_tz
    name="tz"
    istar="php"
    dirname="tz"
    hookdir=$dirname
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "{
        s|index.php;|index.php tz.php;|
        s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|
    }" /opt/etc/nginx/*/$name.conf
}

# 安装phpMyAdmin
install_phpmyadmin() {
    filelink=$url_phpMyAdmin
    name="phpMyAdmin"
    dirname=phpMyAdmin-*-languages
    web_installer
    [ "$?" = 0 ] || return 1
    cp /opt/wwwroot/$name/config.sample.inc.php /opt/wwwroot/$name/config.inc.php
    chmod 644 /opt/wwwroot/$name/config.inc.php
    # 取消-p参数，必须要求webdir创建才可创建文件夹，为部署检测做准备
    make_dir /opt/wwwroot/$name/tmp
    sed -i "s/.*blowfish_secret.*/\$cfg['blowfish_secret'] = 'softwarecentersoftwarecentersoftwarecenter';/g" /opt/wwwroot/$name/config.inc.php
    add_vhost
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/*/$name.conf
    echo_time "phpMyaAdmin的用户、密码就是数据库用户：$user 密码：$pass"
}

# 安装WordPress
install_wordpress() {
    filelink=$url_WordPress
    name="WordPress"
    dirname="wordpress"
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    # WordPress的配置文件中有php-fpm了, 不需要外部引入
    sed -i "s|#otherconf|include /opt/etc/nginx/conf/wordpress.conf;|" /opt/etc/nginx/*/$name.conf
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

# 安装h5ai
install_h5ai() {
    filelink=$url_h5ai
    name="h5ai"
    dirname="_h5ai"
    hookdir=$dirname
    web_installer
    [ "$?" = 0 ] || return 1
    cp /opt/wwwroot/$name/_h5ai/README.md /opt/wwwroot/$name/
    add_vhost
    sed -i "{
        s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|
        s|index .*|index index.html index.php /_h5ai/public/index.php;|
    }" /opt/etc/nginx/*/$name.conf
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

# 安装Lychee
install_lychee() {
    filelink=$url_Lychee
    name="Lychee"
    dirname="Lychee-master"
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/*/$name.conf
    echo_time "首次打开会要配置数据库信息"
    echo_time "地址：127.0.0.1 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "下面的可以不配置，然后下一步创建个用户就可以用了"
}

# 安装kodexplorer芒果云
install_kodexplorer() {
    filelink=$url_Kodexplorer
    name="Kodexplorer"
    dirname="kodexplorer"
    hookdir=$dirname
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/*/$name.conf
}

# 安装 Typecho
install_typecho() {
    filelink=$url_Typecho
    name="Typecho"
    dirname="build"
    hookdir=$dirname
    # istar=true
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "{
        s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|
        s|#otherconf|include /opt/etc/nginx/conf/typecho.conf;|
    }" /opt/etc/nginx/*/$name.conf
    echo_time "可以用phpMyaAdmin建立数据库，然后在这个站点上一步步配置网站信息"
}

# 安装Z-Blog
install_zblog() {
    filelink=$url_Zblog
    name="Zblog"
    dirname="Z-BlogPHP_1_5_1_1740_Zero"
    hookdir=$dirname
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/*/$name.conf
}

# 安装DzzOffice
install_dzzoffice() {
    filelink=$url_DzzOffice
    name="DzzOffice"
    dirname="dzzoffice-master"
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/*/$name.conf # 添加php-fpm支持
    echo_time "DzzOffice应用市场中，某些应用无法自动安装的，请自行参看官网给的手动安装教程"
}

# 安装Owncloud
install_owncloud() {
    filelink=$url_Owncloud
    name="Owncloud"
    dirname="owncloud"
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    # Owncloud的配置文件中有php-fpm了, 不需要外部引入
    sed -i "s|#otherconf|include /opt/etc/nginx/conf/owncloud.conf;|" /opt/etc/nginx/*/$name.conf
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "安装好之后可以点击左上角三条杠进入market安装丰富的插件，比如在线预览图片、视频等"
    echo_time "需要先在web界面配置完成后，才能使用开启Redis"
}

# 安装Nextcloud
install_nextcloud() {
    filelink=$url_Nextcloud
    name="Nextcloud"
    dirname="nextcloud"
    web_installer
    [ "$?" = 0 ] || return 1
    add_vhost
    # nextcloud的配置文件中有php-fpm了, 不需要外部引入
    sed -i "s|#otherconf|include /opt/etc/nginx/conf/nextcloud.conf;|" /opt/etc/nginx/*/$name.conf
    echo_time "首次打开会要配置用户和数据库信息"
    echo_time "地址默认 $localhost 用户、密码就是数据库用户：$user 密码：$pass"
    echo_time "需要先在 web 界面配置完成后，才能使用开启Redis"
}

# 自定义部署通用函数 参数：$1:文件目录 $2:端口号
install_custom() {
    webdir=$1
    check_port_usage
    # 运行安装程序
    echo_time "正在配置$webdir..."

    # 目录检查
    if [ ! -d /opt/wwwroot/$webdir ]; then
        echo_time "目录不存在，部署中断"
        exit 1
    fi
    chmod -R 777 /opt/wwwroot/$webdir

    # 添加到虚拟主机
    add_vhost $port $webdir
    sed -i "s|#php-fpm|include /opt/etc/nginx/conf/php-fpm.conf;|" /opt/etc/nginx/vhost/$webdir.conf
    echo_time "$webdir 安装完成"
}
