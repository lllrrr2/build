local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()
function titlesplit(e)
	return"<p style = \"font-size:15px;font-weight:bold;color: DodgerBlue\">" .. translate(e) .. "</p>"
end

a = Map("deluge", translate("Deluge 下载器"), translate("Deluge是一个通过PyGTK建立图形界面的BitTorrent客户端<br>"))
a:section(SimpleSection).template = "deluge/deluge_status"

t = a:section(NamedSection, "main", "deluge")
t:tab("basic", translate("Basic Settings"))
t:tab("WebUI", translate("WebUI设置"))
t:tab("download", translate("下载设置"))

e = t:taboption("basic", Flag, "enabled", translate("Enabled"))
e = t:option(Flag, "enabled", translate("Enabled"))
e.default = "0"

e = t:taboption("basic", ListValue, "user", translate("Run daemon as user"))
for t in util.execi("cut -d ':' -f1 /etc/passwd") do
	e:value(t)
end

e = t:taboption("basic", Value, "profile_dir", translate("Root Path of the Profile"), translate("默认保存在/etc/deluge"))
e.placeholder = '/etc/deluge'

e = t:taboption("basic", Value, "geoip_db_location", translate("GeoIP 数据库路径"))
e.default = "/usr/share/GeoIP"

e = t:taboption("basic", Value, "cache_size", translate("缓存大小"), translate("单位：KiB"))
e.default = "32768"

e = t:taboption("basic", Flag, "enable_logging", translate("Enable Log"))
e.rmempty = "false"

e = t:taboption("basic", Value, "log_dir", translate("Log Path"), translate("默认保存在/var/log/"))
e:depends("enable_logging", "1")
e.placeholder = "/var/log"

e = t:taboption("basic", ListValue, "log_level", translate("日志记录等级"))
e:depends("enable_logging", "1")
e:value("none", translate("none"))
e:value("error", translate("Error"))
e:value("warning", translate("Warning"))
e:value("info", translate("Info"))
e:value("debug", translate("Debug"))
e.default = "error"

e = t:taboption("download", Value, "download_location", translate("下载文件路径"),
	translate("The files are stored in the download directory automatically created under the selected mounted disk"))
local array = {}
for disk in util.execi("mount | awk '/mnt/{print $3}' | cut -d/ -f-3 | uniq") do
    for x = 1,4 do
        array[x] = sys.exec("df -h | grep " .. disk .. " | awk 'NR==1{print $" .. x .. "}'")
    end
	e:value(disk .. "/download",
		translate(disk .. "/download " .. "(size: " .. array[2] .. ") (Available: " .. array[4] .. ")"))
end

e = t:taboption("download", Flag, "move_completed_enabled", translate("将已完成的任务移动到"))
e = t:taboption("download", Value, "move_completed_path", translate("路径"))
e.placeholder = "/mnt/sda3/download"
e:depends("move_completed_enabled", 1)

e = t:taboption("download", Flag, "copy_torrent_file_enabled", translate("将种子文件复制到"))
e = t:taboption("download", Value, "torrentfiles_location", translate("路径"))
e.placeholder = "/mnt/sda3/download"
e:depends("copy_torrent_file_enabled", 1)

e = t:taboption("WebUI", Value, "language", translate("Locale Language"))
e:value("zh_CN", translate("Simplified Chinese"))
e:value("en_GB", translate("English"))
e.default = "zh_CN"

e = t:taboption("WebUI", Value, "port", translate("Listening Port"), translate("默认端口：8112"))
e.datatype = "port"
e.default = "8112"

e = t:taboption("WebUI", Value, "password", translate("WebUI密码"), translate("默认密码：deluge"))
e.default = "deluge"

e = t:taboption("WebUI", Value, "https", translate("WebUI使用https"), translate("默认不使用"))
e:value("false", translate("不使用"))
e:value("true", translate("使用"))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

return a
