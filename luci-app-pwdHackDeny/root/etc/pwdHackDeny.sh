#!/bin/bash
# wulishui 20210320 v6.0.5
# Author: wulishui <wulishui@gmail.com>
tmp_dir="/tmp/pwdHackDeny"
deny_dir="/etc/pwdHackDeny"

add_ipts() {
	target=$(echo "$line" | awk '{print $3}')
	type=$(echo "$line" | awk '{print $2}')
	case "$type" in
		MAC)
			echo "$target" >>/etc/"$1"
			iptables -w -A "$2" -m mac --mac-source "$target" -j DROP 2>/dev/null
			ip6tables -w -A "$2" -m mac --mac-source "$target" -j DROP 2>/dev/null
		;;
		IP4)
			echo "$target" >>/etc/"$1"
			iptables -w -A "$2" -s "$target" -j DROP 2>/dev/null
		;;
		IP6)
			echo "$target" >>/etc/"$1"
			ip6tables -w -A "$2" -s "$target" -j DROP 2>/dev/null
		;;
	esac
}

add_badhostsbnew() {
	#-------------------------grep target---------------------
	echo "$badhostsbnew" | while read line; do
		MAC=$(echo "$line" | egrep -o "([A-Fa-f0-9]{2}[:-]){5}[A-Fa-f0-9]{2}" | head -1) && target=$(echo "MAC "$MAC"")
		[ -z "$MAC" ] && { IP4=$(echo "$line" | grep -E -o "(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])" | head -1) && target=$(echo "IP4 "$IP4""); }
		[ -z "$MAC" -a -z "$IP4" ] && { IP6=$(echo "$line" | egrep -o "(s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)" | head -1) target=$(echo "IP6 "$IP6""); }
		havetarget=$(grep -w "$target" $deny_dir/"$3")
		if [ -n "$havetarget" ]; then
			sumtarget=$(echo ${havetarget} | awk '{print $1}')
			sed -i '/'"$target"'/d' $deny_dir/"$3"
			echo "$((sumtarget + 1)) $target " >>$deny_dir/"$3"
		else
			echo "1 $target " >> $deny_dir/"$3"
		fi
		unset -v MAC IP4 IP6 target
	done
	unset -v badhostsbnew
	#--------------------------chk sum-------------------------
	if [ -s $deny_dir/$3 ]; then
		cat $deny_dir/$3 | awk NF | while read line; do
			sumtarget=$(echo "$line" | awk '{print $1}')
			[[ "$sumtarget" -ge "$sum"  && -z "$(grep -w "$target" /etc/$1)" ]] && add_ipts $1 $2
			unset -v target sumtarget type
		done
	fi
}

chk_log() {
	#--------------------------chklogsize-----------------------
	for x in "web ssh"; do
		logsize=$(du $deny_dir/badip.log.$x 2>/dev/null | awk '{print $1}') && [ "$logsize" -gt 80 ] && {
			cat $deny_dir/badip.log.$x >> $deny_dir/bak.log.$x
			echo "--------"$(date +"%Y-%m-%d %H:%M:%S")" ：日志文件过大，旧的记录已转移到 $deny_dir/bak.log.$x 。--------" > $deny_dir/badip.log.$x 2>/dev/null
		}
	done

	#---------------------------addlogfile----------------------
	logread | egrep 'dropbear.*[Pp]assword|uhttpd.*login|luci.*login' >$tmp_dir/syslog
	[ -s $tmp_dir/syslog ] || return 0
	[ -s $tmp_dir/_syslog ] && \
	newlog=$(diff $tmp_dir/_syslog $tmp_dir/syslog | grep '^>' | sed 's/^> //g' | uniq -i | sed '/^\s*$/d')
	cp -f $tmp_dir/syslog $tmp_dir/_syslog
	[ -n "$newlog" ] || return 0
	awk '/0x2/{print $1" "$4}' /proc/net/arp | tr '[a-z]' '[A-Z]' >$tmp_dir/MAC-IP.leases
	echo "$newlog" | while read line; do
		BIP=$(echo "$line" | egrep -o "(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])" | head -1) || BIP=$(echo "$line" | egrep -o "(s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*)" | head -1)
		[ -n "$BIP" ] && BIP=$(grep -w "$BIP" $tmp_dir/MAC-IP.leases | awk '{print $2}') && { [ "$(echo "$BIP" | wc -l)" -gt 1 ] && BIP=$(echo "$BIP" | head -1) && BARP=" ，此客户端在进行ARP欺骗！"; }
		sshwrong=$(echo "$line" | grep -o "Bad password attempt")
		webwrong=$(echo "$line" | grep -o "failed login on")
		if [ -n "$sshwrong" -o -n "$webwrong" ]; then
			echo ""$line" (Login Host : "$BIP" "$BARP")  <---------异常登录！！！" >>$tmp_dir/syslog.tmp
		else
			echo ""$line" (Login Host : "$BIP" "$BARP") " >>$tmp_dir/syslog.tmp
		fi
		unset -v BIP BARP
	done
	unset newlog
	[ -s $tmp_dir/syslog.tmp ] || return 0
	grep -E 'dropbear.*[Pp]assword' $tmp_dir/syslog.tmp >>$deny_dir/badip.log.ssh
	grep -E 'uhttpd.*login|luci.*login' $tmp_dir/syslog.tmp >>$deny_dir/badip.log.web
	sum=$(uci -q get pwdHackDeny.pwdHackDeny.sum) || sum=5
	#-----------------------------addbadweblog------------------
	badhostsbnew=$(grep "failed login on" $tmp_dir/syslog.tmp) && \
	add_badhostsbnew "WEBbadip.log" "pwdHackDenyWEB" "badhosts.web"
	#----------------------------addbadsshlog------------------
	badhostsbnew=$(grep "Bad password attempt" $tmp_dir/syslog.tmp) && \
	add_badhostsbnew "SSHbadip.log" "pwdHackDenySSH" "badhosts.ssh"
	rm -f $tmp_dir/syslog.tmp 2>/dev/null
}

chk_ipts_2() {
	sleep 3
	[ $(iptables -w -L INPUT | grep -c 'pwdHackDeny') -ge 2 ] && [ $(ip6tables -w -L INPUT | grep -c 'pwdHackDeny') -ge 2 ] || /etc/init.d/pwdHackDeny restart
}

chk_ipts() {
	[ $(iptables -w -L INPUT | grep -c 'pwdHackDeny') -ge 2 ] && [ $(ip6tables -w -L INPUT | grep -c 'pwdHackDeny') -ge 2 ] || chk_ipts_2
}

time=$(uci -q get pwdHackDeny.pwdHackDeny.time) || time=5
while :; do
	chk_ipts
	chk_log
	sleep "$time"
done
