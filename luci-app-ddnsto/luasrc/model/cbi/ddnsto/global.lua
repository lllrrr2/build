m = Map("ddnsto", translate("DDNSTO 内网穿透"))
m.description = translate("DDNSTO是koolshare小宝开发支持HTTP2.0快速远程穿透的工具。") .. 
translate("<br><br><input class=\"cbi-button cbi-button-apply\" type=\"button\" value=\"" .. 
translate("注册与教程") ..
"\" onclick=\"window.open('https://www.ddnsto.com')\"/>")
m:section(SimpleSection).template = "ddnsto/ddnsto_status"

t = m:section(TypedSection, "global")
t.anonymous = true
t.addremove = false

e = t:option(Flag, "enable", translate("启用"))
e.default = 0

e = t:option(Value, "token", translate('ddnsto令牌'))
e.rmempty = false
-- e.password = true
e.datatype = "rangelength(36,36)"

e = t:option(Value, "start_delay", translate("延迟启动"), translate("单位：秒"))
e.datatype = "uinteger"
e.default = "20"
e.rmempty = true

return m
