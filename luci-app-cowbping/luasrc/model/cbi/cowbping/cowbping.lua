local sys = require "luci.sys"
local fs  = require "nixio.fs"
local state_msg = translatef([[color="red">%s]], "没有运行")
if sys.call("pgrep -f '/etc/cowbping.sh' > /dev/null") == 0 then
    state_msg = translatef([[color="green">%s]], "运行中")
end

m = Map("cowbping", translate("网络检测"),
    translatef("定期ping一个网站以网络检测是否通畅，否则执行相关动作以排除故障<br>网站一与网站二是“与”关系，丢包率与延迟是“或”关系<br><br>运行状态： <b><font %s</font></b><br>", state_msg))

s = m:section(NamedSection, "cowbping", "cowbping")
s.anonymous = true
s.addremove = false

local enabled = s:option(Flag, "enabled", translate("启用"))
enabled.default = 0

local delaytime = s:option(Value, "delaytime", translate("开机延迟"))
for _, v in ipairs({20, 30, 40, 50, 60}) do
    delaytime:value(v, translatef("%u 秒", v))
end
delaytime.default = "30"
delaytime.rmempty = true
delaytime.datatype = "ufloat"

local time = s:option(Value, "time", translate("检测间隔"))
for _, v in ipairs({1, 5, 10, 15, 20}) do
    time:value(v, translatef("%u 分", v))
end
time.default = "15"
time.rmempty = true
time.datatype = "ufloat"

local address1 = s:option(Value, "address1", translate("网站1（IP/域名）"))
address1.default = "163.com"
address1:value("163.com", translate("网易"))
address1:value("baidu.com", translate("百度"))
address1:value("sina.com.cn", translate("新浪"))
address1:value("qq.com", translate("腾讯"))
sys.net.ipv4_hints(function(ip, name)
    address1:value(ip, translatef("%s (%s)", ip, name))
end)

local address2 = s:option(Value, "address2", translate("网站2（IP/域名）"))
address2.default = "223.5.5.5"
address2:value("223.5.5.5", translate("阿里云DNS"))
address2:value("183.60.83.19", translate("腾讯云DNS"))
address2:value("180.76.76.76", translate("百度云DNS"))
address2:value("8.8.8.8", translate("GoogleDNS"))
sys.net.ipv4_hints(function(ip, name)
    address2:value(ip, translatef("%s (%s)", ip, name))
end)

local sum = s:option(Value, "sum", translate("发送包数"))
sum.default  = 3
sum.datatype = "ufloat"

local pkglost  = s:option(Value, "pkglost", translate("丢包率（%）"))
pkglost.default  = 80
pkglost.datatype = "ufloat"

pkgdelay = s:option(Value, "pkgdelay", translate("延迟（毫秒）"))
pkgdelay.default  = 300
pkgdelay.datatype = "ufloat"

local work_mode = s:option(ListValue, "work_mode", translate("执行动作"))
work_mode:value("1", translate("重新拨号"))
work_mode:value("2", translate("重启WIFI"))
work_mode:value("3", translate("重启网络"))
work_mode:value("4", translate("shell命令"))
-- work_mode:value("5", translate("自动中继"))
work_mode:value("6", translate("重启系统"))
work_mode:value("7", translate("关机"))
work_mode.default = 3

local cbp_cmd = "/etc/config/cbp_cmd"
local command = s:option(TextValue, cbp_cmd, translate("shell脚本"),
    translatef("* 应用前需仔细检查脚本语法，如存在语法错误会导致所有命令无法执行，可终端执行sh %s检查。", cbp_cmd))
command:depends("work_mode", 4)
command.rows = 2
command.size = 30
command.wrap = "off"

function command.cfgvalue(self, section)
    return fs.readfile(cbp_cmd) or ""
end

function command.write(self, section, value)
    if value then
        value = value:gsub("\r\n?", "\n")
        local old_value = fs.readfile(cbp_cmd) or ""
        if value ~= old_value then
            fs.writefile(cbp_cmd, value)
        end
    end
end

local run_sum = s:option(Value, "run_sum", translate("执行次数"), translate("设定次数后停止执行动作，0为无限执行"))
run_sum.default = 5
run_sum.datatype = "ufloat"

local stop_run = s:option(Flag, "stop_run", translate("停止运行"), translate("执行到设定次数后停止网络检测"))
stop_run.default = false
-- stop_run:depends('work_mode', '6')

if sys.call("test -s /etc/cowbping_run_sum") == 0 then
    local run_sum  = sys.exec("sed -n '$=' /etc/cowbping_run_sum 2>/dev/null")
    local run_time = sys.exec("sed -n '$p' /etc/cowbping_run_sum 2>/dev/null")
    local clear_sum = s:option(Button, "aad", translate("清除执行记录"),
        translatef([[当前有 <b><font color='red'>%s</font></b> 次执行的记录。<br>最近一次执行的时间：<b><font color='red'>%s</font></b>]], run_sum, run_time))
    clear_sum.inputtitle = translate("清除记录")
    clear_sum.inputstyle = "remove"
    clear_sum.forcewrite = true
    function clear_sum.write(self, section)
        sys.exec(":>/etc/cowbping_run_sum")
        luci.http.redirect(luci.dispatcher.build_url("admin/network/cowbping/cowbping"))
    end
end

if luci.http.formvalue("cbi.apply") then
    sys.exec("/etc/init.d/cowbping trace")
end

return m
