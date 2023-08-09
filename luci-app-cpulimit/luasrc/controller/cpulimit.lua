module("luci.controller.cpulimit", package.seeall)

function index()
    if not nixio.fs.access("/etc/config/cpulimit") then return end
    entry({"admin", "system", "cpulimit"}, cbi("cpulimit"), _("cpulimit"), 65).dependent = true
end
