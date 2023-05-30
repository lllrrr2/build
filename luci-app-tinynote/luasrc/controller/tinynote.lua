-- Copyright (C) 2020 <wulishui@gmail.com>
module("luci.controller.tinynote", package.seeall)
function index()
	entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("TinyNote"), 2).dependent = true
	entry({"admin", "nas", "tinynote", "run_button"}, call("run_button"), nil).leaf = true
end

function run_button()
--	stdout = luci.sys.exec("ls -la /tmp")
	luci.http.prepare_content("application/json")
	luci.http.write_json(stdout)
end
