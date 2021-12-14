module("luci.controller.poweroff",  package.seeall)

function index() 
	entry({"admin", "system", "poweroff"}, template("poweroff"),  _("Power Off"), 99)
	entry({"admin", "system", "poweroff", "call"}, post("action_poweroff"))
end

function action_poweroff()
	luci.util.exec("/sbin/poweroff")
end
