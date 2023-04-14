local sys  = require "luci.sys"
local uci  = require "luci.model.uci".cursor()
module("luci.controller.qbittorrent",package.seeall)

function index()
	if not nixio.fs.access("/etc/config/qbittorrent") then return end
	entry({"admin", "nas", "qbittorrent"}, firstchild(), _("qBittorrent")).dependent = false
	entry({"admin", "nas", "qbittorrent", "config"}, cbi("qbittorrent/config"), _("Global settings"), 1).leaf=true
	entry({"admin", "nas", "qbittorrent", "file"}, form("qbittorrent/files"), _("Configuration"), 2).leaf=true
	entry({"admin", "nas", "qbittorrent", "log"}, form("qbittorrent/log"), _("Log"), 3).leaf=true
	entry({"admin", "nas", "qbittorrent", "status"}, call("act_status")).leaf=true
	entry({"admin", "nas", "qbittorrent", "action_log"}, call("action_log_read")).leaf=true
end

function act_status()
	local BinaryLocation = uci:get("qbittorrent", "main", "BinaryLocation") or "/usr/bin/qbittorrent-nox"
	local e = {running = "", pat = ""}
	if BinaryLocation ~= "/usr/bin/qbittorrent-nox" then
		e.pat = BinaryLocation
	end
	e.running = sys.call("ps | grep " .. BinaryLocation .. " | grep -v grep >/dev/null") == 0
	luci.http.prepare_content("application/json")
	luci.http.write_json(e)
end

function action_log_read()
	local t = {log = "", syslog = ""}
	local config_dir = uci:get("qbittorrent", "main", "RootProfilePath") or "/tmp"
	local config_file = config_dir .. "/qBittorrent/data/logs/qbittorrent.log"
	if nixio.fs.access(config_file) then
		t.log = sys.exec("tail -n 50 %s | sed 'x;1!H;$!d;x'" %config_file)
	end
	t.syslog = sys.exec("/sbin/logread -e qbittorrent | tail -n 50")
	luci.http.prepare_content("application/json")
	luci.http.write_json(t)
end
