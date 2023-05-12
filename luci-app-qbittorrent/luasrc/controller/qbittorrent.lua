local sys  = require "luci.sys"
local http = require "luci.http"
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

local con = uci:get_all("qbittorrent", "main")
function act_status()
	local BinaryLocation = con.BinaryLocation or "/usr/bin/qbittorrent-nox"
	local status = {
		pid = 0,
		pat = "",
		port = "",
		https = "",
		running = "";
	}
	status.port  = con.port  or '8080'
	status.https = con.https or 'false'
	status.pid   = sys.exec("pidof " .. BinaryLocation) or ""
	status.running = status.pid
	if BinaryLocation ~= "/usr/bin/qbittorrent-nox" then
		status.pat = BinaryLocation
	end
	http.prepare_content("application/json")
	http.write_json(status)
end

function action_log_read()
	local file = {
		log    = "",
		syslog = "";
	}
	local log_dir  = con.RootProfilePath or "/tmp"
	local log_file = log_dir .. "/qBittorrent/data/logs/qbittorrent.log"
	if nixio.fs.access(log_file) then
		file.log = sys.exec("tail -n 30 %s | sed 'x;1!H;$!d;x'" %log_file)
	end
	file.syslog = sys.exec("/sbin/logread -e qbittorrent | tail -n 30")
	http.prepare_content("application/json")
	http.write_json(file)
end
