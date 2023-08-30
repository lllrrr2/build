module("luci.controller.softwarecenter", package.seeall)
local sys  = require "luci.sys"
local http = require "luci.http"

function index()
    if not nixio.fs.access("/etc/config/softwarecenter") then return end

    entry({"admin", "services", "softwarecenter"},
        alias("admin", "services", "softwarecenter", "softwarecenter"), _("Entware部署"), 30).dependent = true
    entry({"admin", "services", "softwarecenter", "softwarecenter"},
        cbi("softwarecenter/softwarecenter"), _("常用配置"), 40).leaf = true
    entry({"admin", "services", "softwarecenter", "app"},
        cbi("softwarecenter/app"), _("应用安装"), 50).leaf = true
    entry({"admin", "services", "softwarecenter", "website"},
        cbi("softwarecenter/website"), _("网站管理"), 60).leaf = true
    entry({"admin", "services", "softwarecenter", "errorlog"},
        cbi("softwarecenter/errorlog"), _("nginx日志"), 70).leaf = true
    entry({"admin", "services", "softwarecenter", "log"},
        cbi("softwarecenter/log"), _("运行日志"), 80).leaf = true
    entry({"admin", "services", "softwarecenter", "get_log"},
        call("get_log")).leaf = true
    entry({"admin", "services", "softwarecenter", "clear_log"},
        call("clear_log")).leaf = true
    entry({"admin", "services", "softwarecenter", "error_log"},
        call("error_log")).leaf = true
    entry({"admin", "services", "softwarecenter", "access_log"},
        call("access_log")).leaf = true
    entry({"admin", "services", "softwarecenter", "status"},
        call("connection_status")).leaf = true
    entry({"admin", "services", "softwarecenter", "clear_error_log"},
        call("clear_error_log")).leaf = true
    entry({"admin", "services", "softwarecenter", "clear_access_log"},
        call("clear_nginx_log")).leaf = true
end

function clear_log()
    sys.call("cat >/tmp/log/softwarecenter.log")
end

function clear_error_log()
    sys.call("cat >/opt/var/log/nginx/error.log")
end

function clear_nginx_log()
    sys.call("cat >/opt/var/log/nginx/access.log")
end

function get_log()
    http.write(sys.exec("[ -f '/tmp/log/softwarecenter.log' ] && cat /tmp/log/softwarecenter.log"))
end

function error_log()
    http.write(sys.exec("[ -f '/opt/var/log/nginx/error.log' ] && cat /opt/var/log/nginx/error.log | tail -n 50"))
end

function access_log()
    http.write(sys.exec("[ -f '/opt/var/log/nginx/access.log' ] && cat /opt/var/log/nginx/access.log | tail -n 50"))
end

local function nginx_status_report()
    return sys.call("pidof nginx >/dev/null") == 0
end

local function mysql_status_report()
    return sys.call("pidof mysqld >/dev/null") == 0
end

local function php_status_report()
    return sys.call("pidof php8-fpm >/dev/null") == 0
end

local function nginx_installed_report()
    return sys.call("ls /opt/etc/init.d/S80nginx >/dev/null") == 0
end

local function mysql_installed_report()
    return sys.call("ls /opt/etc/init.d/S70mysqld >/dev/null") == 0
end

local function php_install_report()
    return sys.call("ls /opt/etc/init.d/S79php8-fpm >/dev/null") == 0
end 

local function get_website_list()
    return sys.exec("cat /opt/wwwroot/website_list")
end

function connection_status()
    http.prepare_content("application/json")
    http.write_json({
        php_state=php_status_report(),
        website_list=get_website_list(),
        nginx_state=nginx_status_report(),
        mysql_state=mysql_status_report(),
        php_installed=php_install_report(),
        nginx_installed=nginx_installed_report(),
        mysql_installed=mysql_installed_report()
    })
end
