module("luci.controller.advanced",package.seeall)
function index()
    entry({"admin", "system", "advanced"}, cbi("advanced"), _("快捷设置"), 71).dependent=true
end
