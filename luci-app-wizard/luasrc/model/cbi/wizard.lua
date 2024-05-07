local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
local wizard = uci:get_all("wizard", "default")

local hosts         = '/etc/hosts'
local rc_local      = '/etc/rc.local'
local file_dhcp     = '/etc/config/dhcp'
local dnsmasq_conf  = '/etc/dnsmasq.conf'
local file_uhttpd   = '/etc/config/uhttpd'
local file_network  = '/etc/config/network'
local file_firewall = '/etc/config/firewall'
local file_wireless = '/etc/config/wireless'

local ip_mac = {}
sys.net.ipv4_hints(
    function(ip, name)
        ip_mac[#ip_mac + 1] = {ip = ip, mac = name}
    end, function(a, b)
    if #a.ip ~= #b.ip then
        return #a.ip < #b.ip
    end
    return a.ip < b.ip
end)

local function isFileEmpty(file)
    return (fs.readfile(file) or "") ~= ""
end

local function _writefile(value, path)
    value = value:gsub("\r\n?", "\n")
    local old_value = fs.readfile(path) or ""
    if value ~= old_value then
        return fs.writefile(path, value)
    else
        return false
    end
end

local function description(x)
    return translatef([[<font color='red'><strong>配置文件是直接编辑保存的！除非你知道在干什么，否则请不要修改这些配置文件。配置不正确可能会导致不能开机，联网等错误。</strong></font><br/><b><font color='green'>修改行前建议先备份行再修改，注释行在行首添加 ＃。</font></b><br>本页是<code>%s</code>的配置文件内容，编辑后点击<code>保存&应用</code>按钮后重启生效<br>]], x)
end

m = Map('wizard', translate('快捷设置'))

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

siderouter = s:taboption("wansetup", Flag, "enable_siderouter", translate("旁路由设置"))
siderouter:depends('wan_proto', 'siderouter')

local lan_ipaddr = uci:get("network", "lan", "ipaddr") or ""
ipaddr = s:taboption("wansetup", Value, "lan_ipaddr", translate("IPv4 address"))
ipaddr:value(lan_ipaddr, translate(lan_ipaddr .. " --当前LAN的IP--"))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false
ipaddr:depends('enable_siderouter', false)

local sys_hostname = sys.hostname() or ""
hostname = s:taboption("wansetup", Value, "hostname", translate("Hostname"))
hostname.default = sys_hostname
hostname:depends('enable_siderouter', true)

if wizard.hostname and wizard.hostname ~= sys_hostname then
    sys.hostname(wizard.hostname)
end

ipaddr = s:taboption("wansetup", Value, "siderouter_lan_ipaddr", translate("IPv4 address"))
local descr = {[[设置主路由同网段未冲突的IP地址<font color=red>(即是该路由web访问的IP)</font><br>当前的内网主机列表：<ol>]]}
for _, key in pairs(ip_mac) do
    descr[#descr + 1] = translatef([[<li>%s (%s)</li>]], key.ip, key.mac)
end
ipaddr.description = table.concat(descr) .. "</ol>"

ipaddr:value(lan_ipaddr, translatef("%s --当前LAN的IP--", lan_ipaddr))
ipaddr.default = lan_ipaddr
ipaddr.datatype="ip4addr"
ipaddr.anonymous = false
ipaddr:depends('enable_siderouter', true)

lan_gateway = s:taboption('wansetup', Value, 'lan_gateway', translate('IPv4 gateway'), translate('这里输入主路由IP地址<b><font color="red"> 必须填写</font></b>'))
lan_gateway:depends('enable_siderouter', true)
lan_gateway.datatype = 'ip4addr'
lan_gateway.rmempty = true

lan_sum = s:taboption("wansetup", Value, "lan_sum", translate("网口数量"),
    translate("该路由物理网口数量，留空则自动获取"))
lan_sum.datatype = 'ufloat'
lan_sum:depends('enable_siderouter', true)

netmask = s:taboption('wansetup', ListValue, 'lan_netmask', translate('IPv4 netmask'))
netmask:value("255.255.255.0", translate("255.255.255.0"))
netmask:value("255.255.0.0", translate("255.255.0.0"))
netmask:value("255.0.0.0", translate("255.0.0.0"))
netmask.default = "255.255.255.0"
netmask.datatype='ip4addr'
netmask.anonymous = false

dns = s:taboption('wansetup', DynamicList, 'lan_dns', translate('LAN DNS 服务器'),
    translate("可以设置主路由的IP，或可到<a href='https://dnsdaquan.com' target='_blank'> DNS大全 </a>获取更多"))
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

dhcp = s:taboption('wansetup', Flag, 'dhcp', translate('DHCP Server'),
    translate('开启此DHCP则需要关闭主路由的DHCP<br><b><font color="red">关闭主路由DHCP则需要手动将所有上网设备的网关和DNS改为此旁路由的IP</font></b>'))
dhcp.datatype = 'ip4addr'
dhcp:depends('enable_siderouter', true)

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

if isFileEmpty(file_wireless) then
    s:tab('wifisetup', translate('Wireless Settings'),
        translate('Set the router\'s wireless name and password. For more advanced settings, please go to the Network-Wireless page.'))
    o = s:taboption('wifisetup', Value, 'wifi_ssid', translate('<abbr title=\"Extended Service Set Identifier\">ESSID</abbr>'))
    o.datatype = 'maxlength(32)'
    o = s:taboption("wifisetup", Value, "wifi_key", translate("Key"))
    o.datatype = 'wpakey'
    o.password = true
end

if isFileEmpty(file_network) then
    s:tab("netwrokconf", translate("修改network"), description(file_network))
    local o = s:taboption("netwrokconf", Button, "_network")
    o.inputtitle = translate("重启network")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("network")
    end

    local conf = s:taboption("netwrokconf", Value, "netwrokconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 25
    conf.wrap = "off"
    function conf.cfgvalue(self, section)
        return fs.readfile(file_network) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, file_network) then
            sys.init.restart("network")
        end
    end
end

if isFileEmpty(file_dhcp) then
    s:tab("dhcpconf", translate("修改DHCP"), description(file_dhcp))
    local o = s:taboption("dhcpconf", Button, "_dhcp")
    o.inputtitle = translate("重启dnsmasq")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("dnsmasq")
    end

    local conf = s:taboption("dhcpconf", Value, "dhcpconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 25
    conf.wrap = "off"
    function conf.cfgvalue(self, section)
        return fs.readfile(file_dhcp) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, file_dhcp) then
            sys.init.restart("dnsmasq")
        end
    end
end

if isFileEmpty(file_firewall) then
    s:tab("firewallconf", translate("修改firewall"), description(file_firewall))
    local o = s:taboption("firewallconf", Button, "_firewall")
    o.inputtitle = translate("重启firewall")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("firewall")
    end

    local conf = s:taboption("firewallconf", Value, "firewallconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 25
    conf.wrap = "off"
    function conf.cfgvalue(self, section)
        return fs.readfile(file_firewall) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, file_firewall) then
            sys.init.restart("firewall")
        end
    end
end

if isFileEmpty(hosts) then
    s:tab("hostsconf", translate("hosts"), description(hosts))
    o = s:taboption("hostsconf", Button, "_hosts")
    o.inputtitle = translate("重启dnsmasq")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("dnsmasq")
    end

    conf = s:taboption("hostsconf", Value, "hostsconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"

    function conf.cfgvalue(self, section)
        return fs.readfile(hosts) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, hosts) then
            sys.init.restart("dnsmasq")
        end
    end
end

if isFileEmpty(file_uhttpd) then
    s:tab("uhttpdconf", translate("uhttpd服务器"), description(file_uhttpd))
    o = s:taboption("uhttpdconf", Button, "_uhttpd")
    o.inputtitle = translate("重启uhttpd")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("uhttpd")
    end

    conf = s:taboption("uhttpdconf", Value, "uhttpdconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"

    function conf.cfgvalue(self, section)
        return fs.readfile(file_uhttpd) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, file_uhttpd) then
            sys.init.restart("uhttpd")
        end
    end
end

if isFileEmpty(dnsmasq_conf) then
    s:tab("dnsmasqconf", translate("dnsmasq"), description(dnsmasq_conf))
    o = s:taboption("dnsmasqconf", Button, "_dnsmasq")
    o.inputtitle = translate("重启dnsmasq")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("dnsmasq")
    end

    conf = s:taboption("dnsmasqconf", Value, "dnsmasqconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"

    function conf.cfgvalue(self, section)
        return fs.readfile(dnsmasq_conf) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        if _writefile(value, dnsmasq_conf) then
            sys.init.restart("dnsmasq")
        end
    end
end

if isFileEmpty(rc_local) then
    s:tab("rc_localconf", translate("本地启动脚本"),
        translatef("本页是<code>%s</code>的配置文件内容，编辑后点击<code>保存&应用</code>按钮后生效。<br>启动脚本插入到 'exit 0' 之前即可随系统启动运行。<br>", rc_local))
    conf = s:taboption("rc_localconf", Value, "rc_localconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"

    function conf.cfgvalue(self, section)
        return fs.readfile(rc_local) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        _writefile(value, rc_local)
    end
end

return m
