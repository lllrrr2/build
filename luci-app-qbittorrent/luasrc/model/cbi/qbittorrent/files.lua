local fs   = require "nixio.fs"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local conf = "/etc/config/qbittorrent"
local pat = uci:get("qbittorrent", "main", "RootProfilePath") or "/tmp"
local qbittorrent = pat .. "/qBittorrent/config/qBittorrent.conf"

m = SimpleForm("qbittorrent", "%s - %s"%{translate("qBittorrent"), translate("configuration file")},
	translate("This page is the configuration file content of qBittorrent."))
m.reset = false
m.submit = false

s = m:section(SimpleSection, nil, translatef("This is the content of the configuration file under <code>%s</code>:", conf))
o = s:option(TextValue, "_config")
o.rows = 20
o.readonly = true
o.cfgvalue = function()
	local v = fs.readfile(conf) or translate("File does not exist.")
	return util.trim(v) ~= "" and v or translate("Empty file.")
end

s = m:section(SimpleSection, nil, translatef("This is the content of the configuration file under <code>%s</code>:", qbittorrent))
o = s:option(TextValue, "_session")
o.rows = 20
o.readonly = true
o.cfgvalue = function()
	local v = fs.readfile(qbittorrent) or translate("File does not exist.")
	return util.trim(v) ~= "" and v or translate("Empty file.")
end

return m
