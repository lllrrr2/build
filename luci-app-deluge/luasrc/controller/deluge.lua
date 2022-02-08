local sys  = require "luci.sys"
local http = require "luci.http"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

module("luci.controller.deluge",package.seeall)

function index()
	if not nixio.fs.access("/etc/config/deluge") then return end
	entry({"admin", "nas", "deluge"}, firstchild(), _("Deluge")).dependent = false
	entry({"admin", "nas", "deluge", "config"}, cbi("deluge/config"), _("Global settings"), 1)
	-- entry({"admin", "nas", "deluge", "file"}, form("deluge/files"), _("configuration file"), 2)
	entry({"admin", "nas", "deluge", "log"}, firstchild(), _("Operation log"), 3)
	entry({"admin", "nas", "deluge", "log", "view"}, template("deluge/log"))
	entry({"admin", "nas", "deluge", "log", "read"}, call("action_log_read"))
	entry({"admin", "nas", "deluge", "status"}, call("act_status"))
end

 function act_status()
	local e = { running = (sys.call("ps 2>/dev/null | grep 'deluge' 2>/dev/null | grep 'usr' >/dev/null") == 0) }
	http.prepare_content("application/json")
	http.write_json(e)
 end

function action_log_read()
	local data = { log = "", syslog = "" }
	local o = string.gsub(uci:get("deluge", "main", "log_dir") .. "/deluge.log", '/+', '/')
	data.log = util.trim(sys.exec("tail -n 30 " .. o))
	data.syslog = util.trim(sys.exec("logread | grep deluge | tail -n 30"))
	http.prepare_content("application/json")
	http.write_json(data)
end
