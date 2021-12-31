#!/bin/sh
#本脚本提供以下函数接口：init_mysql del_mysql

# 加载常用函数库
. /usr/bin/softwarecenter/lib_functions.sh
dblist="mariadb-server mariadb-server-extra mariadb-client php7-mod-pdo-mysql mariadb-client-extra"

# 重置、初始化MySQL #
init_mysql() {
	get_env
	install_soft "$dblist"
	cat > "/opt/etc/mysql/my.cnf" <<-EOF
		[client-server]
		port               = 3306
		socket             = /opt/var/run/mysqld.sock

		[mysqld]
		user               = $username
		socket             = /opt/var/run/mysqld.sock
		pid-file           = /opt/var/run/mysqld.pid
		basedir            = /opt
		lc_messages_dir    = /opt/share/mariadb
		lc_messages        = en_US
		datadir            = /opt/var/mariadb/
		tmpdir             = /opt/tmp/

		skip-external-locking

		bind-address       = 127.0.0.1

		key_buffer_size    = 24M
		max_allowed_packet = 24M
		thread_stack       = 192K
		thread_cache_size  = 8

		[mysqldump]
		quick
		quote-names
		max_allowed_packet = 24M

		[mysql]
		#no-auto-rehash

		[isamchk]
		key_buffer_size    = 24M

		[mysqlhotcopy]
		interactive-timeout
		EOF

	chmod 644 /opt/etc/mysql/my.cnf
	make_dir /opt/var/mysql

	# 数据库安装，同步方式，无需延时等待
	echo_time "正在初始化数据库，请稍等1分钟"
	mysql_install_db --user=$username --basedir=/opt --datadir=/opt/var/mariadb/ > /dev/null 2>&1

	# 初次启动MySQL，异步方式，加延时等待
	echo_time "正在启动MySQL"
	/opt/etc/init.d/S70mysqld start
	sleep 10

	# 设置数据库密码
	if [ $user ] && [ $pass ]; then
		echo_time "使用自定义数据库用户：$user, 密码：$pass"
	else
		user="root"
		pass="123456"
		echo_time "使用自定义数据库用户：$user, 密码：$pass"
	fi
	mysqladmin -u $user password $pass
}

del_mysql() {
	# 停止MySQL
	/opt/etc/init.d/S70mysqld stop > /dev/null 2>&1
	echo_time "正在停止MySQL"
	sleep 10

	# 卸载相关的软件包，文件与目录
	remove_soft "`opkg list-installed | awk '/mariadb/{print $1}' | xargs echo`"
	rm -rf /opt/etc/mysql /opt/var/mariadb/ /opt/var/mysql
}
