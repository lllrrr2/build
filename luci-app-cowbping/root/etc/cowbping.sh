#!/bin/sh
#Copyright (C) 20190805 wulishui <wulishui@gmail.com>

LOG_FILE=/tmp/log/cowbping.log
RUN_SUM_FILE=/etc/cowbping_run_sum
uci_get_name() {
	local ret=$(uci -q get cowbping."$1"."$2")
	echo ${ret:=$3}
}

echo_log() {
	local d="[ $(date "+%m月%d日 %H:%M:%S") ]"
	echo -e "$d: $*" >>$LOG_FILE
}

clean_log() {
	log_snum=$(cat $LOG_FILE 2>/dev/null | wc -l)
	[ "$log_snum" -gt 500 ] && echo "[ $(date "+%m月%d日 %H:%M:%S") ]: 日志文件过长，清空处理！" >$LOG_FILE
}

P_G() {
	fail=
	ping1=$(ping -c "$sum" "$address1" 2>/dev/null) || { weberror1=1; echo_log "ping $address1 出错"; }
	ping2=$(ping -c "$sum" "$address2" 2>/dev/null) || { weberror2=1; echo_log "ping $address2 出错"; }
	if [ "$weberror1" = 1 -a "$weberror2" = 1 ]; then
		fail=1
		st="网络不通 ！！！"
	else
		loss1=`echo $ping1 | sed -rne 's|^[^/]+received, ([^ ]+)% .+$$|\1|p'`
		loss2=`echo $ping2 | sed -rne 's|^[^/]+received, ([^ ]+)% .+$$|\1|p'`
		[ "${loss1:=100}" -ge "$pkglost" -a "${loss2:=100}" -ge "$pkglost" ] && { fail=2; st="丢包率过高：$(((loss1+loss2)/2))%"; }
		delay1=`echo $ping1 | awk -F/ '/round-trip/{print $4}' | cut -d'.' -f1`
		delay2=`echo $ping2 | awk -F/ '/round-trip/{print $4}' | cut -d'.' -f1`
		[ "${delay1:=10000}" -ge "$pkgdelay" -a "${delay2:=10000}" -ge "$pkgdelay" ] && { fail=2; st="延迟过高：$(((delay1+delay2)/2))ms"; }
	fi
	clean_log
	unset -v ping1 ping2 weberror1 weberror2 delay1 delay2 loss1 loss2
	xx=$(grep -c 'error' $RUN_SUM_FILE)
	[ -n "$fail" -a "$xx" -lt "$run_sum" ] && {
		case "$work_mode" in
		1)
			xf="重新拨号"
			ifup wan
			;;
		2)
			xf="重启WIFI"
			wifi down
			wifi up
			;;
		3)
			xf="重启网络"
			/etc/init.d/network restart
			;;
		4)
			xf="自定义命令< `cat /etc/config/cbp_cmd` >"
			kill -9 $(ps | awk '/etc\/config\/cbp_cmd/{print $1}') >/dev/null 2>&1
			[ -s /etc/config/cbp_cmd ] && sh /etc/config/cbp_cmd 2>/dev/null &
			;;
		5)
			xf="自动中继"
			wifi down
			wifi up
			;;
		6)
			xf="重启系统"
			;;
		7)
			xf="关机"
			;;
		esac
		echo_log "检查到 $st 执行 $xf"
		echo "error" >>$RUN_SUM_FILE
		[ "$xx" -ge "$run_sum" -a $(grep -c 'exit' $RUN_SUM_FILE) -lt 1 ] && {
			echo_log "$xf 已经执行设定的 $run_sum 次，停止执行 $xf"
			echo "exit" >>$RUN_SUM_FILE
			cat $LOG_FILE >>$RUN_SUM_FILE
		}
		[ "$work_mode" = 7 ] && poweroff
		[ "$fail" = 1 -a "$work_mode" = 6 ] && reboot
	}
}

sum=$(uci_get_name cowbping sum 3)
time=$(uci_get_name cowbping time 10)
run_sum=$(uci_get_name cowbping run_sum 3)
pkglost=$(uci_get_name cowbping pkglost 80)
work_mode=$(uci_get_name cowbping work_mode 3)
pkgdelay=$(uci_get_name cowbping pkgdelay 300)
address1=$(uci_get_name cowbping address1 'baidu.com')
address2=$(uci_get_name cowbping address2 '223.6.6.6')
[ -s "$RUN_SUM_FILE" ] || :>$RUN_SUM_FILE
echo_log "开始运行！系统以每 $time 分循环检查网络状况......"

while :; do
	P_G
	sleep ${time}m
done
