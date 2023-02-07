x = [[<br><font color="Red">配置文件是直接编辑的！除非你知道自己在干什么，否则请不要轻易修改这些配置文件。配置不正确可能会导致不能联网等错误。</font>]]
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
-- wan_proto:value('static', translate('Static address'))

pppoe_user = s:taboption('wansetup', Value, 'pppoe_user', translate('PAP/CHAP username'))
pppoe_user:depends('wan_proto', 'pppoe')

pppoe_pass = s:taboption('wansetup', Value, 'pppoe_pass', translate('PAP/CHAP password'))
pppoe_pass:depends('wan_proto', 'pppoe')
pppoe_pass.password = true

wan_ipaddr = s:taboption('wansetup', Value, 'wan_ipaddr', translate('IPv4 address'))
wan_ipaddr:depends('wan_proto', 'static')
wan_ipaddr.datatype = 'ip4addr'
wan_ipaddr.rmempty = false
wan_ipaddr.ucioption = 'ipaddr'

wan_gateway = s:taboption('wansetup', Value, 'wan_gateway', translate('IPv4 gateway'))
wan_gateway:depends('wan_proto', 'static')
wan_gateway.datatype = "ip4addr"
wan_gateway.ucioption = 'gateway'

wan_netmask = s:taboption('wansetup', ListValue, 'wan_netmask', translate('IPv4 netmask'))
wan_netmask:value('255.255.255.0')
wan_netmask:value('255.255.0.0')
wan_netmask:value('255.0.0.0')
wan_netmask:depends('wan_proto', 'static')
wan_netmask.datatype = "ip4addr"
wan_netmask.rmempty = false
wan_netmask.ucioption = 'netmask'

local lan_ipaddr = (uci:get("network", "lan", "ipaddr") or "")
ipaddr = s:taboption("wansetup", Value, "lan_ipaddr", translate("IPv4 address"),
	translate([[主路由同网段未冲突的IP地址<br><font color="red">即是该路由web访问的IP</font>]]))
ipaddr:value(lan_ipaddr, translate(lan_ipaddr .. " --当前路由的IP--"))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false

wan_dns  = s:taboption('wansetup', DynamicList, 'wan_dns', translate('WAN DNS 服务器'))
wan_dns:depends('wan_proto', 'siderouter')
wan_dns :value("223.5.5.5", translate("阿里DNS：223.5.5.5"))
wan_dns :value("223.6.6.6", translate("阿里DNS：223.6.6.6"))
wan_dns :value("101.226.4.6", translate("DNS派：101.226.4.6"))
wan_dns :value("218.30.118.6", translate("DNS派：218.30.118.6"))
wan_dns :value("180.76.76.76", translate("百度DNS：180.76.76.76"))
wan_dns :value("114.114.114.114", translate("114DNS：114.114.114.114"))
wan_dns :value("114.114.115.115", translate("114DNS：114.114.115.115"))
wan_dns .default = "223.5.5.5"
wan_dns .anonymous = false
wan_dns .datatype = "ip4addr"

dns = s:taboption('wansetup', DynamicList, 'lan_dns', translate('LAN DNS 服务器'), translate("可以设置主路由的IP，或可到<a href='https://dnsdaquan.com' target='_blank'> DNS大全 </a>获取更多"))
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

netmask = s:taboption('wansetup', ListValue, 'lan_netmask', translate('IPv4 netmask'))
netmask:value("255.255.255.0", translate("255.255.255.0"))
netmask:value("255.255.0.0", translate("255.255.0.0"))
netmask:value("255.0.0.0", translate("255.0.0.0"))
netmask.default = "255.255.255.0"
netmask.datatype='ip4addr'
netmask.anonymous = false

lan_gateway = s:taboption('wansetup', Value, 'lan_gateway', translate('IPv4 gateway'), translate('这里输入主路由IP地址'))
lan_gateway:depends('wan_proto', 'siderouter')
lan_gateway.datatype = 'ip4addr'
lan_gateway.rmempty = false

lan_sum = s:taboption("wansetup", Value, "lan_sum", translate("网口数量"),
translate("该路由物理网口数量，留空则自动获取"))
lan_sum:depends('wan_proto', 'siderouter')

dhcp = s:taboption('wansetup', Flag, 'dhcp', translate('DHCP Server'), translate('开启此DHCP则需要关闭主路由的DHCP<br><b><font color="red">关闭主路由DHCP则需要手动将所有上网设备的网关和DNS改为此旁路由的IP</font></b>'))
dhcp.datatype = 'ip4addr'
dhcp:depends('wan_proto', 'siderouter')
-- dhcp.default = o.enabled

wan = s:taboption("wansetup", Flag, "wan_lan", translate("修改WAN口"),
translate("修改WAN口变成LAN口"))
wan.rmempty = true
wan:depends('wan_proto', 'siderouter')

firewall = s:taboption("wansetup", Flag, "firewall", translate("防火墙设置"))
firewall.rmempty = true
firewall:depends('wan_proto', 'siderouter')

fullcone = s:taboption("wansetup", Flag, "fullcone", translate("SYN-flood"),
translate("关闭防火墙ISYN-flood防御服务<code>建议开启</code>"))
fullcone:depends("firewall", true)
fullcone.rmempty = true

masq = s:taboption("wansetup", Flag, "masq", translate("IP动态伪装"),
translate("开启防火墙IP动态伪装IP服务<code>建议开启</code>"))
masq:depends("firewall", true)
masq.rmempty = true

syn_flood = s:taboption("wansetup", Flag, "syn_flood", translate("FullCone-NAT"),
translate("关闭防火墙IFullCone-NAT服务<code>可忽略</code>"))
syn_flood:depends("firewall", true)
syn_flood.rmempty = true

omasq = s:taboption("wansetup", Flag, "omasq", translate("防火墙规定"),
translate("添加自定义防火墙规则。<code>建议开启</code>"))
omasq:depends("firewall", true)

ip_tables = s:taboption("wansetup", DynamicList, "ip_tables", translate(" "))
ip_tables.default = "iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE"
ip_tables.anonymous = false
ip_tables:depends("omasq", true)

ipv6 = s:taboption('wansetup', Value, 'ipv6', translate('Enable IPv6'), translate('Enable/Disable IPv6'))
ipv6:value("0", translate("关闭"))
ipv6:value("1", translate("手动"))
ipv6:value("2", translate("自动"))
ipv6.default = "0"
ipv6:depends('wan_proto', 'pppoe')

-- s:tab("lansetup", translate("Lan Settings"))

if (luci.sys.call("[ -s '/etc/config/wireless' ]") ==0) then
	s:tab('wifisetup', translate('Wireless Settings'), translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
	o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title\"Extended Service Set Identifier\">ESSID</abbr>'))
	o.datatype = 'maxlength(32)'
	o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
	o.datatype = 'wpakey'
	o.password = true
end


if nixio.fs.access("/etc/config/network") then
	s:tab("netwrokconf", translate("修改network"),
	translate("本页是/etc/config/network的配置文件内容，编辑后点击<code>保存&应用</code>按钮后重启生效") .. x)
	o = s:taboption("netwrokconf", Button, "_network")
	o.inputtitle = translate("重启network")
	o.inputstyle = "apply"
	function o.write(self, section)
		luci.sys.exec("/etc/init.d/network restart >/dev/null &")
	end

	conf = s:taboption("netwrokconf", Value, "netwrokconf", nil)
	conf.template = "cbi/tvalue"
	conf.rows = 25
	conf.wrap = "off"
	function conf.cfgvalue(self, section)
		return nixio.fs.readfile("/etc/config/network") or ""
	end
	function conf.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			nixio.fs.writefile("/tmp/network", value)
				if (luci.sys.call("cmp -s /tmp/network /etc/config/network") == 1) then
					nixio.fs.writefile("/etc/config/network", value)
					luci.sys.call("/etc/init.d/network restart >/dev/null &")
				end
			nixio.fs.remove("/tmp/network")
		end
	end
end

if nixio.fs.access("/etc/config/dhcp") then
	s:tab("dhcpconf", translate("修改DHCP"), translate("本页是/etc/config/dhcp的配置文件内容，编辑后点击<code>保存&应用</code>按钮后重启生效") .. x)
	o = s:taboption("dhcpconf", Button, "_dhcp")
	o.inputtitle = translate("重启dnsmasq")
	o.inputstyle = "apply"
	function o.write(self, section)
		luci.sys.exec("/etc/init.d/dnsmasq reload >/dev/null &")
	end

	conf = s:taboption("dhcpconf", Value, "dhcpconf", nil)
	conf.template = "cbi/tvalue"
	conf.rows = 25
	conf.wrap = "off"
	function conf.cfgvalue(self, section)
		return nixio.fs.readfile("/etc/config/dhcp") or ""
	end
	function conf.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			nixio.fs.writefile("/tmp/dhcp", value)
				if (luci.sys.call("cmp -s /tmp/dhcp /etc/config/dhcp") == 1) then
					nixio.fs.writefile("/etc/config/dhcp", value)
					luci.sys.call("/etc/init.d/dnsmasq reload >/dev/null &")
				end
			nixio.fs.remove("/tmp/dhcp")
		end
	end
end

if nixio.fs.access("/etc/config/firewall") then
	s:tab("firewallconf", translate("修改firewall"), translate("本页是/etc/config/firewall的配置文件内容，编辑后点击<code>保存&应用</code>按钮后重启生效") .. x)
	o = s:taboption("firewallconf", Button, "_firewall")
	o.inputtitle = translate("重启firewall")
	o.inputstyle = "apply"
	function o.write(self, section)
		luci.sys.exec("/etc/init.d/firewall reload >/dev/null &")
	end

	conf = s:taboption("firewallconf", Value, "firewallconf", nil)
	conf.template = "cbi/tvalue"
	conf.rows = 25
	conf.wrap = "off"
	function conf.cfgvalue(self, section)
		return nixio.fs.readfile("/etc/config/firewall") or ""
	end
	function conf.write(self, section, value)
		if value then
		value = value:gsub("\r\n?", "\n")
		nixio.fs.writefile("/tmp/firewall", value)
			if (luci.sys.call("cmp -s /tmp/firewall /etc/config/firewall") == 1) then
				nixio.fs.writefile("/etc/config/firewall", value)
				luci.sys.call("/etc/init.d/firewall reload >/dev/null &")
			end
		nixio.fs.remove("/tmp/firewall")
		end
	end
end

return m
