f = SimpleForm("logview")
f.reset = false
f.submit = false

t = f:field(TextValue, "conf")
t.rmempty = true
t.rows = 25
function t.cfgvalue()
	local logs = luci.util.execi("cat /tmp/log/cowbping.log 2>/dev/null")
	local s = ""
	for line in logs do
		s = line .. "\n" .. s
	end
	return s
end
t.readonly="readonly"

if (luci.sys.call("[ -s /tmp/log/cowbping.log ]") == 0) then
	clear_log = f:field(Button, "clear_log")
	clear_log.inputtitle = translate("删除日志")
	clear_log.inputstyle = "remove"
	function clear_log.write(self, section)
		luci.sys.exec(":>/tmp/log/cowbping.log &")
	end
end

return f
