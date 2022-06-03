module("luci.controller.ddnsto",package.seeall)

function index()
	if not nixio.fs.access("/etc/config/ddnsto") then return end
	entry({"admin", "services", "ddnsto"}, cbi("ddnsto/global"), _("DDNSTO 内网穿透"), 2).dependent = true
	entry({"admin", "services", "ddnsto", "status"}, call("act_status")).leaf=true
end

function act_status()
	local e = { }
	e.s = luci.util.trim(luci.sys.exec("ddnsto -v"))
	e.p = luci.util.trim(luci.sys.exec("ddnsto -u $(uci get ddnsto.@global[0].token) -w | awk '{print $2}'"))
	e.running = luci.sys.call("pgrep /usr/bin/ddnsto > /dev/null") == 0
	luci.http.prepare_content("application/json")
	luci.http.write_json(e)
end
