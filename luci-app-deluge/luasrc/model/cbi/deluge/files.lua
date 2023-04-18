local fs   = require "nixio.fs"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local config_dir = uci:get("deluge", "main", "profile_dir") or "/etc/deluge"
local files = {}
files.web  = config_dir .. "/web.conf"
files.core = config_dir .. "/core.conf"
files.config = "/etc/config/deluge"

m = SimpleForm("deluge", "%s - %s"%{translate("Deluge"), translate("configuration file")},
	translate("This page is the configuration file content of Deluge."))
m.reset = false
m.submit = false

for key, value in pairs(files) do
	if fs.readfile(value) then
		s = m:section(SimpleSection, nil, translatef("This is the content of the configuration file under <code>%s</code>:", value))
		o = s:option(TextValue, key)
		o.rows = 20
		o.readonly = true
		o.cfgvalue = function()
			local v = fs.readfile(value) or translate("File does not exist.")
			return util.trim(v) ~= "" and v or translate("Empty file.")
		end
	end
end

return m
