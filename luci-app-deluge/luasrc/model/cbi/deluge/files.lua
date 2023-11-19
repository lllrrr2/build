local fs   = require "nixio.fs"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local config_dir = uci:get("deluge", "main", "profile_dir") or "/etc/deluge"
local conf = {
	a = "/etc/config/deluge",
	b = config_dir .. "/core.conf",
	c = config_dir .. "/web.conf"
}

m = SimpleForm("deluge", "Deluge - %s" % {translate("configuration file")}, translate("This page is the configuration file content of Deluge."))
m.reset = false
m.submit = false

for key, value in pairs(conf) do
	if fs.access(value) then
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
