local fs   = require "nixio.fs"
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
	-- entry({"admin", "nas", "deluge", "log"}, firstchild(), _("Operation log"), 3)
	-- entry({"admin", "nas", "deluge", "log", "view"}, template("deluge/log"))
	-- entry({"admin", "nas", "deluge", "log", "read"}, call("action_log_read"))
	 entry({"admin", "nas", "deluge", "status"}, call("act_status"))
end

 function act_status()
	 local e = { running = (luci.sys.call("ps 2>/dev/null | grep 'deluge' 2>/dev/null | grep '/usr/bin/' >/dev/null") == 0) }
	 luci.http.prepare_content("application/json")
	 luci.http.write_json(e)
 end

-- function action_log_read()
	-- local data = { log = "", syslog = "" }
	-- if uci:get("deluge", "main", "Path") then
		-- path = uci:get("deluge", "main", "Path") .. "/deluge.log"
	-- else
		-- path = uci:get("deluge", "main", "profile") .. "/qBittorrent/data/logs/deluge.log"
	-- end
	-- path = string.gsub(path, '/+', '/')
	-- data.log = util.trim(sys.exec("tail -n 30 " .. path .. " | cut -d'-' -f2- | sed 's/T/-/'"))
	-- data.syslog = util.trim(sys.exec("logread | grep deluge | tail -n 30 | cut -d' ' -f3-"))
	-- http.prepare_content("application/json")
	-- http.write_json(data)
-- end
