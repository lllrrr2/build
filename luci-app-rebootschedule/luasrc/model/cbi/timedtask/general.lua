sys = require "luci.sys"
util = require "luci.util"
uci = require "luci.model.uci".cursor()
m = Map("timedtask", translate("定时任务 Plus+"), 
translate("<font color='green'><b>让定时任务更加易用的插件，是用 wulishui@gmail.com 的原版修改。</font></b><br>") ..
translate("CRON表达式的字符串是五个有空格分隔加执行命令字段组成：<font color=red> * * * * * [command]</font><br>") ..
translate("按照位置的定义以及取值范围分别表示：分(0-59)，时(0-23)，日(1-31)，月(1-12)，周(1-7)，(commond)表示所需执行的命令。<br>") ..
translate("[ , ]逗号表示<strong>列出枚举值</strong>。在分钟域中，5,20表示分别在第5分钟和20分钟触发一次。<br>") ..
translate("[ / ]正斜杠表示<strong>指定数值的增量</strong>。在分钟域中，3/20表示从每20分钟的第3分钟触发一次。<br>") ..
translate("[ - ]连字符表示<strong>范围</strong>。在分钟域中，5-20表示从5分钟到20分钟之间每隔一分钟触发一次。<br>") ..
translate("[ * ]星号表示<strong>所有可能的值</strong>。在月域中，*表示每个月；在星期域中，*表示星期的每一天。<br>") ..
translate([[设置方法也可点击下面查看示例或在  crontab文件  中行尾是　#timedtask　的命令前5个字段去验证是否正确<br><br>]]) ..
translate([[<input class='cbi-button cbi-button-apply' type='button' value='查看示例'  onclick="window.open('http://'+window.location.hostname+'/reboothelp.jpg')">&nbsp;&nbsp;&nbsp;&nbsp;]]) ..
translate([[<input class='cbi-button cbi-button-apply' type='button' value='查看/验证' onclick="window.open('https://tool.lu/crontab')"><br><br>]]))

s = m:section(TypedSection, "crontab", "")
s.template = "cbi/tblsection"
s.anonymous = true -- 删除
s.addremove = true -- 添加
-- s.extedit  =  true -- 修改
-- s.sortable  =  true -- 移动

enable = s:option(Flag, "enable", translate("启用"))
enable.rmempty = false
enable.default = 0

minute = s:option(Value, "minute", translate("分"))
minute.default = '0'

hour = s:option(Value, "hour", translate("时"))
hour.default = '5'

day = s:option(Value, "day", translate("日"))
day.default = '*'

month = s:option(Value, "month", translate("月"))
month.default = '*'

week = s:option(Value, "week", translate("周"))
week:value('*', translate("每天"))
week:value(1, translate("Monday"))
week:value(2, translate("Tuesday"))
week:value(3, translate("Wednesday"))
week:value(4, translate("Thursday"))
week:value(5, translate("Friday"))
week:value(6, translate("Saturday"))
week:value(7, translate("Sunday"))
week.default = '*'

command = s:option(Value, "command", translate("执行的任务"))
command:value('sleep 5 && touch /etc/banner && reboot', translate("重启系统"))
command:value('service network restart &', translate("重启网络"))
command:value('ifdown wan && ifup wan', translate("重启wan"))
command:value('ifup wan', translate("重新拨号"))
command:value('ifdown wan', translate("关闭联网"))
command:value('ifup wan', translate("打开联网"))
command:value('wifi down', translate("关闭WIFI"))
command:value('wifi up', translate("打开WIFI"))
command:value('sync && echo 3 > /proc/sys/vm/drop_caches', translate("释放内存"))
command:value('poweroff', translate("关闭电源"))
command:value('logread | egrep -v "miniupnpd|uhttpd" | tail -20 > /etc/syslog.log', translate("保存日志"))
command.rmempty = false

-- m.template = "rebootschedule/run"
-- btn = s:option(Button, "_baa", translate("立即执行"))
-- btn.inputtitle = translate("执行")
-- btn.inputstyle = "apply"
-- btn.disabled = false
-- btn.template = "rebootschedule/button"

function gen_uuid(format)
    local uuid = sys.exec("echo -n $(cat /proc/sys/kernel/random/uuid)")
    if format == nil then
        uuid = string.gsub(uuid, "-", "")
    end
    return uuid
end

function s.create(e, t)
    local uuid = gen_uuid()
    t = uuid
    TypedSection.create(e, t)
end

if luci.http.formvalue("cbi.apply") then
  io.popen("sleep 3 && service timedtask restart &")
end

return m
