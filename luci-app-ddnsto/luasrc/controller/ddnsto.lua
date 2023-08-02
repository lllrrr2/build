module("luci.controller.ddnsto",package.seeall)

function index()
    if not nixio.fs.access("/etc/config/ddnsto") then return end
    entry({"admin", "services", "ddnsto"}, cbi("ddnsto/ddnsto"), _("DDNSTO 内网穿透"), 2).dependent = true
    entry({"admin", "services", "ddnsto", "status"}, call("act_status")).leaf = true
end

function act_status()
    local value = luci.sys.exec("/usr/bin/ddnsto -w")
    luci.http.prepare_content("application/json")
    luci.http.write_json({
        id   = value:match("%s(.+)"),
        ver  = value:match("^([^%s]+)"),
        stat = luci.sys.call("pgrep -f /usr/bin/ddnsto > /dev/null") == 0
    })
end
