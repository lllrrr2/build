module("luci.controller.transmission", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/transmission") then return end
	entry({"admin", "nas", "transmission"}, firstchild(), _("transmission")).dependent = false
	entry({"admin", "nas", "transmission", "status"}, call("act_status")).leaf = true
	entry({"admin", "nas", "transmission"}, cbi("transmission"), _("Transmission")).dependent = true
end

function act_status()
	local e = {}
	e.running = luci.sys.call("ps | grep /usr/bin/transmission | grep -v grep >/dev/null") == 0
	luci.http.prepare_content("application/json")
	luci.http.write_json(e)
end
