local fs  = require "nixio.fs"
local sys = require "luci.sys"

local function description(value)
    return translatef([[本页是<code>%s</code>的配置文件内容，编辑后点击<code>保存&应用</code>按钮后重启生效]], value)
end

local function isFileEmpty(path)
    local content = fs.readfile(path) or ""
    return content ~= ""
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

local hosts         = '/etc/hosts'
local rc_local      = '/etc/rc.local'
local file_dhcp     = '/etc/config/dhcp'
local file_uhttpd   = '/etc/config/uhttpd'
local dnsmasq_conf  = '/etc/dnsmasq.conf'
local file_network  = '/etc/config/network'
local file_firewall = '/etc/firewall.user'
local file_wireless = '/etc/config/wireless'

m = Map("advanced", translate("快捷设置"),
    translate([[<br><font color='red'><strong>配置文件是直接编辑保存的！除非你知道在干什么，否则请不要修改这些配置文件。配置不正确可能会导致不能开机，联网等错误。</strong></font><br/><b><font color='green'>修改行前建议先备份行再修改，注释行在行首添加 ＃。</font></b><br>]]))
s = m:section(TypedSection,"advanced")
s.anonymous = true

if isFileEmpty(file_network) then
    s:tab("netwrokconf", translate("网络"), description(file_network))
    o = s:taboption("netwrokconf", Button, "_network")
    o.inputtitle = translate("重启网络")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("network")
    end

    conf = s:taboption("netwrokconf", Value, "netwrokconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
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

if isFileEmpty(file_wireless) then
    s:tab("wirelessconf", translate("无线"), description(file_wireless))
    o = s:taboption("wirelessconf", Button, "_wifi")
    o.inputtitle = translate("重启wifi")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.exec("wifi reload >/dev/null &")
    end

    conf = s:taboption("wirelessconf", Value, "wirelessconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"
    function conf.cfgvalue(self, section)
        return fs.readfile(file_wireless) or ""
    end

    function conf.write(self, section, value)
        if not value then return end
        value = value:gsub("\r\n?", "\n")
        local old_value = fs.readfile(file_wireless) or ""
        if value ~= old_value then
            fs.writefile(file_wireless, value)
            sys.exec("wifi reload >/dev/null &")
        end
    end
end

if isFileEmpty(file_dhcp) then
    s:tab("dhcpconf", translate("DHCP"), description(file_dhcp))
    o = s:taboption("dhcpconf", Button, "_dhcp")
    o.inputtitle = translate("重启dhcp")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("dnsmasq")
    end

    conf = s:taboption("dhcpconf", Value, "dhcpconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
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
    s:tab("firewallconf", translate("防火墙-规则"), description(file_firewall))
    o = s:taboption("firewallconf", Button, "_firewall")
    o.inputtitle = translate("重启防火墙")
    o.inputstyle = "reset"
    function o.write(self, section)
        sys.init.restart("firewall")
    end

    conf = s:taboption("firewallconf", Value, "firewallconf", nil)
    conf.template = "cbi/tvalue"
    conf.rows = 20
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
