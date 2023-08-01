#!/bin/sh

. /lib/functions.sh



_info() {
    logger -s -t "cpulimit" "$*"
}

cpulimit_get() {
    config_get enabled $1 enabled
    [ $enabled -gt 0 ] || return 1
    config_get limit $1 limit
    config_get exename $1 exename
    /usr/bin/cpulimit -l $limit -e $exename >/dev/null &
}

case "$1" in
    "start")
        killall -9 cpulimit
        config_load cpulimit
        config_foreach cpulimit_get list
        exit 0
        ;;
    "stop")
        killall -9 cpulimit
        ;;
esac
