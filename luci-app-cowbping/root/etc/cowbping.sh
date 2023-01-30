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
	test "$log_snum" -gt 500 && echo "[ $(date "+%m月%d日 %H:%M:%S") ]: 日志文件过长，清空处理！" >$log_file
}

cycle_ping() {
	run_name=; fail=
	ping1=$(ping -c "$sum" "$address1" 2>/dev/null) || { weberror1=1; echo_log "ping $address1 出错"; }
	ping2=$(ping -c "$sum" "$address2" 2>/dev/null) || { weberror2=1; echo_log "ping $address2 出错"; }
	test "$weberror1" = 1 -a "$weberror2" = 1 && {
		fail=1
		st="网络不通 ！！！"
	} || {
		loss1=`echo $ping1 | sed -rne 's|^[^/]+received, ([^ ]+)% .+$$|\1|p'`
		loss2=`echo $ping2 | sed -rne 's|^[^/]+received, ([^ ]+)% .+$$|\1|p'`
		test "${loss1:=100}" -ge "$pkglost" -a "${loss2:=100}" -ge "$pkglost" && {
			fail=2
			st="丢包率过高：$(((loss1+loss2)/2))%"
		}
		delay1=`echo $ping1 | awk -F/ '/round-trip/{print $4}' | cut -d'.' -f1`
		delay2=`echo $ping2 | awk -F/ '/round-trip/{print $4}' | cut -d'.' -f1`
		test "${delay1:=10000}" -ge "$pkgdelay" -a "${delay2:=10000}" -ge "$pkgdelay" && {
			fail=3
			st="延迟过高：$(((delay1+delay2)/2))ms"
		}
	}
	unset -v ping1 ping2 weberror1 weberror2 delay1 delay2 loss1 loss2
	test -n "$fail" && {
		clean_log
		old_run_sum=$((old_run_sum+1))
		test "$old_run_sum" -le "$run_sum" && {
			case "$work_mode" in
				1) run_name="重新拨号";;
				2) run_name="重启WIFI";;
				3) run_name="重启网络";;
				4) run_name="自定义命令";;
				5) run_name="自动中继";;
				6) run_name="重启系统";;
				7) run_name="关机";;
			esac
			echo_log "检查到 $st 执行第 $old_run_sum 次 $run_name"
			echo "$(date "+%m月%d日 %H:%M:%S")& $st 执行第 $old_run_sum 次 $run_name" >>$run_sum_file
		}
		test "$old_run_sum" -eq "$run_sum" -a "$stop_run" -eq 1 && {
			export old_stop_run=1
			echo_log "$run_name 已经执行 $old_run_sum 次，本次执行后停止执行设定的命令。"
		}
		test "$old_run_sum" -le "$run_sum" && {
			case "$work_mode" in
			1)	ifup wan;;
			2)	wifi down
				wifi up
				;;
			3)	/etc/init.d/network restart
				;;
			4)	kill -9 $(ps | awk '/etc\/config\/cbp_cmd/{print $1}') >/dev/null 2>&1
				test -s /etc/config/cbp_cmd && sh /etc/config/cbp_cmd 2>/dev/null &
				;;
			5)	:
				;;
			6)	reboot
				;;
			7)	poweroff
				;;
			esac
		}
	}
}

old_run_sum=0; old_stop_run=0
sum=$(uci_get_name cowbping sum 3)
time=$(uci_get_name cowbping time 10)
run_sum=$(uci_get_name cowbping run_sum 3)
pkglost=$(uci_get_name cowbping pkglost 80)
stop_run=$(uci_get_name cowbping stop_run 0)
work_mode=$(uci_get_name cowbping work_mode 3)
pkgdelay=$(uci_get_name cowbping pkgdelay 300)
address1=$(uci_get_name cowbping address1 '163.com')
address2=$(uci_get_name cowbping address2 '223.5.5.5')
test -s "$run_sum_file" || :>$run_sum_file
echo_log "开始运行！系统以每 $time 分钟循环检查网络状况......"

while :; do
	test ."$old_stop_run" = .0 && {
		cycle_ping
		sleep ${time}m
	} || :
done
