local sys  = require "luci.sys"
local uci  = require "luci.model.uci".cursor()

module("luci.controller.aria2", package.seeall)
function index()
    if not nixio.fs.access("/etc/config/aria2") then return end

    entry({"admin", "nas", "aria2"}, firstchild(), _("Aria2")).dependent = false
    entry({"admin", "nas", "aria2", "config"}, cbi("aria2/config"), _("Configuration"), 1)
    entry({"admin", "nas", "aria2", "file"}, form("aria2/files"), _("Files"), 2)
    entry({"admin", "nas", "aria2", "log"}, form("aria2/log"), _("Log"), 3).leaf=true
    entry({"admin", "nas", "aria2", "action_log_read"}, call("action_log_read"))
    entry({"admin", "nas", "aria2", "clear_log"}, call("clear_log")).leaf = true
    entry({"admin", "nas", "aria2", "status"}, call("action_status"))
end

function action_status()
    local status = {
        running = sys.call("pidof aria2c >/dev/null") == 0
    }
    luci.http.prepare_content("application/json")
    luci.http.write_json(status)
end

local log_dir = uci:get("aria2", "main", "log_dir") or "/var/log"
local aria2_log = log_dir .. '/aria2.log'
local aria2_syslog = log_dir .. '/aria2_syslog.log'

function action_log_read()
    local data = { log = "", syslog = "" }
    if nixio.fs.access(aria2_syslog) then
        data.log = sys.exec("tail -n 50 %s | sed 'x;1!H;$!d;x'" % aria2_syslog)
    end

    if nixio.fs.access(aria2_log) then
        data.syslog = sys.exec("tail -n 50 %s | sed 'x;1!H;$!d;x'" % aria2_log)
    end
    luci.http.prepare_content("application/json")
    luci.http.write_json(data)
end

function clear_log()
    if nixio.fs.access(aria2_log) then
        sys.call(":> " .. aria2_log)
    end
    if nixio.fs.access(aria2_syslog) then
        sys.call(":> " .. aria2_syslog)
    end
end
