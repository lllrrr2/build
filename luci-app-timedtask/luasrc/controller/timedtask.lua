module("luci.controller.timedtask", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/timedtask") then return end
	entry({"admin", "services", "timedtask"}, alias("admin", "services", "timedtask", "general"), _("timedtask Plus+"), 10) 
	entry({"admin", "services", "timedtask", "general"}, cbi("timedtask/general"), _("Timing settings"), 20).leaf = true
	entry({"admin", "services", "timedtask", "crontab"}, form("timedtask/crontab"), _("crontabs"), 30).leaf = true
	entry({"admin", "services", "timedtask", "button"}, post("button")).leaf = true
end

function button(sections)
	local uci = require "luci.model.uci".cursor()
	command = uci:get("timedtask", sections, "command")
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
