module("luci.controller.rebootschedule", package.seeall)
function index()
	if not nixio.fs.access("/etc/config/rebootschedule") then return end
	entry({"admin", "services", "rebootschedule"}, alias("admin", "services", "rebootschedule", "general"), _("定时任务 Plus+"), 10) 
	entry({"admin", "services", "rebootschedule", "general"}, cbi("rebootschedule/general"), _("时间设置"), 20).leaf = true
	entry({"admin", "services", "rebootschedule", "crontab"}, form("rebootschedule/crontab"), _("crontab文件"), 30).leaf = true
end
module("luci.controller.rebootschedule", package.seeall)
local x = luci.model.uci.cursor()
function index()
	if not nixio.fs.access("/etc/config/rebootschedule") then return end
	entry({"admin", "services", "rebootschedule"}, alias("admin", "services", "rebootschedule", "general"), _("定时任务 Plus+"), 10) 
	entry({"admin", "services", "rebootschedule", "general"}, cbi("rebootschedule/general"), _("时间设置"), 20).leaf = true
	entry({"admin", "services", "rebootschedule", "crontab"}, form("rebootschedule/crontab"), _("crontab文件"), 30).leaf = true
	entry({"admin", "services", "rebootschedule", "awake"}, post("awake")).leaf = true
end

function awake(sections)
	command = x:get("rebootschedule", sections, "command")
    local e = {}
    -- cmd = "echo $(" .. command .. ")"
	local p = io.popen(command)
	local msg = ""
	if p then
		while true do
			local l = p:read("*l")
			if l then
				if #l > 100 then l = l:sub(1, 100) .. "..." end
				msg = msg .. l
			else
				break
			end
		end
		p:close()
	end
	e["data"] = msg
    luci.http.prepare_content("application/json")
    luci.http.write_json(e)
end
