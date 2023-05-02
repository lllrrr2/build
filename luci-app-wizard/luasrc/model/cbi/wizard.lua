local uci = require "luci.model.uci".cursor()
m = Map('wizard', translate('Inital Router Setup'), translate('If you are using this router for the first time, please configure it here.'))

s = m:section(TypedSection, 'wizard')
s.addremove = false
s.anonymous = true

s:tab('wansetup', translate('Wan Settings'))
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
wan_netmask.rmempty = true
wan_netmask.ucioption = 'netmask'

ipv6 = s:taboption('wansetup', ListValue, 'ipv6', translate('Enable IPv6 negotiation'))
ipv6:value("0", translate("disable"))
ipv6:value("1", translate("Manual"))
ipv6:value("auto", translate("Automatic"))
ipv6.default = "0"
ipv6:depends('wan_proto', 'pppoe')

lan_ips = s:taboption("wansetup", Value, "lan_ips", translate("内网主机列表"), translate("只做查阅现已用内网 IP"))
lan_ips.datatype="ipaddr"
luci.ip.neighbors({family=4},function(entry)
	if entry.reachable then
		lan_ips:value(entry.dest:string())
	end
end)
lan_ips:depends('enable_siderouter', true)

local lan_ipaddr = (uci:get("network", "lan", "ipaddr") or "")
ipaddr = s:taboption("wansetup", Value, "lan_ipaddr", translate("IPv4 address"))
ipaddr:value(lan_ipaddr, translate(lan_ipaddr .. " --当前LAN的IP--"))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false
ipaddr:depends('enable_siderouter', false)

ipaddr = s:taboption("wansetup", Value, "siderouter_lan_ipaddr", translate("IPv4 address"),
	translate([[主路由同网段未冲突的IP地址<br><font color="red">即是该路由web访问的IP</font>]]))
ipaddr:value(lan_ipaddr, translate(lan_ipaddr .. " --当前LAN的IP--"))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false
ipaddr:depends('enable_siderouter', true)

local host_name = (uci:get("system", "@system[0]", "hostname") or "")
hostname = s:taboption("wansetup", Value, "hostname", translate("Hostname"))
hostname.default = host_name
hostname:depends('enable_siderouter', true)

netmask = s:taboption('wansetup', ListValue, 'lan_netmask', translate('IPv4 netmask'))
netmask:value("255.255.255.0", translate("255.255.255.0"))
netmask:value("255.255.0.0", translate("255.255.0.0"))
netmask:value("255.0.0.0", translate("255.0.0.0"))
netmask.default = "255.255.255.0"
netmask.datatype='ip4addr'
netmask.anonymous = false

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

siderouter = s:taboption("wansetup", Flag, "enable_siderouter", translate("旁路由设置"))
siderouter:depends('wan_proto', 'siderouter')

lan_gateway = s:taboption('wansetup', Value, 'lan_gateway', translate('IPv4 gateway'), translate('这里输入主路由IP地址<b><font color="red"> 必须填写</font></b>'))
lan_gateway:depends('enable_siderouter', true)
lan_gateway.datatype = 'ip4addr'
lan_gateway.rmempty = true

lan_sum = s:taboption("wansetup", Value, "lan_sum", translate("网口数量"),
translate("该路由物理网口数量，留空则自动获取"))
lan_sum.datatype = 'ufloat'
lan_sum:depends('enable_siderouter', true)

dhcp = s:taboption('wansetup', Flag, 'dhcp', translate('DHCP Server'), translate('开启此DHCP则需要关闭主路由的DHCP<br><b><font color="red">关闭主路由DHCP则需要手动将所有上网设备的网关和DNS改为此旁路由的IP</font></b>'))
dhcp.datatype = 'ip4addr'
dhcp:depends('enable_siderouter', true)
-- dhcp.default = o.enable_siderouterd

wan = s:taboption("wansetup", Flag, "wan_lan", translate("修改WAN口"),
translate("修改WAN口变成LAN口"))
wan.rmempty = true
wan:depends('enable_siderouter', true)

wan_dns_1  = s:taboption('wansetup', DynamicList, 'wan_dns_1', translate('WAN DNS 服务器'))
wan_dns_1:depends('wan_lan', true)
wan_dns_1 :value("223.5.5.5", translate("阿里DNS：223.5.5.5"))
wan_dns_1 :value("223.6.6.6", translate("阿里DNS：223.6.6.6"))
wan_dns_1 :value("101.226.4.6", translate("DNS派：101.226.4.6"))
wan_dns_1 :value("218.30.118.6", translate("DNS派：218.30.118.6"))
wan_dns_1 :value("180.76.76.76", translate("百度DNS：180.76.76.76"))
wan_dns_1 :value("114.114.114.114", translate("114DNS：114.114.114.114"))
wan_dns_1 :value("114.114.115.115", translate("114DNS：114.114.115.115"))
wan_dns_1 .default = "223.5.5.5"
wan_dns_1 .anonymous = false
wan_dns_1 .datatype = "ip4addr"

wan_ipaddr_1 = s:taboption('wansetup', Value, 'wan_ipaddr_1', translate('IPv4 address'))
wan_ipaddr_1:depends('wan_lan', true)
wan_ipaddr_1.datatype = 'ip4addr'
wan_ipaddr_1.rmempty = true
wan_ipaddr_1.ucioption = 'ipaddr'

wan_gateway_1 = s:taboption('wansetup', Value, 'wan_gateway_1', translate('IPv4 gateway'))
wan_gateway_1:depends('wan_lan', true)
wan_gateway_1.datatype = "ip4addr"
wan_gateway_1.ucioption = 'gateway'

wan_netmask_1 = s:taboption('wansetup', ListValue, 'wan_netmask_1', translate('IPv4 netmask'))
wan_netmask_1:value('255.255.255.0')
wan_netmask_1:value('255.255.0.0')
wan_netmask_1:value('255.0.0.0')
wan_netmask_1:depends('wan_lan', true)
wan_netmask_1.datatype = "ip4addr"
wan_netmask_1.rmempty = true
wan_netmask_1.ucioption = 'netmask'

firewall = s:taboption("wansetup", Flag, "firewall", translate("防火墙设置"))
firewall.rmempty = true
firewall:depends('enable_siderouter', true)

fullcone = s:taboption("wansetup", Flag, "fullcone", translate("启用 SYN-flood 防御"),
translate("建议开启"))
fullcone:depends("firewall", true)
fullcone.default = true
fullcone.rmempty = true

masq = s:taboption("wansetup", Flag, "masq", translate("启用 IP 动态伪装"),
translate("LAN防火墙服务<code>建议开启</code>"))
masq:depends("firewall", true)
masq.default = false
masq.rmempty = true

syn_flood = s:taboption("wansetup", Flag, "syn_flood", translate("FullCone-NAT"),
translate("开启防火墙IFullCone-NAT服务，默认关闭。<code>可忽略</code>"))
syn_flood:depends("firewall", true)
syn_flood.default = false
syn_flood.rmempty = true

omasq = s:taboption("wansetup", Flag, "omasq", translate("防火墙规定"),
translate("添加自定义防火墙规则。<code>建议开启</code>"))
omasq:depends("firewall", true)

ip_tables = s:taboption("wansetup", DynamicList, "ip_tables", translate(" "))
ip_tables.default = "iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE"
ip_tables.anonymous = false
ip_tables:depends("omasq", true)

local host = uci:get("system", "@system[0]", "hostname")
local wizard_node = uci:get_all("wizard", "default")
local network_lan = uci:get_all("network", "lan")
local network_wan = uci:get_all("network", "wan")

-- if wizard_node.wan_proto ~= pppoe then
-- 	if wizard_node.pppoe_user ~= network_wan.username or wizard_node.pppoe_pass ~= network_wan.password then
-- 		uci:set("network", "wan", "username", wizard_node.pppoe_user)
-- 		uci:set("network", "wan", "password", wizard_node.pppoe_pass)
-- 		uci:commit("network")
-- 	end
-- end

if wizard_node.ipv6 ~= network_wan.ipv6 and wizard_node.ipv6 then
	uci:set("network", "wan", "ipv6", wizard_node.ipv6)
	uci:commit("network")
end

if wizard_node.lan_dns ~= network_lan.dns and wizard_node.lan_dns then
	uci:set("network", "lan", "dns", wizard_node.lan_dns)
	uci:commit("network")
end

if wizard_node.lan_ipaddr ~= network_lan.ipaddr then
	uci:set("network", "lan", "ipaddr",  wizard_node.lan_ipaddr)
	uci:commit("network")
end

if wizard_node.lan_netmask ~= network_lan.netmask then
	uci:set("network", "lan", "netmask", wizard_node.lan_netmask)
	uci:commit("network")
end

if wizard_node.hostname ~= host and wizard_node.hostname then
	uci:set("system", "@system[0]", "hostname", wizard_node.hostname)
	luci.sys.hostname(host)
	uci:commit("system")
end

-- s:tab("lansetup", translate("Lan Settings"))

if (luci.sys.call("[ -s '/etc/config/wireless' ]") ==0) then
	s:tab('wifisetup', translate('Wireless Settings'), translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
	o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title\"Extended Service Set Identifier\">ESSID</abbr>'))
	o.datatype = 'maxlength(32)'
	o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
	o.datatype = 'wpakey'
	o.password = true
end

local x = [[<br><font color="Red">配置文件是直接编辑的！除非你知道自己在干什么，否则请不要轻易修改这些配置文件。配置不正确可能会导致不能联网等错误。</font>]]
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
