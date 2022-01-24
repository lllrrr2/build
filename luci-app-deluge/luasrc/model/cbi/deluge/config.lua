local a, t, e
local s = luci.util.trim(luci.sys.exec("deluge -v 2>/dev/null | awk '/deluge/{print $2}'"))

function titlesplit(e)
	return"<p style = \"font-size:15px;font-weight:bold;color: DodgerBlue\">" .. translate(e) .. "</p>"
end
local e = require"luci.model.uci".cursor()
local i = require"nixio.fs"
local running = (luci.sys.call("ps 2>/dev/null | grep 'deluge' 2>/dev/null | grep '/usr/bin/' >/dev/null") == 0)

if running then
	state_msg = "<b><font color=\"green\">" .. translate("运行中") .. "</font></b>"
else
	state_msg = "<b><font color=\"red\">" .. translate("没有运行") .. "</font></b>"
end

a = Map("deluge", translate("Deluge 下载器"), translate("Deluge是一个通过PyGTK建立图形界面的BitTorrent客户端<br>Web默认密码：deluge<br>" .. 
translate("运行状态：" ) .. state_msg .. "<br>"))
-- a:section(SimpleSection).template = "qbittorrent/qbittorrent_status"

t = a:section(NamedSection, "main", "deluge")
t:tab("basic", translate("Basic Settings"))
e = t:taboption("basic", Flag, "enabled", translate("Enabled"))
e.description = e.description .. translatef("当前Deluge的版本: <b style=\"color:green\"> %s", s) .. "</b>"
e.default = "1"

e = t:taboption("basic", ListValue, "user", translate("Run daemon as user"), translate("留空以使用默认用户。"))
for t in luci.util.execi("cat /etc/passwd | cut -d ':' -f1")do
	e:value(t)
end

e = t:taboption("basic", Value, "profile_dir", translate("Parent Path for Profile Folder"), translate("The path for storing profile folder using by command: <b>--profile [PATH]</b>."))
e.default = '/tmp'

e = t:taboption("basic", Value, "download_dir", translate("Save Path"), translate("The path to save the download file. For example:<code>/mnt/sda1/download</code>"))
e.placeholder = "/tmp/download"

e = t:taboption("basic", Value, "log_dir", translate("日志目录"), translate("日志保存目录<code>/mnt/sda1/download</code>"))
e.placeholder = "/tmp/download"

e = t:taboption("basic", Value, "Locale", translate("Locale Language"))
e:value("zh_CN", translate("Chinese"))
e:value("en", translate("English"))
e.default = "zh_CN"
e = t:taboption("basic", Value, "Password", translate("Password"), translate("The login password for WebUI."))
e.password = true

e = t:taboption("basic", Value, "port", translate("Listen Port"), translate("The listening port for WebUI."))
e.datatype = "port"
e.default = "7211"

return a
