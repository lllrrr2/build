require("luci.sys")
if (luci.sys.call("ps | grep 'cowbping' | grep -v grep > /dev/null") == 0) then
    state_msg = translate([[运行状态： <b><font color="green">运行中</font></b><br>]])
else
    state_msg = translate([[运行状态： <b><font color="red">没有运行</font></b><br>]])
end

m = Map("cowbping", translate("网络检测"), translate("<font style='color:black'>定期ping一个网站以检测网络是否通畅，否则执行相关动作以排除故障<br>网站一与网站二是“与”关系，丢包率与延迟是“或”关系</font><br><br>" .. state_msg))

s = m:section(NamedSection, "cowbping", "cowbping")
s.anonymous=true
s.addremove=false

enabled = s:option(Flag, "enabled", translate("启用"))
enabled.default = 0

delaytime = s:option(Value, "delaytime", translate("开机延迟"))
for _, v in ipairs({20, 30, 40, 50, 60}) do
	delaytime:value(v, translate("%u 秒") %{v})
end
delaytime.default = "30"
delaytime.rmempty = true
delaytime.datatype = "ufloat"

time = s:option(Value, "time", translate("检测间隔"))
for _, v in ipairs({1, 5, 10, 15, 20}) do
	time:value(v, translate("%u 分") %{v})
end
time.default = "15"
time.rmempty = true
time.datatype = "ufloat"

address1 = s:option(Value, "address1", translate("网站1（IP/域名）"))
address1.default="163.com"
address1:value("163.com", translate("网易"))
address1:value("baidu.com", translate("百度"))
address1:value("sina.com.cn", translate("新浪"))
address1:value("qq.com", translate("腾讯"))

address2 = s:option(Value, "address2", translate("网站2（IP/域名）"))
address2.default="223.5.5.5"
address2:value("223.5.5.5", translate("阿里云DNS"))
address2:value("183.60.83.19", translate("腾讯云DNS"))
address2:value("180.76.76.76", translate("百度云DNS"))
address2:value("8.8.8.8", translate("GoogleDNS"))

sum = s:option(Value, "sum", translate("发送包数"))
sum.default=3
sum.datatype = "ufloat"

pkglost = s:option(Value, "pkglost", translate("丢包率（%）"))
pkglost.default=80
pkglost.datatype = "ufloat"

pkgdelay = s:option(Value, "pkgdelay", translate("延迟（毫秒）"))
pkgdelay.default=300
pkgdelay.datatype = "ufloat"

work_mode = s:option(ListValue, "work_mode", translate("执行动作"))
work_mode:value("1", translate("重新拨号"))
work_mode:value("2", translate("重启WIFI"))
work_mode:value("3", translate("重启网络"))
work_mode:value("4", translate("shell命令"))
-- work_mode:value("5", translate("7.自动中继"))
work_mode:value("6", translate("重启系统"))
work_mode:value("7", translate("关机"))
work_mode.default = 3

command = s:option(TextValue, "/etc/config/cbp_cmd", translate("shell脚本"),
    translate("* 应用前需仔细检查脚本语法，如存在语法错误会导致所有命令无法执行，可终端执行sh /etc/config/cbp_cmd检查。"))
command:depends("work_mode", 4)
command.rows = 10
command.wrap = "off"
function command.cfgvalue(self, section)
    return nixio.fs.readfile("/etc/config/cbp_cmd") or ""
end
function command.write(self, section, value)
    if value then
        value = value:gsub("\r\n?", "\n")
        nixio.fs.writefile("/tmp/cbp_cmd", value)
        if (luci.sys.call("cmp -s /tmp/cbp_cmd /etc/config/cbp_cmd") == 1) then
            nixio.fs.writefile("/etc/config/cbp_cmd", value)
        end
        nixio.fs.remove("/tmp/cbp_cmd")
    end
end

run = s:option(Value, "run_sum", translate("执行次数"), translate("设定执行次数后停止执行"))
run.default = 5
run.datatype = "ufloat"

stop_run = s:option(Flag, "stop_run", translate("停止运行"), translate("执行到设定次数后停止网络检测"))

if (luci.sys.call("grep -q '\&' /etc/cowbping_run_sum") == 0) then
    clear_sum = s:option(Button, "aad", translate("清除执行记录"))
    clear_sum.inputtitle = translate("清除记录")
    clear_sum.inputstyle = "remove"
    clear_sum.forcewrite = true
    function clear_sum.write(self, section)
        luci.sys.exec(":>/etc/cowbping_run_sum")
        luci.http.redirect(luci.dispatcher.build_url("admin/network/cowbping/cowbping"))
    end
    clear_sum.description = translate([[当前有 <b><font color="red">]] ..
        luci.sys.exec("grep -c '\&' /etc/cowbping_run_sum 2>/dev/null") ..
        [[</font></b> 次执行的记录。<br>最近一次执行的时间：<b><font color="red">]] ..
        luci.sys.exec("awk -F'&' '/&/{print $1}' /etc/cowbping_run_sum | sed -n '$p'") .. [[</font></b>]])
end

if (luci.http.formvalue("cbi.apply")) then
  io.popen("/etc/init.d/cowbping trace")
end

return m
