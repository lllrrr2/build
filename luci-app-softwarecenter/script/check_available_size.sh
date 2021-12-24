#!/bin/sh

# 加载通用函数库
. /usr/bin/softwarecenter/lib_functions.sh
p=$(mount | awk '/mnt/{print $3}')
case $1 in
1)
	i=1
	for mounted in $p; do
		for m in $(seq 6); do
			eval value$m=$(df -h | grep $mounted | awk 'NR==1{print $(eval echo '$m')}')
			eval pp$m=$(mount | grep $mounted | awk 'NR==1{print $5}')
		done
		echo "$i) $value6 [ $value1 总容量:$value2 ($pp5) 可用:$value4 已用:$value3($value5) ]<br>"
		i=$((i + 1))
	done
	;;
2)
	for mounted in $p; do
		echo $mounted
	done
	;;
3)
	if [ $(which lsscsi) ]; then
		echo "$(lsscsi | awk '/disk/{print $NF}')"
	elif [ $(which mount) ]; then
		echo "$(mount | awk '/mnt/{print $3}')"
	else
		echo "$(blkid -s PARTLABEL | cut -d: -f1)"
	fi
	;;
esac
