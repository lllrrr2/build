local fs  = require "nixio.fs"
local sys = require "luci.sys"
local state_msg1,state_msg2 = translate(""),translate("")

local function checkKeywordInFile(file_path, keyword)
    local content = fs.readfile(file_path) or ""
    if keyword then
        return content:find(keyword)
    else
        return content ~= ""
    end
end

local state_msg  = [['red'>没有运行]]
if sys.call("pidof pwdHackDeny.sh >/dev/null") == 0 then
    state_msg = [['green'>正在运行]]
end

if checkKeywordInFile("/etc/pwdHackDeny/badip.log.ssh", "Bad password attempt") then
    state_msg1 = translate([[<b><font color='red'>有SSH异常登录！</font></b>]])
end

if checkKeywordInFile("/etc/pwdHackDeny/badip.log.web", "failed login on") then
    state_msg2 = translate([[<b><font color='red'>有WEB异常登录！</font></b>]])
end

m = Map("pwdHackDeny", translate("登录管制"),
    translatef("监控SSH及WEB异常登录，密码错误累计达到 5 次的内外网客户端都禁止连接SSH以及WEB登录端口，<br>直到手动删除相应的IP或MAC名单为止。也可以在名单中添加排除项目，被排除的客户端将不会被禁止。<br><br>运行状态 : <b><font color=%s</font></b><br/>", state_msg))

s = m:section(TypedSection, "pwdHackDeny")
s.anonymous=true
s.addremove=false

enabled = s:option(Flag, "enabled", translate("启用"))
enabled.default = 0

setport =s:option(Value,"time", translate("巡查时间（秒）"))
setport.default=5
setport.datatype="uinteger"

setport =s:option(Value,"sum", translate("失败次数（次）"))
setport.default=5
setport.datatype="uinteger"

if checkKeywordInFile("/etc/pwdHackDeny/badip.log.ssh") then
    clearsshlog = s:option(Button, "clearsshlog", translate("清除SSH登录日志"))
    clearsshlog.inputtitle = translate("清除")
    clearsshlog.inputstyle = "remove"
    function clearsshlog.write(self, section)
       sys.exec(":> /etc/pwdHackDeny/badip.log.ssh &")
       luci.http.redirect(luci.dispatcher.build_url("admin/control/pwdHackDeny"))
    end
end

if checkKeywordInFile("/etc/pwdHackDeny/badip.log.web") then
    clearlwebog = s:option(Button, "clearlwebog", translate("清除WEB登录日志"))
    clearlwebog.inputtitle = translate("清除")
    clearlwebog.inputstyle = "remove"
    function clearlwebog.write(self, section)
       sys.exec(":> /etc/pwdHackDeny/badip.log.web &")
       luci.http.redirect(luci.dispatcher.build_url("admin/control/pwdHackDeny"))
    end
end

s = m:section(TypedSection, "pwdHackDeny")
s.anonymous=true

s:tab("config1", translate("SSH最近登录日志"), state_msg1)
conf = s:taboption("config1", Value, "editconf1", nil,
    translate("<font style='color:red'>新的信息需要刷新页面才会显示。如原为启用状态，禁用后又再启用会清除日志显示，但不会清除累积计数。</font>"))
conf.template = "cbi/tvalue"
conf.rows = 20
conf.wrap = "off"
conf.readonly="readonly"
function conf.cfgvalue()
    return fs.readfile("/etc/pwdHackDeny/badip.log.ssh", value) or ""
end

s:tab("config2", translate("WEB最近登录日志"), state_msg2)
conf = s:taboption("config2", Value, "editconf2", nil,
    translate("<font style='color:red'>新的信息需要刷新页面才会显示。如原为启用状态，禁用后又再启用会清除日志显示，但不会清除累积计数。</font>"))
conf.template = "cbi/tvalue"
conf.rows = 20
conf.wrap = "off"
conf.readonly="readonly"
function conf.cfgvalue()
    return fs.readfile("/etc/pwdHackDeny/badip.log.web", value) or ""
end

if checkKeywordInFile("/etc/pwdHackDeny/badhosts.web") then
    s:tab("config3", translate("WEB累积记录"))
    conf = s:taboption("config3", Value, "editconf3", nil,
        translate("<font style='color:red'>新的信息需要刷新页面才会显示。如记录中有自己的MAC，可复制到相应的黑名单中，在前面加#可避免被屏蔽。</font>"))
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"
    conf.readonly="readonly"
    function conf.cfgvalue()
        return fs.readfile("/etc/pwdHackDeny/badhosts.web", value) or ""
    end
end

if checkKeywordInFile("/etc/pwdHackDeny/badhosts.ssh") then
    s:tab("config4", translate("SSH累积记录"))
    conf = s:taboption("config4", Value, "editconf4", nil,
        translate("<font style='color:red'>新的信息需要刷新页面才会显示。如记录中有自己的MAC，可复制到相应的黑名单中，在前面加#可避免被屏蔽。</font>"))
    conf.template = "cbi/tvalue"
    conf.rows = 20
    conf.wrap = "off"
    conf.readonly="readonly"
    function conf.cfgvalue()
        return fs.readfile("/etc/pwdHackDeny/badhosts.ssh", value) or ""
    end
end

s:tab("config5", translate("SSH禁止名单"),
    translate("每行一条，可手动添加或删除，内网MAC或IPV4/IPV4段(如192.168.18.10-20)、外网IPV4/IPV6，或包含此内容的文本、日志。内网MAC外网IP行首加#将不拦截。"))
conf = s:taboption("config5", Value, "editconf5", nil,
    translate("<font style='color:red'>预设名单内外网都可以添加IP或MAC地址，IP4段格式为192.168.18.10-20，不能为192.168.1.1/24或192.168.18.10-192.168.18.20。<br>自动拦截的内网名单仅自动添加MAC地址。</font>"))
conf.template = "cbi/tvalue"
conf.rows = 20
conf.wrap = "off"
function conf.cfgvalue(self, section)
    return fs.readfile("/etc/SSHbadip.log") or ""
end
function conf.write(self, section, value)
    if value then
        value = value:gsub("\r\n?", "\n")
        local old_value = fs.readfile("/etc/SSHbadip.log") or ""
        if value ~= old_value then
            fs.writefile("/etc/SSHbadip.log", value)
        end
    end
end

s:tab("config6", translate("WEB禁止名单"),
    translate("每行一条，可手动添加或删除，内网MAC或IPV4/IPV4段(如192.168.18.10-20)、外网IPV4/IPV6，或包含此内容的文本、日志。内网MAC外网IP行首加#将不拦截。"))
conf = s:taboption("config6", Value, "editconf6", nil,
    translate("<font style='color:red'>预设名单内外网都可以添加IP或MAC地址，IP4段格式为192.168.18.10-20，不能为192.168.1.1/24或192.168.18.10-192.168.18.20。<br>自动拦截的内网名单仅自动添加MAC地址。</font>"))
conf.template = "cbi/tvalue"
conf.rows = 20
conf.wrap = "off"
function conf.cfgvalue(self, section)
    return fs.readfile("/etc/WEBbadip.log") or ""
end
function conf.write(self, section, value)
    if value then
        value = value:gsub("\r\n?", "\n")
        local old_value = fs.readfile("/etc/WEBbadip.log") or ""
        if value ~= old_value then
            fs.writefile("/etc/WEBbadip.log", value)
        end
    end
end

if luci.http.formvalue("cbi.apply") then
    sys.exec("/etc/init.d/pwdHackDeny start")
end

return m
