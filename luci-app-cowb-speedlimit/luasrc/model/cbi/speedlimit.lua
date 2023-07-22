--Author: wulishui <wulishui@gmail.com>
local sys = require "luci.sys"
local running = sys.call("tc qdisc show dev br-lan 2>/dev/null | grep -q 'default'") == 0

local state_msg = ""
if running then
    state_msg = translatef([[<b><font color='green'>%s</font></b>]], "已运行")
else
    state_msg = translatef([[<b><font color='red'>%s</font></b>]], "未运行")
end

m = Map("speedlimit", translate("速度限制"), translatef([[可以通过MAC，IP，IP段，IP范围限制用户上传/下载的网速。<br>速度单位是（<b><font color='green'>MB/秒</font></b>），速度值 0 时为无限制。 <br/><br/>运行状态 ：%s<br/><br/>]], state_msg))

s = m:section(TypedSection, "usrlimit")
s.template = "cbi/tblsection"
s.anonymous = true
s.addremove = true
s.sortable  = true

e = s:option(Flag, "enable", translate("Enable"))
e.rmempty = false

usr = s:option(Value, "usr", translate([[选择限制的用户（<font color='green'>MAC支持 : 或 - 分割</font>）]]))
sys.net.mac_hints(function(mac, name)
    usr:value(mac, translatef("%s (%s)", mac, name))
end)
usr.size = 8

dl = s:option(Value, "download", translate("下载速度"))
dl.rmempty = false
dl.size = 8

ul = s:option(Value, "upload", translate("上传速度"))
ul.rmempty = false
ul.size = 8

comment = s:option(Value, "comment", translate("备注"))
ul.rmempty = false
comment.size = 8

return m
