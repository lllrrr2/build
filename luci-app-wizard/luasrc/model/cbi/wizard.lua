m = Map('wizard', translate('Inital Router Setup'), translate('If you are using this router for the first time, please configure it here.'))

s = m:section(TypedSection, 'wizard')
s.addremove = false
s.anonymous = true

s:tab('wansetup', translate('外网设置'), translatef('Three different ways to access the Internet, please choose according to your own situation.'))

o = s:taboption('wansetup', ListValue, 'wan_proto', translate('Protocol'))
o:depends('dhcp')
o:value('dhcp', translate('DHCP client'))
o:value('static', translate('Static address'))
o:value('pppoe', translate('PPPoE'))

o = s:taboption('wansetup', Value, 'wan_pppoe_user', translate('PAP/CHAP username'))
o:depends('wan_proto', 'pppoe')

o = s:taboption('wansetup', Value, 'wan_pppoe_pass', translate('PAP/CHAP password'))
o:depends('wan_proto', 'pppoe')
o.password = true

o = s:taboption('wansetup', Value, 'wan_ipaddr', translate('IPv4 address'))
o:depends('wan_proto', 'static')
o.datatype='ip4addr'

o = s:taboption('wansetup', Value, 'wan_netmask', translate('IPv4 netmask'))
o:depends('wan_proto', 'static')
o.datatype='ip4addr'
o:value('255.255.255.0')
o:value('255.255.0.0')
o:value('255.0.0.0')

o = s:taboption('wansetup', Value, 'wan_gateway', translate('IPv4 gateway'))
o:depends('wan_proto', 'static')
o.datatype='ip4addr'

dns = s:taboption('wansetup', DynamicList, 'wan_dns', translate('Use custom DNS servers'), translate("可以设置主路由的IP，或可到<a href='https://dnsdaquan.com' target='_blank'> DNS大全 </a>获取更多"))
dns:value("223.5.5.5", translate("阿里DNS：223.5.5.5"))
dns:value("223.6.6.6", translate("阿里DNS：223.6.6.6"))
dns:value("101.226.4.6", translate("DNS派：101.226.4.6"))
dns:value("218.30.118.6", translate("DNS派：218.30.118.6"))
dns:value("180.76.76.76", translate("百度DNS：180.76.76.76"))
dns:value("114.114.114.114", translate("114DNS：114.114.114.114"))
dns:value("114.114.115.115", translate("114DNS：114.114.115.115"))
dns.rmempty = true
dns.datatype = "ip4addr"
dns.cast = "string"

s:tab("lansetup", translate("Lan Settings"))
o = s:taboption("lansetup", Value, "lan_ipaddr", translate("IPv4 address"))
o.datatype="ip4addr"
o = s:taboption('lansetup', Value, 'lan_netmask', translate('IPv4 netmask'))
o.datatype='ip4addr'
o:value('255.255.255.0')
o:value('255.255.0.0')
o:value('255.0.0.0')

if nixio.fs.access("/etc/config/wireless") then
	s:tab('wifisetup', translate('Wireless Settings'), translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
	o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title\"Extended Service Set Identifier\">ESSID</abbr>'))
	o.datatype = 'maxlength(32)'
	o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
	o.datatype = 'wpakey'
	o.password = true
end

return m
