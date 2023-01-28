local m,s
if (luci.sys.call("ps | grep 'cowbping' | grep -v grep > /dev/null") == 0) then
    state_msg = translate([[运行状态： <b><font color="green">运行中</font></b><br>]])
else
    state_msg = translate([[运行状态： <b><font color="red">没有运行</font></b><br>]])
end

m = Map("cowbping", translate("网络检测"))
m.description = translate("<font style='color:black'>定期ping一个网站以检测网络是否通畅，否则执行相关动作以排除故障。网站一与网站二是“与”关系，丢包率与延迟是“或”关系。</font><br><br>" .. state_msg)

s = m:section(NamedSection, "cowbping")
s.anonymous=true
s.addremove=false

enabled = s:option(Flag, "enabled", translate("启用"))
enabled.default = 0

delaytime = s:option(Value, "delaytime", translate("开机延迟（秒）"))
delaytime.default=60

time = s:option(Value, "time", translate("检测间隔（分）"))
time.default=15

address1 = s:option(Value, "address1", translate("网站一(IP或域名)"))
address1.default="163.com"

address2 = s:option(Value, "address2", translate("网站二(IP或域名)"))
address2.default="223.5.5.5"

sum = s:option(Value, "sum", translate("发送包数（个）"))
sum.default=5

pkglost = s:option(Value, "pkglost", translate("丢包率（%）"))
pkglost.default=80

pkgdelay = s:option(Value, "pkgdelay", translate("延迟（毫秒）"))
pkgdelay.default=300

work_mode = s:option(ListValue, "work_mode", translate("执行动作"))
work_mode:value("1", translate("重新拨号"))
work_mode:value("2", translate("重启WIFI"))
work_mode:value("3", translate("重启网络"))
work_mode:value("4", translate("shell命令"))
-- work_mode:value("5", translate("7.自动中继"))
work_mode:value("6", translate("重启系统"))
work_mode:value("7", translate("关机"))
work_mode.default = 3

command = s:option(TextValue, "/etc/config/cbp_cmd", translate("shell脚本"), translate("* 应用前需仔细检查脚本语法，如存在语法错误会导致所有命令无法执行，可终端执行sh /etc/config/cbp_cmd检查。"))
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

local cowbping_run_sum = luci.util.trim(luci.sys.exec("grep -c 'error' /etc/cowbping_run_sum 2>/dev/null"))
run = s:option(Value, "run_sum", translate("执行次数"), translate("设定执行次数后停止执行"))
run.default = 5
if (luci.sys.call("grep -q 'error' /etc/cowbping_run_sum") == 0) then
    clear_sum = s:option(Button, "aad", translate("清除执行记录"))
    clear_sum.inputtitle = translate("清除")
    clear_sum.inputstyle = "remove"
    clear_sum.forcewrite = true
    function clear_sum.write(self, section)
        luci.sys.exec(":>/etc/cowbping_run_sum")
        luci.http.redirect(luci.dispatcher.build_url("admin/network/cowbping/cowbping"))
    end
    clear_sum.description = translate([[排除故障后清除执行的记录，确保正常运行<br>当前有 <b><font color="red">]] .. cowbping_run_sum .. [[</font></b> 次执行的记录]])
end

return m
