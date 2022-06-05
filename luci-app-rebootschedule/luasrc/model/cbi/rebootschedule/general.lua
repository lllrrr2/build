fs = require "nixio.fs"
sys = require "luci.sys"
uci = require"luci.model.uci".cursor()
util = require "luci.util"
font_color = [[<br><font color=orange>➤</font>]]
m = Map("rebootschedule", translate("定时任务 Plus+"), 
translate("<font color='green'><b>让定时任务更加易用的插件，是用 wulishui@gmail.com 的原版修改。</font></b><br>") ..
translate("CRON表达式的字符串是五个有空格分隔加执行命令字段组成：<font color=red> * * * * * [command]</font><br>") ..
translate("五个星号按照位置分别表示(分)，(时)，(日)，(月)，(周)，(commond)表示所需执行的命令。<br>") ..
translate("允许的数值范围是：分(0-59)，时(0-23)，日(1-31)，月(1-12)，周(1-7)。<br><br>") ..
translate("<font color=orange>▼</font>每一个字段都可以使用范围之内的数值或者以下半角的特殊字符组合组成：") .. font_color ..
translate("1) 星号(*)表示<code>任意值</code>。在(分)字段使用(*), 表示每分钟执行命令。") .. font_color ..
translate("2) 正斜杠(/)表示<code>每隔时段</code>。在(分)字段使用(*/20)，表示每小时中每隔20分钟执行命令。") .. font_color ..
translate("3) 逗号(,)表示<code>分割数值</code>。在(分)字段使用(5,20)，表示每小时中每到5分和20分时执行命令。") .. font_color ..
translate("4) 连字符(-)表示<code>范围</code>。在(分)字段使用(5-20)，表示从每小时中5分到20分时段每分钟执行命令。<br>") ..
translate("<font color='green'><b>设置方法可点击下面查看示例或在  crontab文件  中行尾是　#rebootschedule　的命令前5个字段去验证是否正确</b></font><br>") ..
translate("<input class='cbi-button cbi-button-apply' type='button' value='查看示例'  onclick=\"window.open('http://'+window.location.hostname+'/reboothelp.jpg')\"/>&nbsp;&nbsp;&nbsp;&nbsp;") ..
translate("<input class='cbi-button cbi-button-apply' type='button' value='查看/验证' onclick=\"window.open('https://tool.lu/crontab')\"/>"))

s = m:section(TypedSection, "crontab", "")
s.template  =  "cbi/tblsection"
s.anonymous  =  true -- 删除
s.addremove  =  true -- 添加
-- s.extedit  =  true -- 修改
-- s.sortable  =  true -- 移动

enable = s:option(Flag, "enable", translate("启用"))
enable.rmempty  =  false
enable.default = 0

minute = s:option(Value, "minute", translate("分"))
minute.default  =  '0'
minute.size  =  8

hour = s:option(Value, "hour", translate("时"))
hour.default  =  '5'
hour.size  =  8

day = s:option(Value, "day", translate("日"))
day.default  =  '*'
day.size  =  8

month = s:option(Value, "month", translate("月"))
month.default  =  '*'
month.size  =  8

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
command:value('/etc/init.d/network restart &', translate("重启网络"))
command:value('ifdown wan && ifup wan', translate("重启wan"))
command:value('killall -q pppd && sleep 5 && pppd file /tmp/ppp/options.wan', translate("重新拨号"))
command:value('ifdown wan', translate("关闭联网"))
command:value('ifup wan', translate("打开联网"))
command:value('wifi down', translate("关闭WIFI"))
command:value('wifi up', translate("打开WIFI"))
command:value('sync && echo 3 > /proc/sys/vm/drop_caches', translate("释放内存"))
command:value('poweroff', translate("关闭电源"))
command.default = 'sleep 5 && touch /etc/banner && reboot'
command.rmempty  =  false

-- p  =  s:option(Button, "_baa", translate("立即执行"))
-- p.inputtitle  =  translate("执行")
-- p.inputstyle  =  "apply"
-- p.forcewrite  =  true
-- function p.write(self, section, scope)
	-- local pp = uci:get("rebootschedule", '@crontab[1]', 'command')
	-- util.exec("sh" .. pp)
-- end

if luci.http.formvalue("cbi.apply") then
  io.popen("sleep 3 && /etc/init.d/rebootschedule restart &")
end

return m
