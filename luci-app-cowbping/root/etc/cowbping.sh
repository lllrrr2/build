#!/bin/sh
#Copyright (C) 20190805 wulishui <wulishui@gmail.com>

log_file=/tmp/log/cowbping.log
run_sum_file=/etc/cowbping_run_sum
uci_get_name() {
	local ret=$(uci -q get cowbping."$1"."$2")
	echo ${ret:=$3}
}

echo_log() {
	local d="[ $(date "+%m月%d日 %H:%M:%S") ]"
	echo -e "$d: $*" >>$log_file
}

clean_log() {
	log_snum=$(cat $log_file 2>/dev/null | wc -l)
	[ "$log_snum" -gt 500 ] && echo "[ $(date "+%m月%d日 %H:%M:%S") ]: 日志文件过长，清空处理！" >$log_file
}

cycle_ping() {
	fail=; xf=
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
	xx=$(grep -c 'error' $run_sum_file 2>/dev/null)
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
			xf="自定义命令"
			kill -9 $(ps | awk '/etc\/config\/cbp_cmd/{print $1}') >/dev/null 2>&1
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
		echo "error" >>$run_sum_file
	}
	exit_sum=$(grep -c '_exit_' $run_sum_file 2>/dev/null)
	[ "$((xx+1))" -ge "$run_sum" -a "$exit_sum" -lt 1 ] && {
		echo_log "$xf已经执行 $((run_sum-1)) 次，本次后停止执行。"
		echo "_exit_" >>$run_sum_file
		cat $log_file >>$run_sum_file
	}
	test "$exit_sum" -le 1 && {
		[ "$xf" = "关机" ] && poweroff
		[ "$xf" = "重启系统" ] && reboot
		[ "$xf" = "自定义命令" -a -s /etc/config/cbp_cmd ] && \
		sh /etc/config/cbp_cmd 2>/dev/null &
	}
}

sum=$(uci_get_name cowbping sum 3)
time=$(uci_get_name cowbping time 10)
run_sum=$(uci_get_name cowbping run_sum 3)
pkglost=$(uci_get_name cowbping pkglost 80)
work_mode=$(uci_get_name cowbping work_mode 3)
pkgdelay=$(uci_get_name cowbping pkgdelay 300)
address1=$(uci_get_name cowbping address1 '163.com')
address2=$(uci_get_name cowbping address2 '223.5.5.5')
[ -s "$run_sum_file" ] || :>$run_sum_file
echo_log "开始运行！系统以每 $time 分循环检查网络状况......"

while :; do
	cycle_ping
	sleep ${time}m
done
