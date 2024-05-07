module("luci.controller.wizard", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/wizard") then
		return
	end
	entry({"admin", "system", "wizard"}, cbi("wizard"), _("快捷设置"), 1).dependent = true
end
