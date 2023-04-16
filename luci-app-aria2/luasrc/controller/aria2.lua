module("luci.controller.aria2",package.seeall)
local uci = luci.model.uci.cursor()
local http = require "luci.http"
local util = require "luci.util"
local sys  = require "luci.sys"

function index()
	if not nixio.fs.access("/etc/config/aria2") then return end
	entry({"admin", "nas", "aria2"}, firstchild(), _("Aria2")).dependent = false
	entry({"admin", "nas", "aria2", "config"}, cbi("aria2/config"), _("Configuration"), 1)
	entry({"admin", "nas", "aria2", "file"}, form("aria2/files"), _("Files"), 2)
	entry({"admin", "nas", "aria2", "log"}, firstchild(), _("Log"), 3)
	entry({"admin", "nas", "aria2", "log", "view"}, template("aria2/log_template"))
	entry({"admin", "nas", "aria2", "log", "read"}, call("action_log_read"))
	entry({"admin", "nas", "aria2", "clear_log"}, call("clear_log")).leaf = true
	entry({"admin", "nas", "aria2", "status"}, call("action_status"))
end

local log_dir = uci:get("aria2", "main", "log_dir") or "/var/log"
local aria2_log = log_dir .. '/aria2.log'
local aria2_syslog = log_dir .. '/aria2_syslog.log'

function action_status()
	local status = {running = sys.call("ps | grep /usr/bin/aria2c | grep -v grep >/dev/null") == 0}
	http.prepare_content("application/json")
	http.write_json(status)
end

function clear_log()
	if nixio.fs.access(aria2_syslog) then
		sys.call(":> " .. aria2_syslog)
	end
end

function action_log_read()
	local t = {
		log = "",
		syslog = "";
	}
	if nixio.fs.access(aria2_log) then
		t.log = util.trim(sys.exec("tail -n 50 %s | sed 'x;1!H;$!d;x'" %aria2_log))
	end
	if nixio.fs.access(aria2_syslog) then
		t.syslog = util.trim(sys.exec("tail -n -50 %s" %aria2_syslog))
	end
	http.prepare_content("application/json")
	http.write_json(t)
end
