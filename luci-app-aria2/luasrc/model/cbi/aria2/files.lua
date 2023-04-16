local fs   = require "nixio.fs"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local config_dir = uci:get("aria2", "main", "pro") or uci:get("aria2", "main", "config_dir")
local files = {}
files.config  = "/etc/config/aria2"
files.conf    = config_dir .. "/aria2.main.conf"
files.session = config_dir .. "/aria2.session"

t = SimpleForm("aria2", "%s - %s"%{translate("Aria2"), translate("Files")},
	translate("Here shows the files used by aria2."))
t.reset = false
t.submit = false

for key, value in pairs(files) do
	if fs.readfile(value) then
		a = t:section(SimpleSection, nil,
			translatef("This is the content of the configuration file under <code>%s</code>:", value))
		e = a:option(TextValue, key)
		e.rows = 20
		e.readonly = true
		e.cfgvalue = function()
		local e = fs.readfile(value) or translate("File does not exist.")
		return util.trim(e) ~= "" and e or translate("Empty file.") end
	end
end

return t
