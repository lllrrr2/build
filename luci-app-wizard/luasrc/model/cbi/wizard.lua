m = Map('wizard', translate('Inital Router Setup'), translate('If you are using this router for the first time, please configure it here.'))

s = m:section(TypedSection, 'wizard')
s.addremove = false
s.anonymous = true

s:tab('wansetup', translate('Wan Settings'), translatef('Three different ways to access the Internet, please choose according to your own situation.'))
o = s:taboption('wansetup', ListValue, 'wan_proto', translate('Protocol'))
o:value('dhcp', translate('DHCP client'))
o:value('pppoe', translate('PPPoE'))

o = s:taboption('wansetup', Value, 'wan_pppoe_user', translate('PAP/CHAP username'))
o:depends('wan_proto', 'pppoe')

o = s:taboption('wansetup', Value, 'wan_pppoe_pass', translate('PAP/CHAP password'))
o:depends('wan_proto', 'pppoe')
o.password = true

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
ipaddr = s:taboption("lansetup", Value, "lan_ipaddr", translate("IPv4 address"), "LAN网口IP (<b><font color=\"red\">即是该路由web访问的IP</font></b>)")
for ip in luci.util.execi("uci -q get network.lan.ipaddr") do
	ipaddr:value(ip, translate(ip .. " --当前路由的IP--"))
	ipaddr.default = ip
end
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false

netmask = s:taboption('lansetup', ListValue, 'lan_netmask', translate('IPv4 netmask'))
netmask:value("255.255.255.0", translate("255.255.255.0"))
netmask:value("255.255.0.0", translate("255.255.0.0"))
netmask:value("255.0.0.0", translate("255.0.0.0"))
netmask.default = "255.255.255.0"
netmask.datatype='ip4addr'
netmask.anonymous = false

o = s:taboption('lansetup', Flag, 'siderouter', translate('Siderouter'))
o.rmempty = false

o = s:taboption('lansetup', Value, 'lan_gateway', translate('IPv4 gateway'), translate('这里输入主路由IP地址'))
o:depends('siderouter', '1')
o.datatype = 'ip4addr'
o.rmempty = false

o = s:taboption('lansetup', Flag, 'dhcp', translate('DHCP Server'), translate('开启此DHCP则需要关闭主路由的DHCP<br><b><font color=\"red\">关闭主路由DHCP则需要手动将所有上网设备的网关和DNS改为此旁路由的IP</font></b>'))
o.datatype = 'ip4addr'
o:depends('siderouter', '1')
-- o.default = o.enabled

o = s:taboption('lansetup', Value, 'ipv6', translate('Enable IPv6'), translate('Enable/Disable IPv6'))
o:value("0", translate("关闭"))
o:value("1", translate("手动"))
o:value("2", translate("自动"))
o.default = "0"

local wireless = luci.sys.exec(string.format("[ -f '/etc/config/wireless' ] && echo -n $(cat /etc/config/wireless)"))
if wireless and wireless ~= "" and wireless ~= "nil" then
	s:tab('wifisetup', translate('Wireless Settings'), translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
	o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title\"Extended Service Set Identifier\">ESSID</abbr>'))
	o.datatype = 'maxlength(32)'
	o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
	o.datatype = 'wpakey'
	o.password = true
end

return m
