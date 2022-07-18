module("luci.controller.wizard", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/wizard") then
		return
	end
	entry({"admin", "system", "wizard"}, cbi("wizard"), _("Wizard"), 1).dependent = true
end

