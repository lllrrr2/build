m = Map("cpulimit", translate("cpulimit"), translate("Use cpulimit to restrict app's cpu usage."))
s = m:section(TypedSection, "list", translate("Settings"))
s.template = "cbi/tblsection"
s.anonymous = true
s.addremove = true

enable = s:option(Flag, "enabled", translate("Enable", "Enable"))
enable.optional = false
enable.rmempty = false
local e = io.popen("top -bn1 | awk '{print $8}' | awk -F/ '/bin|etc/{print $NF}' | sort | uniq", "r")
exename = s:option(Value, "exename", translate("exename"), translate("name of the executable program file or path name"))
exename.optional = false
exename.rmempty = false
exename.default = "vsftpd"
for e in e:lines() do
	exename:value(e)
end

limit = s:option(Value, "limit", translate("limit"))
limit.optional = false
limit.rmempty = false
limit.default = "50"
limit:value("100", "100%")
limit:value("90", "90%")
limit:value("80", "80%")
limit:value("70", "70%")
limit:value("60", "60%")
limit:value("50", "50%")
limit:value("40", "40%")
limit:value("30", "30%")
limit:value("20", "20%")
limit:value("10", "10%")

return m
