module("luci.controller.deluge", package.seeall)
local sys  = require "luci.sys"
local http = require "luci.http"
local uci  = require "luci.model.uci".cursor()

function index()
    if not nixio.fs.access("/etc/config/deluge") then return end
    entry({ "admin", "nas", "deluge" }, firstchild(), _("Deluge")).dependent = false
    entry({ "admin", "nas", "deluge", "config" }, cbi("deluge/config"), _("Global settings"), 1).leaf = true
    entry({ "admin", "nas", "deluge", "file" }, form("deluge/files"), _("configuration file"), 2).leaf = true
    entry({ "admin", "nas", "deluge", "log" }, form("deluge/log"), _("Log"), 3).leaf = true
    entry({ "admin", "nas", "deluge", "action_log" }, call("action_log_read")).leaf = true
    entry({ "admin", "nas", "deluge", "status" }, call("act_status")).leaf = true
end

local con = uci:get_all("deluge", "main")
function act_status()
    http.prepare_content("application/json")
    http.write_json({
        port    = con.port or '8112',
        https   = con.https or 'false',
        running = sys.call("ps 2>/dev/null | grep deluged 2>/dev/null | grep /usr/bin >/dev/null") == 0
    })
end

function action_log_read()
    local data = {
        log = "",
        syslog = sys.exec("logread -e deluge | tail -n 60")
    }
    local log_file = (con.log_dir or con.profile_dir or "") .. "/deluge.log"
    if nixio.fs.access(log_file) then
        data.log = sys.exec("tail -n 60 %s" % log_file)
    end
    http.prepare_content("application/json")
    http.write_json(data)
end
