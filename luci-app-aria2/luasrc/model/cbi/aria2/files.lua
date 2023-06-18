local fs   = require "nixio.fs"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local config_dir = uci:get("aria2", "main", "pro") or uci:get("aria2", "main", "config_dir")
local files = {}
files.config  = "/etc/config/aria2"
files.session = config_dir .. "/aria2.session"
files.conf    = config_dir .. "/aria2.main.conf"

t = SimpleForm("aria2", "%s - %s"%{translate("Aria2"), translate("Files")},
    translate("Here shows the files used by aria2."))
t.reset = false
t.submit = false

for key, value in pairs(files) do
    if fs.readfile(value) then
        s = t:section(SimpleSection, nil,
            translatef("This is the content of the configuration file under <code>%s</code>:", value))
        o = s:option(TextValue, key)
        o.rows = 20
        o.readonly = true
        o.cfgvalue = function()
            local v = fs.readfile(value) or translate("File does not exist.")
            return util.trim(v) ~= "" and v or translate("Empty file.")
        end
    end
end

return t
