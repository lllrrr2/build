module("luci.controller.timedtask", package.seeall)

function index()
    if not nixio.fs.access("/etc/config/timedtask") then return end
    entry({"admin", "services", "timedtask"}, alias("admin", "services", "timedtask", "general"), _("TimedTask Plus+"), 10)
    entry({"admin", "services", "timedtask", "general"}, cbi("timedtask/general"), _("Timing Settings"), 20).leaf = true
    entry({"admin", "services", "timedtask", "crontab"}, form("timedtask/crontab"), _("Crontabs"), 30).leaf = true
    entry({"admin", "services", "timedtask", "action_run"}, call("action_run")).leaf = true
end

function action_run(sections)
    luci.http.prepare_content("application/json")
    luci.http.write_json({
        data = luci.util.exec(luci.model.uci:get("timedtask", sections, "command") .. " 2>&1")
    })
end
