local util = require "luci.util"
local processList = {}
for _, info in pairs(luci.sys.process.list()) do
    local command = info.COMMAND
    if command:match("^([%a/])") and not (command:match("cpulimit") or command:match("sleep")) then
        command = command:match("^/bin/sh%s(.*)$") or command
        processList[#processList + 1] = {
            cpu  = info['%CPU'],
            mem  = info['%MEM'],
            name = command:match("^([^%s]+)")
        }
    end
end

table.sort(processList, function(a, b)
    return a.cpu:gsub("%%", "") > b.cpu:gsub("%%", "")
end)

m = Map("cpulimit", translate("cpulimit"),
    translate("Use cpulimit to restrict app's cpu usage.")
    .. translate("<a href='%s'> " % luci.dispatcher.build_url("admin/status/processes"))
    .. translate("Processes") .. "</a>"
    )
s = m:section(TypedSection, "list")
s.template = "cbi/tblsection"
s.anonymous = true
s.addremove = true

local enable = s:option(Flag, "enabled", translate("Enable"))
enable.optional = false
enable.rmempty = false

local exename = s:option(Value, "exename", translate("Executable program filename or pathname"))
exename.optional = false
exename.rmempty = false
for _, process in ipairs(processList) do
    exename:value(process.name, translatef('%s Useage[CPU %s] [Memory %s]', process.name, process.cpu, process.mem))
end

local limit = s:option(Value, "limit", translate("limit"))
limit.optional = false
limit.rmempty = false
limit.default = "20"
local values = {
    {"90", "90%"}, {"80", "80%"}, {"70", "70%"},
    {"60", "60%"}, {"50", "50%"}, {"40", "40%"},
    {"30", "30%"}, {"20", "20%"}, {"10", "10%"}
}

for _, k in ipairs(values) do
    limit:value(k[1], k[2])
end

return m
