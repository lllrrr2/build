local uci = require "luci.model.uci".cursor()
m = Map('wizard', translate('Inital Router Setup'), translate('If you are using this router for the first time, please configure it here.'))

s = m:section(TypedSection, 'wizard')
s.addremove = false
s.anonymous = true

s:tab('wansetup', translate('Wan Settings'), translatef('Three different ways to access the Internet, please choose according to your own situation.'))
wan_proto = s:taboption('wansetup', ListValue, 'wan_proto', translate('Protocol'))
wan_proto:value('pppoe', translate('PPPoE'))
wan_proto:value('dhcp', translate('DHCP client'))
wan_proto:value('siderouter', translate('Siderouter'))

pppoe_user = s:taboption('wansetup', Value, 'pppoe_user', translate('PAP/CHAP username'))
pppoe_user:depends('wan_proto', 'pppoe')

pppoe_pass = s:taboption('wansetup', Value, 'pppoe_pass', translate('PAP/CHAP password'))
pppoe_pass:depends('wan_proto', 'pppoe')
pppoe_pass.password = true

lan_gateway = s:taboption('wansetup', Value, 'lan_gateway', translate('IPv4 gateway'), translate('这里输入主路由IP地址'))
lan_gateway:depends('wan_proto', 'siderouter')
lan_gateway.datatype = 'ip4addr'
lan_gateway.rmempty = false

lan_sum = s:taboption("wansetup", Value, "lan_sum", translate("网口数量"),
translate("该路由物理网口数量，留空则自动获取"))
lan_sum.anonymous = false
lan_sum:depends('wan_proto', 'siderouter')

dhcp = s:taboption('wansetup', Flag, 'dhcp', translate('DHCP Server'), translate('开启此DHCP则需要关闭主路由的DHCP<br><b><font color="red">关闭主路由DHCP则需要手动将所有上网设备的网关和DNS改为此旁路由的IP</font></b>'))
dhcp.datatype = 'ip4addr'
dhcp:depends('wan_proto', 'siderouter')
-- dhcp.default = o.enabled

wan = s:taboption("wansetup", Flag, "wan_lan", translate("修改WAN口"),
translate("把WAN口变成LAN口"))
wan.rmempty = true
wan:depends('wan_proto', 'siderouter')

ipv6 = s:taboption('wansetup', Value, 'ipv6', translate('Enable IPv6'), translate('Enable/Disable IPv6'))
ipv6:value("0", translate("关闭"))
ipv6:value("1", translate("手动"))
ipv6:value("2", translate("自动"))
ipv6.default = "0"
ipv6:depends('wan_proto', 'pppoe')

dns = s:taboption('wansetup', DynamicList, 'lan_dns', translate('Use custom DNS servers'), translate("可以设置主路由的IP，或可到<a href='https://dnsdaquan.com' target='_blank'> DNS大全 </a>获取更多"))
dns:value("223.5.5.5", translate("阿里DNS：223.5.5.5"))
dns:value("223.6.6.6", translate("阿里DNS：223.6.6.6"))
dns:value("101.226.4.6", translate("DNS派：101.226.4.6"))
dns:value("218.30.118.6", translate("DNS派：218.30.118.6"))
dns:value("180.76.76.76", translate("百度DNS：180.76.76.76"))
dns:value("114.114.114.114", translate("114DNS：114.114.114.114"))
dns:value("114.114.115.115", translate("114DNS：114.114.115.115"))
dns.default = "223.5.5.5"
dns.anonymous = false
dns.datatype = "ip4addr"
-- dns.cast = "string"

s:tab("lansetup", translate("Lan Settings"))

local lan_ipaddr = (uci:get("network", "lan", "ipaddr") or "")
ipaddr = s:taboption("lansetup", Value, "lan_ipaddr", translate("IPv4 address"),
	translate([[主路由同网段未冲突的IP地址<br><font color="red">即是该路由web访问的IP</font>]]))
ipaddr:value(lan_ipaddr, translate(lan_ipaddr .. " --当前路由的IP--"))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false

netmask = s:taboption('lansetup', ListValue, 'lan_netmask', translate('IPv4 netmask'))
netmask:value("255.255.255.0", translate("255.255.255.0"))
netmask:value("255.255.0.0", translate("255.255.0.0"))
netmask:value("255.0.0.0", translate("255.0.0.0"))
netmask.default = "255.255.255.0"
netmask.datatype='ip4addr'
netmask.anonymous = false

if (luci.sys.call("[ -s '/etc/config/wireless' ]") ==0) then
	s:tab('wifisetup', translate('Wireless Settings'), translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
	o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title\"Extended Service Set Identifier\">ESSID</abbr>'))
	o.datatype = 'maxlength(32)'
	o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
	o.datatype = 'wpakey'
	o.password = true
end

return m
