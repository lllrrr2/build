m = Map("cpulimit", translate("cpulimit"),
    translate("Use cpulimit to restrict app's cpu usage."))
s = m:section(TypedSection, "list", translate("Settings"))
s.template = "cbi/tblsection"
s.anonymous = true
s.addremove = true

enable = s:option(Flag, "enabled", translate("Enable", "Enable"))
enable.optional = false
enable.rmempty  = false

exename = s:option(Value, "exename", translate("exename"),
    translate("name of the executable program file or path name"))
exename.optional = false
exename.rmempty  = false
exename.default  = "vsftpd"
for pid, info in pairs(luci.sys.process.list()) do
    local command = info.COMMAND
    if command:match("^([%a/])") then
        command = command:match("^/bin/sh%s(.*)$") or command
        exename:value(command:match("^([^%s]+)"))
    end
end

limit = s:option(Value, "limit", translate("limit"))
limit.optional = false
limit.rmempty  = false
limit.default  = "50"
local values = {
    {"100", "100%"}, {"90", "90%"}, {"80", "80%"}, {"70", "70%"}, {"60", "60%"},
      {"50", "50%"}, {"40", "40%"}, {"30", "30%"}, {"20", "20%"}, {"10", "10%"}
}

for _, k in ipairs(values) do
    limit:value(k[1], k[2])
end

return m
