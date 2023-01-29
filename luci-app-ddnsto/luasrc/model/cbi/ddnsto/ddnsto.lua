m = Map("ddnsto", translate("DDNSTO 内网穿透"))
m.description = translate("简单、快速的内网穿透工具，不受网络限制，全局掌控您的私人设备") .. 
translate("&nbsp;&nbsp;&nbsp;&nbsp;<input class='cbi-button cbi-button-apply' type='button' value='注册与教程' onclick='window.open(\"https://www.ddnsto.com\")'/>")
m:section(SimpleSection).template = "ddnsto/ddnsto_status"

t = m:section(TypedSection, "ddnsto")
t.anonymous = true
t.addremove = false

e = t:option(Flag, "enable", translate("启用"))
e.default = 0

e = t:option(Value, "token", translate('ddnsto令牌'))
e.rmempty = false
e.password = true
e.datatype = "rangelength(36,36)"

e = t:option(Value, "start_delay", translate("延迟启动"))
e.datatype = "uinteger"
for _, v in ipairs({10, 20, 30, 40, 50, 60}) do
	e:value(v, translate("%u 秒") %{v})
end
e.default = "20"
e.rmempty = true

return m
