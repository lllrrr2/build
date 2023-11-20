local fs       = require "nixio.fs"
local util     = require "luci.util"
local uci      = require "luci.model.uci".cursor()

local conf_dir = uci:get("deluge", "main", "profile_dir") or "/etc/deluge"
local conf     = {
    a = "/etc/config/deluge",
    b = conf_dir .. "/core.conf",
    c = conf_dir .. "/web.conf"
}

local m = SimpleForm("deluge", "Deluge - %s" % { translate("configuration file") },
    translate("This page is the configuration file content of Deluge."))
m.reset        = false
m.submit       = false
for i, value in pairs(conf) do
    if fs.access(value) then
        local s = m:section(SimpleSection, nil,
            translatef("This is the content of the configuration file under <code>%s</code>:", value))
        local o = s:option(TextValue, 'files' .. i)
        local fileContent = fs.readfile(value)
        o.rows = util.trim(fileContent) ~= "" and 20 or 2
        o.readonly = true
        o.cfgvalue = function()
            if not fileContent then return translate("File does not exist.") end
            return util.trim(fileContent) ~= "" and fileContent or translate("Empty file.")
        end
    end
end

return m
