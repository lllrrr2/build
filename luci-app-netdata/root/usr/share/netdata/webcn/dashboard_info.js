// SPDX-License-Identifier: GPL-3.0-or-later

// Codacy declarations
/* global NETDATA */

var netdataDashboard = window.netdataDashboard || {};

// Informational content for the various sections of the GUI (menus, sections, charts, etc.)

// ----------------------------------------------------------------------------
// Menus

netdataDashboard.menu = {
    'system': {
        title: '系统概述',
        icon: '<i class="fas fa-bookmark"></i>',
        info: '关键系统指标的概述。'
    },

    'services': {
        title: 'systemd 服务',
        icon: '<i class="fas fa-cogs"></i>',
        info: 'systemd服务的资源利用情况。 ' +
        'Netdata通过' +
        '<a href="https://en.wikipedia.org/wiki/Cgroups" target="_blank">cgroups</a> ' +
        '（容器使用的资源账户管理）监控所有systemd服务。'
    },

    'ap': {
        title: '接入点',
        icon: '<i class="fas fa-wifi"></i>',
        info: '在系统上找到的接入点（即AP模式下的无线接口）的性能指标.'
    },

    'tc': {
        title: '服务质量',
        icon: '<i class="fas fa-globe"></i>',
        info: 'Netdata 使用其 收集和可视化 <code>tc</code> 类利用率 ' +
            '<a href="https://github.com/netdata/netdata/blob/master/collectors/tc.plugin/tc-qos-helper.sh.in" target="_blank">tc-helper 插件</一个>。 ' +
            '如果您还使用 <a href="http://firehol.org/#fireqos" target="_blank">FireQOS</a> 来设置 QoS，' +
            'netdata 自动收集接口和类名。如果您的 QoS 配置包括开销 ' +
            '计算时，此处显示的值将包括这些开销（相同的总带宽' +
            '网络接口部分中报告的接口将低于总带宽' +
            ' 报道在这里）。 QoS数据采集与接口相比可能会有微小的时间差异'+
            '（QoS 数据收集使用 BASH 脚本，因此数据收集的变化为几毫秒' +
            '应该是合理的）。'
    },

    'net': {
        title: '网络接口',
        icon: '<i class="fas fa-sitemap"></i>',
        info: '<p>网络接口性能<a href="https://www.kernel.org/doc/html/latest/networking/statistics.html" target="_blank">网络接口指标</a>。</p >'+
        '<p>Netdata 读取 <code>/proc/net/dev</code> 文件和 <code>/sys/class/net/</code> 目录来检索此数据。</p>'
    },

    'Infiniband': {
        title: 'Infiniband端口',
        icon: '<i class="fas fa-sitemap"></i>',
        info: '<p>性能和异常统计信息</p>'
    },

    'wireless': {
        title: '无线接口',
        icon: '<i class="fas fa-wifi"></i>',
        info: '无线接口的性能指标。'
    },

    'ip': {
        title: '网络堆栈',
        icon: '<i class="fas fa-cloud"></i>',
        info: function (os) {
            if (os === "linux")
                return '系统网络堆栈的指标。这些指标是从 <code>/proc/net/netstat</code> 收集的，或者通过将 <code>kprobes</code> 附加到内核函数来收集的，适用于 IPv4 和 IPv6 流量，并与内核网络堆栈的运行相关。';
            else
                return '系统网络堆栈的指标。';
        }
    },

    'ipv4': {
        title: 'IPv4 网络',
        icon: '<i class="fas fa-cloud"></i>',
        info: '系统 IPv4 堆栈的指标。<a href="https://en.wikipedia.org/wiki/IPv4" target="_blank">IPv4（Internet Protocol version 4，互联网协议第4版）</a> 是互联网协议（IP）的第四个版本。它是互联网上基于标准的网络方法的核心协议之一。IPv4 是用于分组交换网络的一种无连接协议。它采用尽力而为的传递模式，即它不保证传递，也不保证正确排序或避免重复传递。这些方面，包括数据完整性，由上层传输协议（如传输控制协议（TCP））来处理。'
    },

    'ipv6': {
        title: 'IPv6 网络',
        icon: '<i class="fas fa-cloud"></i>',
        info: '系统 IPv6 堆栈的指标。<a href="https://en.wikipedia.org/wiki/IPv6" target="_blank">IPv6（Internet Protocol version 6，互联网协议第6版）</a> 是互联网协议（IP）的最新版本，是为网络上的计算机提供识别和定位系统以及在互联网上路由流量的通信协议。IPv6 是由互联网工程任务组（IETF）开发的，旨在解决 IPv4 地址耗尽的长期预期问题。IPv6 旨在取代 IPv4。'
    },

    'sctp': {
        title: 'SCTP 网络',
        icon: '<i class="fas fa-cloud"></i>',
        info: '<p><a href="https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol" target="_blank">流控制传输协议(SCTP)</a>是一种在传输层运行的计算机网络协议其作用类似于流行的 TCP 和 UDP 协议。 SCTP 提供了 UDP 和 TCP 的一些功能：它像 UDP 一样是面向消息的，并且像 TCP 一样通过拥塞控制确保消息的可靠、按顺序传输。它与这些协议的不同之处在于，它提供多宿主和冗余路径来提高弹性和可靠性。</p><p>Netdata 收集读取 <code>/proc/net/sctp/snmp</code> 文件的 SCTP 指标。< /p>'
    },

    'ipvs': {
        title: 'IP虚拟服务器',
        icon: '<i class="fas fa-eye"></i>',
        info: '<p><a href="http://www.linuxvirtualserver.org/software/ipvs.html" target="_blank">IPVS（IP虚拟服务器）</a>在Linux内核内部实现传输层负载平衡，即所谓的第4层交换。运行在主机上的 IPVS 充当真实服务器集群前端的负载均衡器，它可以将基于 TCP/UDP 的服务的请求定向到真实服务器，<p>Netdata 收集汇总统计信息，读取 <code>/proc /net/ip_vs_stats</code>。要显示服务及其服务器的统计信息，请运行<code>ipvsadm -Ln --stats</code>或<code>ipvsadm -Ln --rate</code>进行速率统计。有关详细信息，请参阅 <a href="https://linux.die.net/man/8/ipvsadm" target="_blank">ipvsadm(8)</a>。</p>'
    },

    'netfilter': {
        title: '防火墙(netfilter)',
        icon: '<i class="fas fa-shield-alt"></i>',
        info: 'netfilter组件的性能指标。'
    },

    'ipfw': {
        title: '防火墙(ipfw)',
        icon: '<i class="fas fa-shield-alt"></i>',
        info: 'ipfw规则的计数器和内存使用情况。'
    },

    'cpu': {
        title: 'CPUs',
        icon: '<i class="fas fa-bolt"></i>',
        info: '系统中每一个 CPU 的详细资讯。全部 CPU 的总量可以到 <a href="#menu_system">系统概观</a> 区段查看。'
    },

    'mem': {
        title: '内存',
        icon: '<i class="fas fa-microchip"></i>',
        info: '系统内存管理的详细资讯。'
    },

    'disk': {
        title: '磁盘',
        icon: '<i class="fas fa-hdd"></i>',
        info: '显示所有系统磁盘性能信息的图表。我们特别关注以与 <code>iostat -x</code> 兼容的方式呈现磁盘性能指标。netdata 默认情况下防止为单个分区和未挂载的虚拟磁盘渲染性能图表。已禁用的图表仍可以通过在 netdata 配置文件中配置相关设置来启用。'
    },

    'mount': {
        title: '挂载点',
        icon: '<i class="fas fa-hdd"></i>',
        info: ''
    },

    'mdstat': {
        title: 'MD阵列',
        icon: '<i class="fas fa-hdd"></i>',
        info: '<p>RAID设备是由两个或多个实块设备创建的虚拟设备。</p>'
    },

    'sensors': {
        title: '传感器',
        icon: '<i class="fas fa-leaf"></i>',
        info: '配置的系统传感器读数.'
    },

    'ipmi': {
        title: 'IPMI',
        icon: '<i class="fas fa-leaf"></i>',
        info: '智能平台管理接口 (IPMI) 是一组用于自主计算机子系统的计算机接口规范，该子系统提供独立于主机系统 CPU、固件（BIOS 或 UEFI）和操作系统的管理和监控功能。'
    },

    'samba': {
        title: 'Samba',
        icon: '<i class="fas fa-folder-open"></i>',
        info: '该系统的 Samba 文件共享操作的性能指标。 Samba 是 Windows 服务的实现，包括 Windows SMB 协议文件共享。'
    },

    'nfsd': {
        title: 'NFS服器器',
        icon: '<i class="fas fa-folder-open"></i>',
        info: '网络文件服务器的性能指标。 '+
        '<a href="https://en.wikipedia.org/wiki/Network_File_System" target="_blank">NFS</a> '+
        '是一种分布式文件系统协议，允许客户端计算机上的用户通过网络访问文件，'+
        '很像访问本地存储。 '+
        'NFS 与许多其他协议一样，构建在开放网络计算远程过程调用 (ONC RPC) 系统之上。'
    },

    'nfs': {
        title: 'NFS客户端',
        icon: '<i class="fas fa-folder-open"></i>',
        info: '显示本机做为 NFS 客户端的效能指标。'
    },

    'zfs': {
        title: 'ZFS文件系统',
        icon: '<i class="fas fa-folder-open"></i>',
        info: 'ZFS档案系统的效能指标。以下图表呈现来自 <a href="https://github.com/zfsonlinux/zfs/blob/master/cmd/arcstat/arcstat.py" target="_blank">arcstat.py</a> 与 <a href="https://github.com/zfsonlinux/zfs/blob/master/cmd/arc_summary/arc_summary.py" target="_blank">arc_summary.py</a> 的效能数据。'
    },

    'zfspool': {
        title: 'ZFS提供',
        icon: '<i class="fas fa-database"></i>',
        info: 'ZFS池的状态。'
    },

    'btrfs': {
        title: 'BTRFS文件系统',
        icon: '<i class="fas fa-folder-open"></i>',
        info: 'BTRFS文件系统的磁盘空间指标。'
    },

    'apps': {
        title: '应用程序',
        icon: '<i class="fas fa-heartbeat"></i>',
        info: '使用 <a href="https://learn.netdata.cloud/docs/agent/collectors/apps.plugin" target="_blank">apps.plugin</a> 收集每个应用程序的统计信息。该插件遍历所有进程并聚合 <a href="https://learn.netdata.cloud/docs/agent/collectors/apps.plugin#configuration" target="_blank">应用程序组</a> 的统计信息。该插件还计算已退出子进程的资源。因此，对于像 shell 脚本这样的进程，报告的值包括每个时间段内这些脚本运行的命令使用的资源。',
        height: 1.5
    },

    'groups': {
        title: '用户组',
        icon: '<i class="fas fa-user"></i>',
        info: '每个用户组的统计数据是使用以下方式收集的 '+
        '<a href="https://learn.netdata.cloud/docs/agent/collectors/apps.plugin" target="_blank">apps.plugin</a>. '+
        '这个插件会遍历所有流程并汇总每个用户组的统计信息。 '+
        '该插件还计算退出孩子的资源。 '+
        '因此，对于像 shell 脚本这样的进程，报告的值包括命令使用的资源'+
        '这些脚本在每个时间范围内运行。',
        height: 1.5
    },

    'users': {
        title: '用户',
        icon: '<i class="fas fa-users"></i>',
        info: '每个用户的统计信息是使用 <a href="https://learn.netdata.cloud/docs/agent/collectors/apps.plugin" target="_blank">apps.plugin</a> 收集的。该插件会遍历所有流程并汇总每个用户的统计信息。该插件还计算退出子项的资源。因此，对于像 shell 脚本这样的进程，报告的值包括这些脚本在每个时间范围内运行的命令所使用的资源。',
        height: 1.5
    },

    'netdata': {
        title: 'Netdata监视',
        icon: '<i class="fas fa-chart-bar"></i>',
        info: 'netdata本身与外挂程式的效能数据。'
    },

    'aclk_test': {
        title: 'ACLK试验发报',
        info: '用于内部执行集成测试。'
    },

    'example': {
        title: '范例图表',
        info: '范例图表，展示外挂程式的架构之用。'
    },

    'cgroup': {
        title: '',
        icon: '<i class="fas fa-th"></i>',
        info: '容器资源使用率指标。netdata 从 <b>cgroups</b> (<b>control groups</b> 的缩写) 中读取这些资讯，cgroups 是 Linux 核心的一个功能，做限制与计算程序集中的资源使用率 (CPU、内存、磁盘 I/O、网络...等等)。<b>cgroups</b> 与 <b>namespaces</b> (程序之间的隔离) 结合提供了我们所说的：<b>容器</b>。'
    },

    'cgqemu': {
        title: '',
        icon: '<i class="fas fa-th-large"></i>',
        info: 'QEMU 虚拟机资源利用率指标。 QEMU（Quick Emulator 的缩写）是一个免费的开源托管虚拟机管理程序，用于执行硬件虚拟化。'
    },

    'docker': {
        title: 'Docker',
        icon: '<i class="fas fa-cube"></i>',
        info: 'Docker 容器状态和磁盘使用情况。'
    },

    'fping': {
        title: 'fping',
        icon: '<i class="fas fa-exchange-alt"></i>',
        info: '网络延迟统计，通过 <b>fping</b>。 <b>fping</b> 是一个向网络主机发送 ICMP 回显探测的程序，类似于 <code>ping</code>，但在 ping 多个主机时性能要好得多。 fping 3.15以后版本可以直接作为netdata插件使用。'
    },

    'ping': {
        title: 'Ping',
        icon: '<i class="fas fa-exchange-alt"></i>',
        info: '通过向网络主机发送 ping 消息来测量往返时间和数据包丢失。'
    },

    'gearman': {
        title: 'Gearman',
        icon: '<i class="fas fa-tasks"></i>',
        info: 'Gearman 是一个作业服务器，允许您并行工作、负载平衡处理以及在语言之间调用函数。'
    },

    'ioping': {
        title: 'ioping',
        icon: '<i class="fas fa-exchange-alt"></i>',
        info: '磁盘延迟统计信息，通过 <b>ioping</b>。 <b>ioping</b> 是一个从磁盘读取数据探针或向磁盘写入数据探针的程序。'
    },

    'httpcheck': {
        title: 'Http Check',
        icon: '<i class="fas fa-heartbeat"></i>',
        info: '使用 HTTP 检查的 Web 服务可用性和延迟监控。该插件是端口检查插件的专门版本。'
    },

    'memcached': {
        title: '内存缓存',
        icon: '<i class="fas fa-database"></i>',
        info: '<b>memcached</b> 的性能指标。 Memcached 是一个通用的分布式内存缓存系统。它通常用于通过在 RAM 中缓存数据和对象来加速动态数据库驱动的网站，以减少必须读取外部数据源（例如数据库或 API）的次数。'
    },

    'monit': {
        title: 'monit',
        icon: '<i class="fas fa-database"></i>',
        info: '<b>monit</b> 中的检查状态。 Monit 是一个用于管理和监视 Unix 系统上的进程、程序、文件、目录和文件系统的实用程序。 Monit 进行自动维护和修复，并可以在错误情况下执行有意义的因果操作。'
    },

    'mysql': {
        title: 'MySQL',
        icon: '<i class="fas fa-database"></i>',
        info: '<b>mysql</b>（开源关系数据库管理系统 (RDBMS)）的性能指标。'
    },

    'nvme': {
        title: 'NVMe',
        icon: '<i class="fas fa-hdd"></i>',
        info: 'NVMe 设备 SMART 和运行状况指标。有关指标的更多信息，请参阅 <a href="https://nvmexpress.org/developers/nvme-specation/" target="_blank">NVM Express 基本规范</a>。'
    },

    'postgres': {
        title: 'Postgres',
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance metrics for <b>PostgreSQL</b>, the open source object-relational database management system (ORDBMS).'
    },

    'proxysql': {
        title: 'ProxySQL',
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance metrics for <b>ProxySQL</b>, a high-performance open-source MySQL proxy.'
    },

    'pgbouncer': {
        title: 'PgBouncer',
        icon: '<i class="fas fa-exchange-alt"></i>',
        info: 'Performance metrics for PgBouncer, an open source connection pooler for PostgreSQL.'
    },

    'redis': {
        title: 'Redis',
        icon: '<i class="fas fa-database"></i>',
        info: '<b>redis</b> 的性能指标。 Redis（REmote DIctionary Server）是一个实现数据结构服务器的软件项目。它是开源的、联网的、内存中的，并以可选的持久性存储密钥。'
    },

    'rethinkdbs': {
        title: 'RethinkDB',
        icon: '<i class="fas fa-database"></i>',
        info: '<b>rethinkdb</b> 的性能指标。 RethinkDB 是第一个为实时应用程序构建的开源可扩展数据库'
    },

    'retroshare': {
        title: 'RetroShare',
        icon: '<i class="fas fa-share-alt"></i>',
        info: '<b>RetroShare</b> 的性能指标。 RetroShare 是一款开源软件，用于加密文件共享、无服务器电子邮件、即时消息、在线聊天和 BBS，基于 GNU Privacy Guard (GPG) 构建的朋友间网络。'
    },

    'riakkv': {
        title: 'Riak KV',
        icon: '<i class="fas fa-database"></i>',
        info: '分布式键值存储 <b>Riak KV</b> 的指标。'
    },

    'ipfs': {
        title: 'IPFS',
        icon: '<i class="fas fa-folder-open"></i>',
        info: 'Performance metrics for the InterPlanetary File System (IPFS), a content-addressable, peer-to-peer hypermedia distribution protocol.'
    },

    'phpfpm': {
        title: 'PHP-FPM',
        icon: '<i class="fas fa-eye"></i>',
        info: 'Performance metrics for <b>PHP-FPM</b>, an alternative FastCGI implementation for PHP.'
    },

    'pihole': {
        title: 'Pi-hole',
        icon: '<i class="fas fa-ban"></i>',
        info: 'Metrics for <a href="https://pi-hole.net/" target="_blank">Pi-hole</a>, a black hole for Internet advertisements.' +
            ' The metrics returned by Pi-Hole API is all from the last 24 hours.'
    },

    'portcheck': {
        title: 'Port Check',
        icon: '<i class="fas fa-heartbeat"></i>',
        info: 'Service availability and latency monitoring using port checks.'
    },

    'postfix': {
        title: 'postfix',
        icon: '<i class="fas fa-envelope"></i>',
        info: undefined
    },

    'dovecot': {
        title: 'Dovecot',
        icon: '<i class="fas fa-envelope"></i>',
        info: undefined
    },

    'hddtemp': {
        title: 'HDD Temp',
        icon: '<i class="fas fa-thermometer-half"></i>',
        info: undefined
    },

    'nginx': {
        title: 'nginx',
        icon: '<i class="fas fa-eye"></i>',
        info: undefined
    },

    'nginxplus': {
        title: 'Nginx Plus',
        icon: '<i class="fas fa-eye"></i>',
        info: undefined
    },
    'apache': {
        title: 'Apache',
        icon: '<i class="fas fa-eye"></i>',
        info: undefined
    },

    'lighttpd': {
        title: 'Lighttpd',
        icon: '<i class="fas fa-eye"></i>',
        info: undefined
    },

    'web_log': {
        title: undefined,
        icon: '<i class="fas fa-file-alt"></i>',
        info: '从服务器日志文件中提取的信息。 <code>web_log</code> 插件增量解析服务器日志文件，以实时提供关键服务器性能指标的细分。对于 Web 服务器，可以选择使用扩展日志文件格式（对于 <code>nginx</code> 和 <code>apache</code>），为请求和响应提供计时信息和带宽。 <code>web_log</code> 插件还可以配置为提供每个 URL 模式的请求细分（检查 <a href="https://github.com/netdata/go.d.plugin/blob/master/config/go.d/web_log.conf" target="_blank"><code>/etc/netdata/go.d/web_log.conf</code></a>）。'
    },

    'squid': {
        title: 'squid',
        icon: '<i class="fas fa-exchange-alt"></i>',
        info: undefined
    },

    'nut': {
        title: 'UPS',
        icon: '<i class="fas fa-battery-half"></i>',
        info: undefined
    },

    'apcupsd': {
        title: 'UPS',
        icon: '<i class="fas fa-battery-half"></i>',
        info: undefined
    },
    'snmp': {
        title: 'SNMP',
        icon: '<i class="fas fa-random"></i>',
        info: undefined
    },

    'go_expvar': {
        title: 'Go - expvars',
        icon: '<i class="fas fa-eye"></i>',
        info: '有关 <a href="https://golang.org/pkg/expvar/" target="_blank">expvar 包</a> 公开的正在运行的 Go 应用程序的统计信息。'
    },

    'chrony': {
        title: 'Chrony',
        icon: '<i class="fas fa-clock"></i>',
        info: '系统的时钟性能和对等活动状态。'
    },

    'couchdb': {
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance metrics for <b><a href="https://couchdb.apache.org/" target="_blank">CouchDB</a></b>, the open-source, JSON document-based database with an HTTP API and multi-master replication.'
    },

    'beanstalk': {
        title: 'Beanstalkd',
        icon: '<i class="fas fa-tasks"></i>',
        info: 'Provides statistics on the <b><a href="http://kr.github.io/beanstalkd/" target="_blank">beanstalkd</a></b> server and any tubes available on that server using data pulled from beanstalkc'
    },

    'rabbitmq': {
        title: 'RabbitMQ',
        icon: '<i class="fas fa-comments"></i>',
        info: 'Performance data for the <b><a href="https://www.rabbitmq.com/" target="_blank">RabbitMQ</a></b> open-source message broker.'
    },

    'ceph': {
        title: 'Ceph',
        icon: '<i class="fas fa-database"></i>',
        info: 'Provides statistics on the <b><a href="http://ceph.com/" target="_blank">ceph</a></b> cluster server, the open-source distributed storage system.'
    },

    'ntpd': {
        title: 'ntpd',
        icon: '<i class="fas fa-clock"></i>',
        info: '提供网络时间协议守护进程 <b><a href="http://www.ntp.org/" target="_blank">ntpd</a></b> 内部变量的统计信息，可选包括配置的对等点（如果在模块配置中启用）。该模块提供的性能指标如 <b><a href="http://doc.ntp.org/current-stable/ntpq.html">ntpq</a></b>（标准 NTP 查询程序）使用NTP模式6 UDP数据包与NTP服务器通信。'
    },

    'spigotmc': {
        title: 'Spigot MC',
        icon: '<i class="fas fa-eye"></i>',
        info: 'Provides basic performance statistics for the <b><a href="https://www.spigotmc.org/" target="_blank">Spigot Minecraft</a></b> server.'
    },

    'unbound': {
        title: 'Unbound',
        icon: '<i class="fas fa-tag"></i>',
        info: undefined
    },

    'boinc': {
        title: 'BOINC',
        icon: '<i class="fas fa-microchip"></i>',
        info: 'Provides task counts for <b><a href="http://boinc.berkeley.edu/" target="_blank">BOINC</a></b> distributed computing clients.'
    },

    'w1sensor': {
        title: '1-Wire Sensors',
        icon: '<i class="fas fa-thermometer-half"></i>',
        info: 'Data derived from <a href="https://en.wikipedia.org/wiki/1-Wire" target="_blank">1-Wire</a> sensors.  Currently temperature sensors are automatically detected.'
    },

    'logind': {
        title: 'Logind',
        icon: '<i class="fas fa-user"></i>',
        info: '通过查询 <a href="https://www.freedesktop.org/software/systemd/man/org.freedesktop.login1.html" target="_blank">systemd-logind API< 来跟踪用户登录和会话/a>.'
    },

    'powersupply': {
        title: 'Power Supply',
        icon: '<i class="fas fa-battery-half"></i>',
        info: 'Statistics for the various system power supplies. Data collected from <a href="https://www.kernel.org/doc/Documentation/power/power_supply_class.txt" target="_blank">Linux power supply class</a>.'
    },

    'xenstat': {
        title: 'Xen Node',
        icon: '<i class="fas fa-server"></i>',
        info: 'General statistics for the Xen node. Data collected using <b>xenstat</b> library</a>.'
    },

    'xendomain': {
        title: '',
        icon: '<i class="fas fa-th-large"></i>',
        info: 'Xen domain resource utilization metrics. Netdata reads this information using <b>xenstat</b> library which gives access to the resource usage information (CPU, memory, disk I/O, network) for a virtual machine.'
    },

    'wmi': {
        title: 'wmi',
        icon: '<i class="fas fa-server"></i>',
        info: undefined
    },

    'perf': {
        title: 'Perf Counters',
        icon: '<i class="fas fa-tachometer-alt"></i>',
        info: 'Performance Monitoring Counters (PMC). Data collected using <b>perf_event_open()</b> system call which utilises Hardware Performance Monitoring Units (PMU).'
    },

    'vsphere': {
        title: 'vSphere',
        icon: '<i class="fas fa-server"></i>',
        info: 'Performance statistics for ESXI hosts and virtual machines. Data collected from <a href="https://www.vmware.com/products/vcenter-server.html" target="_blank">VMware vCenter Server</a> using <code><a href="https://github.com/vmware/govmomi"> govmomi</a></code>  library.'
    },

    'vcsa': {
        title: 'VCSA',
        icon: '<i class="fas fa-server"></i>',
        info: 'vCenter Server Appliance health statistics. Data collected from <a href="https://vmware.github.io/vsphere-automation-sdk-rest/vsphere/index.html#SVC_com.vmware.appliance.health" target="_blank">Health API</a>.'
    },

    'zookeeper': {
        title: 'Zookeeper',
        icon: '<i class="fas fa-database"></i>',
        info: 'Provides health statistics for <b><a href="https://zookeeper.apache.org/" target="_blank">Zookeeper</a></b> server. Data collected through the command port using <code><a href="https://zookeeper.apache.org/doc/r3.5.5/zookeeperAdmin.html#sc_zkCommands">mntr</a></code> command.'
    },

    'hdfs': {
        title: 'HDFS',
        icon: '<i class="fas fa-folder-open"></i>',
        info: 'Provides <b><a href="https://hadoop.apache.org/docs/r3.2.0/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html" target="_blank">Hadoop Distributed File System</a></b> performance statistics. Module collects metrics over <code>Java Management Extensions</code> through the web interface of an <code>HDFS</code> daemon.'
    },

    'am2320': {
        title: 'AM2320 Sensor',
        icon: '<i class="fas fa-thermometer-half"></i>',
        info: 'Readings from the external AM2320 Sensor.'
    },

    'scaleio': {
        title: 'ScaleIO',
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance and health statistics for various ScaleIO components. Data collected via VxFlex OS Gateway REST API.'
    },

    'squidlog': {
        title: 'Squid log',
        icon: '<i class="fas fa-file-alt"></i>',
        info: undefined
    },

    'cockroachdb': {
        title: 'CockroachDB',
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance and health statistics for various <code>CockroachDB</code> components.'
    },

    'ebpf': {
        title: 'eBPF',
        icon: '<i class="fas fa-heartbeat"></i>',
        info: 'Monitor system calls, internal functions, bytes read, bytes written and errors using <code>eBPF</code>.'
    },

    'filesystem': {
        title: 'Filesystem',
        icon: '<i class="fas fa-hdd"></i>',
        info: 'Number of filesystem events for <a href="#menu_filesystem_submenu_vfs">Virtual File System</a>, <a href="#menu_filesystem_submenu_file_access">File Access</a>, <a href="#menu_filesystem_submenu_directory_cache__eBPF_">Directory cache</a>, and file system latency (<a href="#menu_filesystem_submenu_btrfs_latency">BTRFS</a>, <a href="#menu_filesystem_submenu_ext4_latency">EXT4</a>, <a href="#menu_filesystem_submenu_nfs_latency">NFS</a>, <a href="#menu_filesystem_submenu_xfs_latency">XFS</a>, and <a href="#menu_filesystem_submenu_xfs_latency">ZFS</a>) when your disk has the file system. Filesystem charts have relationship with <a href="#menu_system_submenu_swap">SWAP</a>, <a href="#menu_disk">Disk</a>, <a href="#menu_mem_submenu_synchronization__eBPF_">Sync</a>, and <a href="#menu_mount">Mount Points</a>.'
    },

    'vernemq': {
        title: 'VerneMQ',
        icon: '<i class="fas fa-comments"></i>',
        info: 'Performance data for the <b><a href="https://vernemq.com/" target="_blank">VerneMQ</a></b> open-source MQTT broker.'
    },

    'pulsar': {
        title: 'Pulsar',
        icon: '<i class="fas fa-comments"></i>',
        info: 'Summary, namespaces and topics performance data for the <b><a href="http://pulsar.apache.org/" target="_blank">Apache Pulsar</a></b> pub-sub messaging system.'
    },

    'anomalies': {
        title: 'Anomalies',
        icon: '<i class="fas fa-flask"></i>',
        info: 'Anomaly scores relating to key system metrics. A high anomaly probability indicates strange behaviour and may trigger an anomaly prediction from the trained models. Read the <a href="https://github.com/netdata/netdata/tree/master/collectors/python.d.plugin/anomalies" target="_blank">anomalies collector docs</a> for more details.'
    },

    'alarms': {
        title: 'Alarms',
        icon: '<i class="fas fa-bell"></i>',
        info: 'Charts showing alarm status over time. More details <a href="https://github.com/netdata/netdata/blob/master/collectors/python.d.plugin/alarms/README.md" target="_blank">here</a>.'
    },

    'statsd': { 
        title: 'StatsD',
        icon: '<i class="fas fa-chart-line"></i>',
        info:'StatsD is an industry-standard technology stack for monitoring applications and instrumenting any piece of software to deliver custom metrics. Netdata allows the user to organize the metrics in different charts and visualize any application metric easily. Read more on <a href="https://learn.netdata.cloud/docs/agent/collectors/statsd.plugin" target="_blank">Netdata Learn</a>.'
    },

    'supervisord': {
        title: 'Supervisord',
        icon: '<i class="fas fa-tasks"></i>',
        info: 'Detailed statistics for each group of processes controlled by <b><a href="http://supervisord.org/" target="_blank">Supervisor</a></b>. ' +
        'Netdata collects these metrics using <a href="http://supervisord.org/api.html#supervisor.rpcinterface.SupervisorNamespaceRPCInterface.getAllProcessInfo" target="_blank"><code>getAllProcessInfo</code></a> method.'
    },

    'systemdunits': {
        title: 'systemd单位',
        icon: '<i class="fas fa-cogs"></i>',
        info: '<b>systemd</b>提供了11种不同类型的"units"之间的依赖系统。' +
            'Units封装了各种与系统启动和维护相关的对象。' +
            'Units可以是<code>active</code>（表示已启动、已绑定、已插入，具体取决于单位类型），' +
            '或者<code>inactive</code>（表示已停止、未绑定、未插入），' +
            '还可以处于被激活或停用的过程中，即处于两种状态之间（这些状态称为<code>activating</code>、<code>deactivating</code>）。' +
            '还有一个特殊的<code>failed</code>状态，与<code>inactive</code>非常相似，在服务以某种方式失败时进入该状态（进程在退出时返回错误代码，或者崩溃，操作超时，或者重新启动次数过多）。' +
            '详情请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.html" target="_blank"> systemd(1)</a>。'
    },
    
    'changefinder': {
        title: 'ChangeFinder',
        icon: '<i class="fas fa-flask"></i>',
        info: 'Online changepoint detection using machine learning. More details <a href="https://github.com/netdata/netdata/blob/master/collectors/python.d.plugin/changefinder/README.md" target="_blank">here</a>.'
    },

    'zscores': {
        title: 'Z-Scores',
        icon: '<i class="fas fa-exclamation"></i>',
        info: 'Z scores scores relating to key system metrics.'
    },

    'anomaly_detection': {
        title: '异常检测',
        icon: '<i class="fas fa-brain"></i>',
        info: '与异常检测、增加的<code>异常</code>维度或高于平常的<code>anomaly_rate</code>相关的图表可能是某些异常行为的迹象。请阅读我们的<a href="https://learn.netdata.cloud/guides/monitor/anomaly-detection" target="_blank">异常检测指南</a>了解更多详细信息。'
    },

    'fail2ban': {
        title: 'Fail2ban',
        icon: '<i class="fas fa-shield-alt"></i>',
        info: 'Netdata keeps track of the current jail status by reading the Fail2ban log file.'
    },
    'wireguard': {
        title: 'WireGuard',
        icon: '<i class="fas fa-dragon"></i>',
        info: 'VPN network interfaces and peers traffic.'
    },
    'pandas': {
        icon: '<i class="fas fa-teddy-bear"></i>'
    },
    'cassandra': {
        title: 'Cassandra',
        icon: '<i class="fas fa-database"></i>',
        info: 'Performance metrics for Cassandra, the open source distributed NoSQL database management system'
    }
};


// ----------------------------------------------------------------------------
// submenus

// information to be shown, just below each submenu

// information about the submenus
netdataDashboard.submenu = {
    'web_log.squid_bandwidth': {
        title: '频宽',
        info: 'squid响应（<code>发送</code>）的带宽。该图表可能会出现异常峰值，因为带宽是在服务器保存日志行时计算的，即使提供服务所需的时间跨越较长的持续时间。我们建议使用 QoS（例如 <a href="http://firehol.org/#fireqos" target="_blank">FireQOS</a>）来准确计算服务器带宽。'
    },

    'web_log.squid_responses': {
        title: '回应',
        info: '与squid发送的响应相关的信息。'
    },

    'web_log.squid_requests': {
        title: '请求',
        info: '与squid 已收到的请求相关的信息。'
    },

    'web_log.squid_hierarchy': {
        title: '等级制度',
        info: '用于服务请求的squid层次结构的性能指标。'
    },

    'web_log.squid_squid_transport': {
        title: '运输'
    },

    'web_log.squid_squid_cache': {
        title: '缓存',
        info: 'squid缓存性能的性能指标.'
    },

    'web_log.squid_timings': {
        title: 'timings',
        info: 'squid请求的持续时间。可能会报告不切实际的峰值，因为squid会在请求完成时记录请求的总时间。特别是对于 HTTPS，客户端从代理获取隧道并直接与上游服务器交换请求，因此squid无法评估单个请求并报告隧道打开的总时间。'
    },

    'web_log.squid_clients': {
        title: 'clients'
    },

    'web_log.bandwidth': {
        info: '请求（<code>接收</code>）和响应（<code>发送</code>）的带宽。 <code>received</code> 需要扩展日志格式（没有它，Web 服务器日志就没有此信息）。该图表可能会出现异常峰值，因为带宽是在 Web 服务器保存日志行时计算的，即使提供服务所需的时间跨越较长的持续时间。我们建议使用 QoS（例如 <a href="http://firehol.org/#fireqos" target="_blank">FireQOS</a>）来准确计算 Web 服务器带宽。'
    },

    'web_log.urls': {
        info: '<a href="https://github.com/netdata/netdata/blob/master/collectors/python.d.plugin/web_log/web_log.conf 中定义的每个 <code>URL 模式</code> 的请求数“ target="_blank"><code>/etc/netdata/python.d/web_log.conf</code></a>。此图表统计与定义的 URL 模式匹配的所有请求，与 Web 服务器响应代码无关（即成功和不成功）。'
    },

    'web_log.clients': {
        info: '显示访问 Web 服务器的唯一客户端 IP 数量的图表。'
    },

    'web_log.timings': {
        info: 'Web 服务器响应时间 - Web 服务器准备和响应请求所需的时间。这需要扩展的日志格式，其含义是特定于 Web 服务器的。对于大多数 Web 服务器来说，这计算了从接收完整请求到发送响应的最后一个字节的时间。因此，它包括响应的网络延迟，但不包括请求的网络延迟。'
    },

    'mem.ksm': {
        title: 'deduper (ksm)',
        info: 'Kernel Same-page Merging (KSM) 效能监视，经由读取 <code>/sys/kernel/mm/ksm/</code> 下的档案而来。KSM 是在 Linux 核心 (自 2.6.32 版起) 内含的一种节省内存使用率重复资料删除功能。)。 KSM 服务程序 ksmd 会定期扫描内存区域，寻找正有资料要更新进来且相同资料存在的分页。KSM 最初是从 KVM 专案开发中而来，利用这种共用相同资料的机制，即可以让更多的虚拟机器放到内存中。另外，对许多会产生同样内容的应用程序来说，这个功能是相当有效益的。'
    },

    'mem.hugepages': {
        info: 'Hugepages 是一项允许内核利用现代硬件架构的多页面大小功能的功能。内核创建多页虚拟内存，从物理 RAM 和交换映射。 CPU架构中有一种称为“转换后备缓冲区”（TLB）的机制来管理虚拟内存页到实际物理内存地址的映射。 TLB 是有限的硬件资源，因此使用默认页面大小的大量物理内存会消耗 TLB 并增加处理开销。通过利用大页面，内核能够创建更大尺寸的页面，每个页面消耗 TLB 中的单个资源。大页面固定在物理 RAM 上，无法交换/换出。'
    },

    'mem.numa': {
        info: 'Non-Uniform Memory Access (NUMA) 是一种内存存取分隔设计，在 NUMA 之下，一个处理器存取自己管理的的内存，将比非自己管理的内存 (另一个处理器所管理的内存或是共用内存) 具有更快速的效能。在 <a href="https://www.kernel.org/doc/Documentation/numastat.txt" target="_blank">Linux 核心文件</a> 中有详细说明这些指标。'
    },

    'mem.ecc': {
        info: '<p><a href="https://en.wikipedia.org/wiki/ECC_memory" target="_blank">ECC 内存</a> ' +
        '是一种计算机数据存储，它使用纠错码 (ECC) 来检测 ' +
        '并纠正内存中发生的 n 位数据损坏。 ' +
        '通常，ECC 内存会维护一个不受单位错误影响的内存系统：' +
        '从每个字读取的数据始终与写入其中的数据相同，' +
        '即使实际存储的一位已被翻转到错误的状态。</p>' +
        '<p>内存错误可以分为两种类型：' +
        '<b>软错误</b>，它会随机损坏位，但不会留下物理损坏。 ' +
        '软错误本质上是暂时性的并且不可重复，可能是由于电气或' +
        '磁干扰。 ' +
        '<b>硬错误</b>，它以可重复的方式损坏位，因为 ' +
        '物理/ 硬件缺陷或环境问题。'
    },

    'mem.pagetype': {
        info: '可用内存的统计信息 '+
        '<a href="https://en.wikipedia.org/wiki/Buddy_memory_allocation" target="_blank">内存伙伴分配器</a>. '+
        'The buddy allocator is the system memory allocator. '+
        'The whole memory space is split in physical pages, which are grouped by '+
        'NUMA node, zone, '+
        '<a href="https://lwn.net/Articles/224254/" target="_blank">migrate type</a>, and size of the block. '+
        'By keeping pages grouped based on their ability to move, '+
        'the kernel can reclaim pages within a page block to satisfy a high-order allocation. '+
        'When the kernel or an application requests some memory, the buddy allocator provides a page that matches closest the request.'
    },

    'ip.ecn': {
        info: '<a href="https://en.wikipedia.org/wiki/Explicit_Congestion_Notification" target="_blank">显式拥塞通知 (ECN)</a> 是 IP 和 TCP 的扩展，允许终端-网络拥塞的端到端通知而不丢失数据包。 ECN 是一项可选功能，当底层网络基础设施也支持时，可以在两个启用 ECN 的端点之间使用。'
    },

    'ip.multicast': {
        info: '<a href="https://en.wikipedia.org/wiki/Multicast" target="_blank">IP 多播</a>是一种用于 ' +
        '通过 IP 网络进行一对多通信。 ' +
        '多播通过要求源仅发送一次数据包来有效地使用网络基础设施，'+
        '即使需要交付给大量接收者。 ' +
        '网络中的节点仅在必要时才负责复制数据包以到达多个接收者。'
    },
    'ip.broadcast': {
        info: '在计算机网络中，'+
        '<a href="https://en.wikipedia.org/wiki/Broadcasting_(networking)" target="_blank">broadcasting</a>指的是发送一个数据包，将被网络中的每个设备接收到。'+
        '在实践中，broadcasting的范围被限制在一个broadcasting域内。'
    },

    'netfilter.conntrack': {
        title: '连接跟踪器',
        info: 'Netfilter connection tracker 效能指标。Connection tracker 会追踪这台主机上所有的连接，包括流入与流出。工作原理是将所有开启的连接都储存到资料库，以追踪网络、位址转换与连接目标。'
    },

    'netfilter.nfacct': {
        title: '带宽计费',
        info: '使用<code>nfacct.plugin</code>读取以下信息。'
    },

    'netfilter.synproxy': {
        title: 'DDoS防护',
        info: 'DDoS 保护性能指标。 <a href="https://github.com/firehol/firehol/wiki/Working-with-SYNPROXY" target="_blank">SYNPROXY</a> 是 TCP SYN 数据包代理。它用于保护任何 TCP 服务器（如 Web 服务器）免受 SYN 洪水和类似的 DDoS 攻击。 SYNPROXY 拦截新的 TCP 连接，并使用 syncookies 而不是 conntrack 来处理初始 3 次握手来建立连接。它经过优化，可以利用所有可用的 CPU 每秒处理数百万个数据包，而无需连接之间的任何并发锁定。它可以用于任何类型的 TCP 流量（甚至是加密的），因为它不会干扰内容本身。'
    },

    'ipfw.dynamic_rules': {
        title: '动态规则',
        info: '由相应的有状态防火墙规则创建的动态规则数。'
    },

    'system.softnet_stat': {
        title: 'softnet',
        info: function (os) {
            if (os === 'linux')
                return '<p>与网络接收工作相关的CPU软件的统计信息. '+
                '每个 CPU 核心的细分可以在 <a href="#menu_cpu_submenu_softnet_stat">CPU/softnet 统计信息</a> 中找到。 '+
                '有关识别和排除网络驱动程序相关问题的更多信息，请访问 '+
                '<a href="https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf" target="_blank">红帽企业 Linux 网络性能调优指南</a>。</p >'+
                '<p><b>已处理</b> - 数据包已处理。 '+
                '<b>已丢弃</b> - 由于网络设备积压已满而丢弃数据包。 '+
                '<b>Squeezed</b> - 消耗网络设备预算或达到时间限制的次数，'+
                '但还有更多的工作要做。 '+
                '<b>ReceivedRPS</b> - 该 CPU 被唤醒以通过处理器间中断处理数据包的次数。 '+
                '<b>FlowLimitCount</b> - 达到流量限制的次数（流量限制是可选的 '+
                '接收数据包引导功能）。</p>';
            else
                return '与网络接收工作相关的 CPU SoftIRQ 统计信息。';
        }
    },

    'system.clock synchronization': {
        info: '<a href="https://en.wikipedia.org/wiki/Network_Time_Protocol" target="_blank">NTP</a> '+
        '允许您自动将系统时间与远程服务器同步. '+
        '通过与已知具有准确时间的服务器同步，可以保持计算机时间的准确性。'
    },

    'cpu.softnet_stat': {
        title: 'softnet',
        info: function (os) {
            if (os === 'linux')
                return '<p>与网络接收工作相关的CPU软件的统计信息. '+
                '所有 CPU 核心的总数可以在<a href="#menu_system_submenu_softnet_stat">系统/软网络统计信息</a>中找到。 '+
                '有关识别和排除网络驱动程序相关问题的更多信息，请访问 '+
                '<a href="https://access.redhat.com/sites/default/files/attachments/20150325_network_performance_tuning.pdf" target="_blank">红帽企业 Linux 网络性能调优指南</a>。</p >'+
                '<p><b>已处理</b> - 数据包已处理。 '+
                '<b>已丢弃</b> - 由于网络设备积压已满而丢弃数据包。 '+
                '<b>Squeezed</b> - 消耗网络设备预算或达到时间限制的次数，'+
                '但还有更多的工作要做。 '+
                '<b>ReceivedRPS</b> - 该 CPU 被唤醒以通过处理器间中断处理数据包的次数。 '+
                '<b>FlowLimitCount</b> - 达到流量限制的次数（流量限制是可选的 '+
                '接收数据包引导功能）。</p>';
            else
                return '与网络接收工作相关的每个 CPU 核心 SoftIRQ 的统计信息。所有 CPU 内核的总计可以在<a href="#menu_system_submenu_softnet_stat">系统/软网络统计信息</a>中找到。';
        }
    },

    'go_expvar.memstats': {
        title: '内存统计信息',
        info: 'Go运行时内存统计。有关每个图表和值的更多信息，请参阅 <a href="https://golang.org/pkg/runtime/#MemStats" target="_blank">runtime.MemStats</a> 文档。'
    },

    'couchdb.dbactivity': {
        title: 'db活动',
        info: '整个数据库读取和写入整个服务器。这包括任何外部 HTTP 流量，以及在集群中执行的内部复制流量，以确保节点一致性。'
    },

    'couchdb.httptraffic': {
        title: 'http流量细分',
        info: '所有 HTTP 流量，按请求类型（<tt>GET</tt>、<tt>PUT</tt>、<tt>POST</tt> 等）和响应状态代码（<tt> 200</tt>、<tt>201</tt>、<tt>4xx</tt> 等）<br/><br/>此处任何 <tt>5xx</tt> 错误都表明可能存在 CouchDB漏洞;检查日志文件以获取更多信息。'
    },

    'couchdb.ops': {
        title: '服务器操作'
    },

    'couchdb.perdbstats': {
        title: '每db统计信息',
        info: '每个数据库的统计数据。这包括<a href="http://docs.couchdb.org/en/latest/api/database/common.html#get--db" target="_blank">每个数据库 3 个大小的图表</a>：活动（数据库中实时数据的大小）、外部（数据库内容的未压缩大小）和文件（磁盘上文件的大小，不包括任何视图和索引）。它还包括每个数据库的文档数量和已删除文档的数量。'
    },

    'couchdb.erlang': {
        title: 'erlang统计信息',
        info: '有关托管 CouchDB 的 Erlang VM 状态的详细信息。这些仅供高级用户使用。峰值消息队列的高值（>10e6）通常表明存在过载情况。'
    },

    'ntpd.system': {
        title: '系统',
        info: '系统变量的统计信息，如读取列表广告牌 <code>ntpq -c rl</code> 所示。系统变量分配的关联 ID 为零，并且还可以显示在 readvar billboard <code>ntpq -c "rv 0"</code> 中。这些变量用于<a href="http://doc.ntp.org/current-stable/discipline.html" target="_blank">时钟规则算法</a>，计算最低和最稳定的时钟规则抵消。'
    },

    'ntpd.peers': {
        title: '同行',
        info: '在 <code>/etc/ntp.conf</code> 中配置的每个对等点的对等变量统计信息，如 readvar billboard <code>ntpq -c "rv <association>"</code> 所示，而每个对等点被分配一个非零关联 ID，如 ntpq -c "apeers" </code> 所示。该模块定期扫描新的/更改的对等点（默认值：每 60 秒）。 <b>ntpd</b> 从可用对等点中选择最佳的对等点来同步时钟。至少需要 3 个对等点才能正确识别最佳的对等点。'
    },

    'mem.page_cache': {
        title: '页面缓存(eBPF)',
        info: '监视对用于操作 <a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">Linux 页面缓存</a>的函数的调用。当<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>与应用集成时，Netdata 还会显示页面缓存操作每个<a href="#menu_apps_submenu_page_cache">应用程序</a>。'
    },

    'apps.page_cache': {
        title: '页面缓存 (eBPF)',
        info: 'Netdata 还在<a href="#menu_mem_submenu_page_cache">内存子菜单</a>中提供了这些图表的摘要。'
    },

    'filesystem.vfs': {
        title: 'vfs (eBPF)',
        info: 'Monitor calls to functions used to manipulate <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">File Systems</a>. When integration with apps is <a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">enabled</a>, Netdata also shows Virtual File System per <a href="#menu_apps_submenu_vfs">application</a>.'
    },

    'apps.vfs': {
        title: 'vfs (eBPF)',
        info: 'Netdata also gives a summary for these charts in <a href="#menu_filesystem_submenu_vfs">Filesystem submenu</a>.'
    },

    'filesystem.ext4_latency': {
        title: 'ext4延迟 (eBPF)',
        info: 'Latency is the time it takes for an event to be completed. We calculate the difference between the calling and return times, this spans disk I/O, file system operations (lock, I/O), run queue latency and all events related to the monitored action. Based on the eBPF <a href="http://www.brendangregg.com/blog/2016-10-06/linux-bcc-ext4dist-ext4slower.html" target="_blank">ext4dist</a> from BCC tools.'
    },

    'filesystem.xfs_latency': {
        title: 'xfs延迟 (eBPF)',
        info: '延迟是完成事件所需的时间。我们计算调用时间和返回时间之间的差异，这涵盖磁盘 I/O、文件系统操作（锁定、I/O）、运行队列延迟以及与受监控操作相关的所有事件。基于 BCC 工具中的 eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/xfsdist_example.txt" target="_blank">xfsdist</a>.'
    },

    'filesystem.nfs_latency': {
        title: 'nfs延迟 (eBPF)',
        info: '延迟是完成事件所需的时间。我们计算调用时间和返回时间之间的差异，这涵盖磁盘 I/O、文件系统操作（锁定、I/O）、运行队列延迟以及与受监控操作相关的所有事件。基于 BCC 工具中的 eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/nfsdist_example.txt" target="_blank">nfsdist</a>。'
    },

    'filesystem.zfs_latency': {
        title: 'zfs延迟 (eBPF)',
        info: '延迟是完成事件所需的时间。我们计算调用时间和返回时间之间的差异，这涵盖磁盘 I/O、文件系统操作（锁定、I/O）、运行队列延迟以及与受监控操作相关的所有事件。基于 BCC 工具中的 eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/zfsdist_example.txt" target="_blank">zfsdist</a>。'
    },

    'filesystem.btrfs_latency': {
        title: 'btrfs延迟 (eBPF)',
        info: '延迟是完成事件所需的时间。我们计算调用时间和返回时间之间的差值，得到最终结果的对数，并将一个值与相应的 bin 相加。基于 BCC 工具中的 eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/btrfsdist_example.txt" target="_blank">btrfsdist</a>。'
    },

    'filesystem.file_access': {
        title: '文件访问权限 (eBPF)',
        info: '当<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>与应用集成时，Netdata 还会显示每个文件的文件访问权限<a href="#menu_apps_submenu_file_access">应用程序</a>。'
    },

    'apps.file_access': {
        title: '文件访问权限 (eBPF)',
        info: 'Netdata also gives a summary for this chart on <a href="#menu_filesystem_submenu_file_access">Filesystem submenu</a> (more details on <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file" target="_blank">eBPF plugin file chart section</a>).'
    },

    'ip.kernel': {
        title: '内核函数 (eBPF)',
    },

    'apps.net': {
        title: '网络',
        info: 'Netdata 还在<a href="#menu_ip_submenu_kernel">网络堆栈子菜单</a>中提供了 eBPF 图表的摘要。'
    },

    'system.ipc semaphores': {
        info: 'System V信号量是一种进程间通信（IPC）机制. '+
        '它允许进程或进程内的线程同步它们的操作。 '+
        '它们通常用于监视和控制系统资源的可用性，例如共享内存段。 ' +
        '有关详细信息，请参阅 <a href="https://man7.org/linux/man-pages/man7/svipc.7.html" target="_blank">svipc(7)</a>。 ' +
        '要查看主机IPC信号量信息，请运行<code>ipcs -us</code>。对于限制，请运行 <code>ipcs -ls</code>。'
    },

    'system.ipc shared memory': {
        info: 'System V共享内存是一种进程间通信（IPC）机制. '+
        '它允许进程通过共享内存区域来传递信息。 '+
        '这是可用的最快的进程间通信形式，因为当数据在进程之间传递时不会发生内核参与（不复制）。 '+
        '通常，进程必须同步对共享内存对象的访问，例如使用 POSIX 信号量。 '+
        '有关详细信息，请参阅 <a href="https://man7.org/linux/man-pages/man7/svipc.7.html" target="_blank">svipc(7)</a>。 '+
        '要查看主机IPC共享内存信息，请运行<code>ipcs -um</code>。对于限制，请运行 <code>ipcs -lm</code>。'
    },

    'system.ipc message queues': {
        info: 'System V消息队列是一种进程间通信（IPC）机制. '+
        '它允许进程以消息的形式交换数据。 '+
        '有关详细信息，请参阅 <a href="https://man7.org/linux/man-pages/man7/svipc.7.html" target="_blank">svipc(7)</a>。 ' +
        '要查看主机 IPC 消息信息，请运行 <code>ipcs -uq</code>。对于限制，请运行 <code>ipcs -lq</code>。'
    },

    'system.interrupts': {
        info: '<a href="https://en.wikipedia.org/wiki/Interrupt" target="_blank"><b>中断</b></a> 是外部设备（通常是 I/O 设备）或程序（运行中的进程）发送给 CPU 的信号。它们告诉 CPU 停止当前的活动并执行操作系统的适当部分。中断类型有 <b>hardware</b>（由硬件设备生成，用于向操作系统发出需要关注的信号）、<b>software</b>（由程序生成，当它们想要请求操作系统执行系统调用时）、以及 <b>traps</b>（由 CPU 本身生成，以指示发生了某些错误或条件，需要操作系统提供帮助）。'
    },

    'system.softirqs': {
        info: '软件中断（“softirq”）是内核中最古老的延迟执行机制之一. '+
        '内核执行的任务中有几个并不重要：'+
        '如果有必要，它们可以被推迟很长一段时间。 '+
        '可延迟任务可以在启用所有中断的情况下执行'+
        '（软中断是在硬件中断之后形成的）。 '+
        '将它们从中断处理程序中取出有助于缩短内核响应时间。'
    },

    'cpu.softirqs': {
        info: '每个CPU的软件中断总数. '+
        '要查看系统的总数，请检查 <a href="#menu_system_submenu_softirqs">软中断</a> 部分。'
    },

    'cpu.interrupts': {
        info: '每个CPU的中断总数. '+
        '要查看系统的总数，请检查<a href="#menu_system_submenu_interrupts">中断</a>部分。 '+
        '<code>/proc/interrupts</code> 中的最后一列提供了中断描述或为该中断注册处理程序的设备名称。'
    },

    'cpu.throttling': {
        info: ' CPU调节通常用于自动降低计算机速度'+
        '尽可能使用更少的能源并节省电池。'
    },

    'cpu.cpuidle': {
        info: '<a href="https://en.wikipedia.org/wiki/Advanced_Configuration_and_Power_Interface#Processor_states" target="_blank">空闲状态（C 状态）</a> '+
        '用于在处理器空闲时节省电量。'
    },

    'services.net': {
        title: '网络 (eBPF)',
    },

    'services.page_cache': {
        title: 'Pache缓存 (eBPF)',
    },
    'netdata.ebpf': {
        title: 'eBPF.plugin',
        info: 'eBPF (extended Berkeley Packet Filter) is used to collect metrics from inside Linux kernel giving a zoom inside your <a href="#ebpf_system_process_thread">Process</a>, '+
              '<a href="#menu_disk">Hard Disk</a>, <a href="#menu_filesystem">File systems</a> (<a href="#menu_filesystem_submenu_file_access">File Access</a>, and ' +
              '<a href="#menu_filesystem_submenu_directory_cache__eBPF_">Directory Cache</a>), Memory (<a href="#ebpf_global_swap">Swap I/O</a>, <a href="#menu_mem_submenu_page_cache">Page Cache</a>), ' +
              'IRQ (<a href="#ebpf_global_hard_irq">Hard IRQ</a> and <a href="#ebpf_global_soft_irq">Soft IRQ</a> ), <a href="#ebpf_global_shm">Shared Memory</a>, ' +
              'Syscalls (<a href="#menu_mem_submenu_synchronization__eBPF_">Sync</a>, <a href="#menu_mount_submenu_mount__eBPF_">Mount</a>), and <a href="#menu_ip_submenu_kernel">Network</a>.'
    },

    'postgres.connections': {
        info: '连接是客户端和 PostgreSQL 服务器之间已建立的通信线路。每个连接都会增加 PostgreSQL 服务器上的负载。为了防止内存不足或数据库过载，<i>max_connections</i> 参数（默认 = 100）定义了数据库服务器的最大并发连接数。单独的参数 <i>superuser_reserved_connections</i>（默认值 = 3）定义超级用户连接的配额（以便即使所有其他连接槽都被阻止，超级用户也可以进行连接）。'
    },
};

// ----------------------------------------------------------------------------
// chart

// information works on the context of a chart
// Its purpose is to set:
//
// info: the text above the charts
// heads: the representation of the chart at the top the subsection (second level menu)
// mainheads: the representation of the chart at the top of the section (first level menu)
// colors: the dimension colors of the chart (the default colors are appended)
// height: the ratio of the chart height relative to the default
//

var cgroupCPULimitIsSet = 0;
var cgroupMemLimitIsSet = 0;

const netBytesInfo = '网络接口传输的流量量。';
const netPacketsInfo = '网络接口传输的数据包数量。' +
    '接收到的<a href="https://en.wikipedia.org/wiki/Multicast" target="_blank">组播</a>计数通常在设备级别计算（与<b>接收</b>不同），因此可能包括未到达主机的数据包。';
const netErrorsInfo = '<p>网络接口遇到的错误数量。</p>' +
    '<p><b>入站</b> - 在此接口上收到的错误数据包。' +
    '包括由于无效长度、CRC、帧对齐和其他错误而丢弃的数据包。' +
    '<b>出站</b> - 传输问题。' +
    '包括由于载波丢失、FIFO欠流/溢出、心跳、迟到碰撞和其他问题而导致的帧传输错误。</p>';
const netFIFOInfo = '<p>网络接口遇到的FIFO错误数量。</p>' +
    '<p><b>入站</b> - 由于数据包超出了主机提供的缓冲区，如大于MTU或下一个缓冲区在环形传输中不可用，而导致的丢包。' +
    '<b>出站</b> - 由于设备FIFO欠流/溢出而导致的帧传输错误。' +
    '当设备开始传输帧但无法及时将整个帧传输给发送器时，就会出现这种情况。</p>';
const netDropsInfo = '<p>在网络接口级别被丢弃的数据包数量。</p>' +
    '<p><b>入站</b> - 接收到但未经处理的数据包，例如由于<a href="#menu_system_submenu_softnet_stat">softnet backlog</a>溢出、错误/意外的VLAN标签、未知或未注册的协议、服务器未配置为IPv6时的IPv6帧。' +
    '<b>出站</b> - 在传输途中被丢弃的数据包，例如由于资源不足。</p>';
const netCompressedInfo = '网络接口正确传输的压缩数据包数量。' +
    '这些计数器仅对支持数据包压缩的接口（例如CSLIP、PPP）有意义。';
const netEventsInfo = '<p>网络接口遇到的错误数量。</p>' +
    '<p><b>帧</b> - 由于无效长度、FIFO溢出、CRC和帧对齐错误而丢弃的数据包的聚合计数。' +
    '<b>碰撞</b> - 数据包传输过程中的<a href="https://en.wikipedia.org/wiki/Collision_(telecommunications)" target="blank">碰撞</a>。' +
    '<b>载波</b> - 由于过多碰撞、载波丢失、设备FIFO欠流/溢出、心跳/SQE测试错误和迟到碰撞而导致的帧传输错误的聚合计数。</p>';
const netDuplexInfo = '<p>网络适配器与其连接的设备协商的最新或当前<a href="https://en.wikipedia.org/wiki/Duplex_(telecommunications)" target="_blank">双工</a>模式。</p>' +
    '<p><b>未知</b> - 无法确定双工模式。' +
    '<b>半双工</b> - 通信一次只能进行一个方向。' +
    '<b>全双工</b> - 接口能够同时发送和接收数据。</p>';
const netOperstateInfo = '<p>接口的当前<a href="https://datatracker.ietf.org/doc/html/rfc2863" target="_blank">操作状态</a>。</p>' +
    '<p><b>未知</b> - 无法确定状态。' +
    '<b>不存在</b> - 接口缺少（通常是硬件）组件。' +
    '<b>下线</b> - 接口无法在L1上传输数据，例如以太网未插入或接口被管理员关闭。' +
    '<b>下层接口下线</b> - 接口由于下层接口的状态而关闭。' +
    '<b>测试中</b> - 接口处于测试模式，例如电缆测试。在测试完成之前，它不能用于正常流量。' +
    '<b>休眠</b> - 接口处于L1上线，但正在等待外部事件，例如协议建立。' +
    '<b>在线</b> - 接口已准备好传递数据包并可用。</p>';
const netCarrierInfo = '接口的当前物理链路状态。';
const netSpeedInfo = '网络适配器与其连接的设备协商的最新或当前速度。' +
    '这不提供NIC的最大支持速度。';
const netMTUInfo = '接口当前配置的<a href="https://en.wikipedia.org/wiki/Maximum_transmission_unit" target="_blank">最大传输单元</a>（MTU）值。' +
    'MTU是单个网络层事务中可以通信的最大协议数据单元的大小。';
const ebpfChartProvides = '此图表由<a href="#menu_netdata_submenu_ebpf">eBPF插件</a>提供。';
const ebpfProcessCreate = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#processes" target="_blank">启动进程的函数</a>的次数。Netdata在<a href="#ebpf_system_process_thread">进程</a>中为此图表提供摘要，' +
    '并且当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_process_create">应用程序</a>显示每个进程。' + ebpfChartProvides;
const ebpfThreadCreate = '启动线程的函数被调用的次数。Netdata在<a href="#ebpf_system_process_thread">进程</a>中为此图表提供摘要，' +
    '并且当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_thread_create">应用程序</a>显示每个进程。' + ebpfChartProvides;
const ebpfTaskExit = '负责关闭任务的函数被调用的次数。Netdata在<a href="#ebpf_system_process_exit">进程</a>中为此图表提供摘要，' +
    '并且当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_process_exit">应用程序</a>显示每个进程。' + ebpfChartProvides;
const ebpfTaskClose = '释放任务的函数被调用的次数。Netdata在<a href="#ebpf_system_process_exit">进程</a>中为此图表提供摘要，' +
    '并且当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_task_release">应用程序</a>显示每个进程。' + ebpfChartProvides;
const ebpfTaskError = '创建新<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#task-error" target="_blank">任务</a>时出错的次数。Netdata在<a href="#ebpf_system_task_error">进程</a>中为此图表提供摘要，' +
    '并且当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_task_error">应用程序</a>显示每个进程。' + ebpfChartProvides;
const ebpfFileOpen = 'Linux内核内部函数调用次数，负责<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file-descriptor" target="_blank">打开文件</a>。' +
    'Netdata在<a href="#menu_filesystem_submenu_file_access">文件访问</a>中为此图表提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_file_open">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfFileOpenError = 'Linux内核内部函数调用失败次数，负责<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file-descriptor" target="_blank">打开文件</a>。' +
    'Netdata在<a href="#menu_filesystem_submenu_file_error">文件访问</a>中为此图表提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_file_open_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfFileClosed = 'Linux内核内部函数调用次数，负责<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file-descriptor" target="_blank">关闭文件</a>。' +
    'Netdata在<a href="#menu_filesystem_submenu_file_access">文件访问</a>中为此图表提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_file_closed">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfFileCloseError = 'Linux内核内部函数调用失败次数，负责<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file-descriptor" target="_blank">关闭文件</a>。' +
    'Netdata在<a href="#menu_filesystem_submenu_file_error">文件访问</a>中为此图表提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_file_close_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfDCHit = '文件访问中存在于<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#directory-cache" target="_blank">目录缓存</a>中的百分比。' +
    'Netdata在<a href="#ebpf_dc_hit_ratio">目录缓存</a>中为此图表提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_dc_hit">应用程序</a>显示目录缓存。' + ebpfChartProvides;
const ebpfDCReference = '文件在<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#directory-cache" target="_blank">目录缓存</a>中被访问的次数。Netdata为此图表在<a href="#ebpf_dc_reference">目录缓存</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_dc_reference">应用程序</a>显示目录缓存。' + ebpfChartProvides;
const ebpfDCNotCache = '因未在<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#directory-cache" target="_blank">目录缓存</a>中找到，文件在文件系统中被访问的次数。' +
    'Netdata为此图表在<a href="#ebpf_dc_reference">目录缓存</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_dc_not_cache">应用程序</a>显示目录缓存。' + ebpfChartProvides;
const ebpfDCNotFound = '文件在文件系统中未被找到的次数。Netdata为此图表在<a href="#ebpf_dc_reference">目录缓存</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_dc_not_found">应用程序</a>显示目录缓存。' + ebpfChartProvides;
const ebpfVFSWrite = '成功调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统写入函数</a>的次数。Netdata为此图表在<a href="#ebpf_global_vfs_io">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_write">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSRead = '成功调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统读取函数</a>的次数。Netdata为此图表在<a href="#ebpf_global_vfs_io">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_read">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSWriteError = '失败调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统写入函数</a>的次数。Netdata为此图表在<a href="#ebpf_global_vfs_io_error">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_write_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSReadError = '失败调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统读取函数</a>的次数。Netdata为此图表在<a href="#ebpf_global_vfs_io_error">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_read_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSWriteBytes = '使用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统写入函数</a>成功写入的字节总数。Netdata为此图表在<a href="#ebpf_global_vfs_io_bytes">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_write_bytes">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSReadBytes = '使用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统读取函数</a>成功读取的字节总数。Netdata为此图表在<a href="#ebpf_global_vfs_io_bytes">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_read_bytes">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSUnlink = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统取消链接函数</a>的次数。Netdata为此图表在<a href="#ebpf_global_vfs_unlink">虚拟文件系统</a>中提供摘要，' +
    '当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata会按<a href="#ebpf_apps_vfs_unlink">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSSync = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统同步函数</a>的次数。Netdata为此图表在' +
    '<a href="#ebpf_global_vfs_sync">虚拟文件系统</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_vfs_sync">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSSyncError = '失败调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统同步函数</a>的次数。Netdata为此图表在' +
    '<a href="#ebpf_global_vfs_sync_error">虚拟文件系统</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_vfs_sync_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSOpen = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统打开函数</a>的次数。Netdata为此图表在' +
    '<a href="#ebpf_global_vfs_open">虚拟文件系统</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_vfs_open">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSOpenError = '失败调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统打开函数</a>的次数。Netdata为此图表在' +
    '<a href="#ebpf_global_vfs_open_error">虚拟文件系统</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_vfs_open_error">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSCreate = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">虚拟文件系统创建函数</a>的次数。Netdata为此图表在' +
    '<a href="#ebpf_global_vfs_create">虚拟文件系统</a>中提供摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，' +
    'Netdata会按<a href="#ebpf_apps_vfs_create">应用程序</a>显示虚拟文件系统。' + ebpfChartProvides;
const ebpfVFSCreateError = '调用 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS 创建函数</a> 失败次数。Netdata 在<a href="#ebpf_global_vfs_create_error">虚拟文件系统</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_vfs_create_error">应用程序</a>的虚拟文件系统。' + ebpfChartProvides;
const ebpfSwapRead = '调用 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#swap" target="_blank">交换读取函数</a> 失败次数。Netdata 在<a href="#ebpf_global_swap">系统概览</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_swap_read">应用程序</a>的交换。' + ebpfChartProvides;
const ebpfSwapWrite = '调用 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#swap" target="_blank">交换写入函数</a> 失败次数。Netdata 在<a href="#ebpf_global_swap">系统概览</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_swap_write">应用程序</a>的交换。' + ebpfChartProvides;
const ebpfCachestatRatio = '比率显示直接在内存中访问的数据百分比。<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#page-cache-ratio" target="_blank">页面缓存比率</a>。Netdata 在<a href="#menu_mem_submenu_page_cache">内存</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_cachestat_ratio">应用程序</a>的页面缓存命中。' + ebpfChartProvides;
const ebpfCachestatDirties = 'Linux 页面缓存中的 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#dirty-pages" target="_blank">修改页面</a> 数量。Netdata 在<a href="#ebpf_global_cachestat_dirty">内存</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_cachestat_dirties">应用程序</a>的页面缓存命中。' + ebpfChartProvides;
const ebpfCachestatHits = '在<a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">Linux 页面缓存</a>中对数据的访问次数。Netdata 在<a href="#ebpf_global_cachestat_hits">内存</a>提供此图表的摘要，当集成被<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata 显示每个<a href="#ebpf_apps_cachestat_hits">应用程序</a>的页面缓存命中。' + ebpfChartProvides;
const ebpfCachestatMisses = '数据访问未在Linux页面缓存中找到的次数。Netdata在<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#page-cache-misses" target="_blank">Memory</a>中为此图表提供了摘要，在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_cachestat_misses">应用程序</a>的页面缓存未命中。' + ebpfChartProvides;
const ebpfSHMget = '调用<code>shmget</code>的次数。Netdata在<a href="#ebpf_global_shm">系统概览</a>中为此图表提供了摘要，在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_shm_get">应用程序</a>的共享内存指标。' + ebpfChartProvides;
const ebpfSHMat = '调用<code>shmat</code>的次数。Netdata在<a href="#ebpf_global_shm">系统概览</a>中为此图表提供了摘要，在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_shm_at">应用程序</a>的共享内存指标。' + ebpfChartProvides;
const ebpfSHMctl = '调用<code>shmctl</code>的次数。Netdata在<a href="#ebpf_global_shm">系统概览</a>中为此图表提供了摘要，在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_shm_ctl">应用程序</a>的共享内存指标。' + ebpfChartProvides;
const ebpfSHMdt = '调用<code>shmdt</code>的次数。Netdata在<a href="#ebpf_global_shm">系统概览</a>中为此图表提供了摘要，在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_shm_dt">应用程序</a>的共享内存指标。' + ebpfChartProvides;
const ebpfIPV4conn = '调用IPV4 TCP函数开始连接的次数。Netdata在<a href="#ebpf_global_outbound_conn">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_outbound_conn_ipv4">应用程序</a>的出站连接。' + ebpfChartProvides;
const ebpfIPV6conn = '调用IPV6 TCP函数开始连接的次数。Netdata在<a href="#ebpf_global_outbound_conn">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_outbound_conn_ipv6">应用程序</a>的出站连接。' + ebpfChartProvides;
const ebpfBandwidthSent = '使用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-bandwidth" target="_blank">TCP</a>或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#udp-functions" target="_blank">UDP</a>内部函数发送的总字节数。Netdata在<a href="#ebpf_global_bandwidth_tcp_bytes">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_bandwidth_sent">应用程序</a>的带宽。' + ebpfChartProvides;
const ebpfBandwidthRecv = '使用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-bandwidth" target="_blank">TCP</a>或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#udp-functions" target="_blank">UDP</a>内部函数接收的总字节数。Netdata在<a href="#ebpf_global_bandwidth_tcp_bytes">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_bandwidth_received">应用程序</a>的带宽。' + ebpfChartProvides;
const ebpfTCPSendCall = '调用发送数据的<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-bandwidth" target="_blank">TCP</a>函数的次数。Netdata在<a href="#ebpf_global_tcp_bandwidth_call">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_bandwidth_tcp_sent">应用程序</a>的TCP调用。' + ebpfChartProvides;
const ebpfTCPRecvCall = '调用接收数据的<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-bandwidth" target="_blank">TCP</a>函数的次数。Netdata在<a href="#ebpf_global_tcp_bandwidth_call">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_bandwidth_tcp_received">应用程序</a>的TCP调用。' + ebpfChartProvides;
const ebpfTCPRetransmit = '重新传输<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-retransmit" target="_blank">TCP</a>数据包的次数。Netdata在<a href="#ebpf_global_tcp_retransmit">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_tcp_retransmit">应用程序</a>的TCP调用。' + ebpfChartProvides;
const ebpfUDPsend = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#udp-functions" target="_blank">UDP</a>函数发送数据的次数。Netdata在<a href="#ebpf_global_udp_bandwidth_call">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_udp_sendmsg">应用程序</a>的UDP调用。' + ebpfChartProvides;
const ebpfUDPrecv = '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#udp-functions" target="_blank">UDP</a>函数接收数据的次数。Netdata在<a href="#ebpf_global_udp_bandwidth_call">网络堆栈</a>中为此图表提供了摘要。在集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata显示每个<a href="#ebpf_apps_udp_recv">应用程序</a>的UDP调用。' + ebpfChartProvides;
const cgroupCPULimit = '在配置的或系统范围内（如果未设置）的限制下的总CPU利用率。当cgroup的CPU利用率超过配置的周期限制时，其层次结构中属于其的任务将被限制，直到下一个周期。';
const cgroupCPU = '系统范围内CPU资源（所有核心）的总CPU利用率。由cgroup任务在<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">用户和内核</a>模式中花费的时间。';
const cgroupThrottled = '当cgroup中的任务被限制时可运行周期的百分比。任务由于已耗尽其CPU配额而无法运行。';
const cgroupThrottledDuration = 'cgroup中的任务被限制的总时长。当应用程序使用其给定周期的CPU配额时，它会被限制，直到下一个周期。';
const cgroupCPUShared = '<p>在同一层次中的每个组的权重，转换为其预期获得的CPU量。分配给cgroup的CPU的百分比是份额的值除以同一级别所有cgroup中所有份额的总和。</p><p>例如，两个cgroup中的任务，其<b>cpu.shares</b>设置为100，将获得相等的CPU时间，但具有<b>cpu.shares</b>设置为200的cgroup中的任务将获得与具有<b>cpu.shares</b>设置为100的cgroup中的任务两倍的CPU时间。</p>';
const cgroupCPUPerCore = '系统范围内每个核心的总CPU利用率。';
const cgroupCPUSomePressure = 'CPU <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Some</b> 表示至少有 <b>一些任务</b> 在 CPU 上停滞的时间份额。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupCPUSomePressureStallTime = '一些进程等待 CPU 时间的量。'
const cgroupCPUFullPressure = 'CPU <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Full</b> 表示 <b>所有非空闲任务</b> 同时在 CPU 资源上停滞的时间份额。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupCPUFullPressureStallTime = '所有非空闲进程由于 CPU 拥塞而停滞的时间量。'
const cgroupMemUtilization = '在配置的或系统范围内（如果未设置）的 RAM 利用率。当 cgroup 的 RAM 利用率超过限制时，OOM killer 将开始杀死属于该 cgroup 的任务。'
const cgroupMemUsageLimit = '在配置的或系统范围内（如果未设置）的 RAM 使用限制。当 cgroup 的 RAM 使用量超过限制时，OOM killer 将开始杀死属于该 cgroup 的任务。'
const cgroupMemUsage = '已使用的 RAM 和交换内存量。'
const cgroupMem = '内存使用统计信息。单独的指标在 <a href="https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v1/memory.html#per-memory-cgroup-local-status" target="_blank">cgroup-v1</a> 和 <a href="https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html#memory-interface-files" target="_blank">cgroup-v2</a> 的 memory.stat 部分中描述。'
const cgroupMemFailCnt = '内存使用超出限制的次数。'
const cgroupWriteback = '<b>Dirty</b> 是等待写入磁盘的内存量。 <b>Writeback</b> 是正在主动写入磁盘的内存量。'
const cgroupMemActivity = '<p>内存记账统计信息。</p><p><b>In</b> - 页面被记入 cgroup 作为映射的匿名页面（RSS）或缓存页面（Page Cache）。 <b>Out</b> - 页面从 cgroup 中取消记账。</p>'
const cgroupPgFaults = '<p>内存 <a href="https://en.wikipedia.org/wiki/Page_fault" target="_blank">页面错误</a> 统计信息。</p><p><b>Pgfault</b> - 所有页面错误。 <b>Swap</b> - 重要页面错误。</p>'
const cgroupMemorySomePressure = '内存 <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Some</b> 表示至少有 <b>一些任务</b> 在内存上停滞的时间份额。在这种状态下，CPU 仍在进行有生产力的工作。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupMemorySomePressureStallTime = '一些进程由于内存拥塞而等待的时间量。'
const cgroupMemoryFullPressure = '内存 <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Full</b> 表示 <b>所有非空闲任务</b> 同时在内存资源上停滞的时间份额。在这种状态下，实际的 CPU 循环被浪费，而在这种状态下长时间进行的工作负载被认为是抖动的。这对性能有严重影响。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupMemoryFullPressureStallTime = '所有非空闲进程由于内存拥塞而停滞的时间量。'
const cgroupIO = '由 CFQ 调度程序看到的传输到和从特定设备的数据量。当 CFQ 调度程序正在操作请求队列时，它不会被更新。'
const cgroupServicedOps = 'CFQ 调度程序所见到的在特定设备上执行的 I/O 操作次数。'
const cgroupQueuedOps = '排队等待执行的 I/O 操作请求数量。'
const cgroupMergedOps = '合并到 I/O 操作请求中的 BIOS 请求的数量。'
const cgroupThrottleIO = '作为节流策略所见到的传输到和从特定设备的数据量。'
const cgroupThrottleIOServicesOps = '节流策略所见到的在特定设备上执行的 I/O 操作次数。'
const cgroupIOSomePressure = 'I/O <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Some</b> 表示至少有 <b>一些任务</b> 在 I/O 上停滞的时间份额。在这种状态下，CPU 仍在进行有生产力的工作。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupIOSomePRessureStallTime = '由于 I/O 拥塞而导致一些进程等待的时间量。'
const cgroupIOFullPressure = 'I/O <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停顿信息</a>。 <b>Full</b> 表示 <b>所有非空闲任务</b> 同时在 I/O 资源上停滞的时间份额。在这种状态下，实际的 CPU 循环被浪费，而在这种状态下长时间进行的工作负载被认为是抖动的。这对性能有严重影响。这些比率是在最近的10秒、60秒和300秒窗口内跟踪的趋势。'
const cgroupIOFullPressureStallTime = '由于 I/O 拥塞而导致所有非空闲进程停滞的时间量。'
netdataDashboard.context = {
    'system.cpu': {
        info: function (os) {
            void (os);
            return '总CPU利用率（所有核心）。这里的100%意味着没有CPU空闲时间。您可以在 <a href="#menu_cpu">CPU</a> 部分获取每个核心的使用情况，以及在 <a href="#menu_apps">应用程序监控</a> 部分获取每个应用程序的使用情况。' +
                netdataDashboard.sparkline('<br/>请注意<b> iowait </b>', 'system.cpu', 'iowait', '%', '。如果它持续很高，您的磁盘是一个瓶颈，并且会减慢系统速度。') +
                netdataDashboard.sparkline('<br/>一个值得关注的重要指标是<b> softirq </b>', 'system.cpu', 'softirq', '%', '。softirq的持续高百分比可能表明存在网络驱动程序问题。 ' +
                '您可以在<a href="https://www.kernel.org/doc/html/latest/filesystems/proc.html#miscellaneous-kernel-statistics-in-proc-stat" target="_blank"> 内核文档 </a>中找到各个指标。');
        },
        valueRange: "[0, 100]"
    },

    'system.load': {
        info: '当前系统负载，即使用 CPU 或等待系统资源（通常是 CPU 和磁盘）的进程数量。这 3 个指标分别是 1、5 和 15 分钟的平均值。系统每 5 秒计算一次这个值。欲了解更多信息，请查阅此 <a href="https://en.wikipedia.org/wiki/Load_(computing)" target="_blank"> Wikipedia </a>文章。',
        height: 0.7
    },

    'system.cpu_some_pressure': {
        info: 'CPU <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>一些</b> 表示至少有 <b>一些任务</b> 在 CPU 上停滞的时间份额。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.cpu_some_pressure_stall_time': {
        info: '某些进程等待 CPU 时间的时间量。'
    },
    'system.cpu_full_pressure': {
        info: 'CPU <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>完全</b> 表示所有非空闲任务同时在 CPU 资源上停滞的时间份额。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.cpu_full_pressure_stall_time': {
        info: '所有非空闲进程因 CPU 拥塞而停止的时间量。'
    },

    'system.memory_some_pressure': {
        info: '内存 <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>一些</b> 表示至少有 <b>一些任务</b> 在内存上停滞的时间份额。 ' +
        '在这种状态下，CPU 仍在进行有效的工作。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.memory_some_pressure_stall_time': {
        info: '某些进程由于内存拥塞而等待的时间量。'
    },
    'system.memory_full_pressure': {
        info: '内存 <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>完全</b> 表示所有非空闲任务同时在内存资源上停滞的时间份额。 ' +
        '在这种状态下，实际的 CPU 循环被浪费掉，而在这种状态下花费大量时间的工作负载被认为是抖动的。 ' +
        '这对性能有严重影响。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.memory_full_pressure_stall_time': {
        info: '所有非空闲进程由于内存拥塞而停止的时间量。'
    },

    'system.io_some_pressure': {
        info: 'I/O <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>一些</b> 表示至少有 <b>一些任务</b> 在I/O上停滞的时间份额。 ' +
        '在这种状态下，CPU 仍在进行有效的工作。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.io_some_pressure_stall_time': {
        info: '某些进程由于 I/O 拥塞而等待的时间量。'
    },
    'system.io_full_pressure': {
        info: 'I/O <a href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank">压力停滞信息</a>。 ' +
        '<b>完全</b> 表示所有非空闲任务同时在I/O资源上停滞的时间份额。 ' +
        '在这种状态下，实际的 CPU 循环被浪费掉，而在这种状态下花费大量时间的工作负载被认为是抖动的。 ' +
        '这对性能有严重影响。 ' +
        '这些比例被跟踪作为最近的趋势，涵盖了10秒、60秒和300秒的窗口期。'
    },
    'system.io_full_pressure_stall_time': {
        info: '所有非空闲进程由于 I/O 拥塞而停止的时间量。'
    },

    'system.io': {
        info: function (os) {
            var s = '磁盘 I/O 总计, 包含所有的实体磁盘。您可以在 <a href="#menu_disk">磁盘</a> 区段查看每一个磁盘的详细资讯，也可以在 <a href="#menu_apps">应用程序</a> 区段了解每一支应用程序对于磁盘的使用情况。';
            if (os === 'linux')
                return s + ' 实体磁盘指的是 <code>/sys/block</code> 中有列出，但是没有在 <code>/sys/devices/virtual/block</code> 的所有磁盘。';
            else
                return s;
        }
    },

    'system.pgpgio': {
        info: '从/到磁盘中分页的内存。这通常是系统的总磁盘 I/O。'
    },

    'system.swapio': {
        info: '所有的 Swap I/O. (netdata 会合并显示 <code>输入</code> 与 <code>输出</code>。如果图表中没有任何数值，则表示为 0。 - 您可以修改这一页的设定，让图表显示固定的维度。'
    },

    'system.pgfaults': {
        info: '所有的页面错误。 <b>主要页面错误</b>表示系统正在使用其交换区。您可以在<a href="#menu_apps">应用程序监控</a>部分找到哪些应用程序使用交换。'
    },

    'system.entropy': {
        colors: '#CC22AA',
        info: '<a href="https://en.wikipedia.org/wiki/Entropy_(computing)" target="_blank">熵 (Entropy)</a>，主要是用在密码学的乱数集区 (<a href="https://en.wikipedia.org/wiki//dev/random" target="_blank">/dev/random</a>)。如果熵的集区为空，需要乱数的程序可能会导致执行变慢 (这取决于每个程序使用的介面)，等待集区补充。在理想情况下，有高度熵需求的系统应该要具备专用的硬体装置 (例如 TPM 装置)。您也可以安装纯软体的方案，例如 <code>haveged</code>，通常这些方案只会使用在伺服器上。'
    },

    'system.clock_sync_state': {
        info: '<p>由 <a href="https://man7.org/linux/man-pages/man2/adjtimex.2.html" target="_blank">ntp_adjtime()</a> 系统调用提供的系统时钟同步状态。 ' +
        '一个未同步的时钟可能是由于 NTP 守护程序的同步问题或硬件时钟故障造成的。 ' +
        '在 NTP 守护程序选择要同步的服务器之前可能需要几分钟（通常最多 17 分钟）。 ' +
        '<p><b>状态映射</b>: 0 - 未同步，1 - 已同步。</p>'
    },

    'system.clock_status': {
        info: '<p>内核代码可以以各种模式运行，并根据 <a href="https://man7.org/linux/man-pages/man2/adjtimex.2.html" target="_blank">ntp_adjtime()</a> 系统调用选择启用或禁用各种功能。 ' +
        '系统时钟状态显示内核中 <b>time_status</b> 变量的值。 ' +
        '该变量的位用于控制这些功能，并记录它们存在的错误条件。</p>' +
        '<p><b>UNSYNC</b> - 调用者设置/清除以指示时钟未同步（例如，当没有可达的对等方时）。 ' +
        '此标志通常由应用程序控制，但操作系统也可以设置它。 ' +
        '<b>CLOCKERR</b> - 外部硬件时钟驱动程序设置/清除以指示硬件故障。</p>' +
        '<p><b>状态映射</b>: 0 - 位未设置，1 - 位已设置。</p>'
    },

    'system.clock_sync_offset': {
        info: '典型的NTP客户端定期轮询一个或多个NTP服务器. '+
        '客户端必须计算它的'+
        '<a href="https://en.wikipedia.org/wiki/Network_Time_Protocol#Clock_synchronization_algorithm" target="_blank">时间偏移</a> '+
        '和往返延迟。 '+
        '时间偏移是两个时钟之间的绝对时间之差。'
    },

    'system.forks': {
        colors: '#5555DD',
        info: '建立新程序的数量。'
    },

    'system.intr': {
        colors: '#DD5555',
        info: 'CPU 中断的总数。透过检查 <code>system.interrupts</code>，得知每一个中断的细节资讯。在 <a href="#menu_cpu">CPU</a> 区段提供每一个 CPU 核心的中断情形。'
    },

    'system.interrupts': {
        info: 'CPU 中断的细节。在 <a href="#menu_cpu">CPU</a> 区段中，依据每个 CPU 核心分析中断。'
    },

    'system.hardirq_latency': {
        info: '维护硬件中断所花费的总时间。基于eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/hardirqs_example.txt" target="_blank">hardirqs</a> from BCC tools.'
    },

    'system.softirqs': {
        info: '<p>系统中软件中断的总数。在 <a href="#menu_cpu">CPU</a> 部分，softirqs 根据 <a href="#menu_cpu_submenu_softirqs">每个 CPU 核心</a> 进行分析。</p><p><b>HI</b> - 高优先级任务。 <b>TIMER</b> - 与定时器中断相关的任务。 <b>NET_TX</b>、<b>NET_RX</b> - 用于网络发送和接收处理。 <b>BLOCK</b> - 处理块 I/O 完成事件。 <b>IRQ_POLL</b> - IO 子系统使用它来提高性能（用于块设备的类似 NAPI 的方法）。 <b>TASKLET</b> - 处理常规任务。 <b>SCHED</b> - 调度程序用于执行负载平衡和其他调度任务。 <b>HRTIMER</b> - 用于高分辨率定时器。 <b>RCU</b> - 执行读-拷贝-更新（RCU）处理。</p>'
    },

    'system.softirq_latency': {
        info: '维护软件中断所耗费的总时间基于 eBPF<a href="https://github.com/iovisor/bcc/blob/master/tools/softirqs_example.txt" target="_blank">softirqs</a>来自密件抄送工具。'
    },

    'system.processes': {
        info: '<p>系统进程。</p>'+
        '<p><b>正在运行</b> - 正在运行或准备运行（可运行）。 '+
        '<b>已阻塞</b> - 当前已阻塞，正在等待 I/O 完成。</p>'
    },

    'system.processes_state': {
        info: '<p>不同状态下的进程数量。</p> ' +
        '<p><b>运行中</b> - 在特定时刻正在使用 CPU 的进程。 ' +
        '<b>休眠（不可中断）</b> - 当等待的资源可用或等待超时时，进程将会被唤醒。 ' +
        '主要由设备驱动程序用于等待磁盘或网络 I/O。 ' +
        '<b>休眠（可中断）</b> - 进程在等待特定的时间段或事件发生。 ' +
        '<b>僵尸</b> - 进程已完成执行，释放了系统资源，但其条目仍未从进程表中删除。 ' +
        '通常在父进程仍需读取其子进程退出状态时出现。 ' +
        '长时间保持为僵尸状态的进程通常是错误的，并会导致系统 PID 空间泄漏。 ' +
        '<b>停止</b> - 进程因接收到 STOP 或 TSTP 信号而暂停执行。 ' +
        '在此状态下，进程不会执行任何操作（甚至不会终止），直到接收到 CONT 信号。</p>'
    },

    'system.active_processes': {
        info: '系统中的进程总数。'
    },

    'system.ctxt': {
        info: '<a href="https://en.wikipedia.org/wiki/Context_switch" target="_blank">Context Switches</a> 是指将 CPU 从一个进程、任务或线程切换到另一个的过程。如果有很多进程或线程愿意执行，而可用的 CPU 核心非常少，系统将进行更多的 Context Switches 以在它们之间平衡 CPU 资源。整个过程在计算上是密集的。Context Switches 越多，系统就会变得越慢。'
    },

    'system.idlejitter': {
        info: 'Idle jitter 是由 netdata 计算而得。当一个执行绪要求睡眠 (Sleep) 时，需要几个微秒的时间。当系统要唤醒它时，会量测它用了多少个微秒的时间。要求睡眠与实际睡眠时间的差异就是 <b>idle jitter</b>。这个数字在即时的环境中非常有用，因为 CPU jitter 将会影响服务的品质 (例如 VoIP media gateways)。'
    },

    'system.net': {
        info: function (os) {
            var s = '所有物理网络接口的总带宽。这不包括 <code>lo</code>、VPN、网络桥接、IFB 设备、绑定接口等。只有物理网络接口的带宽被聚合。';

            if (os === 'linux')
                return s + ' 物理接口是指列在 <code>/proc/net/dev</code> 中但不存在于 <code>/sys/devices/virtual/net</code> 中的所有网络接口。';
            else
                return s;
        }
    },

    'system.ip': {
        info: 'IP 总流量。'
    },

    'system.ipv4': {
        info: 'IPv4 总流量。'
    },

    'system.ipv6': {
        info: 'IPv6 总流量。'
    },

    'system.ram': {
        info: '系统随机存取内存 (也就是实体内存) 使用情况。'
    },

    'system.swap': {
        info: '系统交换空间 (Swap) 内存使用情况。Swap 空间会在实体内存 (RAM) 已满的情况下使用。当系统内存已满但还需要使用更多内存情况下，系统内存中的比较没有异动的 Page 将会被移动到 Swap 空间 (通常是磁盘、磁盘分割区或是档案)。'
    },

    'system.swapcalls': {
        info: '监视对函数的调用<code>swap_readpage</code>和<code>swap_writepage</code>。当<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>与应用集成时，Netdata 还会显示每个应用程序的交换访问权限<a href="#menu_apps_submenu_swap">应用程序</a>。'
    },

    'system.ipc_semaphores': {
        info: '分配的System V IPC信号量的数量. '+
        '所有信号量集中信号量数量的系统范围限制在 <code>/proc/sys/kernel/sem</code> 文件（第二个字段）中指定。'
    },

    'system.ipc_semaphore_arrays': {
        info: '使用的 System V IPC 信号量数组（组）的数量。信号量支持信号量集，其中每个信号量都是一个计数信号量。 '+
        '因此，当应用程序请求信号量时，内核会成组释放它们。 '+
        '系统范围内对信号量集最大数量的限制在 <code>/proc/sys/kernel/sem</code> 文件（第 4 个字段）中指定。'
    },

    'system.shared_memory_segments': {
        info: '分配的System V IPC内存段数. '+
        '可以创建的系统范围最大共享内存段数在 /proc/sys/kernel/shmmni</code> 文件中指定。'
    },

    'system.shared_memory_bytes': {
        info: 'System V IPC内存段当前使用的内存量. '+
        '可以创建的最大共享内存段大小的运行时限制在 <code>/proc/sys/kernel/shmmax</code> 文件中指定。'
    },

    'system.shared_memory_calls': {
        info: '监视对函数的调用 <code>shmget</code>、<code>shmat</code>、<code>shmdt</code> 和 <code>shmctl</code>。当<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>与应用集成时，Netdata 还会显示共享内存系统<a href="#menu_apps_submenu_ipc_shared_memory">每个应用程序的调用使用情况</a>。'
    },

    'system.message_queue_messages': {
        info: '当前存在于System V IPC消息队列中的消息数。'
    },

    'system.message_queue_bytes': {
        info: 'System V IPC消息队列中消息当前使用的内存量。'
    },

    'system.uptime': {
        info: '系统已运行的时间量，包括挂起所用的时间.'
    },

    'system.process_thread': {
        title : '任务创建',
        info: '其中一项的费用 <a href="https://www.ece.uic.edu/~yshi1/linux/lkse/node4.html#SECTION00421000000000000000" target="_blank">do_fork</a>，或 < code>kernel_clone</code> 如果您运行的内核版本高于 5.9.16，则会调用它来创建新任务，这是用于定义内核内部进程和任务的通用名称。 Netdata 标识监视跟踪点 <code>sched_process_fork</code> 的线程。该图表由 eBPF 插件提供。'
    },

    'system.exit': {
        title : '退出监控',
        info: ' 调用负责关闭的函数 (<a href="https://www.informit.com/articles/article.aspx?p=370047&seqNum=4" target="_blank">do_exit</a>) 并释放 (< a href="https://www.informit.com/articles/article.aspx?p=370047&seqNum=4" target="_blank">release_task</a>) 任务。该图表由 eBPF 插件提供。'
    },

    'system.task_error': {
        title : '任务错误',
        info: '创建新进程或线程的错误数。此图表由eBPF插件提供.'
    },

    'system.process_status': {
        title : '任务状态',
        info: '每个期间创建的进程数和创建的线程数之间的差异（<code>process</code>维度），它还显示了系统上运行的可能的僵尸进程的数量。该图表由 eBPF 插件提供。'
    },

    // ------------------------------------------------------------------------
    // CPU charts

    'cpu.cpu': {
        commonMin: true,
        commonMax: true,
        valueRange: "[0, 100]"
    },

    'cpu.interrupts': {
        commonMin: true,
        commonMax: true
    },

    'cpu.softirqs': {
        commonMin: true,
        commonMax: true
    },

    'cpu.softnet_stat': {
        commonMin: true,
        commonMax: true
    },

    'cpu.core_throttling': {
        info: '根据CPU核心温度对CPU时钟速度进行的调整次数.'
    },

    'cpu.package_throttling': {
        info: '根据CPU的封装（芯片）温度对CPU时钟速度进行的调整次数.'
    },

    'cpufreq.cpufreq': {
        info: '频率测量CPU每秒执行的周期数.'
    },

    'cpuidle.cpuidle': {
        info: '在C状态花费的时间百分比.'
    },

    // ------------------------------------------------------------------------
    // MEMORY

    'mem.ksm': {
        info: '<p>内存页合并统计信息. '+
        '<b>共享</b>与<b>共享</b>的比率较高表明共享良好，'+
        '但<b>未共享</b>与<b>共享</b>的比例较高表明精力被浪费了。</p>'+
        '<p><b>共享</b> - 使用的共享页面。 '+
        '<b>Unshared</b> - 内存不再共享（页面是唯一的，但会反复检查合并）。 '+
        '<b>共享</b> - 当前共享的内存（还有多少个站点正在共享页面，即节省了多少）。 '+
        '<b>易失性</b> - 易失性页面（变化太快而无法放置在树中）。</p>'
    },

    'mem.ksm_savings': {
        heads: [
            netdataDashboard.gaugeChart('已保存', '12%', 'savings', '#0099CC')
        ],
        info: '<p>KSM保存的内存量.</p>'+
        '<p><b>Savings</b> - 保存的内存. '+
        '<b>Offered</b> - 标记为可合并的内存.</p>'
    },

    'mem.ksm_ratios': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Savings"'
                    + ' data-units="percentage %"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' role="application"></div>';
            }
        ],
        info: 'KSM的有效性. '+
        '这是当前合并的可合并页面的百分比.'
    },

    'mem.zram_usage': {
        info: 'ZRAM 总 RAM 使用指标。 ZRAM 使用一些内存来存储有关已存储内存页的元数据，从而引入与磁盘大小成正比的开销。它排除了相同元素填充的页面，因为没有为它们分配内存。'
    },

    'mem.zram_savings': {
        info: '显示原始和压缩内存数据大小.'
    },

    'mem.zram_ratio': {
        heads: [
            netdataDashboard.gaugeChart('压缩率', '12%', 'ratio', '#0099CC')
        ],
        info: '压缩比，计算公式为<code>100 * original_size /compressed_size</code>。更多意味着更好的压缩和更多的 RAM 节省。'
    },

    'mem.zram_efficiency': {
        heads: [
            netdataDashboard.gaugeChart('效率', '12%', 'percent', NETDATA.colors[0])
        ],
        commonMin: true,
        commonMax: true,
        valueRange: "[0, 100]",
        info: '内存使用效率，计算公式为 <code>100 *compressed_size /total_mem_used</code>。'
    },


    'mem.pgfaults': {
        info: '<p><a href="https://en.wikipedia.org/wiki/Page_fault" target="_blank">页面错误</a>是一种中断，'+
        '称为陷阱，当正在运行的程序访问内存页面时由计算机硬件引发'+
        '映射到虚拟地址空间，但实际上并未加载到主内存中。</p>'+
        '</p><b>Minor</b> - 生成故障时页面已加载到内存中，'+
        '但未在内存管理单元中标记为正在加载到内存中。 '+
        '<b>Major</b> - 当系统需要从磁盘或交换内存加载内存页面时生成。</p>'
    },

    'mem.committed': {
        colors: NETDATA.colors[3],
        info: '提交内存是进程已分配的所有内存的总和。'
    },

    'mem.real': {
        colors: NETDATA.colors[3],
        info: 'Total amount of real (physical) memory used.'
    },

    'mem.oom_kill': {
        info: '被终止的进程数 '+
        '<a href="https://en.wikipedia.org/wiki/Out_of_memory" target="_blank">内存不足</a>杀手。 '+
        '当系统可用内存不足时，内核的 OOM 杀手就会被调用，并且 '+
        '如果不终止一个或多个进程就无法继续。 '+
        '它试图选择其终止将释放最多内存的进程，而'+
        '给系统用户带来最少的痛苦。 '+
        '该计数器还包括容器内超出内存限制的进程。'
    },

    'mem.numa': {
        info: '<p>NUMA平衡统计.</p>'+
        '<p><b>本地</b> - 由该节点上的进程在此节点上成功分配的页面。 '+
        '<b>外部</b> - 最初用于此节点的页面已分配给另一个节点。 '+
        '<b>Interleave</b> - 已成功分配给此节点的交错策略页面。 '+
        '<b>其他</b> - 由另一个节点上的进程在此节点上分配的页面。 '+
        '<b>PteUpdates</b> - 标记为 NUMA 提示错误的基页。 '+
        '<b>HugePteUpdates</b> - 标记为 NUMA 提示错误的透明大页面。 '+
        '结合<b>pte_updates</b>可以计算出标记的总地址空间。 '+
        '<b>HintFaults</b> - 被捕获的 NUMA 提示错误。 '+
        '<b>HintFaultsLocal</b> - 提示本地节点的故障。 '+
        '结合<b>HintFaults</b>，可以计算本地故障与远程故障的百分比。 '+
        '局部提示错误比例较高表明工作负载更接近收敛。 '+
        '<b>PagesMigerated</b> - 页面因放错位置而被迁移。 '+
        '由于迁移是一种复制操作，因此它贡献了 NUMA 平衡产生的最大部分开销。</p>'
    },

    'mem.available': {
        info: function (os) {
            if (os === "freebsd")
                return '可供用户空间进程使用的内存量，而不会引起交换。计算为空闲、缓存和非活动内存的总和。';
            else
                return '可用内存由内核估算，表示可供用户空间进程使用的内存量，而不会引起交换。';
        }
    },

    'mem.writeback': {
        info: '<b>Dirty</b> 是等待写入磁盘的内存量。<b>Writeback</b> 是指有多少内存内容被主动写入磁盘。'
    },

    'mem.kernel': {
        info: '<p>内核使用的内存总量.</p>'+
        '<p><b>Slab</b> - 内核使用它来缓存数据结构以供自己使用。 '+
        '<b>KernelStack</b> - 为内核完成的每个任务分配。 '+
        '<b>PageTables</b> - 专用于最低级别的页表（页表用于将虚拟地址转换为物理内存地址）。 '+
        '<b>VmallocUsed</b> - 用作虚拟地址空间。 '+
        '<b>Percpu</b> - 分配给用于支持每 CPU 分配的每 CPU 分配器（不包括元数据的成本）。 '+
        '当您创建每个 CPU 变量时，系统上的每个处理器都会获得该变量自己的副本。</p>'
    },

    'mem.slab': {
        info: '<p><a href="https://en.wikipedia.org/wiki/Slab_allocation" target="_blank">Slab 内存</a>统计信息。<p>' +
            '<p><b>可回收</b> - 内核可以重用的内存量。 <b>不可回收</b> - 即使内核缺乏内存也无法重用。</p>'
    },

    'mem.hugepages': {
        info: '专用（或直接）大页面是为配置为使用大页面的应用程序保留的内存。即使有可用的空闲大页，大页也会<b>使用</b>内存。'
    },

    'mem.transparent_hugepages': {
        info: '透明大页（THP）通过大页支持虚拟内存，支持页面大小的自动提升和降级。它适用于所有匿名内存映射和 tmpfs/shmem 应用程序。'
    },

    'mem.hwcorrupt': {
        info: '存在物理损坏问题的内存量，由 <a href="https://en.wikipedia.org/wiki/ECC_memory" target="_blank">ECC</a> and set aside by the kernel so it does not get used.'
    },

    'mem.ecc_ce': {
        info: '存在物理损坏问题的内存量，由. '+
        '这些错误不影响系统的正常运行'+
        '因为它们仍在被纠正。 '+
        '周期性的可纠正错误可能表明其中一个内存模块正在慢慢失效。'
    },

    'mem.ecc_ue': {
        info: '无法纠正的（多位）ECC错误数. '+
        '不可纠正的错误是致命的问题，通常会导致操作系统崩溃。'
    },

    'mem.pagetype_global': {
        info: '在一定大小的块中可用的内存量.'
    },

    'mem.cachestat_ratio': {
        info: '当处理器需要读取或写入主内存中的某个位置时，它会检查页面缓存中的相应条目。如果该条目存在，则表明发生了页高速缓存命中并且读取来自高速缓存。如果该条目不存在，则发生页面缓存未命中，内核会分配一个新条目并从磁盘复制数据。 Netdata 计算内存中缓存的已访问文件的百分比。 <a href="https://github.com/iovisor/bcc/blob/master/tools/cachestat.py#L126-L138" target="_blank">该比率</a>是根据访问的缓存页面来计算的（不计算脏页和由于读取未命中而添加的页）除以没有脏页的总访问量。'
    },

    'mem.cachestat_dirties': {
        info: '脏页缓存的数量。带有修改的页面在被调入后称为脏页。由于页面缓存中的非脏页在辅助存储（例如硬盘驱动器或固态硬盘）中有相同的副本，丢弃和重用它们的空间比将脏页刷新到辅助存储并重用其空间要快得多。',
    },

    'mem.cachestat_hits': {
        info: '当处理器需要读取或写入主内存中的某个位置时，它会检查页面缓存中是否有相应的条目。如果条目存在，则发生了页面缓存命中，并且读取来自缓存。命中显示访问的页面未被修改（我们排除了脏页），此计数还排除了最近插入的用于读取的页面。',
    },

    'mem.cachestat_misses': {
        info: '当处理器需要读取或写入主内存中的某个位置时，它会检查页面缓存中是否有相应的条目。如果条目不存在，则发生了页面缓存未命中，并且缓存分配了一个新的条目并复制数据到主内存。未命中计数与写入无关的页面插入到内存中。',
    },

    'mem.sync': {
        info: '用于将文件系统缓冲区刷新到存储设备的<a href="https://man7.org/linux/man-pages/man2/sync.2.html" target="_blank">sync()</a> 和 <a href="https://man7.org/linux/man-pages/man2/syncfs.2.html" target="_blank">syncfs()</a> 的系统调用。这些调用可能导致性能波动。 <code>sync()</code> 调用基于来自 BCC 工具的 eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/syncsnoop.py" target="_blank">syncsnoop</a>。',
    },

    'mem.file_sync': {
        info: '用于 <a href="https://man7.org/linux/man-pages/man2/fsync.2.html" target="_blank">fsync() 和 fdatasync()</a> 的系统调用，用于传输对磁盘设备上文件的所有修改的页缓存。这些调用会一直阻塞，直到设备报告传输已经完成。'
    },

    'mem.memory_map': {
        info: '用于 <a href="https://man7.org/linux/man-pages/man2/msync.2.html" target="_blank">msync()</a> 的系统调用，该调用刷新了映射文件的内核空间副本所做的更改。'
    },

    'mem.file_segment': {
        info: '用于 <a href="https://man7.org/linux/man-pages/man2/sync_file_range.2.html" target="_blank">sync_file_range()</a> 的系统调用，允许对通过文件描述符fd引用的打开文件与磁盘进行精细控制同步。这个系统调用非常危险，不应在可移植程序中使用。'
    },

    'filesystem.dc_hit_ratio': {
        info: '文件访问中存在于目录缓存中的百分比。100% 表示每次访问的文件都存在于目录缓存中。如果文件不存在于目录缓存中，1）它们在文件系统中不存在，2）之前未访问过这些文件。了解更多关于<a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">目录缓存</a>的信息。当与应用程序集成<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">启用</a>时，Netdata还显示每个<a href="#menu_apps_submenu_directory_cache__eBPF_">应用程序</a>的目录缓存。'
    },

    'filesystem.dc_reference': {
        info: '文件访问的计数器。当发生文件访问且文件不在目录缓存中时，称为<code>Reference</code>。当发生文件访问且文件在文件系统中找不到时，称为<code>Miss</code>。当发生文件访问且文件存在于文件系统中但不在目录缓存中时，称为<code>Slow</code>。了解更多关于<a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">目录缓存</a>的信息。'
    },

    'md.health': {
        info: '每个MD阵列中失败设备的数量。Netdata从md状态行的[n/m]字段检索此数据。这意味着理想情况下，阵列应该有n个设备，但当前有m个设备正在使用。<code>失败的磁盘</code>是n-m。'
    },
    'md.disks': {
        info: '正在使用和处于停机状态的设备数量。Netdata从md状态行的[n/m]字段检索此数据。这意味着理想情况下，阵列应该有n个设备，但当前有m个设备正在使用。<code>正在使用</code>是m，<code>停机</code>是n-m。'
    },
    'md.status': {
        info: '正在进行操作的完成进度。'
    },
    'md.expected_time_until_operation_finish': {
        info: '完成进行中操作的预估时间。由于操作速度会根据其他I/O需求而变化，所以这个时间只是一个近似值。'
    },
    'md.operation_speed': {
        info: '正在进行操作的速度。系统范围的重建速度限制在<code>/proc/sys/dev/raid/{speed_limit_min,speed_limit_max}</code>文件中指定。这些选项对于调整重建过程很有用，可能会增加整体系统负载、CPU和内存使用率。'
    },
    'md.mismatch_cnt': {
        info: '在执行检查和修复时，可能在执行重新同步时，md会计算发现的错误数量。在<code>sysfs</code>文件<code>md/mismatch_cnt</code>中记录了不匹配的计数。此值是重写的扇区数，或者（对于<检查>）将被重写的扇区数。它可能比实际错误的数量大数倍，与页面中的扇区数成正比。在RAID1或RAID10上，不匹配无法非常可靠地解释，特别是当设备用于交换时。在真正干净的RAID5或RAID6阵列上，任何不匹配都应该表明某个级别存在硬件问题 - 软件问题永远不应该导致这种不匹配。有关详情，请参阅<a href="https://man7.org/linux/man-pages/man4/md.4.html" target="_blank">md(4)</a>。'
    },
    'md.flush': {
        info: '每个MD阵列的刷新次数。基于BCC工具中的eBPF <a href="https://github.com/iovisor/bcc/blob/master/tools/mdflush_example.txt" target="_blank">mdflush</a>。'
    },

    // ------------------------------------------------------------------------
    // IP

    'ip.inerrors': {
        info: '<p>在接收IP数据包期间遇到的错误数.</p>' +
        '</p><b>NoRoutes</b> - 由于没有路由发送而被丢弃的数据包。 ' +
        '<b>截断</b> - 由于数据报帧没有携带足够的数据而被丢弃的数据包。 ' +
        '<b>校验和</b> - 由于校验和错误而被丢弃的数据包。</p>'
    },

    'ip.mcast': {
        info: '系统中的总多播流量.'
    },

    'ip.mcastpkts': {
        info: '系统中传输的多播数据包总数.'
    },

    'ip.bcast': {
        info: '系统中的总广播流量.'
    },

    'ip.bcastpkts': {
        info: '系统中传输的广播数据包总数.'
    },

    'ip.ecnpkts': {
        info: '<p>系统中接收到的带有 ECN 位设置的 IP 数据包总数。</p>'+
        '<p><b>CEP</b> - 遇到拥塞。 '+
        '<b>NoECTP</b> - 不支持 ECN 的传输。 '+
        '<b>ECTP0</b> 和 <b>ECTP1</b> - 支持 ECN 的传输。</p>'
    },

    'ip.tcpreorders': {
        info: '<p>TCP通过按正确的顺序对数据包进行排序或 '+
        '通过请求重新传输无序数据包。</p>' +
        '<p><b>时间戳</b> - 使用时间戳选项检测到重新排序。 ' +
        '<b>SACK</b> - 使用选择性确认算法检测到重新排序。 ' +
        '<b>FACK</b> - 使用前向确认算法检测到重新排序。 ' +
        '<b>Reno</b> - 使用快速重传算法检测到重新排序。</p>'
    },

    'ip.tcp_outbound_conn': {
        info: '与启动连接相关的TCP函数调用次数。如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示TCP外发连接的指标。' +
        ebpfChartProvides + '<div id="ebpf_global_outbound_conn"></div>'
    },

    'ip.tcp_functions': {
        info: '用于交换数据的TCP函数调用次数。如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示TCP函数的指标。' +
        ebpfChartProvides + '<div id="ebpf_global_tcp_bandwidth_call"></div>'
    },

    'ip.total_tcp_bandwidth': {
        info: '使用TCP内部函数发送和接收的总字节数。如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示TCP带宽的指标。' +
        ebpfChartProvides + '<div id="ebpf_global_bandwidth_tcp_bytes"></div>'
    },

    'ip.tcp_error': {
        info: 'TCP带宽的失败调用次数。如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示TCP错误。' +
        ebpfChartProvides + '<div id="ebpf_global_tcp_bandwidth_error"></div>'
    },

    'ip.tcp_retransmit': {
        info: 'TCP数据包被<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-retransmit" target="_blank">重新传输</a>的次数。 ' +
        '如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示TCP重传。' +
        ebpfChartProvides + '<div id="ebpf_global_tcp_retransmit"></div>'
    },

    'ip.udp_functions': {
        info: '调用UDP函数交换数据的次数。 ' +
        '如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示UDP函数的指标。' +
        ebpfChartProvides + '<div id="ebpf_global_udp_bandwidth_call"></div>'
    },

    'ip.total_udp_bandwidth': {
        info: '使用UDP内部函数发送和接收的总字节数。 ' +
        '如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示UDP带宽的指标。' +
        ebpfChartProvides + '<div id="ebpf_global_bandwidth_udp_sendmsg"></div>'
    },

    'ip.udp_error': {
        info: 'UDP带宽的失败调用次数。 ' +
        '如果启用了应用程序或cgroup（systemd服务）插件，则Netdata会根据每个应用程序和cgroup（systemd服务）显示UDP错误。' + ebpfChartProvides + '<div id="ebpf_global_udp_bandwidth_error"></div>'
    },

    'ip.tcpreorders': {
        info: '<p>TCP通过将数据包按正确顺序进行排序或请求重传乱序数据包来防止乱序数据包。</p>' +
        '<p><b>时间戳</b> - 使用时间戳选项检测到乱序。 ' +
        '<b>SACK</b> - 使用选择性确认算法检测到乱序。 ' +
        '<b>FACK</b> - 使用前向确认算法检测到乱序。 ' +
        '<b>Reno</b> - 使用快速重传算法检测到乱序。</p>'
    },

    'ip.tcpofo': {
        info: '<p>TCP维护一个乱序队列，用于保存TCP通信中的乱序数据包。</p>' +
        '<p><b>在队列中</b> - TCP层接收到一个乱序数据包，并且有足够的内存来排队。 ' +
        '<b>丢弃</b> - TCP层接收到一个乱序数据包，但没有足够的内存，因此将其丢弃。 ' +
        '<b>合并</b> - 接收到的乱序数据包与前一个数据包存在重叠部分。 ' +
        '重叠部分将被丢弃。所有这些数据包也将计入<b>在队列中</b>。 ' +
        '<b>修剪</b> - 因套接字缓冲区溢出而从乱序队列中丢弃的数据包。</p>'
    },

    'ip.tcpsyncookies': {
        info: '<p><a href="https://en.wikipedia.org/wiki/SYN_cookies" target="_blank">SYN cookies</a> ' +
        '用于缓解SYN cookies攻击。</p>' +
        '<p><b>已接收</b> - 发送SYN cookie后，它返回给我们并通过了检查。 ' +
        '<b>已发送</b> - 应用程序无法快速接受连接，因此内核无法为此连接在队列中存储条目。 ' +
        '内核不会将其丢弃，而是向客户端发送了一个SYN cookie。 ' +
        '<b>失败</b> - 从SYN cookie解码出的MSS无效。 当增加此计数器时， ' +
        '接收到的数据包将不会被视为SYN cookie。</p>'
    },
    'ip.tcpmemorypressures': {
        info: 'The number of times a socket was put in memory pressure due to a non fatal memory allocation failure '+
        '(the kernel attempts to work around this situation by reducing the send buffers, etc).'
    },
    'ip.tcpconnaborts': {
        info: '<p>TCP连接中止。</p>' +
        '<p><b>BadData</b> - 发生在连接处于FIN_WAIT1状态时，内核收到一个序列号超过此连接的最后一个序列号的数据包时 - ' +
        '内核会响应RST（关闭连接）。 ' +
        '<b>UserClosed</b> - 当内核在已关闭的连接上接收到数据时发生，并且会响应RST。 ' +
        '<b>NoMemory</b> - 当存在太多的孤立套接字（未附加到文件描述符）时发生，并且内核必须丢弃一个连接 - 有时会发送RST，有时不会。 ' +
        '<b>Timeout</b> - 当连接超时时发生。 ' +
        '<b>Linger</b> - 当内核终止一个已由应用程序关闭且在周围持续时间足够长的套接字时发生。 ' +
        '<b>Failed</b> - 当内核尝试发送RST但因没有可用内存而失败时发生。</p>'
    },

    'ip.tcp_syn_queue': {
        info: '<p>内核的SYN队列跟踪TCP握手，直到连接完全建立. ' +
        '当太多传入的 TCP 连接请求挂在半开状态并且服务器挂起时就会溢出' +
        '未配置为回退到 SYN cookie。溢出通常是由 SYN Flood DoS 攻击引起的。</p>' +
        '<p><b>丢弃</b> - 由于 SYN 队列已满且 SYN cookie 被禁用而丢弃的连接数。 ' +
        '<b>Cookies</b> - 由于 SYN 队列已满而发送的 SYN cookie 数量。</p>'
    },

    'ip.tcp_accept_queue': {
        info: '<p>内核的接受队列保存完全建立的TCP连接，等待处理 ' +
        '由侦听应用程序处理。</p><b>溢出</b> - 由于侦听应用程序的接收队列已满而无法处理的已建立连接数。 <b>丢弃</b> - 无法处理的传入连接数，包括 SYN 泛洪、溢出、内存不足、安全问题、没有到达目的地的路由、接收相关 ICMP 消息、套接字是广播或多播。< /p>'
    },


    // ------------------------------------------------------------------------
    // IPv4

    'ipv4.packets': {
        info: '<p>此主机的IPv4数据包统计信息.</p>'+
        '<p><b>已接收</b> - IP层接收的数据包。 ' +
        '即使数据包稍后被丢弃，该计数器也会增加。 ' +
        '<b>已发送</b> - 通过 IP 层发送的数据包，适用于单播和多播数据包。 ' +
        '此计数器不包括<b>转发</b>中计数的任何数据包。 ' +
        '<b>转发</b> - 该主机不是其最终 IP 目的地的输入数据包，' +
        '因此，我们试图找到一条路线将他们运送到最终目的地。 ' +
        '在不充当 IP 网关的主机中，此计数器将仅包括那些被 ' +
        '<a href="https://en.wikipedia.org/wiki/Source_routing" target="_blank">源路由</a> ' +
        '并且源路由选项处理成功。 ' +
        '<b>已交付</b> - 数据包交付到上层协议，例如TCP、UDP、ICMP 等。</p>'
    },

    'ipv4.fragsout': {
        info: '<p><a href="https://en.wikipedia.org/wiki/IPv4#Fragmentation" target="_blank">IPv4碎片</a> '+
        '此系统的统计信息.</p>'+
        '<p><b>OK</b> - 数据包已成功分段。 ' +
        '<b>失败</b> - 数据包因需要分段而被丢弃 ' +
        '但不可能，例如由于设置了<i>不分段</i> (DF) 标志。 ' +
        '<b>已创建</b> - 由于碎片而生成的碎片。</p>'
    },

    'ipv4.fragsin': {
        info: '<p><a href="https://en.wikipedia.org/wiki/IPv4#Reassemble" target="_blank">IPv4 重组</a> '+
        '该系统的统计数据。</p>'+
        '<p><b>OK</b> - 数据包已成功重组。 '+
        '<b>Failed</b> - IP 重组算法检测到的失败。 '+
        '这不一定是丢弃的 IP 片段的计数，因为某些算法'+
        '在收到碎片时将其合并，可能会丢失碎片的数量。 '+
        '<b>全部</b> - 收到需要重新组装的 IP 片段。</p>'
    },

    'ipv4.errors': {
        info: '<p>丢弃的IPv4数据包数.</p>'+
        '<p><b>InDiscards</b>、<b>OutDiscards</b> - 选择的入站和出站数据包 ' +
        '即使没有错误也被丢弃' +
        '检测到以防止它们被传送到更高层协议。 ' +
        '<b>InHdrErrors</b> - 由于 IP 标头错误而被丢弃的输入数据包，包括 ' +
        '错误的校验和，版本号不匹配，其他格式错误，超出生存时间，' +
        '在处理其 IP 选项等时发现的错误' +
        '<b>OutNoRoutes</b> - 由于找不到路由而被丢弃的数据包 ' +
        '将它们传送到目的地。这包括主机无法路由的任何数据包 ' +
        '因为它的所有默认网关都已关闭。 ' +
        '<b>InAddrErrors</b> - 由于无效 IP 地址或 ' + '而被丢弃的输入数据包' +
        '目标IP地址不是本地地址并且未启用IP转发。 '+
        '<b>InUnknownProtos</b> - 由于未知或不受支持的协议而被丢弃的输入数据包。</p>'
    },

    'ipv4.icmp': {
        info: '<p>传输的IPv4 ICMP消息数.</p>'+
        '<p><b>已接收</b>、<b>已发送</b> - 主机接收并尝试发送的 ICMP 消息。 '+
        '这两个计数器都有错误。</p>'
    },

    'ipv4.icmp_errors': {
        info: '<p>IPv4 ICMP错误数.</p>'+
        '<p><b>InErrors</b> - 收到 ICMP 消息，但确定存在 ICMP 特定错误，例如错误的 ICMP 校验和、错误的长度等。 <b>OutErrors</b> - 由于 ICMP 中发现的问题（例如缺少缓冲区），该主机未发送 ICMP 消息。此计数器不包括在 ICMP 层外部发现的错误，例如 IP 无法路由结果数据报。 <b>InCsumErrors</b> - 收到校验和错误的 ICMP 消息。</p>'
    },

    'ipv4.icmpmsg': {
        info: '转入数量'+
        '<a href="https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml" target="_blank">IPv4 ICMP 控制消息</a>。'
    },

    'ipv4.udppackets': {
        info: '传输的UDP数据包数.'
    },

    'ipv4.udperrors': {
        info: '<p>传输 UDP 数据包时遇到的错误数。</p>'+
        '<b>RcvbufErrors</b> - 接收缓冲区已满。 '+
        '<b>SndbufErrors</b> - 发送缓冲区已满，没有可用的内核内存，或 '+
        'IP 层在尝试发送数据包时报告错误，并且尚未设置错误队列。 '+
        '<b>InErrors</b> - 这是所有错误的聚合计数器，不包括 <b>NoPorts</b>。 '+
        '<b>NoPorts</b> - 没有应用程序正在侦听目标端口。 '+
        '<b>InCsumErrors</b> - 检测到 UDP 校验和失败。 '+
        '<b>IgnoredMulti</b> - 忽略多播数据包。'
    },

    'ipv4.udplite': {
        info: '传输的UDP Lite数据包数.'
    },

    'ipv4.udplite_errors': {
        info: '<p>传输 UDP-Lite 数据包时遇到的错误数。</p>'+
        '<b>RcvbufErrors</b> - 接收缓冲区已满。 '+
        '<b>SndbufErrors</b> - 发送缓冲区已满，没有可用的内核内存，或 '+
        'IP 层在尝试发送数据包时报告错误，并且尚未设置错误队列。 '+
        '<b>InErrors</b> - 这是所有错误的聚合计数器，不包括 <b>NoPorts</b>。 '+
        '<b>NoPorts</b> - 没有应用程序正在侦听目标端口。 '+
        '<b>InCsumErrors</b> - 检测到 UDP 校验和失败。 '+
        '<b>IgnoredMulti</b> - 忽略多播数据包。'
    },

    'ipv4.tcppackets': {
        info: '<p>TCP层传输的数据包数.</p>'+
        '</p><b>已接收</b> - 已接收的数据包，包括错误接收的数据包，'+
        '比如校验和错误、无效的 TCP 标头等等。 '+
        '<b>已发送</b> - 已发送的数据包，不包括重传的数据包。 '+
        '但它包括 SYN、ACK 和 RST 数据包。</p>'
    },

    'ipv4.tcpsock': {
        info: '当前状态为 ESTABLISHED 或 CLOSE-WAIT 的 TCP 连接数。 '+
        '这是测量时已建立连接的快照'+
        '（即在同一迭代内建立的连接和断开的连接不会影响此指标）。'
    },

    'ipv4.tcpopens': {
        info: '<p>TCP连接统计信息.</p>'+
        '<p><b>活动</b> - 该主机尝试的传出 TCP 连接数。 ' +
        '<b>被动</b> - 该主机接受的传入 TCP 连接数。</p>'
    },

    'ipv4.tcperrors': {
        info: '<p>TCP错误.</p>'+
        '<p><b>InErrs</b> - TCP 段接收错误'+
        '（包括报头太小、校验和错误、序列错误、坏数据包 - 对于 IPv4 和 IPv6）。 '+
        '<b>InCsumErrors</b> - 收到的 TCP 段存在校验和错误（对于 IPv4 和 IPv6）。 '+
        '<b>RetransSegs</b> - TCP 段重新传输。</p>'
    },

    'ipv4.tcphandshake': {
        info: '<p>TCP握手统计信息.</p>'+
        '<p><b>EstabResets</b> - 已建立的连接重置 ' +
        '（即从 ESTABLISHED 或 CLOSE_WAIT 直接转换为 CLOSED 的连接）。 ' +
        '<b>OutRsts</b> - 发送的 TCP 段，设置了 RST 标志（适用于 IPv4 和 IPv6）。 ' +
        '<b>AttemptFails</b> - TCP 连接从任一直接转换的次数' +
        'SYN_SENT 或 SYN_RECV 到 CLOSED，加上 TCP 连接直接转换的次数 '+
        '从 SYN_RECV 到 LISTEN。 ' +
        '<b>SynRetrans</b> - 显示新出站 TCP 连接的重试，' +
        '这可以表明一般连接问题或远程主机上的积压。</p>'
    },

    'ipv4.sockstat_sockets': {
        info: '所有已用套接字的总数 '+
        '<a href="https://man7.org/linux/man-pages/man7/address_families.7.html" target="_blank">address families</a> '+
        'in this system.'
    },

    'ipv4.sockstat_tcp_sockets': {
        info: '<p>系统中特定位置的TCP套接字数 '+
        '<a href="https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Protocol_operation" target="_blank">状态</a>。</p>'+
        '<p><b>Alloc</b> - 处于任何 TCP 状态。 '+
        '<b>孤立</b> - 不再附加到任何用户进程中的套接字描述符，'+
        '但内核仍然需要维护状态才能完成传输协议。 '+
        '<b>InUse</b> - 处于任何 TCP 状态，不包括 TIME-WAIT 和 CLOSED。 '+
        '<b>TimeWait</b> - 处于 TIME-WAIT 状态。</p>'
    },

    'ipv4.sockstat_tcp_mem': {
        info: '分配的TCP套接字使用的内存量.'
    },

    'ipv4.sockstat_udp_sockets': {
        info: '使用的UDP套接字数.'
    },

    'ipv4.sockstat_udp_mem': {
        info: '分配的UDP套接字使用的内存量.'
    },

    'ipv4.sockstat_udplite_sockets': {
        info: '使用的UDP Lite套接字数.'
    },

    'ipv4.sockstat_raw_sockets': {
        info: '使用的数量 <a href="https://en.wikipedia.org/wiki/Network_socket#Types" target="_blank"> 采用原始套接字</a>.'
    },

    'ipv4.sockstat_frag_sockets': {
        info: '哈希表中用于数据包重组的条目数.'
    },

    'ipv4.sockstat_frag_mem': {
        info: '用于数据包重组的内存量.'
    },

    // ------------------------------------------------------------------------
    // IPv6

    'ipv6.packets': {
        info: '<p>此主机的IPv6数据包统计信息.</p>'+
        '<p><b>已接收</b> - IP层接收的数据包。 ' +
        '即使数据包稍后被丢弃，该计数器也会增加。 ' +
        '<b>已发送</b> - 通过 IP 层发送的数据包，适用于单播和多播数据包。 ' +
        '此计数器不包括<b>转发</b>中计数的任何数据包。 ' +
        '<b>转发</b> - 该主机不是其最终 IP 目的地的输入数据包，' +
        '因此，我们试图找到一条路线将他们运送到最终目的地。 ' +
        '在不充当 IP 网关的主机中，此计数器将仅包括那些被 ' +
        '<a href="https://en.wikipedia.org/wiki/Source_routing" target="_blank">源路由</a> ' +
        '并且源路由选项处理成功。 ' +
        '<b>Delivers</b> - 数据包传送到上层协议，例如TCP、UDP、ICMP 等。</p>'
    },

    'ipv6.fragsout': {
        info: '<p><a href="https://en.wikipedia.org/wiki/IP_fragmentation" target="_blank">IPv6碎片</a> '+
        '此系统的统计信息.</p>'+
        '<p><b>OK</b> - 数据包已成功分段。 ' +
        '<b>失败</b> - 数据包因需要分段而被丢弃 ' +
        '但不可能，例如由于设置了<i>不分段</i> (DF) 标志。 ' +
        '<b>全部</b> - 由于碎片而生成的碎片。</p>'
    },

    'ipv6.fragsin': {
        info: '<p><a href="https://en.wikipedia.org/wiki/IP_fragmentation" target="_blank">IPv6重新组装</a> '+
        '此系统的统计信息.</p>'+
        '<p><b>OK</b> - 数据包已成功重组。 ' +
        '<b>失败</b> - IP 重组算法检测到的失败。 ' +
        '这不一定是丢弃的 IP 片段的计数，因为某些算法' +
        '在收到碎片时将其合并，可能会丢失碎片的数量。 ' +
        '<b>超时</b> - 检测到重组超时。 ' +
        '<b>全部</b> - 收到需要重新组装的 IP 片段。</p>'
    },

    'ipv6.errors': {
        info: '<p>丢弃的 IPv6 数据包数。</p><p><b>InDiscards</b>、<b>OutDiscards</b> - 即使没有检测到错误，也选择丢弃的数据包以防止它们被传送到更高层协议。 <b>InHdrErrors</b> - IP 标头中的错误，包括错误的校验和、版本号不匹配、其他格式错误、超出生存时间等。 <b>InAddrErrors</b> - 无效的 IP 地址或目标IP 地址不是本地地址，且未启用 IP 转发。 <b>InUnknownProtos</b> - 未知或不受支持的协议。 <b>InTooBigErrors</b> - 大小超出了链接 MTU。 <b>InTruncatedPkts</b> - 数据包帧未携带足够的数据。 <b>InNoRoutes</b> - 转发时找不到路由。 <b>OutNoRoutes</b> - 找不到该主机生成的数据包的路由。</p>'
    },

    'ipv6.udppackets': {
        info: '传输的UDP数据包数.'
    },

    'ipv6.udperrors': {
        info: '<p>传输UDP数据包期间遇到错误数。</p><b>RcvbufErrors</b> - 接收缓冲区已满。 <b>SndbufErrors</b> - 发送缓冲区已满，没有可用的内核内存，或者IP层在尝试发送数据包时报告错误并且尚未设置错误队列。 <b>InErrors</b> - 这是所有错误的聚合计数器，不包括 <b>NoPorts</b>。 <b>NoPorts</b> - 没有应用程序正在侦听目标端口。 <b>InCsumErrors</b> - 检测到 UDP 校验和失败。 <b>IgnoredMulti</b> - 忽略多播数据包。'
    },

    'ipv6.udplitepackets': {
        info: '传输的UDP Lite数据包数.'
    },

    'ipv6.udpliteerrors': {
        info: '<p>在传输UDP Lite数据包时遇到的错误数。</p>' +
        '<p><b>RcvbufErrors</b> - 接收缓冲区已满。' +
        '<b>SndbufErrors</b> - 发送缓冲区已满，没有可用的内核内存，或' +
        'IP层在尝试发送数据包时报告了错误，并且没有设置错误队列。' +
        '<b>InErrors</b> - 这是所有错误的聚合计数器，不包括<b>NoPorts</b>。' +
        '<b>NoPorts</b> - 目标端口没有应用程序在监听。' +
        '<b>InCsumErrors</b> - 检测到UDP校验和失败。</p>'
    },

    'ipv6.mcast': {
        info: 'IPv6多播通信总量.'
    },

    'ipv6.bcast': {
        info: 'IPv6广播总流量.'
    },

    'ipv6.mcastpkts': {
        info: '传输的IPv6多播数据包总数.'
    },

    'ipv6.icmp': {
        info: '<p>传输的ICMPv6消息数.</p>'+
        '<p><b>已接收</b>、<b>已发送</b> - 主机接收并尝试发送的 ICMP 消息。 ' +
        '这两个计数器都有错误。</p>'
    },

    'ipv6.icmpredir': {
        info: '传输的ICMPv6重定向消息数. '+
        'These messages inform a host to update its routing information (to send packets on an alternative route).'
    },

    'ipv6.icmpechos': {
        info: '传输的ICMPv6重定向消息数.'
    },

    'ipv6.icmperrors': {
        info: '<p>ICMPv6错误数和<a href="https://www.rfc-editor.org/rfc/rfc4443.html#section-3" target="_blank">错误消息</a>。</p ><p><b>InErrors</b>、<b>OutErrors</b> - 错误的 ICMP 消息（错误的 ICMP 校验和、错误的长度等）。 <b>InCsumErrors</b> - 校验和错误。</p>'
    },

    'ipv6.groupmemb': {
        info: '<p>传输的ICMPv6组成员身份消息数。</p>' +
        '<p>多播路由器发送组成员身份查询消息，以了解每个连接的物理网络上有哪些组成员。主机通过为主机加入的每个多播组发送组成员报告来响应。主机计算机在加入新的多播组时也可以发送组成员报告。当主机计算机离开多播组时，将发送组成员减少消息。</p>'
    },

    'ipv6.icmprouter': {
        info: '<p>传输的ICMPv6的数量<a href="https://en.wikipedia.org/wiki/Neighbor_Discovery_Protocol" target="_blank">路由器发现</a>消息。</p><p>路由器<b>请求</b>消息从计算机主机发送到局域网上的任何路由器，以请求它们在网络上通告它们的存在。路由器<b>通告</b>消息由局域网上的路由器发送，以宣布其 IP 地址可用于路由。</p>'
    },

    'ipv6.icmpneighbor': {
        info: '<p>传输的ICMPv6的数量<a href="https://en.wikipedia.org/wiki/Neighbor_Discovery_Protocol" target="_blank">邻居发现</a>消息。</p><p>邻居<b>请求</b>由节点用来确定邻居的链路层地址，或者验证邻居是否仍然可以通过缓存的链路层地址到达。节点使用邻居<b>广告</b>来响应邻居请求消息。</p>'
    },

    'ipv6.icmpmldv2': {
        info: '传输的ICMPv6的数量'+
        '<a href="https://en.wikipedia.org/wiki/Multicast_Listener_Discovery" target="_blank">Multicast Listener Discovery</a> (MLD) messages.'
    },

    'ipv6.icmptypes': {
        info: '已传输的ICMPv6消息数 '+
        '<a href="https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol_for_IPv6#Types" target="_blank">certain types</a>.'
    },

    'ipv6.ect': {
        info: '<p>系统中设置了ECN位的已接收IPv6数据包总数.</p>'+
        '<p><b>CEP</b> - 遇到拥塞。 '+
        '<b>NoECTP</b> - 不支持 ECN 的传输。 '+
        '<b>ECTP0</b> 和 <b>ECTP1</b> - 支持 ECN 的传输。</p>'
    },

    'ipv6.sockstat6_tcp_sockets': {
        info: '任何<a href="https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Protocol_operation" target="_blank">状态</a>中的TCP套接字数量，不包括TIME-WAIT和CLOSED状态。'
    },

    'ipv6.sockstat6_udp_sockets': {
        info: '使用的UDP套接字数.'
    },

    'ipv6.sockstat6_udplite_sockets': {
        info: '使用的UDP Lite套接字数.'
    },

    'ipv6.sockstat6_raw_sockets': {
        info: '使用的数量 <a href="https://en.wikipedia.org/wiki/Network_socket#Types" target="_blank"> raw sockets</a>.'
    },

    'ipv6.sockstat6_frag_sockets': {
        info: '哈希表中用于数据包重组的条目数.'
    },


    // ------------------------------------------------------------------------
    // SCTP

    'sctp.established': {
        info: 'The number of associations for which the current state is either '+
        'ESTABLISHED, SHUTDOWN-RECEIVED or SHUTDOWN-PENDING.'
    },

    'sctp.transitions': {
        info: '<p>协会在国家间直接过渡的次数.</p>'+
        '<p><b>Active</b> - from COOKIE-ECHOED to ESTABLISHED. The upper layer initiated the association attempt. '+
        '<b>Passive</b> - from CLOSED to ESTABLISHED. The remote endpoint initiated the association attempt. '+
        '<b>Aborted</b> - from any state to CLOSED using the primitive ABORT. Ungraceful termination of the association. '+
        '<b>Shutdown</b> - from SHUTDOWN-SENT or SHUTDOWN-ACK-SENT to CLOSED. Graceful termination of the association.</p>'
    },

    'sctp.packets': {
        info: '<p>传输的SCTP数据包数.</p>'+
        '<p><b>Received</b> - includes duplicate packets. '+
        '<b>Sent</b> - includes retransmitted DATA chunks.</p>'
    },

    'sctp.packet_errors': {
        info: '<p>接收SCTP数据包期间遇到的错误数.</p>'+
        '<p><b>Invalid</b> - packets for which the receiver was unable to identify an appropriate association. '+
        '<b>Checksum</b> - packets with an invalid checksum.</p>'
    },

    'sctp.fragmentation': {
        info: '<p>分段和重新组合的SCTP消息数.</p>'+
        '<p><b>Reassembled</b> - reassembled user messages, after conversion into DATA chunks. '+
        '<b>Fragmented</b> - user messages that have to be fragmented because of the MTU.</p>'
    },

    'sctp.chunks': {
        info: '传输的控制、有序和无序数据块的数量. '+
        'Retransmissions and duplicates are not included.'
    },

    // ------------------------------------------------------------------------
    // Netfilter Connection Tracker

    'netfilter.conntrack_sockets': {
        info: 'conntrack表中的条目数.'
    },

    'netfilter.conntrack_new': {
        info: '<p>数据包跟踪统计信息。 <b>New</b>（自 v4.9 起）和 <b>Ignore</b>（自 v5.10 起）在最新内核中被硬编码为零。</p>'+
        '<p><b>新</b> - 添加了之前未预料到的 conntrack 条目。 '+
        '<b>忽略</b> - 发现已连接到 conntrack 条目的数据包。 '+
        '<b>无效</b> - 发现无法跟踪的数据包。</p>'
    },

    'netfilter.conntrack_changes': {
        info: '<p>conntrack表中的更改数字。</p><p><b>插入</b>，<b>删除</b> - 插入或删除的conntrack条目。 <b>Delete-list</b> - conntrack 被放入删除列表的条目。</p>'
    },

    'netfilter.conntrack_expect': {
        info: '<p>“预期”表中的事件数。 '+
        '连接跟踪期望是用于“期望”与现有连接相关的连接的机制。 '+
        '期望是指预计在一段时间内发生的联系。</p>'+
        '<p><b>已创建</b>、<b>已删除</b> - conntrack 插入或删除的条目。 '+
        '<b>新</b> - 在预期的 conntrack 条目已经存在后添加。</p>'
    },

    'netfilter.conntrack_search': {
        info: '<p>Conntrack表查找统计信息。</p>'+
        '<p><b>搜索</b> - 执行 conntrack 表查找。 '+
        '<b>重新启动</b> - 由于哈希表大小调整而必须重新启动的 conntrack 表查找。 '+
        '<b>找到</b> - conntrack 成功的表查找。</p>'
    },

    'netfilter.conntrack_errors': {
        info: '<p>Conntrack错误.</p>'+
        '<p><b>IcmpError</b> - 由于错误情况而无法跟踪的数据包。 '+
        '<b>InsertFailed</b> - 尝试插入列表但失败的条目 '+
        '（如果相同的条目已经存在，则会发生）。 '+
        '<b>丢弃</b> - 由于 conntrack 失败而丢弃的数据包。 '+
        '新的 conntrack 条目分配失败，或者协议帮助程序丢弃了数据包。 '+
        '<b>EarlyDrop</b> - 如果达到最大表大小，则删除 conntrack 条目以为新条目腾出空间。</p>'
    },

    'netfilter.synproxy_syn_received': {
        info: '从客户端接收的初始TCP SYN数据包数.'
    },

    'netfilter.synproxy_conn_reopened': {
        info: '新TCP SYN数据包直接从TIME-WAIT状态重新打开的连接数.'
    },

    'netfilter.synproxy_cookies': {
        info: '<p>SYNPROXY cookie统计信息.</p>'+
        '<p><b>Valid</b>, <b>Invalid</b> - result of cookie validation in TCP ACK packets received from clients. '+
        '<b>Retransmits</b> - TCP SYN packets retransmitted to the server. '+
        'It happens when the client repeats TCP ACK and the connection to the server is not yet established.</p>'
    },

    // ------------------------------------------------------------------------
    // APPS (Applications, Groups, Users)

    // APPS cpu
    'apps.cpu': {
        info: 'CPU 总利用率（所有核心）。它包括用户、系统和访客时间。'
    },
    'groups.cpu': {
        info: 'CPU 总利用率（所有核心）。它包括用户、系统和访客时间。'
    },
    'users.cpu': {
        info: 'CPU 总利用率（所有核心）。它包括用户、系统和访客时间。'
    },

    'apps.cpu_user': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">用户模式</a>（所有核心）。'
    },
    'groups.cpu_user': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">用户模式</a>（所有核心）。'
    },
    'users.cpu_user': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">用户模式</a>（所有核心）。'
    },

    'apps.cpu_system': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">内核模式</a>（所有内核）。'
    },
    'groups.cpu_system': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">内核模式</a>（所有内核）。'
    },
    'users.cpu_system': {
        info: 'The amount of time the CPU was busy executing code in '+
        '<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">内核模式</a>（所有内核）。'
    },

    'apps.cpu_guest': {
        info: '为客户操作系统（所有内核）运行虚拟 CPU 所花费的时间。'
    },
    'groups.cpu_guest': {
        info: '为客户操作系统（所有内核）运行虚拟 CPU 所花费的时间。'
    },
    'users.cpu_guest': {
        info: '为客户操作系统（所有内核）运行虚拟 CPU 所花费的时间。'
    },

    // APPS disk
    'apps.preads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'Actual physical disk I/O was required.'
    },
    'groups.preads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'Actual physical disk I/O was required.'
    },
    'users.preads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'Actual physical disk I/O was required.'
    },

    'apps.pwrites': {
        info: 'The amount of data that has been written to the storage layer. '+
        'Actual physical disk I/O was required.'
    },
    'groups.pwrites': {
        info: 'The amount of data that has been written to the storage layer. '+
        'Actual physical disk I/O was required.'
    },
    'users.pwrites': {
        info: 'The amount of data that has been written to the storage layer. '+
        'Actual physical disk I/O was required.'
    },

    'apps.lreads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required '+
        '(the read might have been satisfied from pagecache).'
    },
    'groups.lreads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required '+
        '(the read might have been satisfied from pagecache).'
    },
    'users.lreads': {
        info: 'The amount of data that has been read from the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required '+
        '(the read might have been satisfied from pagecache).'
    },

    'apps.lwrites': {
        info: 'The amount of data that has been written or shall be written to the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required.'
    },
    'groups.lwrites': {
        info: 'The amount of data that has been written or shall be written to the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required.'
    },
    'users.lwrites': {
        info: 'The amount of data that has been written or shall be written to the storage layer. '+
        'It includes things such as terminal I/O and is unaffected by whether or '+
        'not actual physical disk I/O was required.'
    },

    'apps.files': {
        info: 'The number of open files and directories.'
    },
    'groups.files': {
        info: 'The number of open files and directories.'
    },
    'users.files': {
        info: 'The number of open files and directories.'
    },

    // APPS mem
    'apps.mem': {
        info: 'Real memory (RAM) used by applications. This does not include shared memory.'
    },
    'groups.mem': {
        info: 'Real memory (RAM) used per user group. This does not include shared memory.'
    },
    'users.mem': {
        info: 'Real memory (RAM) used per user group. This does not include shared memory.'
    },

    'apps.vmem': {
        info: 'Virtual memory allocated by applications. '+
        'Check <a href="https://github.com/netdata/netdata/tree/master/daemon#virtual-memory" target="_blank">this article</a> for more information.'
    },
    'groups.vmem': {
        info: 'Virtual memory allocated per user group since the Netdata restart. Please check <a href="https://github.com/netdata/netdata/tree/master/daemon#virtual-memory" target="_blank">this article</a> for more information.'
    },
    'users.vmem': {
        info: 'Virtual memory allocated per user group since the Netdata restart. Please check <a href="https://github.com/netdata/netdata/tree/master/daemon#virtual-memory" target="_blank">this article</a> for more information.'
    },

    'apps.minor_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Minor" target="_blank">minor faults</a> '+
        'which have not required loading a memory page from the disk. '+
        'Minor page faults occur when a process needs data that is in memory and is assigned to another process. '+
        'They share memory pages between multiple processes – '+
        'no additional data needs to be read from disk to memory.'
    },
    'groups.minor_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Minor" target="_blank">minor faults</a> '+
        'which have not required loading a memory page from the disk. '+
        'Minor page faults occur when a process needs data that is in memory and is assigned to another process. '+
        'They share memory pages between multiple processes – '+
        'no additional data needs to be read from disk to memory.'
    },
    'users.minor_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Minor" target="_blank">minor faults</a> '+
        'which have not required loading a memory page from the disk. '+
        'Minor page faults occur when a process needs data that is in memory and is assigned to another process. '+
        'They share memory pages between multiple processes – '+
        'no additional data needs to be read from disk to memory.'
    },

    // APPS processes
    'apps.threads': {
        info: '<a href="https://en.wikipedia.org/wiki/Thread_(computing)" target="_blank">线程数</a>。'
    },
    'groups.threads': {
        info: '<a href="https://en.wikipedia.org/wiki/Thread_(computing)" target="_blank">线程数</a>。'
    },
    'users.threads': {
        info: '<a href="https://en.wikipedia.org/wiki/Thread_(computing)" target="_blank">线程数</a>。'
    },

    'apps.processes': {
        info: '<a href="https://en.wikipedia.org/wiki/Process_(computing)" target="_blank">进程数</a>。'
    },
    'groups.processes': {
        info: '<a href="https://en.wikipedia.org/wiki/Process_(computing)" target="_blank">进程数</a>。'
    },
    'users.processes': {
        info: '<a href="https://en.wikipedia.org/wiki/Process_(computing)" target="_blank">进程数</a>。'
    },

    'apps.uptime': {
        info: '组中至少有一个进程运行的时间段。'
    },
    'groups.uptime': {
        info: '组中至少有一个进程运行的时间段。'
    },
    'users.uptime': {
        info: '组中至少有一个进程运行的时间段。'
    },

    'apps.uptime_min': {
        info: '该组进程中正常运行时间最短。'
    },
    'groups.uptime_min': {
        info: '该组进程中正常运行时间最短。'
    },
    'users.uptime_min': {
        info: '该组进程中正常运行时间最短。'
    },

    'apps.uptime_avg': {
        info: 'The average uptime of processes in the group.'
    },
    'groups.uptime_avg': {
        info: 'The average uptime of processes in the group.'
    },
    'users.uptime_avg': {
        info: 'The average uptime of processes in the group.'
    },

    'apps.uptime_max': {
        info: 'The longest uptime among processes in the group.'
    },
    'groups.uptime_max': {
        info: 'The longest uptime among processes in the group.'
    },
    'users.uptime_max': {
        info: 'The longest uptime among processes in the group.'
    },

    'apps.pipes': {
        info: 'The number of open '+
        '<a href="https://en.wikipedia.org/wiki/Anonymous_pipe#Unix" target="_blank">pipes</a>. '+
        'A pipe is a unidirectional data channel that can be used for interprocess communication.'
    },
    'groups.pipes': {
        info: 'The number of open '+
        '<a href="https://en.wikipedia.org/wiki/Anonymous_pipe#Unix" target="_blank">pipes</a>. '+
        'A pipe is a unidirectional data channel that can be used for interprocess communication.'
    },
    'users.pipes': {
        info: 'The number of open '+
        '<a href="https://en.wikipedia.org/wiki/Anonymous_pipe#Unix" target="_blank">pipes</a>. '+
        'A pipe is a unidirectional data channel that can be used for interprocess communication.'
    },

    // APPS swap
    'apps.swap': {
        info: 'The amount of swapped-out virtual memory by anonymous private pages. '+
        'This does not include shared swap memory.'
    },
    'groups.swap': {
        info: 'The amount of swapped-out virtual memory by anonymous private pages. '+
        'This does not include shared swap memory.'
    },
    'users.swap': {
        info: 'The amount of swapped-out virtual memory by anonymous private pages. '+
        'This does not include shared swap memory.'
    },

    'apps.major_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Major" target="_blank">major faults</a> '+
        'which have required loading a memory page from the disk. '+
        'Major page faults occur because of the absence of the required page from the RAM. '+
        'They are expected when a process starts or needs to read in additional data and '+
        'in these cases do not indicate a problem condition. '+
        'However, a major page fault can also be the result of reading memory pages that have been written out '+
        'to the swap file, which could indicate a memory shortage.'
    },
    'groups.major_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Major" target="_blank">major faults</a> '+
        'which have required loading a memory page from the disk. '+
        'Major page faults occur because of the absence of the required page from the RAM. '+
        'They are expected when a process starts or needs to read in additional data and '+
        'in these cases do not indicate a problem condition. '+
        'However, a major page fault can also be the result of reading memory pages that have been written out '+
        'to the swap file, which could indicate a memory shortage.'
    },
    'users.major_faults': {
        info: 'The number of <a href="https://en.wikipedia.org/wiki/Page_fault#Major" target="_blank">major faults</a> '+
        'which have required loading a memory page from the disk. '+
        'Major page faults occur because of the absence of the required page from the RAM. '+
        'They are expected when a process starts or needs to read in additional data and '+
        'in these cases do not indicate a problem condition. '+
        'However, a major page fault can also be the result of reading memory pages that have been written out '+
        'to the swap file, which could indicate a memory shortage.'
    },

    // APPS net
    'apps.sockets': {
        info: 'The number of open sockets. '+
        'Sockets are a way to enable inter-process communication between programs running on a server, '+
        'or between programs running on separate servers. This includes both network and UNIX sockets.'
    },
    'groups.sockets': {
        info: 'The number of open sockets. '+
        'Sockets are a way to enable inter-process communication between programs running on a server, '+
        'or between programs running on separate servers. This includes both network and UNIX sockets.'
    },
    'users.sockets': {
        info: 'The number of open sockets. '+
        'Sockets are a way to enable inter-process communication between programs running on a server, '+
        'or between programs running on separate servers. This includes both network and UNIX sockets.'
    },

   // Apps eBPF stuff

    'apps.file_open': {
        info: 'Calls to the internal function <code>do_sys_open</code> (for kernels newer than <code>5.5.19</code> we add a kprobe to <code>do_sys_openat2</code>. ), which is the common function called from' +
            ' <a href="https://www.man7.org/linux/man-pages/man2/open.2.html" target="_blank">open(2)</a> ' +
            ' and <a href="https://www.man7.org/linux/man-pages/man2/openat.2.html" target="_blank">openat(2)</a>. '
    },

    'apps.file_open_error': {
        info: 'Failed calls to the internal function <code>do_sys_open</code> (for kernels newer than <code>5.5.19</code> we add a kprobe to <code>do_sys_openat2</code>. ).'
    },

    'apps.file_closed': {
        info: 'Calls to the internal function <a href="https://elixir.bootlin.com/linux/v5.10/source/fs/file.c#L665" target="_blank">__close_fd</a> or <a href="https://elixir.bootlin.com/linux/v5.11/source/fs/file.c#L617" target="_blank">close_fd</a> according to your kernel version, which is called from' +
            ' <a href="https://www.man7.org/linux/man-pages/man2/close.2.html" target="_blank">close(2)</a>. '
    },

    'apps.file_close_error': {
        info: 'Failed calls to the internal function <a href="https://elixir.bootlin.com/linux/v5.10/source/fs/file.c#L665" target="_blank">__close_fd</a> or <a href="https://elixir.bootlin.com/linux/v5.11/source/fs/file.c#L617" target="_blank">close_fd</a> according to your kernel version.'
    },

    'apps.file_deleted': {
        info: 'Calls to the function <a href="https://www.kernel.org/doc/htmldocs/filesystems/API-vfs-unlink.html" target="_blank">vfs_unlink</a>. This chart does not show all events that remove files from the filesystem, because filesystems can create their own functions to remove files.'
    },

    'apps.vfs_write_call': {
        info: 'Successful calls to the function <a href="https://topic.alibabacloud.com/a/kernel-state-file-operation-__-work-information-kernel_8_8_20287135.html" target="_blank">vfs_write</a>. This chart may not show all filesystem events if it uses other functions to store data on disk.'
    },

    'apps.vfs_write_error': {
        info: 'Failed calls to the function <a href="https://topic.alibabacloud.com/a/kernel-state-file-operation-__-work-information-kernel_8_8_20287135.html" target="_blank">vfs_write</a>. This chart may not show all filesystem events if it uses other functions to store data on disk.'
    },

    'apps.vfs_read_call': {
        info: 'Successful calls to the function <a href="https://topic.alibabacloud.com/a/kernel-state-file-operation-__-work-information-kernel_8_8_20287135.html" target="_blank">vfs_read</a>. This chart may not show all filesystem events if it uses other functions to store data on disk.'
    },

    'apps.vfs_read_error': {
        info: 'Failed calls to the function <a href="https://topic.alibabacloud.com/a/kernel-state-file-operation-__-work-information-kernel_8_8_20287135.html" target="_blank">vfs_read</a>. This chart may not show all filesystem events if it uses other functions to store data on disk.'
    },

    'apps.vfs_write_bytes': {
        info: 'Total of bytes successfully written using the function <a href="https://topic.alibabacloud.com/a/kernel-state-file-operation-__-work-information-kernel_8_8_20287135.html" target="_blank">vfs_write</a>.'
    },

    'apps.vfs_read_bytes': {
        info: 'Total of bytes successfully written using the <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS reader function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_io_bytes">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_read_bytes">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_read_bytes"></div>'
    },
    'apps.vfs_fsync': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS syncer function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_sync">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_sync">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_sync"></div>'
    },

    'apps.vfs_fsync_error': {
        info: 'Number of failed calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS syncer function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_sync_error">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_sync_error">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_sync_error"></div>'
    },
    'apps.vfs_open': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS opener function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_open">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_open">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_open"></div>'
    },
    'apps.vfs_open_error': {
        info: 'Number of failed calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS opener function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_open_error">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_open_error">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_open_error"></div>'
    },
    'apps.vfs_create': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS creator function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_create">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_create">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_create"></div>'
    },
    'apps.vfs_create_error': {
        info: 'Number of failed calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS creator function</a>. Netdata gives a summary for this chart in ' +
            '<a href="#ebpf_global_vfs_create_error">Virtual File System</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, ' +
            'Netdata shows virtual file system per <a href="#ebpf_services_vfs_create_error">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_vfs_create_error"></div>'
    },
    'apps.process_create': {
        info: 'Calls to either <a href="https://programming.vip/docs/the-execution-procedure-of-do_fork-function-in-linux.html" target="_blank">do_fork</a>, or <code>kernel_clone</code> if you are running kernel newer than 5.9.16, to create a new task, which is the common name used to define process and tasks inside the kernel. This chart is provided by eBPF plugin.'
    },

    'apps.thread_create': {
        info: 'Calls to either <a href="https://programming.vip/docs/the-execution-procedure-of-do_fork-function-in-linux.html" target="_blank">do_fork</a>, or <code>kernel_clone</code> if you are running kernel newer than 5.9.16, to create a new task, which is the common name used to define process and tasks inside the kernel. Netdata identifies the threads monitoring tracepoint <code>sched_process_fork</code>. This chart is provided by eBPF plugin.'
    },

    'apps.task_exit': {
        info: 'Calls to the function responsible for closing (<a href="https://www.informit.com/articles/article.aspx?p=370047&seqNum=4" target="_blank">do_exit</a>) tasks. This chart is provided by eBPF plugin.'
    },

    'apps.task_close': {
        info: 'Calls to the function responsible for releasing (<a  href="https://www.informit.com/articles/article.aspx?p=370047&seqNum=4" target="_blank">release_task</a>) tasks. This chart is provided by eBPF plugin.'
    },

    'apps.task_error': {
        info: 'Number of errors to create a new <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#process-exit" target="_blank">task</a>. Netdata gives a summary for this chart in <a href="#ebpf_system_task_error">Process</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows process per <a href="#ebpf_services_task_error">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_task_error"></div>'
    },

    'apps.outbound_conn_v4': {
        info: 'Number of calls to IPV4 TCP function responsible for <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-outbound-connections" target="_blank">starting connections</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_outbound_conn">Network Stack</a>. When the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows outbound connections per <a href="#ebpf_services_outbound_conn_ipv4">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_outbound_conn_ipv4"></div>'
    },

    'apps.outbound_conn_v6': {
        info: 'Number of calls to IPV6 TCP function responsible for <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#tcp-outbound-connections" target="_blank">starting connections</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_outbound_conn">Network Stack</a>. When the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows outbound connections per <a href="#ebpf_services_outbound_conn_ipv6">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_outbound_conn_ipv6"></div>'
    },
    'apps.total_bandwidth_sent': {
        info: 'Bytes sent by functions <code>tcp_sendmsg</code> and <code>udp_sendmsg</code>.'
    },

    'apps.total_bandwidth_recv': {
        info: 'Bytes received by functions <code>tcp_cleanup_rbuf</code> and <code>udp_recvmsg</code>. We use <code>tcp_cleanup_rbuf</code> instead <code>tcp_recvmsg</code>, because this last misses <code>tcp_read_sock()</code> traffic and we would also need to have more probes to get the socket and package size.'
    },

    'apps.bandwidth_tcp_send': {
        info: 'The function <code>tcp_sendmsg</code> is used to collect number of bytes sent from TCP connections.'
    },

    'apps.bandwidth_tcp_recv': {
        info: 'The function <code>tcp_cleanup_rbuf</code> is used to collect number of bytes received from TCP connections.'
    },

    'apps.bandwidth_tcp_retransmit': {
        info: 'The function <code>tcp_retransmit_skb</code> is called when the host did not receive the expected return from a packet sent.'
    },

    'apps.bandwidth_udp_send': {
        info: 'The function <code>udp_sendmsg</code> is used to collect number of bytes sent from UDP connections.'
    },

    'apps.bandwidth_udp_recv': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#udp-functions" target="_blank">UDP</a> functions responsible to receive data. Netdata gives a summary for this chart in <a href="#ebpf_global_udp_bandwidth_call">Network Stack</a>. When the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows UDP calls per <a href="#ebpf_services_udp_recv">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_udp_recv"></div>'
    },

    'apps.cachestat_ratio' : {
        info: 'The <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#page-cache-ratio" target="_blank">ratio</a> shows the percentage of data accessed directly in memory. Netdata gives a summary for this chart in <a href="#menu_mem_submenu_page_cache">Memory</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows page cache hit per <a href="#ebpf_services_cachestat_ratio">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_cachestat_ratio"></div>'
    },

    'apps.cachestat_dirties' : {
        info: 'Number of <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#dirty-pages" target="_blank">modified pages</a> in <a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">Linux page cache</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_cachestat_dirty">Memory</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows page cache hit per <a href="#ebpf_services_cachestat_dirties">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_cachestat_dirties"></div>'
    },

    'apps.cachestat_hits' : {
        info: 'Number of <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#page-cache-hits" target="_blank">access</a> to data in <a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">Linux page cache</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_cachestat_hits">Memory</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows page cache hit per <a href="#ebpf_services_cachestat_hits">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_cachestat_hits"></div>'
    },

    'apps.cachestat_misses' : {
        info: 'Number of <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#page-cache-misses" target="_blank">access</a> to data was not present in <a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">Linux page cache</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_cachestat_misses">Memory</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows page cache misses per <a href="#ebpf_services_cachestat_misses">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_cachestat_misses"></div>'
    },

    'apps.dc_hit_ratio': {
        info: 'Percentage of file accesses that were present in the directory cache. 100% means that every file that was accessed was present in the directory cache. If files are not present in the directory cache 1) they are not present in the file system, 2) the files were not accessed before. Read more about <a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">directory cache</a>. Netdata also gives a summary for these charts in <a href="#menu_filesystem_submenu_directory_cache__eBPF_">Filesystem submenu</a>.'
    },

    'apps.dc_reference': {
        info: 'Counters of file accesses. <code>Reference</code> is when there is a file access, see the <code>filesystem.dc_reference</code> chart for more context. Read more about <a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">directory cache</a>.'
    },

    'apps.dc_not_cache': {
        info: 'Counters of file accesses. <code>Slow</code> is when there is a file access and the file is not present in the directory cache, see the <code>filesystem.dc_reference</code> chart for more context. Read more about <a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">directory cache</a>.'
    },

    'apps.dc_not_found': {
        info: 'Number of times a file was not found on the file system. Netdata gives a summary for this chart in <a href="#ebpf_dc_reference">directory cache</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows directory cache per <a href="#ebpf_services_dc_not_found">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_dc_not_found"></div>'
    },

    'apps.swap_read_call': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#swap">swap reader function</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_swap">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows swap metrics per <a href="#ebpf_services_swap_read">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_swap_read"></div>'
    },
    'apps.swap_write_call': {
        info: 'Number of calls to <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#swap">swap writer function</a>. Netdata gives a summary for this chart in <a href="#ebpf_global_swap">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows swap metrics per <a href="#ebpf_services_swap_write">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_swap_write"></div>'
    },
    'apps.shmget_call': {
        info: 'Number of calls to <code>shmget</code>. Netdata gives a summary for this chart in <a href="#ebpf_global_shm">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows shared memory metrics per <a href="#ebpf_services_shm_get">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_shm_get"></div>'
    },
    'apps.shmat_call': {
        info: 'Number of calls to <code>shmat</code>. Netdata gives a summary for this chart in <a href="#ebpf_global_shm">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows shared memory metrics per <a href="#ebpf_services_shm_at">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_shm_at"></div>'
    },
    'apps.shmdt_call': {
        info: 'Number of calls to <code>shmdt</code>. Netdata gives a summary for this chart in <a href="#ebpf_global_shm">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows shared memory metrics per <a href="#ebpf_services_shm_dt">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_shm_dt"></div>'
    },
    'apps.shmctl_call': {
        info: 'Number of calls to <code>shmctl</code>. Netdata gives a summary for this chart in <a href="#ebpf_global_shm">System Overview</a>, and when the integration is <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">enabled</a>, Netdata shows shared memory metrics per <a href="#ebpf_services_shm_ctl">cgroup (systemd Services)</a>.' + ebpfChartProvides + '<div id="ebpf_apps_shm_ctl"></div>'
    },

    // ------------------------------------------------------------------------
    // NETWORK QoS

    'tc.qos': {
        heads: [
            function (os, id) {
                void (os);

                if (id.match(/.*-ifb$/))
                    return netdataDashboard.gaugeChart('流入', '12%', '', '#5555AA');
                else
                    return netdataDashboard.gaugeChart('流出', '12%', '', '#AA9900');
            }
        ]
    },

    // ------------------------------------------------------------------------
    // NETWORK INTERFACES

    'net.net': {
        heads: [
            netdataDashboard.gaugeChart('已收到', '15%', 'received'),
            netdataDashboard.gaugeChart('已发送', '15%', 'sent'),
        ],
        info: netBytesInfo
    },
    'net.packets': {
        info: netPacketsInfo
    },
    'net.errors': {
        info: netErrorsInfo
    },
    'net.fifo': {
        info: netFIFOInfo
    },
    'net.drops': {
        info: netDropsInfo
    },
    'net.compressed': {
        info: netCompressedInfo
    },
    'net.events': {
        info: netEventsInfo
    },
    'net.duplex': {
        info: netDuplexInfo
    },
    'net.operstate': {
        info: netOperstateInfo
    },
    'net.carrier': {
        info: netCarrierInfo
    },
    'net.speed': {
        info: netSpeedInfo
    },
    'net.mtu': {
        info: netMTUInfo
    },
    'cgroup.net_net': {
        mainheads: [
            function (os, id) {
                void (os);
                    var iface;
                    try {
                        iface = ' ' + id.substring(id.lastIndexOf('.net_') + 5, id.length);
                    } catch (e) {
                        iface = '';
                    }
                return netdataDashboard.gaugeChart('已收到' + iface, '15%', 'received');

            },
            function (os, id) {
                void (os);
                    var iface;
                    try {
                        iface = ' ' + id.substring(id.lastIndexOf('.net_') + 5, id.length);
                    } catch (e) {
                        iface = '';
                    }
                return netdataDashboard.gaugeChart('已发送' + iface, '15%', 'sent');
            }
        ],
        info: netBytesInfo
    },
    'cgroup.net_packets': {
        info: netPacketsInfo
    },
    'cgroup.net_errors': {
        info: netErrorsInfo
    },
    'cgroup.net_fifo': {
        info: netFIFOInfo
    },
    'cgroup.net_drops': {
        info: netDropsInfo
    },
    'cgroup.net_compressed': {
        info: netCompressedInfo
    },
    'cgroup.net_events': {
        info: netEventsInfo
    },
    'cgroup.net_duplex': {
        info: netDuplexInfo
    },
    'cgroup.net_operstate': {
        info: netOperstateInfo
    },
    'cgroup.net_carrier': {
        info: netCarrierInfo
    },
    'cgroup.net_speed': {
        info: netSpeedInfo
    },
    'cgroup.net_mtu': {
        info: netMTUInfo
    },
    'k8s.cgroup.net_net': {
        mainheads: [
            function (_, id) {
                var iface;
                try {
                    iface = ' ' + id.substring(id.lastIndexOf('.net_') + 5, id.length);
                } catch (e) {
                    iface = '';
                }
                return netdataDashboard.gaugeChart('已收到' + iface, '15%', 'received');

            },
            function (_, id) {
                var iface;
                try {
                    iface = ' ' + id.substring(id.lastIndexOf('.net_') + 5, id.length);
                } catch (e) {
                    iface = '';
                }
                return netdataDashboard.gaugeChart('已发送' + iface, '15%', 'sent');
            }
        ],
        info: netBytesInfo
    },
    'k8s.cgroup.net_packets': {
        info: netPacketsInfo
    },
    'k8s.cgroup.net_errors': {
        info: netErrorsInfo
    },
    'k8s.cgroup.net_fifo': {
        info: netFIFOInfo
    },
    'k8s.cgroup.net_drops': {
        info: netDropsInfo
    },
    'k8s.cgroup.net_compressed': {
        info: netCompressedInfo
    },
    'k8s.cgroup.net_events': {
        info: netEventsInfo
    },
    'k8s.cgroup.net_operstate': {
        info: netOperstateInfo
    },
    'k8s.cgroup.net_duplex': {
        info: netDuplexInfo
    },
    'k8s.cgroup.net_carrier': {
        info: netCarrierInfo
    },
    'k8s.cgroup.net_speed': {
        info: netSpeedInfo
    },
    'k8s.cgroup.net_mtu': {
        info: netMTUInfo
    },

    // ------------------------------------------------------------------------
    // WIRELESS NETWORK INTERFACES

    'wireless.link_quality': {
        info: 'Overall quality of the link. '+
        'May be based on the level of contention or interference, the bit or frame error rate, '+
        'how good the received signal is, some timing synchronisation, or other hardware metric.'
    },

    'wireless.signal_level': {
        info: 'Received signal strength '+
        '(<a href="https://en.wikipedia.org/wiki/Received_signal_strength_indication" target="_blank">RSSI</a>).'
    },

    'wireless.noise_level': {
        info: 'Background noise level (when no packet is transmitted).'
    },

    'wireless.discarded_packets': {
        info: '<p>The number of discarded packets.</p>'+
        '</p><b>NWID</b> - received packets with a different NWID or ESSID. '+
        'Used to detect configuration problems or adjacent network existence (on the same frequency). '+
        '<b>Crypt</b> - received packets that the hardware was unable to code/encode. '+
        'This can be used to detect invalid encryption settings. '+
        '<b>Frag</b> - received packets for which the hardware was not able to properly re-assemble '+
        'the link layer fragments (most likely one was missing). '+
        '<b>Retry</b> - packets that the hardware failed to deliver. '+
        'Most MAC protocols will retry the packet a number of times before giving up. '+
        '<b>Misc</b> - other packets lost in relation with specific wireless operations.</p>'
    },

    'wireless.missed_beacons': {
        info: 'The number of periodic '+
        '<a href="https://en.wikipedia.org/wiki/Beacon_frame" target="_blank">beacons</a> '+
        'from the Cell or the Access Point have been missed. '+
        'Beacons are sent at regular intervals to maintain the cell coordination, '+
        'failure to receive them usually indicates that the card is out of range.'
    },

    // ------------------------------------------------------------------------
    // INFINIBAND

    'ib.bytes': {
        info: 'The amount of traffic transferred by the port.'
    },

    'ib.packets': {
        info: 'The number of packets transferred by the port.'
    },

    'ib.errors': {
        info: 'The number of errors encountered by the port.'
    },

    'ib.hwerrors': {
        info: 'The number of hardware errors encountered by the port.'
    },

    'ib.hwpackets': {
        info: 'The number of hardware packets transferred by the port.'
    },

    // ------------------------------------------------------------------------
    // NETFILTER

    'netfilter.sockets': {
        colors: '#88AA00',
        heads: [
            netdataDashboard.gaugeChart('活跃连接数', '12%', '', '#88AA00')
        ]
    },

    'netfilter.new': {
        heads: [
            netdataDashboard.gaugeChart('新连接', '12%', 'new', '#5555AA')
        ]
    },

    // ------------------------------------------------------------------------
    // IPVS
    'ipvs.sockets': {
        info: 'Total created connections for all services and their servers. '+
        'To see the IPVS connection table, run <code>ipvsadm -Lnc</code>.'
    },
    'ipvs.packets': {
        info: 'Total transferred packets for all services and their servers.'
    },
    'ipvs.net': {
        info: 'Total network traffic for all services and their servers.'
    },

    // ------------------------------------------------------------------------
    // DISKS

    'disk.util': {
        colors: '#FF5588',
        heads: [
            netdataDashboard.gaugeChart('使用率', '12%', '', '#FF5588')
        ],
        info: '磁盘利用率衡量磁盘忙于某些事情的时间量。这与其性能无关。 100% 表示系统始终在磁盘上有未完成的操作。请记住，根据磁盘的底层技术，此处的 100% 可能表示也可能不表示拥塞。'
    },

    'disk.busy': {
        colors: '#FF5588',
        info: '磁盘繁忙时间衡量磁盘忙于某些事情的时间量。'
    },
    
    'disk.backlog': {
        colors: '#0099CC',
        info: '积压是待处理磁盘操作的持续时间的指示。对于每个 I/O 事件，系统都会将自上次更新该字段以来执行 I/O 所花费的时间乘以待处理操作的数量。虽然不准确，但该指标可以指示正在进行的操作的预期完成时间。'
    },

    'disk.io': {
        heads: [
            netdataDashboard.gaugeChart('读取', '12%', 'reads'),
            netdataDashboard.gaugeChart('写入', '12%', 'writes')
        ],
        info: '磁盘传输资料的总计。'
    },

    'disk_ext.io': {
        info: '已装入的文件系统不再使用的丢弃数据量.'
    },

    'disk.ops': {
        info: '已完成的磁盘 I/O operations。提醒：实际上的 operations 数量可能更高，因为系统能够将它们互相合并 (详见 operations 图表)。'
    },

    'disk_ext.ops': {
        info: '<p>已完成的丢弃/刷新请求的数量（合并后）。</p>' +
        '<p><b>丢弃</b>命令通知磁盘哪些数据块不再被视为正在使用，因此可以在内部擦除。 ' +
        '它们对于固态驱动器(SSD) 和精简配置存储非常有用。 '+
        '丢弃/修剪使 SSD 能够更有效地处理垃圾收集，' +
        '否则这会减慢未来对相关块的写入操作。</p>' +
        '<p><b>刷新</b>操作将所有修改的核心数据（即修改的缓冲区高速缓存页）传输到磁盘设备' +
        '这样，即使系统崩溃或重新启动，也可以检索所有更改的信息。 ' +
        '刷新请求由磁盘执行。不跟踪分区的刷新请求。 ' +
        '在合并之前，刷新操作被计为写入。</p>'
    },

    'disk.qops': {
        info: '当前正在进行 I/O 操作。该指标是一个快照 - 它不是上一个时间间隔的平均值。'
    },

    'disk.iotime': {
        height: 0.5,
        info: '所有已完成的 I/O 操作的持续时间之和。如果磁盘能够并行执行 I/O 操作，则此数量可能会超出间隔。'
    },
    'disk_ext.iotime': {
        height: 0.5,
        info: '所有已完成的丢弃/刷新操作的持续时间的总和。如果磁盘能够并行执行丢弃/刷新操作，则此数字可能会超出间隔。'
    },
    'disk.mops': {
        height: 0.5,
        info: '合并磁盘操作的数量。系统能够合并相邻的 I/O 操作，例如，两次 4KB 读取可以在提交给磁盘之前变成一次 8KB 读取。'
    },
    'disk_ext.mops': {
        height: 0.5,
        info: '合并丢弃磁盘操作的数量。为了提高效率，可以合并彼此相邻的丢弃操作。'
    },
    'disk.svctm': {
        height: 0.5,
        info: '已完成 I/O 操作的平均服务时间。该指标是使用磁盘的总繁忙时间和已完成操作的数量来计算的。如果磁盘能够执行多个并行操作，则报告的平均服务时间将会产生误导。'
    },
    'disk.latency_io': {
        height: 0.5,
        info: '磁盘 I/O 延迟是完成 I/O 请求所需的时间。在大多数情况下，延迟是存储性能方面需要关注的最重要的指标。对于硬盘驱动器，10 到 20 毫秒之间的平均延迟可以被认为是可以接受的。对于 SSD（固态硬盘），根据工作负载，它不应超过 1-3 毫秒。在大多数情况下，工作负载的延迟时间将小于 1 毫秒。维度指的是时间间隔。此图表基于 ebpf_exporter 的 <a href="https://github.com/cloudflare/ebpf_exporter/blob/master/examples/bio-tracepoints.yaml" target="_blank">bio_tracepoints</a> 工具。'
    },
    'disk.avgsz': {
        height: 0.5,
        info: 'I/O operation 平均大小。'
    },
    'disk_ext.avgsz': {
        height: 0.5,
        info: '平均丢弃操作大小.'
    },
    'disk.await': {
        height: 0.5,
        info: '对要提供服务的设备发出 I/O 请求平均时间。这包含了请求在伫列中所花费的时间以及实际提供服务的时间。'
    },
    'disk_ext.await': {
        height: 0.5,
        info: '向要服务的设备发出丢弃/刷新请求的平均时间。这包括请求在队列中花费的时间以及为它们提供服务所花费的时间。'
    },

    'disk.space': {
        info: '磁盘空间使用率。系统会自动为 root 使用者做保留，以防止 root 使用者使用过多。'
    },
    'disk.inodes': {
        info: '索引节点（或索引节点）是文件系统对象（例如文件和目录）。在许多类型的文件系统实现中，inode 的最大数量在文件系统创建时是固定的，从而限制了文件系统可以容纳的最大文件数量。设备可能会耗尽 inode。发生这种情况时，即使有可用空间，也无法在设备上创建新文件。'
    },

    'disk.bcache_hit_ratio': {
        info: '<p><b>Bcache（块缓存）</b>是Linux内核块层的缓存，' +
        '用于访问辅助存储设备。 ' +
        '它允许一个或多个快速存储设备，例如基于闪存的固态硬盘(SSD)，'+
        '充当一个或多个速度较慢的存储设备（例如硬盘驱动器 (HDD)）的缓存。</p>' +
        '<p>直接从块缓存满足的数据请求的百分比。 ' +
        '命中和未命中按 bcache 看到的每个单独 IO 进行计数。 ' +
        '部分命中算作未命中。</p>'
    },
    'disk.bcache_rates': {
        info: 'Throttling rates. '+
        'To avoid congestions bcache tracks latency to the cache device, and gradually throttles traffic if the latency exceeds a threshold. ' +
        'If the writeback percentage is nonzero, bcache tries to keep around this percentage of the cache dirty by '+
        'throttling background writeback and using a PD controller to smoothly adjust the rate.'
    },
    'disk.bcache_size': {
        info: '缓存中此支持设备的脏数据量。'
    },
    'disk.bcache_usage': {
        info: '不包含脏数据且可能用于写回的缓存设备的百分比。'
    },
    'disk.bcache_cache_read_races': {
        info: '<b>Read races</b> happen when a bucket was reused and invalidated while data was being read from the cache. '+
        'When this occurs the data is reread from the backing device. '+
        '<b>IO errors</b> are decayed by the half life. '+
        'If the decaying count reaches the limit, dirty data is written out and the cache is disabled.'
    },
    'disk.bcache': {
        info: 'Hits and misses are counted per individual IO as bcache sees them; a partial hit is counted as a miss. '+
        'Collisions happen when data was going to be inserted into the cache from a cache miss, '+
        'but raced with a write and data was already present. '+
        'Cache miss reads are rounded up to the readahead size, but without overlapping existing cache entries.'
    },
    'disk.bcache_bypass': {
        info: 'Hits and misses for IO that is intended to skip the cache.'
    },
    'disk.bcache_cache_alloc': {
        info: '<p>Working set size.</p>'+
        '<p><b>Unused</b> is the percentage of the cache that does not contain any data. '+
        '<b>Dirty</b> is the data that is modified in the cache but not yet written to the permanent storage. '+
        '<b>Clean</b> data matches the data stored on the permanent storage. '+
        '<b>Metadata</b> is bcache\'s metadata overhead.</p>'
    },

    // ------------------------------------------------------------------------
    // NFS client

    'nfs.net': {
        info: 'The number of received UDP and TCP packets.'
    },

    'nfs.rpc': {
        info: '<p>Remote Procedure Call (RPC) statistics.</p>'+
        '</p><b>Calls</b> - all RPC calls. '+
        '<b>Retransmits</b> - retransmitted calls. '+
        '<b>AuthRefresh</b> - authentication refresh calls (validating credentials with the server).</p>'
    },

    'nfs.proc2': {
        info: 'NFSv2 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc1094#section-2.2" target="_blank">RFC1094</a>.'
    },

    'nfs.proc3': {
        info: 'NFSv3 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc1813#section-3" target="_blank">RFC1813</a>.'
    },

    'nfs.proc4': {
        info: 'NFSv4 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc8881#section-18" target="_blank">RFC8881</a>.'
    },

    // ------------------------------------------------------------------------
    // NFS server

    'nfsd.readcache': {
        info: '<p>Reply cache statistics. '+
        'The reply cache keeps track of responses to recently performed non-idempotent transactions, and '+
        'in case of a replay, the cached response is sent instead of attempting to perform the operation again.</p>'+
        '<b>Hits</b> - client did not receive a reply and re-transmitted its request. This event is undesirable. '+
        '<b>Misses</b> - an operation that requires caching (idempotent). '+
        '<b>Nocache</b> - an operation that does not require caching (non-idempotent).'
    },

    'nfsd.filehandles': {
        info: '<p>File handle statistics. '+
        'File handles are small pieces of memory that keep track of what file is opened.</p>'+
        '<p><b>Stale</b> - happen when a file handle references a location that has been recycled. '+
        'This also occurs when the server loses connection and '+
        'applications are still using files that are no longer accessible.'
    },

    'nfsd.io': {
        info: '传入和传出磁盘的数据量。'
    },

    'nfsd.threads': {
        info: 'NFS 守护程序使用的线程数。'
    },

    'nfsd.readahead': {
        info: '<p>Read-ahead cache statistics. '+
        'NFS read-ahead predictively requests blocks from a file in advance of I/O requests by the application. '+
        'It is designed to improve client sequential read throughput.</p>'+
        '<p><b>10%</b>-<b>100%</b> - histogram of depth the block was found. '+
        'This means how far the cached block is from the original block that was first requested. '+
        '<b>Misses</b> - not found in the read-ahead cache.</p>'
    },

    'nfsd.net': {
        info: 'The number of received UDP and TCP packets.'
    },

    'nfsd.rpc': {
        info: '<p>Remote Procedure Call (RPC) statistics.</p>'+
        '</p><b>Calls</b> - all RPC calls. '+
        '<b>BadAuth</b> - bad authentication. '+
        'It does not count if you try to mount from a machine that it\'s not in your exports file. '+
        '<b>BadFormat</b> - other errors.</p>'
    },

    'nfsd.proc2': {
        info: 'NFSv2 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc1094#section-2.2" target="_blank">RFC1094</a>.'
    },

    'nfsd.proc3': {
        info: 'NFSv3 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc1813#section-3" target="_blank">RFC1813</a>.'
    },

    'nfsd.proc4': {
        info: 'NFSv4 RPC calls. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc8881#section-18" target="_blank">RFC8881</a>.'
    },

    'nfsd.proc4ops': {
        info: 'NFSv4 RPC operations. The individual metrics are described in '+
        '<a href="https://datatracker.ietf.org/doc/html/rfc8881#section-18" target="_blank">RFC8881</a>.'
    },

    // ------------------------------------------------------------------------
    // ZFS

    'zfs.arc_size': {
        info: '<p>The size of the ARC.</p>'+
        '<p><b>Arcsz</b> - actual size. '+
        '<b>Target</b> - target size that the ARC is attempting to maintain (adaptive). '+
        '<b>Min</b> - minimum size limit. When the ARC is asked to shrink, it will stop shrinking at this value. '+
        '<b>Min</b> - maximum size limit.</p>'
    },

    'zfs.l2_size': {
        info: '<p>The size of the L2ARC.</p>'+
        '<p><b>Actual</b> - size of compressed data. '+
        '<b>Size</b> - size of uncompressed data.</p>'
    },

    'zfs.reads': {
        info: '<p>The number of read requests.</p>'+
        '<p><b>ARC</b> - all prefetch and demand requests. '+
        '<b>Demand</b> - triggered by an application request. '+
        '<b>Prefetch</b> - triggered by the prefetch mechanism, not directly from an application request. '+
        '<b>Metadata</b> - metadata read requests. '+
        '<b>L2</b> - L2ARC read requests.</p>'
    },

    'zfs.bytes': {
        info: 'The amount of data transferred to and from the L2ARC cache devices.'
    },

    'zfs.hits': {
        info: '<p>Hit rate of the ARC read requests.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.dhits': {
        info: '<p>Hit rate of the ARC data and metadata demand read requests. '+
        'Demand requests are triggered by an application request.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.phits': {
        info: '<p>Hit rate of the ARC data and metadata prefetch read requests. '+
        'Prefetch requests are triggered by the prefetch mechanism, not directly from an application request.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.mhits': {
        info: '<p>Hit rate of the ARC metadata read requests.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.l2hits': {
        info: '<p>Hit rate of the L2ARC lookups.</p>'+
        '</p><b>Hits</b> - a data block was in the L2ARC cache and returned. '+
        '<b>Misses</b> - a data block was not in the L2ARC cache. '+
        'It will be read from the pool disks.</p>'
    },

    'zfs.demand_data_hits': {
        info: '<p>Hit rate of the ARC data demand read requests. '+
        'Demand requests are triggered by an application request.</p>'+
        '<b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.prefetch_data_hits': {
        info: '<p>Hit rate of the ARC data prefetch read requests. '+
        'Prefetch requests are triggered by the prefetch mechanism, not directly from an application request.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.list_hits': {
        info: 'MRU (most recently used) and MFU (most frequently used) cache list hits. '+
        'MRU and MFU lists contain metadata for requested blocks which are cached. '+
        'Ghost lists contain metadata of the evicted pages on disk.'
    },

    'zfs.arc_size_breakdown': {
        info: 'The size of MRU (most recently used) and MFU (most frequently used) cache.'
    },

    'zfs.memory_ops': {
        info: '<p>Memory operation statistics.</p>'+
        '<p><b>Direct</b> - synchronous memory reclaim. Data is evicted from the ARC and free slabs reaped. '+
        '<b>Throttled</b> - number of times that ZFS had to limit the ARC growth. '+
        'A constant increasing of the this value can indicate excessive pressure to evict data from the ARC. '+
        '<b>Indirect</b> - asynchronous memory reclaim. It reaps free slabs from the ARC cache.</p>'
    },

    'zfs.important_ops': {
        info: '<p>Eviction and insertion operation statistics.</p>'+
        '<p><b>EvictSkip</b> - skipped data eviction operations. '+
        '<b>Deleted</b> - old data is evicted (deleted) from the cache. '+
        '<b>MutexMiss</b> - an attempt to get hash or data block mutex when it is locked during eviction. '+
        '<b>HashCollisions</b> - occurs when two distinct data block numbers have the same hash value.</p>'
    },

    'zfs.actual_hits': {
        info: '<p>MRU and MFU cache hit rate.</p>'+
        '<p><b>Hits</b> - a data block was in the ARC DRAM cache and returned. '+
        '<b>Misses</b> - a data block was not in the ARC DRAM cache. '+
        'It will be read from the L2ARC cache devices (if available and the data is cached on them) or the pool disks.</p>'
    },

    'zfs.hash_elements': {
        info: '<p>Data Virtual Address (DVA) hash table element statistics.</p>'+
        '<p><b>Current</b> - current number of elements. '+
        '<b>Max</b> - maximum number of elements seen.</p>'
    },

    'zfs.hash_chains': {
        info: '<p>Data Virtual Address (DVA) hash table chain statistics. '+
        'A chain is formed when two or more distinct data block numbers have the same hash value.</p>'+
        '<p><b>Current</b> - current number of chains. '+
        '<b>Max</b> - longest length seen for a chain. '+
        'If the value is high, performance may degrade as the hash locks are held longer while the chains are walked.</p>'
    },

    // ------------------------------------------------------------------------
    // ZFS pools
    'zfspool.state': {
        info: 'ZFS pool state. '+
        'The overall health of a pool, as reported by <code>zpool status</code>, '+
        'is determined by the aggregate state of all devices within the pool. ' +
        'For states description, '+
        'see <a href="https://openzfs.github.io/openzfs-docs/man/7/zpoolconcepts.7.html#Device_Failure_and_Recovery" target="_blank"> ZFS documentation</a>.'
    },

    // ------------------------------------------------------------------------
    // MYSQL

    'mysql.net': {
        info: 'The amount of data sent to mysql clients (<strong>out</strong>) and received from mysql clients (<strong>in</strong>).'
    },

    'mysql.queries': {
        info: 'The number of statements executed by the server.<ul>' +
            '<li><strong>queries</strong> counts the statements executed within stored SQL programs.</li>' +
            '<li><strong>questions</strong> counts the statements sent to the mysql server by mysql clients.</li>' +
            '<li><strong>slow queries</strong> counts the number of statements that took more than <a href="http://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_long_query_time" target="_blank">long_query_time</a> seconds to be executed.' +
            ' For more information about slow queries check the mysql <a href="http://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html" target="_blank">slow query log</a>.</li>' +
            '</ul>'
    },

    'mysql.handlers': {
        info: 'Usage of the internal handlers of mysql. This chart provides very good insights of what the mysql server is actually doing.' +
            ' (if the chart is not showing all these dimensions it is because they are zero - set <strong>Which dimensions to show?</strong> to <strong>All</strong> from the dashboard settings, to render even the zero values)<ul>' +
            '<li><strong>commit</strong>, the number of internal <a href="http://dev.mysql.com/doc/refman/5.7/en/commit.html" target="_blank">COMMIT</a> statements.</li>' +
            '<li><strong>delete</strong>, the number of times that rows have been deleted from tables.</li>' +
            '<li><strong>prepare</strong>, a counter for the prepare phase of two-phase commit operations.</li>' +
            '<li><strong>read first</strong>, the number of times the first entry in an index was read. A high value suggests that the server is doing a lot of full index scans; e.g. <strong>SELECT col1 FROM foo</strong>, with col1 indexed.</li>' +
            '<li><strong>read key</strong>, the number of requests to read a row based on a key. If this value is high, it is a good indication that your tables are properly indexed for your queries.</li>' +
            '<li><strong>read next</strong>, the number of requests to read the next row in key order. This value is incremented if you are querying an index column with a range constraint or if you are doing an index scan.</li>' +
            '<li><strong>read prev</strong>, the number of requests to read the previous row in key order. This read method is mainly used to optimize <strong>ORDER BY ... DESC</strong>.</li>' +
            '<li><strong>read rnd</strong>, the number of requests to read a row based on a fixed position. A high value indicates you are doing a lot of queries that require sorting of the result. You probably have a lot of queries that require MySQL to scan entire tables or you have joins that do not use keys properly.</li>' +
            '<li><strong>read rnd next</strong>, the number of requests to read the next row in the data file. This value is high if you are doing a lot of table scans. Generally this suggests that your tables are not properly indexed or that your queries are not written to take advantage of the indexes you have.</li>' +
            '<li><strong>rollback</strong>, the number of requests for a storage engine to perform a rollback operation.</li>' +
            '<li><strong>savepoint</strong>, the number of requests for a storage engine to place a savepoint.</li>' +
            '<li><strong>savepoint rollback</strong>, the number of requests for a storage engine to roll back to a savepoint.</li>' +
            '<li><strong>update</strong>, the number of requests to update a row in a table.</li>' +
            '<li><strong>write</strong>, the number of requests to insert a row in a table.</li>' +
            '</ul>'
    },

    'mysql.table_locks': {
        info: 'MySQL table locks counters: <ul>' +
            '<li><strong>immediate</strong>, the number of times that a request for a table lock could be granted immediately.</li>' +
            '<li><strong>waited</strong>, the number of times that a request for a table lock could not be granted immediately and a wait was needed. If this is high and you have performance problems, you should first optimize your queries, and then either split your table or tables or use replication.</li>' +
            '</ul>'
    },

    'mysql.innodb_deadlocks': {
        info: 'A deadlock happens when two or more transactions mutually hold and request for locks, creating a cycle of dependencies. For more information about <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-deadlocks-handling.html" target="_blank">how to minimize and handle deadlocks</a>.'
    },

    'mysql.galera_cluster_status': {
        info: "<p>Status of this cluster component.</p><p><b>Primary</b> - primary group configuration, quorum present. <b>Non-Primary</b> - non-primary group configuration, quorum lost. <b>Disconnected</b> - not connected to group, retrying.</p>"
    },

    'mysql.galera_cluster_state': {
        info: "<p>Membership state of this cluster component.</p><p><b>Undefined</b> - undefined state. <b>Joining</b> - the node is attempting to join the cluster. <b>Donor</b> - the node has blocked itself while it sends a State Snapshot Transfer (SST) to bring a new node up to date with the cluster. <b>Joined</b> - the node has successfully joined the cluster. <b>Synced</b> - the node has established a connection with the cluster and synchronized its local databases with those of the cluster. <b>Error</b> - the node is not part of the cluster and does not replicate transactions. This state is provider-specific, check <i>wsrep_local_state_comment</i> variable for a description.</p>"
    },

    'mysql.galera_cluster_weight': {
        info: 'The value is counted as a sum of <code>pc.weight</code> of the nodes in the current Primary Component.'
    },

    'mysql.galera_connected': {
        info: '<code>0</code> means that the node has not yet connected to any of the cluster components. ' +
            'This may be due to misconfiguration.'
    },

    'mysql.open_transactions': {
        info: 'The number of locally running transactions which have been registered inside the wsrep provider. ' +
            'This means transactions which have made operations which have caused write set population to happen. ' +
            'Transactions which are read only are not counted.'
    },


    // ------------------------------------------------------------------------
    // POSTGRESQL
    'postgres.connections_utilization': {
        room: { 
            mainheads: [
                function (_, id) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-append-options="percentage"'
                        + ' data-gauge-max-value="100"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="Connections Utilization"'
                        + ' data-units="%"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[1] + '"'
                        + ' role="application"></div>';
                }
            ],
        },
        info: '<b>Total connection utilization</b> across all databases. Utilization is measured as a percentage of (<i>max_connections</i> - <i>superuser_reserved_connections</i>). If the utilization is 100% no more new connections will be accepted (superuser connections will still be accepted if superuser quota is available).'
    },
    'postgres.connections_usage': {
        info: '<p><b>Connections usage</b> across all databases. The maximum number of concurrent connections to the database server is (<i>max_connections</i> - <i>superuser_reserved_connections</i>). As a general rule, if you need more than 200 connections it is advisable to use connection pooling.</p><p><b>Available</b> - new connections allowed. <b>Used</b> - connections currently in use.</p>'
    },
    'postgres.connections_state_count': {
        info: '<p>Number of connections in each state across all databases.</p><p><b>Active</b> - the backend is executing query. <b>Idle</b> - the backend is waiting for a new client command. <b>IdleInTransaction</b> - the backend is in a transaction, but is not currently executing a query. <b>IdleInTransactionAborted</b> - the backend is in a transaction, and not currently executing a query, but one of the statements in the transaction caused an error. <b>FastPathFunctionCall</b> - the backend is executing a fast-path function. <b>Disabled</b> - is reported if <a href="https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITIES" target="_blank"><i>track_activities</i></a> is disabled in this backend.</p>'
    },
    'postgres.transactions_duration': {
        info: 'Running transactions duration histogram. The bins are specified as consecutive, non-overlapping intervals. The value is the number of observed transactions that fall into each interval.'
    },
    'postgres.queries_duration': {
        info: 'Active queries duration histogram. The bins are specified as consecutive, non-overlapping intervals. The value is the number of observed active queries that fall into each interval.'
    },
    'postgres.checkpoints_rate': {
        info: '<p>Number of checkpoints that have been performed. Checkpoints are periodic maintenance operations the database performs to make sure that everything it\'s been caching in memory has been synchronized with the disk. Ideally checkpoints should be time-driven (scheduled) as opposed to load-driven (requested).</p><p><b>Scheduled</b> - checkpoints triggered as per schedule when time elapsed from the previous checkpoint is greater than <a href="https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-CHECKPOINT-TIMEOUT" target="_blank"><i>checkpoint_timeout</i></a>. <b>Requested</b> - checkpoints triggered due to WAL updates reaching the <a href="https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MAX-WAL-SIZE" target="_blank"><i>max_wal_size</i></a> before the <i>checkpoint_timeout</i> is reached.</p>'
    },
    'postgres.checkpoints_time': {
        info: '<p>Checkpoint timing information. An important indicator of how well checkpoint I/O is performing is the amount of time taken to sync files to disk.</p><p><b>Write</b> - amount of time spent writing files to disk during checkpoint processing. <b>Sync</b> - amount of time spent synchronizing files to disk during checkpoint processing.</p>'
    },
    'postgres.buffers_allocated_rate': {
        info: 'Allocated and re-allocated buffers. If a backend process requests data it is either found in a block in shared buffer cache or the block has to be allocated (read from disk). The latter is counted as <b>Allocated</b>.'
    },
    'postgres.buffers_io_rate': {
        info: '<p>Amount of data flushed from memory to disk.</p><p><b>Checkpoint</b> - buffers written during checkpoints. <b>Backend</b> -  buffers written directly by a backend. It may happen that a dirty page is requested by a backend process. In this case the page is synced to disk before the page is returned to the client. <b>BgWriter</b> - buffers written by the background writer. PostgreSQL may clear pages with a low usage count in advance. The process scans for dirty pages with a low usage count so that they could be cleared if necessary. Buffers written by this process increment the counter.</p>'
    },
    'postgres.bgwriter_halts_rate': {
        info: 'Number of times the background writer stopped a cleaning scan because it had written too many buffers (exceeding the value of <a href="https://www.postgresql.org/docs/current/runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER" target="_blank"><i>bgwriter_lru_maxpages</i></a>).'
    },
    'postgres.buffers_backend_fsync_rate': {
        info: 'Number of times a backend had to execute its own fsync call (normally the background writer handles those even when the backend does its own write). Any values above zero can indicate problems with storage when fsync queue is completely filled.'
    },
    'postgres.wal_io_rate': {
        info: 'Write-Ahead Logging (WAL) ensures data integrity by ensuring that changes to data files (where tables and indexes reside) are written only after log records describing the changes have been flushed to permanent storage.'
    },
    'postgres.wal_files_count': {
        info: '<p>Number of WAL logs stored in the directory <i>pg_wal</i> under the data directory.</p><p><b>Written</b> - generated log segments files. <b>Recycled</b> - old log segment files that are no longer needed. Renamed to become future segments in the numbered sequence to avoid the need to create new ones.</p>'
    },
    'postgres.wal_archiving_files_count': {
        info: '<p>WAL archiving.</p><p><b>Ready</b> - WAL files waiting to be archived. A non-zero value can indicate <i>archive_command</i> is in error, see <a href="https://www.postgresql.org/docs/current/static/continuous-archiving.html" target="_blank">Continuous Archiving and Point-in-Time Recovery</a>. <b>Done</b> - WAL files successfully archived.'
    },
    'postgres.autovacuum_workers_count': {
        info: 'PostgreSQL databases require periodic maintenance known as vacuuming. For many installations, it is sufficient to let vacuuming be performed by the autovacuum daemon. For more information see <a href="https://www.postgresql.org/docs/current/static/routine-vacuuming.html#AUTOVACUUM" target="_blank">The Autovacuum Daemon</a>.'
    },
    'postgres.txid_exhaustion_towards_autovacuum_perc': {
        info: 'Percentage towards emergency autovacuum for one or more tables. A forced autovacuum will run once this value reaches 100%. For more information see <a href="https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND" target="_blank">Preventing Transaction ID Wraparound Failures</a>.'
    },
    'postgres.txid_exhaustion_perc': {
        info: 'Percentage towards transaction wraparound. A transaction wraparound may occur when this value reaches 100%. For more information see <a href="https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND" target="_blank">Preventing Transaction ID Wraparound Failures</a>.'
    },
    'postgres.txid_exhaustion_oldest_txid_num': {
        info: 'The oldest current transaction ID (XID). If for some reason autovacuum fails to clear old XIDs from a table, the system will begin to emit warning messages when the database\'s oldest XIDs reach eleven million transactions from the wraparound point. For more information see <a href="https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND" target="_blank">Preventing Transaction ID Wraparound Failures</a>.'
    },
    'postgres.uptime': {
        room: { 
            mainheads: [
                function (os, id) {
                    void (os);
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="easypiechart"'
                        + ' data-title="Uptime"'
                        + ' data-units="Seconds"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="10%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' role="application"></div>';
                }
            ],
        },
        info: 'The time elapsed since the Postgres process was started.'
    },
    'postgres.replication_app_wal_lag_size': {
        info: '<p>Replication WAL lag size.</p><p><b>SentLag</b> - sent over the network. <b>WriteLag</b> - written to disk. <b>FlushLag</b> - flushed to disk. <b>ReplayLag</b> - replayed into the database.</p>'
    },
    'postgres.replication_app_wal_lag_time': {
        info: '<p>Replication WAL lag time.</p><p><b>WriteLag</b> - time elapsed between flushing recent WAL locally and receiving notification that the standby server has written it, but not yet flushed it or applied it. <b>FlushLag</b> - time elapsed between flushing recent WAL locally and receiving notification that the standby server has written and flushed it, but not yet applied it. <b>ReplayLag</b> - time elapsed between flushing recent WAL locally and receiving notification that the standby server has written, flushed and applied it.</p>'
    },
    'postgres.replication_slot_files_count': {
        info: '<p>Replication slot files. For more information see <a href="https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION-SLOTS" target="_blank">Replication Slots</a>.</p><p><b>WalKeep</b> - WAL files retained by the replication slot. <b>PgReplslotFiles</b> - files present in pg_replslot.</p>'
    },
    'postgres.db_transactions_ratio': {
        info: 'Percentage of committed/rollback transactions.'
    },
    'postgres.db_transactions_rate': {
        info: '<p>Number of transactions that have been performed</p><p><b>Committed</b> - transactions that have been committed. All changes made by the committed transaction become visible to others and are guaranteed to be durable if a crash occurs. <b>Rollback</b> - transactions that have been rolled back. Rollback aborts the current transaction and causes all the updates made by the transaction to be discarded. Single queries that have failed outside the transactions are also accounted as rollbacks.</p>'
    },
    'postgres.db_connections_utilization': {
        info: 'Connection utilization per database. Utilization is measured as a percentage of <i>CONNECTION LIMIT</i> per database (if set) or <i>max_connections</i> (if <i>CONNECTION LIMIT</i> is not set).'
    },
    'postgres.db_connections_count': {
        info: 'Number of current connections per database.'
    },    
    'postgres.db_cache_io_ratio': {
        room: { 
            mainheads: [
                function (_, id) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-append-options="percentage"'
                        + ' data-gauge-max-value="100"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="Cache Miss Ratio"'
                        + ' data-units="%"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[1] + '"'
                        + ' role="application"></div>';
                }
            ],
        },
        info: 'PostgreSQL uses a <b>shared buffer cache</b> to store frequently accessed data in memory, and avoid slower disk reads. If you are seeing performance issues, consider increasing the <a href="https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS" target="_blank"><i>shared_buffers</i></a> size or tuning <a href="https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE" target="_blank"><i>effective_cache_size</i></a>.'
    },
    'postgres.db_io_rate': {
        info: '<p>Amount of data read from shared buffer cache or from disk.</p><p><b>Disk</b> - data read from disk. <b>Memory</b> - data read from buffer cache (this only includes hits in the PostgreSQL buffer cache, not the operating system\'s file system cache).</p>'
    },
    'postgres.db_ops_fetched_rows_ratio': {
        room: {
            mainheads: [
                function (_, id) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-append-options="percentage"'
                        + ' data-gauge-max-value="100"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="Rows Fetched vs Returned"'
                        + ' data-units="%"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[1] + '"'
                        + ' role="application"></div>';
                }
            ],
        }, 
        info: 'The percentage of rows that contain data needed to execute the query, out of the total number of rows scanned. A high value indicates that the database is executing queries efficiently, while a low value indicates that the database is performing extra work by scanning a large number of rows that aren\'t required to process the query. Low values may be caused by missing indexes or inefficient queries.'
    },
    'postgres.db_ops_read_rows_rate': {
        info: '<p>Read queries throughput.</p><p><b>Returned</b> - Total number of rows scanned by queries. This value indicates rows returned by the storage layer to be scanned, not rows returned to the client. <b>Fetched</b> - Subset of scanned rows (<b>Returned</b>) that contained data needed to execute the query.</p>'
    },
    'postgres.db_ops_write_rows_rate': {
        info: '<p>Write queries throughput.</p><p><b>Inserted</b> - number of rows inserted by queries. <b>Deleted</b> - number of rows deleted by queries. <b>Updated</b> - number of rows updated by queries.</p>'
    },
    'postgres.db_conflicts_rate': {
        info: 'Number of queries canceled due to conflict with recovery on standby servers. To minimize query cancels caused by cleanup records consider configuring <a href="https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-HOT-STANDBY-FEEDBACK" target="_blank"><i>hot_standby_feedback</i></a>.'
    },
    'postgres.db_conflicts_reason_rate': {
        info: '<p>Statistics about queries canceled due to various types of conflicts on standby servers.</p><p><b>Tablespace</b> - queries that have been canceled due to dropped tablespaces. <b>Lock</b> - queries that have been canceled due to lock timeouts. <b>Snapshot</b> - queries that have been canceled due to old snapshots. <b>Bufferpin</b> - queries that have been canceled due to pinned buffers. <b>Deadlock</b> - queries that have been canceled due to deadlocks.</p>'
    },
    'postgres.db_deadlocks_rate': {
        info: 'Number of detected deadlocks. When a transaction cannot acquire the requested lock within a certain amount of time (configured by <b>deadlock_timeout</b>), it begins deadlock detection.'
    },
    'postgres.db_locks_held_count': {
        info: 'Number of held locks. Some of these lock modes are acquired by PostgreSQL automatically before statement execution, while others are provided to be used by applications. All lock modes acquired in a transaction are held for the duration of the transaction. For lock modes details, see <a href="https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES" target="_blank">table-level locks</a>.'
    },
    'postgres.db_locks_awaited_count': {
        info: 'Number of awaited locks. It indicates that some transaction is currently waiting to acquire a lock, which implies that some other transaction is holding a conflicting lock mode on the same lockable object. For lock modes details, see <a href="https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-TABLES" target="_blank">table-level locks</a>.'
    },
    'postgres.db_temp_files_created_rate': {
        info: 'Number of temporary files created by queries. Complex queries may require more memory than is available (specified by <b>work_mem</b>). When this happens, Postgres reverts to using temporary files - they are actually stored on disk, but only exist for the duration of the request. After the request returns, the temporary files are deleted.'
    },
    'postgres.db_temp_files_io_rate': {
        info: 'Amount of data written temporarily to disk to execute queries.'
    },
    'postgres.db_size': {
        room: {
            mainheads: [
                function (os, id) {
                    void (os);
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="easypiechart"'
                        + ' data-title="DB Size"'
                        + ' data-units="MiB"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="10%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' role="application"></div>';
                }
            ],
        },        
        info: 'Actual on-disk usage of the database\'s data directory and any associated tablespaces.'
    },
    'postgres.table_rows_dead_ratio': {
        info: 'Percentage of dead rows. An increase in dead rows indicates a problem with VACUUM processes, which can slow down your queries.'
    },
    'postgres.table_rows_count': {
        info: '<p>Number of rows. When you do an UPDATE or DELETE, the row is not actually physically deleted. For a DELETE, the database simply marks the row as unavailable for future transactions, and for UPDATE, under the hood it is a combined INSERT then DELETE, where the previous version of the row is marked unavailable.</p><p><b>Live</b> - rows that currently in use and can be queried. <b>Dead</b> - deleted rows that will later be reused for new rows from INSERT or UPDATE.</p>'
    },
    'postgres.table_ops_rows_rate': {
        info: 'Write queries throughput. If you see a large number of updated and deleted rows, keep an eye on the number of dead rows, as a high percentage of dead rows can slow down your queries.'
    },
    'postgres.table_ops_rows_hot_ratio': {
        info: 'Percentage of HOT (Heap Only Tuple) updated rows. HOT updates are much more efficient than ordinary updates: less write operations, less WAL writes, vacuum operation has less work to do, increased read efficiency (help to limit table and index bloat).'
    },
    'postgres.table_ops_rows_hot_rate': {
        info: 'Number of HOT (Heap Only Tuple) updated rows.'
    },
    'postgres.table_cache_io_ratio': {
        info: 'Table cache inefficiency. Percentage of data read from disk. Lower is better.'
    },
    'postgres.table_io_rate': {
        info: '<p>Amount of data read from shared buffer cache or from disk.</p><p><b>Disk</b> - data read from disk. <b>Memory</b> - data read from buffer cache (this only includes hits in the PostgreSQL buffer cache, not the operating system\'s file system cache).</p>'
    },
    'postgres.table_index_cache_io_ratio': {
        info: 'Table indexes cache inefficiency. Percentage of data read from disk. Lower is better.'
    },
    'postgres.table_index_io_rate': {
        info: '<p>Amount of data read from all indexes from shared buffer cache or from disk.</p><p><b>Disk</b> - data read from disk. <b>Memory</b> - data read from buffer cache (this only includes hits in the PostgreSQL buffer cache, not the operating system\'s file system cache).</p>'
    },
    'postgres.table_toast_cache_io_ratio': {
        info: 'Table TOAST cache inefficiency. Percentage of data read from disk. Lower is better.'
    },
    'postgres.table_toast_io_rate': {
        info: '<p>Amount of data read from TOAST table from shared buffer cache or from disk.</p><p><b>Disk</b> - data read from disk. <b>Memory</b> - data read from buffer cache (this only includes hits in the PostgreSQL buffer cache, not the operating system\'s file system cache).</p>'
    },
    'postgres.table_toast_index_cache_io_ratio': {
        info: 'Table TOAST indexes cache inefficiency. Percentage of data read from disk. Lower is better.'
    },
    'postgres.table_toast_index_io_rate': {
        info: '<p>Amount of data read from this table\'s TOAST table indexes from shared buffer cache or from disk.</p><p><b>Disk</b> - data read from disk. <b>Memory</b> - data read from buffer cache (this only includes hits in the PostgreSQL buffer cache, not the operating system\'s file system cache).</p>'
    },
    'postgres.table_scans_rate': {
        info: '<p>Number of scans initiated on this table. If you see that your database regularly performs more sequential scans over time, you can improve its performance by creating an index on data that is frequently accessed.</p><p><b>Index</b> - relying on an index to point to the location of specific rows. <b>Sequential</b> - have to scan through each row of a table sequentially. Typically, take longer than index scans.</p>'
    },
    'postgres.table_scans_rows_rate': {
        info: 'Number of live rows fetched by scans.'
    },
    'postgres.table_autovacuum_since_time': {
        info: 'Time elapsed since this table was vacuumed by the autovacuum daemon.'
    },
    'postgres.table_vacuum_since_time': {
        info: 'Time elapsed since this table was manually vacuumed (not counting VACUUM FULL).'
    },
    'postgres.table_autoanalyze_since_time': {
        info: 'Time elapsed this table was analyzed by the autovacuum daemon.'
    },
    'postgres.table_analyze_since_time': {
        info: 'Time elapsed since this table was manually analyzed.'
    },
    'postgres.table_null_columns': {
        info: 'Number of table columns that contain only NULLs.'
    },
    'postgres.table_total_size': {
        info: 'Actual on-disk size of the table.'
    },
    'postgres.table_bloat_size_perc': {
        info: 'Estimated percentage of bloat in the table. It is normal for tables that are updated frequently to have a small to moderate amount of bloat.'
    },
    'postgres.table_bloat_size': {
        info: 'Disk space that was used by the table and is available for reuse by the database but has not been reclaimed. Bloated tables require more disk storage and additional I/O that can slow down query execution. Running <a href="https://www.postgresql.org/docs/current/sql-vacuum.html" target="_blank">VACUUM</a> regularly on a table that is updated frequently results in fast reuse of space occupied by expired rows, which prevents the table from growing too large.'
    },
    'postgres.index_size': {
        info: 'Actual on-disk size of the index.'
    },
    'postgres.index_bloat_size_perc': {
        info: 'Estimated percentage of bloat in the index.'
    },
    'postgres.index_bloat_size': {
        info: 'Disk space that was used by the index and is available for reuse by the database but has not been reclaimed. Bloat slows down your database and eats up more storage than needed. To recover the space from indexes, recreate them using the <a href="https://www.postgresql.org/docs/current/sql-reindex.html" target="_blank">REINDEX</a> command.'
    },
    'postgres.index_usage_status': {
        info: 'An index is considered unused if no scans have been initiated on that index.'
    },


    // ------------------------------------------------------------------------
    // PgBouncer
    'pgbouncer.client_connections_utilization': {
        info: 'Client connections in use as percentage of <i>max_client_conn</i> (default 100).'
    },
    'pgbouncer.db_client_connections': {
        info: '<p>Client connections in different states.</p><p><b>Active</b> - linked to server connection and can process queries. <b>Waiting</b> - have sent queries but have not yet got a server connection. <b>CancelReq</b> - have not forwarded query cancellations to the server yet.</p>'
    },
    'pgbouncer.db_server_connections': {
        info: '<p>Server connections in different states.</p><p><b>Active</b> - linked to a client. <b>Idle</b> - unused and immediately usable for client queries. <b>Used</b> - have been idle for more than <i>server_check_delay</i>, so they need <i>server_check_query</i> to run on them before they can be used again. <b>Tested</b> - currently running either <i>server_reset_query</i> or <i>server_check_query</i>. <b>Login</b> - currently in the process of logging in.</p>'
    },
    'pgbouncer.db_server_connections_utilization': {
        info: 'Server connections in use as percentage of <i>max_db_connections</i> (default 0 - unlimited). This considers the PgBouncer database that the client has connected to, not the PostgreSQL database of the outgoing connection.'
    },
    'pgbouncer.db_clients_wait_time': {
        info: 'Time spent by clients waiting for a server connection. This shows if the decrease in database performance from the client\'s point of view was due to exhaustion of the corresponding PgBouncer pool.'
    },
    'pgbouncer.db_client_max_wait_time': {
        info: 'Waiting time for the first (oldest) client in the queue. If this starts increasing, then the current pool of servers does not handle requests quickly enough.'
    },
    'pgbouncer.db_transactions': {
        info: 'SQL transactions pooled (proxied) by pgbouncer.'
    },
    'pgbouncer.db_transactions_time': {
        info: 'Time spent by pgbouncer when connected to PostgreSQL in a transaction, either idle in transaction or executing queries.'
    },
    'pgbouncer.db_transaction_avg_time': {
        info: 'Average transaction duration.'
    },
    'pgbouncer.db_queries': {
        info: 'SQL queries pooled (proxied) by pgbouncer.'
    },
    'pgbouncer.db_queries_time': {
        info: 'Time spent by pgbouncer when actively connected to PostgreSQL, executing queries.'
    },
    'pgbouncer.db_query_avg_time': {
        info: 'Average query duration.'
    },
    'pgbouncer.db_network_io': {
        info: '<p>Network traffic received and sent by pgbouncer.</p><p><b>Received</b> - received from clients. <b>Sent</b> - sent to servers.</p>'
    },


    'cassandra.client_requests_rate': {
        info: 'Client requests received per second. Consider whether your workload is read-heavy or write-heavy while choosing a compaction strategy.'
    },
    'cassandra.client_requests_latency': {
        info: 'Response latency of requests received per second. Latency could be impacted by disk access, network latency or replication configuration.'
    },
    'cassandra.key_cache_hit_ratio': {
        info: 'Key cache hit ratio indicates the efficiency of the key cache. If ratio is consistently < 80% consider increasing cache size.'
    },
    'cassandra.key_cache_hit_rate': {
        info: 'Key cache hit rate measures the cache hits and misses per second.'
    },
    'cassandra.storage_live_disk_space_used': {
        info: 'Amount of live disk space used. This does not include obsolete data waiting to be garbage collected.'
    },
    'cassandra.compaction_completed_tasks_rate': {
        info: 'Compaction tasks completed per second.'
    },
    'cassandra.compaction_pending_tasks_count': {
        info: 'Total compaction tasks in queue.'
    },
    'cassandra.thread_pool_active_tasks_count': {
        info: 'Total tasks currently being processed.'
    },
    'cassandra.thread_pool_pending_tasks_count': {
        info: 'Total tasks in queue awaiting a thread for processing.'
    },
    'cassandra.thread_pool_blocked_tasks_rate': {
        info: 'Tasks that cannot be queued for processing yet.'
    },
    'cassandra.thread_pool_blocked_tasks_count': {
        info: 'Total tasks that cannot yet be queued for processing.'
    },
    'cassandra.jvm_gc_rate': {
        info: 'Rate of garbage collections.</p><p><b>ParNew</b> - young-generation. <b>cms (ConcurrentMarkSweep)</b> - old-generation.</p>'
    },
    'cassandra.jvm_gc_time': {
        info: 'Elapsed time of garbage collection.</p><p><b>ParNew</b> - young-generation. <b>cms (ConcurrentMarkSweep)</b> - old-generation.</p>'
    },
    'cassandra.client_requests_timeouts_rate': {
        info: 'Requests which were not acknowledged within the configurable timeout window.'
    },
    'cassandra.client_requests_unavailables_rate': {
        info: 'Requests for which the required number of nodes was unavailable.'
    },
    'cassandra.storage_exceptions_rate': {
        info: 'Requests for which a storage exception was encountered.'
    },


    'wmi.processes_cpu_time': {
        info: 'Total CPU utilization. The amount of time spent by the process in <a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">user and privileged</a> modes.'
    },
    'wmi.processes_handles': {
        info: 'Total number of <a href="https://learn.microsoft.com/en-us/windows/win32/sysinfo/handles-and-objects" target="_blank">handles</a> the process has open. This number is the sum of the handles currently open by each thread in the process.'
    },
    'wmi.processes_io_bytes': {
        info: 'Bytes issued to I/O operations in different modes (read, write, other). This property counts all I/O activity generated by the process to include file, network, and device I/Os. Read and write mode includes data operations; other mode includes those that do not involve data, such as control operations.'
    },
    'wmi.processes_io_operations': {
        info: 'I/O operations issued in different modes (read, write, other). This property counts all I/O activity generated by the process to include file, network, and device I/Os. Read and write mode includes data operations; other mode includes those that do not involve data, such as control operations.'
    },
    'wmi.processes_page_faults': {
        info: 'Page faults by the threads executing in this process. A page fault occurs when a thread refers to a virtual memory page that is not in its working set in main memory. This can cause the page not to be fetched from disk if it is on the standby list and hence already in main memory, or if it is in use by another process with which the page is shared.'
    },
    'wmi.processes_file_bytes': {
        info: 'Current number of bytes this process has used in the paging file(s). Paging files are used to store pages of memory used by the process that are not contained in other files. Paging files are shared by all processes, and lack of space in paging files can prevent other processes from allocating memory.'
    },
    'wmi.processes_pool_bytes': {
        info: 'Pool Bytes is the last observed number of bytes in the paged or nonpaged pool. The nonpaged pool is an area of system memory (physical memory used by the operating system) for objects that cannot be written to disk, but must remain in physical memory as long as they are allocated. The paged pool is an area of system memory (physical memory used by the operating system) for objects that can be written to disk when they are not being used.'
    },
    'wmi.processes_threads': {
        info: 'Number of threads currently active in this process. An instruction is the basic unit of execution in a processor, and a thread is the object that executes instructions. Every running process has at least one thread.'
    },

    // ------------------------------------------------------------------------
    // WMI (TCP)

    'wmi.tcp_conns_active': {
        info: 'Number of times TCP connections have made a direct transition from the CLOSED state to the SYN-SENT state.'
    },
    'wmi.tcp_conns_established': {
        info: 'Number of TCP connections for which the current state is either ESTABLISHED or CLOSE-WAIT.'
    },
    'wmi.tcp_conns_failures': {
        info: 'Number of times TCP connections have made a direct transition to the CLOSED state from the SYN-SENT state or the SYN-RCVD state, plus the number of times TCP connections have made a direct transition from the SYN-RCVD state to the LISTEN state.'
    },
    'wmi.tcp_conns_passive': {
        info: 'Number of times TCP connections have made a direct transition from the LISTEN state to the SYN-RCVD state.'
    },
    'wmi.tcp_conns_resets': {
        info: 'Number of times TCP connections have made a direct transition from the LISTEN state to the SYN-RCVD state.'
    },
    'wmi.tcp_segments_received': {
        info: 'Rate at which segments are received, including those received in error. This count includes segments received on currently established connections.'
    },
    'wmi.tcp_segments_retransmitted': {
        info: 'Rate at which segments are retransmitted, that is, segments transmitted that contain one or more previously transmitted bytes.'
    },
    'wmi.tcp_segments_sent': {
        info: 'Rate at which segments are sent, including those on current connections, but excluding those containing only retransmitted bytes.'
    },

    // ------------------------------------------------------------------------
    // APACHE

    'apache.connections': {
        colors: NETDATA.colors[4],
        mainheads: [
            netdataDashboard.gaugeChart('连接', '12%', '', NETDATA.colors[4])
        ]
    },

    'apache.requests': {
        colors: NETDATA.colors[0],
        mainheads: [
            netdataDashboard.gaugeChart('请求', '12%', '', NETDATA.colors[0])
        ]
    },

    'apache.net': {
        colors: NETDATA.colors[3],
        mainheads: [
            netdataDashboard.gaugeChart('带宽', '12%', '', NETDATA.colors[3])
        ]
    },

    'apache.workers': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="busy"'
                    + ' data-append-options="percentage"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Workers Utilization"'
                    + ' data-units="percentage %"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' role="application"></div>';
            }
        ]
    },

    'apache.bytesperreq': {
        colors: NETDATA.colors[3],
        height: 0.5
    },

    'apache.reqpersec': {
        colors: NETDATA.colors[4],
        height: 0.5
    },

    'apache.bytespersec': {
        colors: NETDATA.colors[6],
        height: 0.5
    },


    // ------------------------------------------------------------------------
    // LIGHTTPD

    'lighttpd.connections': {
        colors: NETDATA.colors[4],
        mainheads: [
            netdataDashboard.gaugeChart('连接', '12%', '', NETDATA.colors[4])
        ]
    },

    'lighttpd.requests': {
        colors: NETDATA.colors[0],
        mainheads: [
            netdataDashboard.gaugeChart('请求', '12%', '', NETDATA.colors[0])
        ]
    },

    'lighttpd.net': {
        colors: NETDATA.colors[3],
        mainheads: [
            netdataDashboard.gaugeChart('带宽', '12%', '', NETDATA.colors[3])
        ]
    },

    'lighttpd.workers': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="busy"'
                    + ' data-append-options="percentage"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Servers Utilization"'
                    + ' data-units="percentage %"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' role="application"></div>';
            }
        ]
    },

    'lighttpd.bytesperreq': {
        colors: NETDATA.colors[3],
        height: 0.5
    },

    'lighttpd.reqpersec': {
        colors: NETDATA.colors[4],
        height: 0.5
    },

    'lighttpd.bytespersec': {
        colors: NETDATA.colors[6],
        height: 0.5
    },

    // ------------------------------------------------------------------------
    // NGINX

    'nginx.connections': {
        colors: NETDATA.colors[4],
        mainheads: [
            netdataDashboard.gaugeChart('连接', '12%', '', NETDATA.colors[4])
        ]
    },

    'nginx.requests': {
        colors: NETDATA.colors[0],
        mainheads: [
            netdataDashboard.gaugeChart('请求', '12%', '', NETDATA.colors[0])
        ]
    },

    // ------------------------------------------------------------------------
    // HTTP check

    'httpcheck.responsetime': {
        info: 'The <code>response time</code> describes the time passed between request and response. ' +
            'Currently, the accuracy of the response time is low and should be used as reference only.'
    },

    'httpcheck.responselength': {
        info: 'The <code>response length</code> counts the number of characters in the response body. For static pages, this should be mostly constant.'
    },

    'httpcheck.status': {
        valueRange: "[0, 1]",
        info: 'This chart verifies the response of the webserver. Each status dimension will have a value of <code>1</code> if triggered. ' +
            'Dimension <code>success</code> is <code>1</code> only if all constraints are satisfied. ' +
            'This chart is most useful for alarms or third-party apps.'
    },

    // ------------------------------------------------------------------------
    // NETDATA

    'netdata.response_time': {
        info: 'netdata API 响应时间测量 netdata 处理请求所需的时间。这个时间包括所有内容，从接收请求的第一个字节到发送其答复的最后一个字节，因此它包括涉及的所有网络延迟（即慢速网络上的客户端将影响这些指标）。'
    },

    'netdata.ebpf_threads': {
        info: 'Show total number of threads and number of active threads. For more details about the threads, see the <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#ebpf-programs">official documentation</a>.'
    },

    'netdata.ebpf_load_methods': {
        info: 'Show number of threads loaded using legacy code (independent binary) or <code>CO-RE (Compile Once Run Everywhere)</code>.'
    },

    // ------------------------------------------------------------------------
    // RETROSHARE

    'retroshare.bandwidth': {
        info: 'RetroShare 入站和出站流量。',
        mainheads: [
            netdataDashboard.gaugeChart('已收到', '12%', 'bandwidth_down_kb'),
            netdataDashboard.gaugeChart('已发出', '12%', 'bandwidth_up_kb')
        ]
    },

    'retroshare.peers': {
        info: '（已连接）RetroShare 好友数量。',
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="peers_connected"'
                    + ' data-append-options="friends"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="connected friends"'
                    + ' data-units=""'
                    + ' data-width="8%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' role="application"></div>';
            }
        ]
    },

    'retroshare.dht': {
        info: 'Statistics about RetroShare\'s DHT. These values are estimated!'
    },

    // ------------------------------------------------------------------------
    // fping

    'fping.quality': {
        colors: NETDATA.colors[10],
        height: 0.5
    },

    'fping.packets': {
        height: 0.5
    },


    // ------------------------------------------------------------------------
    // containers

    'cgroup.cpu_limit': {
        valueRange: "[0, null]",
        mainheads: [
            function (_, id) {
                cgroupCPULimitIsSet = 1;
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="used"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="CPU"'
                    + ' data-units="%"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupCPULimit
    },

    'cgroup.cpu': {
        mainheads: [
            function (_, id) {
                if (cgroupCPULimitIsSet === 0) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="CPU"'
                        + ' data-units="%"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[4] + '"'
                        + ' role="application"></div>';
                } else
                    return '';
            }
        ],
        info: cgroupCPU
    },
    'cgroup.throttled': {
        info: cgroupThrottled
    },
    'cgroup.throttled_duration': {
        info: cgroupThrottledDuration
    },
    'cgroup.cpu_shares': {
        info: cgroupCPUShared
    },
    'cgroup.cpu_per_core': {
        info: cgroupCPUPerCore
    },
    'cgroup.cpu_some_pressure': {
        info: cgroupCPUSomePressure
    },
    'cgroup.cpu_some_pressure_stall_time': {
        info: cgroupCPUSomePressureStallTime
    },
    'cgroup.cpu_full_pressure': {
        info: cgroupCPUFullPressure
    },
    'cgroup.cpu_full_pressure_stall_time': {
        info: cgroupCPUFullPressureStallTime
    },

    'k8s.cgroup.cpu_limit': {
        valueRange: "[0, null]",
        mainheads: [
            function (_, id) {
                cgroupCPULimitIsSet = 1;
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="used"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="CPU"'
                    + ' data-units="%"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupCPULimit
    },
    'k8s.cgroup.cpu': {
        mainheads: [
            function (_, id) {
                if (cgroupCPULimitIsSet === 0) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="CPU"'
                        + ' data-units="%"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[4] + '"'
                        + ' role="application"></div>';
                } else
                    return '';
            }
        ],
        info: cgroupCPU
    },
    'k8s.cgroup.throttled': {
        info: cgroupThrottled
    },
    'k8s.cgroup.throttled_duration': {
        info: cgroupThrottledDuration
    },
    'k8s.cgroup.cpu_shares': {
        info: cgroupCPUShared
    },
    'k8s.cgroup.cpu_per_core': {
        info: cgroupCPUPerCore
    },
    'k8s.cgroup.cpu_some_pressure': {
        info: cgroupCPUSomePressure
    },
    'k8s.cgroup.cpu_some_pressure_stall_time': {
        info: cgroupCPUSomePressureStallTime
    },
    'k8s.cgroup.cpu_full_pressure': {
        info: cgroupCPUFullPressure
    },
    'k8s.cgroup.cpu_full_pressure_stall_time': {
        info: cgroupCPUFullPressureStallTime
    },

    'cgroup.mem_utilization': {
        info: cgroupMemUtilization
    },

    'cgroup.mem_usage_limit': {
        mainheads: [
            function (_, id) {
                cgroupMemLimitIsSet = 1;
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="used"'
                    + ' data-append-options="percentage"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Memory"'
                    + ' data-units="%"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupMemUsageLimit
    },

    'cgroup.mem_usage': {
        mainheads: [
            function (_, id) {
                if (cgroupMemLimitIsSet === 0) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="Memory"'
                        + ' data-units="MB"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[1] + '"'
                        + ' role="application"></div>';
                } else
                    return '';
            }
        ],
        info: cgroupMemUsage
    },

    'cgroup.mem': {
        info: cgroupMem
    },

    'cgroup.mem_failcnt': {
        info: cgroupMemFailCnt
    },

    'cgroup.writeback': {
        info: cgroupWriteback
    },

    'cgroup.mem_activity': {
        info: cgroupMemActivity
    },

    'cgroup.pgfaults': {
        info: cgroupPgFaults
    },
    'cgroup.memory_some_pressure': {
        info: cgroupMemorySomePressure
    },
    'cgroup.memory_some_pressure_stall_time': {
        info: cgroupMemorySomePressureStallTime
    },
    'cgroup.memory_full_pressure': {
        info: cgroupMemoryFullPressure
    },
    'cgroup.memory_full_pressure_stall_time': {
        info: cgroupMemoryFullPressureStallTime
    },

    'k8s.cgroup.mem_utilization': {
        info: cgroupMemUtilization
    },
    'k8s.cgroup.mem_usage_limit': {
        mainheads: [
            function (_, id) {
                cgroupMemLimitIsSet = 1;
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="used"'
                    + ' data-append-options="percentage"'
                    + ' data-gauge-max-value="100"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Memory"'
                    + ' data-units="%"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupMemUsageLimit
    },
    'k8s.cgroup.mem_usage': {
        mainheads: [
            function (_, id) {
                if (cgroupMemLimitIsSet === 0) {
                    return '<div data-netdata="' + id + '"'
                        + ' data-chart-library="gauge"'
                        + ' data-title="Memory"'
                        + ' data-units="MB"'
                        + ' data-gauge-adjust="width"'
                        + ' data-width="12%"'
                        + ' data-before="0"'
                        + ' data-after="-CHART_DURATION"'
                        + ' data-points="CHART_DURATION"'
                        + ' data-colors="' + NETDATA.colors[1] + '"'
                        + ' role="application"></div>';
                } else
                    return '';
            }
        ],
        info: cgroupMemUsage
    },
    'k8s.cgroup.mem': {
        info: cgroupMem
    },
    'k8s.cgroup.mem_failcnt': {
        info: cgroupMemFailCnt
    },
    'k8s.cgroup.writeback': {
        info: cgroupWriteback
    },
    'k8s.cgroup.mem_activity': {
        info: cgroupMemActivity
    },
    'k8s.cgroup.pgfaults': {
        info: cgroupPgFaults
    },
    'k8s.cgroup.memory_some_pressure': {
        info: cgroupMemorySomePressure
    },
    'k8s.cgroup.memory_some_pressure_stall_time': {
        info: cgroupMemorySomePressureStallTime
    },
    'k8s.cgroup.memory_full_pressure': {
        info: cgroupMemoryFullPressure
    },
    'k8s.cgroup.memory_full_pressure_stall_time': {
        info: cgroupMemoryFullPressureStallTime
    },

    'cgroup.io': {
        info: cgroupIO
    },

    'cgroup.serviced_ops': {
        info: cgroupServicedOps
    },

    'cgroup.queued_ops': {
        info: cgroupQueuedOps
    },

    'cgroup.merged_ops': {
        info: cgroupMergedOps
    },

    'cgroup.throttle_io': {
        mainheads: [
            function (_, id) {
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="read"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Read Disk I/O"'
                    + ' data-units="KB/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' role="application"></div>';
            },
            function (_, id) {
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="write"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Write Disk I/O"'
                    + ' data-units="KB/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupThrottleIO
    },

    'cgroup.throttle_serviced_ops': {
        info: cgroupThrottleIOServicesOps
    },
    'cgroup.io_some_pressure': {
        info: cgroupIOSomePressure
    },
    'cgroup.io_some_pressure_stall_time': {
        info: cgroupIOSomePRessureStallTime
    },
    'cgroup.io_full_pressure': {
        info: cgroupIOFullPressure
    },
    'cgroup.io_full_pressure_stall_time': {
        info: cgroupIOFullPressureStallTime
    },

    'k8s.cgroup.io': {
        info: cgroupIO
    },
    'k8s.cgroup.serviced_ops': {
        info: cgroupServicedOps
    },
    'k8s.cgroup.queued_ops': {
        info: cgroupQueuedOps
    },
    'k8s.cgroup.merged_ops': {
        info: cgroupMergedOps
    },
    'k8s.cgroup.throttle_io': {
        mainheads: [
            function (_, id) {
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="read"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Read Disk I/O"'
                    + ' data-units="KB/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' role="application"></div>';
            },
            function (_, id) {
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="write"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Write Disk I/O"'
                    + ' data-units="KB/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' role="application"></div>';
            }
        ],
        info: cgroupThrottleIO
    },
    'k8s.cgroup.throttle_serviced_ops': {
        info: cgroupThrottleIOServicesOps
    },
    'k8s.cgroup.io_some_pressure': {
        info: cgroupIOSomePressure
    },
    'k8s.cgroup.io_some_pressure_stall_time': {
        info: cgroupIOSomePRessureStallTime
    },
    'k8s.cgroup.io_full_pressure': {
        info: cgroupIOFullPressure
    },
    'k8s.cgroup.io_full_pressure_stall_time': {
        info: cgroupIOFullPressureStallTime
    },

    'cgroup.swap_read': {
        info: ebpfSwapRead
    },

    'cgroup.swap_write': {
        info: ebpfSwapWrite
    },

    'cgroup.fd_open': {
        info: ebpfFileOpen
    },

    'cgroup.fd_open_error': {
        info: ebpfFileOpenError
    },

    'cgroup.fd_close': {
        info: ebpfFileClosed
    },

    'cgroup.fd_close_error': {
        info: ebpfFileCloseError
    },

    'cgroup.vfs_unlink': {
        info: ebpfVFSUnlink
    },

    'cgroup.vfs_write': {
        info: ebpfVFSWrite
    },

    'cgroup.vfs_write_error': {
        info: ebpfVFSWriteError
    },

    'cgroup.vfs_read': {
        info: ebpfVFSRead
    },

    'cgroup.vfs_read_error': {
        info: ebpfVFSReadError
    },

    'cgroup.vfs_write_bytes': {
        info: ebpfVFSWriteBytes
    },

    'cgroup.vfs_read_bytes': {
        info: ebpfVFSReadBytes
    },
    'cgroup.vfs_fsync': {
        info: ebpfVFSSync
    },
    'cgroup.vfs_fsync_error': {
        info: ebpfVFSSyncError
    },
    'cgroup.vfs_open': {
        info: ebpfVFSOpen
    },
    'cgroup.vfs_open_error': {
        info: ebpfVFSOpenError
    },
    'cgroup.vfs_create': {
        info: ebpfVFSCreate
    },
    'cgroup.vfs_create_error': {
        info: ebpfVFSCreateError
    },
    'cgroup.process_create': {
        info: ebpfProcessCreate
    },

    'cgroup.thread_create': {
        info: ebpfThreadCreate
    },

    'cgroup.task_exit': {
        info: ebpfTaskExit
    },

    'cgroup.task_close': {
        info: ebpfTaskClose
    },

    'cgroup.task_error': {
        info: ebpfTaskError
    },


    'cgroup.dc_ratio': {
        info: 'Percentage of file accesses that were present in the directory cache. 100% means that every file that was accessed was present in the directory cache. If files are not present in the directory cache 1) they are not present in the file system, 2) the files were not accessed before. Read more about <a href="https://www.kernel.org/doc/htmldocs/filesystems/the_directory_cache.html" target="_blank">directory cache</a>. Netdata also gives a summary for these charts in <a href="#menu_filesystem_submenu_directory_cache__eBPF_">Filesystem submenu</a>.'
    },

    'cgroup.shmget': {
        info: ebpfSHMget
    },

    'cgroup.shmat': {
        info: ebpfSHMat
    },

    'cgroup.shmdt': {
        info: ebpfSHMdt
    },

    'cgroup.shmctl': {
        info: ebpfSHMctl
    },
    'cgroup.outbound_conn_v4': {
        info: ebpfIPV4conn
    },
    'cgroup.outbound_conn_v6': {
        info: ebpfIPV6conn
    },
    'cgroup.net_bytes_send': {
        info: ebpfBandwidthSent
    },

    'cgroup.net_bytes_recv': {
        info: ebpfBandwidthRecv
    },

    'cgroup.net_tcp_send': {
        info: ebpfTCPSendCall
    },

    'cgroup.net_tcp_recv': {
        info: ebpfTCPRecvCall
    },

    'cgroup.net_retransmit': {
        info: ebpfTCPRetransmit
    },

    'cgroup.net_udp_send': {
        info: ebpfUDPsend
    },

    'cgroup.net_udp_recv': {
        info: ebpfUDPrecv
    },
    'cgroup.dc_hit_ratio': {
        info: ebpfDCHit
    },
    'cgroup.dc_reference': {
        info: ebpfDCReference
    },
    'cgroup.dc_not_cache': {
        info: ebpfDCNotCache
    },
    'cgroup.dc_not_found': {
        info: ebpfDCNotFound
    },
    'cgroup.cachestat_ratio': {
        info: ebpfCachestatRatio
    },

    'cgroup.cachestat_dirties': {
        info: ebpfCachestatDirties
    },

    'cgroup.cachestat_hits': {
        info: ebpfCachestatHits
    },

    'cgroup.cachestat_misses': {
        info: ebpfCachestatMisses
    },

    // ------------------------------------------------------------------------
    // containers (systemd)

    'services.cpu': {
        info: '系统范围 CPU 资源（所有核心）内的 CPU 总利用率。 cgroup 任务在<a href="https://en.wikipedia.org/wiki/CPU_modes#Mode_types" target="_blank">用户和内核</a>模式下花费的时间量。'
    },

    'services.mem_usage': {
        info: 'The amount of used RAM.'
    },

    'services.mem_rss': {
        info: 'The amount of used '+
        '<a href="https://en.wikipedia.org/wiki/Resident_set_size" target="_blank">RSS</a> memory. '+
        'It includes transparent hugepages.'
    },

    'services.mem_mapped': {
        info: 'The size of '+
        '<a href="https://en.wikipedia.org/wiki/Memory-mapped_file" target="_blank">memory-mapped</a> files.'
    },

    'services.mem_cache': {
        info: 'The amount of used '+
        '<a href="https://en.wikipedia.org/wiki/Page_cache" target="_blank">page cache</a> memory.'
    },

    'services.mem_writeback': {
        info: 'The amount of file/anon cache that is '+
        '<a href="https://en.wikipedia.org/wiki/Cache_(computing)#Writing_policies" target="_blank">queued for syncing</a> '+
        'to disk.'
    },

    'services.mem_pgfault': {
        info: 'The number of '+
        '<a href="https://en.wikipedia.org/wiki/Page_fault#Types" target="_blank">page faults</a>. '+
        'It includes both minor and major page faults.'
    },

    'services.mem_pgmajfault': {
        info: 'The number of '+
        '<a href="https://en.wikipedia.org/wiki/Page_fault#Major" target="_blank">major</a> '+
        'page faults.'
    },

    'services.mem_pgpgin': {
        info: 'The amount of memory charged to the cgroup. '+
        'The charging event happens each time a page is accounted as either '+
        'mapped anon page(RSS) or cache page(Page Cache) to the cgroup.'
    },

    'services.mem_pgpgout': {
        info: 'The amount of memory uncharged from the cgroup. '+
        'The uncharging event happens each time a page is unaccounted from the cgroup.'
    },

    'services.mem_failcnt': {
        info: 'The number of memory usage hits limits.'
    },

    'services.swap_usage': {
        info: 'The amount of used '+
        '<a href="https://en.wikipedia.org/wiki/Memory_paging#Unix_and_Unix-like_systems" target="_blank">swap</a> '+
        'memory.'
    },

    'services.io_read': {
        info: 'The amount of data transferred from specific devices as seen by the CFQ scheduler. '+
        'It is not updated when the CFQ scheduler is operating on a request queue.'
    },

    'services.io_write': {
        info: 'The amount of data transferred to specific devices as seen by the CFQ scheduler. '+
        'It is not updated when the CFQ scheduler is operating on a request queue.'
    },

    'services.io_ops_read': {
        info: 'The number of read operations performed on specific devices as seen by the CFQ scheduler.'
    },

    'services.io_ops_write': {
        info: 'The number write operations performed on specific devices as seen by the CFQ scheduler.'
    },

    'services.throttle_io_read': {
        info: 'The amount of data transferred from specific devices as seen by the throttling policy.'
    },

    'services.throttle_io_write': {
        info: 'The amount of data transferred to specific devices as seen by the throttling policy.'
    },

    'services.throttle_io_ops_read': {
        info: 'The number of read operations performed on specific devices as seen by the throttling policy.'
    },

    'services.throttle_io_ops_write': {
        info: 'The number of write operations performed on specific devices as seen by the throttling policy.'
    },

    'services.queued_io_ops_read': {
        info: 'The number of queued read requests.'
    },

    'services.queued_io_ops_write': {
        info: 'The number of queued write requests.'
    },

    'services.merged_io_ops_read': {
        info: 'The number of read requests merged.'
    },

    'services.merged_io_ops_write': {
        info: 'The number of write requests merged.'
    },

    'services.swap_read': {
        info: ebpfSwapRead + '<div id="ebpf_services_swap_read"></div>'
    },

    'services.swap_write': {
        info: ebpfSwapWrite + '<div id="ebpf_services_swap_write"></div>'
    },

    'services.fd_open': {
        info: ebpfFileOpen + '<div id="ebpf_services_file_open"></div>'
    },

    'services.fd_open_error': {
        info: ebpfFileOpenError + '<div id="ebpf_services_file_open_error"></div>'
    },

    'services.fd_close': {
        info: ebpfFileClosed + '<div id="ebpf_services_file_closed"></div>'
    },

    'services.fd_close_error': {
        info: ebpfFileCloseError + '<div id="ebpf_services_file_close_error"></div>'
    },

    'services.vfs_unlink': {
        info: ebpfVFSUnlink + '<div id="ebpf_services_vfs_unlink"></div>'
    },

    'services.vfs_write': {
        info: ebpfVFSWrite + '<div id="ebpf_services_vfs_write"></div>'
    },

    'services.vfs_write_error': {
        info: ebpfVFSWriteError + '<div id="ebpf_services_vfs_write_error"></div>'
    },

    'services.vfs_read': {
        info: ebpfVFSRead + '<div id="ebpf_services_vfs_read"></div>'
    },

    'services.vfs_read_error': {
        info: ebpfVFSReadError + '<div id="ebpf_services_vfs_read_error"></div>'
    },

    'services.vfs_write_bytes': {
        info: ebpfVFSWriteBytes + '<div id="ebpf_services_vfs_write_bytes"></div>'
    },

    'services.vfs_read_bytes': {
        info: ebpfVFSReadBytes + '<div id="ebpf_services_vfs_read_bytes"></div>'
    },

    'services.vfs_fsync': {
        info: ebpfVFSSync + '<div id="ebpf_services_vfs_sync"></div>'
    },

    'services.vfs_fsync_error': {
        info: ebpfVFSSyncError + '<div id="ebpf_services_vfs_sync_error"></div>'
    },
    'services.vfs_open': {
        info: ebpfVFSOpen + '<div id="ebpf_services_vfs_open"></div>'
    },
    'services.vfs_open_error': {
        info: ebpfVFSOpenError + '<div id="ebpf_services_vfs_open_error"></div>'
    },
    'services.vfs_create': {
        info: ebpfVFSCreate + '<div id="ebpf_services_vfs_create"></div>'
    },
    'services.vfs_create_error': {
        info: ebpfVFSCreateError + '<div id="ebpf_services_vfs_create_error"></div>'
    },
    'services.process_create': {
        info: ebpfProcessCreate + '<div id="ebpf_services_process_create"></div>'
    },

    'services.thread_create': {
        info: ebpfThreadCreate + '<div id="ebpf_services_thread_create"></div>'
    },

    'services.task_exit': {
        info: ebpfTaskExit + '<div id="ebpf_services_process_exit"></div>'
    },

    'services.task_close': {
        info: ebpfTaskClose + '<div id="ebpf_services_task_release"></div>'
    },

    'services.task_error': {
        info: ebpfTaskError + '<div id="ebpf_services_task_error"></div>'
    },

    'services.dc_hit_ratio': {
        info: ebpfDCHit + '<div id="ebpf_services_dc_hit"></div>'
    },

    'services.dc_reference': {
        info: ebpfDCReference + '<div id="ebpf_services_dc_reference"></div>'
    },

    'services.dc_not_cache': {
        info: ebpfDCNotCache + '<div id="ebpf_services_dc_not_cache"></div>'
    },

    'services.dc_not_found': {
        info: ebpfDCNotFound + '<div id="ebpf_services_dc_not_found"></div>'
    },

    'services.cachestat_ratio': {
        info: ebpfCachestatRatio + '<div id="ebpf_services_cachestat_ratio"></div>'
    },

    'services.cachestat_dirties': {
        info: ebpfCachestatDirties + '<div id="ebpf_services_cachestat_dirties"></div>'
    },
    'services.cachestat_hits': {
        info: ebpfCachestatHits + '<div id="ebpf_services_cachestat_hits"></div>'
    },
    'services.cachestat_misses': {
        info: ebpfCachestatMisses + '<div id="ebpf_services_cachestat_misses"></div>'
    },
    'services.shmget': {
        info: ebpfSHMget + '<div id="ebpf_services_shm_get"></div>'
    },

    'services.shmat': {
        info: ebpfSHMat + '<div id="ebpf_services_shm_at"></div>'
    },

    'services.shmdt': {
        info: ebpfSHMdt + '<div id="ebpf_services_shm_dt"></div>'
    },

    'services.shmctl': {
        info: ebpfSHMctl + '<div id="ebpf_services_shm_ctl"></div>'
    },

    'services.outbound_conn_v4': {
        info: ebpfIPV4conn + '<div id="ebpf_services_outbound_conn_ipv4"></div>'
    },

    'services.outbound_conn_v6': {
        info: ebpfIPV6conn + '<div id="ebpf_services_outbound_conn_ipv6"></div>'
    },
    'services.net_bytes_send': {
        info: ebpfBandwidthSent + '<div id="ebpf_services_bandwidth_sent"></div>'
    },

    'services.net_bytes_recv': {
        info: ebpfBandwidthRecv + '<div id="ebpf_services_bandwidth_received"></div>'
    },

    'services.net_tcp_send': {
        info: ebpfTCPSendCall + '<div id="ebpf_services_bandwidth_tcp_sent"></div>'
    },

    'services.net_tcp_recv': {
        info: ebpfTCPRecvCall + '<div id="ebpf_services_bandwidth_tcp_received"></div>'
    },

    'services.net_retransmit': {
        info: ebpfTCPRetransmit + '<div id="ebpf_services_tcp_retransmit"></div>'
    },

    'services.net_udp_send': {
        info: ebpfUDPsend + '<div id="ebpf_services_udp_sendmsg"></div>'
    },

    'services.net_udp_recv': {
       info: ebpfUDPrecv + '<div id="ebpf_services_udp_recv"></div>'



    },

    // ------------------------------------------------------------------------
    // beanstalkd
    // system charts
    'beanstalk.cpu_usage': {
        info: 'Amount of CPU Time for user and system used by beanstalkd.'
    },

    // This is also a per-tube stat
    'beanstalk.jobs_rate': {
        info: 'The rate of jobs processed by the beanstalkd served.'
    },

    'beanstalk.connections_rate': {
        info: 'The rate of connections opened to beanstalkd.'
    },

    'beanstalk.commands_rate': {
        info: 'The rate of commands received by beanstalkd.'
    },

    'beanstalk.current_tubes': {
        info: 'Total number of current tubes on the server including the default tube (which always exists).'
    },

    'beanstalk.current_jobs': {
        info: 'Current number of jobs in all tubes grouped by status: urgent, ready, reserved, delayed and buried.'
    },

    'beanstalk.current_connections': {
        info: 'Current number of connections group by connection type: written, producers, workers, waiting.'
    },

    'beanstalk.binlog': {
        info: 'The rate of records <code>written</code> to binlog and <code>migrated</code> as part of compaction.'
    },

    'beanstalk.uptime': {
        info: 'Total time beanstalkd server has been up for.'
    },

    // tube charts
    'beanstalk.jobs': {
        info: 'Number of jobs currently in the tube grouped by status: urgent, ready, reserved, delayed and buried.'
    },

    'beanstalk.connections': {
        info: 'The current number of connections to this tube grouped by connection type; using, waiting and watching.'
    },

    'beanstalk.commands': {
        info: 'The rate of <code>delete</code> and <code>pause</code> commands executed by beanstalkd.'
    },

    'beanstalk.pause': {
        info: 'Shows info on how long the tube has been paused for, and how long is left remaining on the pause.'
    },

    // ------------------------------------------------------------------------
    // ceph

    'ceph.general_usage': {
        info: 'The usage and available space in all ceph cluster.'
    },

    'ceph.general_objects': {
        info: 'Total number of objects storage on ceph cluster.'
    },

    'ceph.general_bytes': {
        info: 'Cluster read and write data per second.'
    },

    'ceph.general_operations': {
        info: 'Number of read and write operations per second.'
    },

    'ceph.general_latency': {
        info: 'Total of apply and commit latency in all OSDs. The apply latency is the total time taken to flush an update to disk. The commit latency is the total time taken to commit an operation to the journal.'
    },

    'ceph.pool_usage': {
        info: 'The usage space in each pool.'
    },

    'ceph.pool_objects': {
        info: 'Number of objects presents in each pool.'
    },

    'ceph.pool_read_bytes': {
        info: 'The rate of read data per second in each pool.'
    },

    'ceph.pool_write_bytes': {
        info: 'The rate of write data per second in each pool.'
    },

    'ceph.pool_read_objects': {
        info: 'Number of read objects per second in each pool.'
    },

    'ceph.pool_write_objects': {
        info: 'Number of write objects per second in each pool.'
    },

    'ceph.osd_usage': {
        info: 'The usage space in each OSD.'
    },

    'ceph.osd_size': {
        info: "Each OSD's size"
    },

    'ceph.apply_latency': {
        info: 'Time taken to flush an update in each OSD.'
    },

    'ceph.commit_latency': {
        info: 'Time taken to commit an operation to the journal in each OSD.'
    },

    // ------------------------------------------------------------------------
    // web_log

    'web_log.response_statuses': {
        info: 'Web server responses by type. <code>success</code> includes <b>1xx</b>, <b>2xx</b>, <b>304</b> and <b>401</b>, <code>error</code> includes <b>5xx</b>, <code>redirect</code> includes <b>3xx</b> except <b>304</b>, <code>bad</code> includes <b>4xx</b> except <b>401</b>, <code>other</code> are all the other responses.',
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="success"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Successful"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="redirect"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Redirects"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="bad"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Bad Requests"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="error"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Server Errors"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            }
        ]
    },

    'web_log.response_codes': {
        info: 'Web server responses by code family. ' +
            'According to the standards <code>1xx</code> are informational responses, ' +
            '<code>2xx</code> are successful responses, ' +
            '<code>3xx</code> are redirects (although they include <b>304</b> which is used as "<b>not modified</b>"), ' +
            '<code>4xx</code> are bad requests, ' +
            '<code>5xx</code> are internal server errors, ' +
            '<code>other</code> are non-standard responses, ' +
            '<code>unmatched</code> counts the lines in the log file that are not matched by the plugin (<a href="https://github.com/netdata/netdata/issues/new?title=web_log%20reports%20unmatched%20lines&body=web_log%20plugin%20reports%20unmatched%20lines.%0A%0AThis%20is%20my%20log:%0A%0A%60%60%60txt%0A%0Aplease%20paste%20your%20web%20server%20log%20here%0A%0A%60%60%60" target="_blank">let us know</a> if you have any unmatched).'
    },

    'web_log.response_time': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="avg"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Average Response Time"'
                    + ' data-units="milliseconds"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },

    'web_log.detailed_response_codes': {
        info: 'Number of responses for each response code individually.'
    },

    'web_log.requests_per_ipproto': {
        info: 'Web server requests received per IP protocol version.'
    },

    'web_log.clients': {
        info: 'Unique client IPs accessing the web server, within each data collection iteration. If data collection is <b>per second</b>, this chart shows <b>unique client IPs per second</b>.'
    },

    'web_log.clients_all': {
        info: 'Unique client IPs accessing the web server since the last restart of netdata. This plugin keeps in memory all the unique IPs that have accessed the web server. On very busy web servers (several millions of unique IPs) you may want to disable this chart (check <a href="https://github.com/netdata/netdata/blob/master/collectors/python.d.plugin/web_log/web_log.conf" target="_blank"><code>/etc/netdata/python.d/web_log.conf</code></a>).'
    },

    // ------------------------------------------------------------------------
    // web_log for squid

    'web_log.squid_response_statuses': {
        info: 'Squid responses by type. ' +
            '<code>success</code> includes <b>1xx</b>, <b>2xx</b>, <b>000</b>, <b>304</b>, ' +
            '<code>error</code> includes <b>5xx</b> and <b>6xx</b>, ' +
            '<code>redirect</code> includes <b>3xx</b> except <b>304</b>, ' +
            '<code>bad</code> includes <b>4xx</b>, ' +
            '<code>other</code> are all the other responses.',
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="success"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Successful"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="redirect"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Redirects"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="bad"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Bad Requests"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="error"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Server Errors"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            }
        ]
    },

    'web_log.squid_response_codes': {
        info: 'Web server responses by code family. ' +
            'According to HTTP standards <code>1xx</code> are informational responses, ' +
            '<code>2xx</code> are successful responses, ' +
            '<code>3xx</code> are redirects (although they include <b>304</b> which is used as "<b>not modified</b>"), ' +
            '<code>4xx</code> are bad requests, ' +
            '<code>5xx</code> are internal server errors. ' +
            'Squid also defines <code>000</code> mostly for UDP requests, and ' +
            '<code>6xx</code> for broken upstream servers sending wrong headers. ' +
            'Finally, <code>other</code> are non-standard responses, and ' +
            '<code>unmatched</code> counts the lines in the log file that are not matched by the plugin (<a href="https://github.com/netdata/netdata/issues/new?title=web_log%20reports%20unmatched%20lines&body=web_log%20plugin%20reports%20unmatched%20lines.%0A%0AThis%20is%20my%20log:%0A%0A%60%60%60txt%0A%0Aplease%20paste%20your%20web%20server%20log%20here%0A%0A%60%60%60" target="_blank">let us know</a> if you have any unmatched).'
    },

    'web_log.squid_duration': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="avg"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Average Response Time"'
                    + ' data-units="milliseconds"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },

    'web_log.squid_detailed_response_codes': {
        info: 'Number of responses for each response code individually.'
    },

    'web_log.squid_clients': {
        info: 'Unique client IPs accessing squid, within each data collection iteration. If data collection is <b>per second</b>, this chart shows <b>unique client IPs per second</b>.'
    },

    'web_log.squid_clients_all': {
        info: 'Unique client IPs accessing squid since the last restart of netdata. This plugin keeps in memory all the unique IPs that have accessed the server. On very busy squid servers (several millions of unique IPs) you may want to disable this chart (check <a href="https://github.com/netdata/netdata/blob/master/collectors/python.d.plugin/web_log/web_log.conf" target="_blank"><code>/etc/netdata/python.d/web_log.conf</code></a>).'
    },

    'web_log.squid_transport_methods': {
        info: 'Break down per delivery method: <code>TCP</code> are requests on the HTTP port (usually 3128), ' +
            '<code>UDP</code> are requests on the ICP port (usually 3130), or HTCP port (usually 4128). ' +
            'If ICP logging was disabled using the log_icp_queries option, no ICP replies will be logged. ' +
            '<code>NONE</code> are used to state that squid delivered an unusual response or no response at all. ' +
            'Seen with cachemgr requests and errors, usually when the transaction fails before being classified into one of the above outcomes. ' +
            'Also seen with responses to <code>CONNECT</code> requests.'
    },

    'web_log.squid_code': {
        info: 'These are combined squid result status codes. A break down per component is given in the following charts. ' +
            'Check the <a href="http://wiki.squid-cache.org/SquidFaq/SquidLogs" target="_blank">squid documentation about them</a>.'
    },

    'web_log.squid_handling_opts': {
        info: 'These tags are optional and describe why the particular handling was performed or where the request came from. ' +
            '<code>CLIENT</code> means that the client request placed limits affecting the response. Usually seen with client issued a <b>no-cache</b>, or analogous cache control command along with the request. Thus, the cache has to validate the object.' +
            '<code>IMS</code> states that the client sent a revalidation (conditional) request. ' +
            '<code>ASYNC</code>, is used when the request was generated internally by Squid. Usually this is background fetches for cache information exchanges, background revalidation from stale-while-revalidate cache controls, or ESI sub-objects being loaded. ' +
            '<code>SWAPFAIL</code> is assigned when the object was believed to be in the cache, but could not be accessed. A new copy was requested from the server. ' +
            '<code>REFRESH</code> when a revalidation (conditional) request was sent to the server. ' +
            '<code>SHARED</code> when this request was combined with an existing transaction by collapsed forwarding. NOTE: the existing request is not marked as SHARED. ' +
            '<code>REPLY</code> when particular handling was requested in the HTTP reply from server or peer. Usually seen on DENIED due to http_reply_access ACLs preventing delivery of servers response object to the client.'
    },

    'web_log.squid_object_types': {
        info: 'These tags are optional and describe what type of object was produced. ' +
            '<code>NEGATIVE</code> is only seen on HIT responses, indicating the response was a cached error response. e.g. <b>404 not found</b>. ' +
            '<code>STALE</code> means the object was cached and served stale. This is usually caused by stale-while-revalidate or stale-if-error cache controls. ' +
            '<code>OFFLINE</code> when the requested object was retrieved from the cache during offline_mode. The offline mode never validates any object. ' +
            '<code>INVALID</code> when an invalid request was received. An error response was delivered indicating what the problem was. ' +
            '<code>FAIL</code> is only seen on <code>REFRESH</code> to indicate the revalidation request failed. The response object may be the server provided network error or the stale object which was being revalidated depending on stale-if-error cache control. ' +
            '<code>MODIFIED</code> is only seen on <code>REFRESH</code> responses to indicate revalidation produced a new modified object. ' +
            '<code>UNMODIFIED</code> is only seen on <code>REFRESH</code> responses to indicate revalidation produced a <b>304</b> (Not Modified) status, which was relayed to the client. ' +
            '<code>REDIRECT</code> when squid generated an HTTP redirect response to this request.'
    },

    'web_log.squid_cache_events': {
        info: 'These tags are optional and describe whether the response was loaded from cache, network, or otherwise. ' +
            '<code>HIT</code> when the response object delivered was the local cache object. ' +
            '<code>MEM</code> when the response object came from memory cache, avoiding disk accesses. Only seen on HIT responses. ' +
            '<code>MISS</code> when the response object delivered was the network response object. ' +
            '<code>DENIED</code> when the request was denied by access controls. ' +
            '<code>NOFETCH</code> an ICP specific type, indicating service is alive, but not to be used for this request (sent during "-Y" startup, or during frequent failures, a cache in hit only mode will return either UDP_HIT or UDP_MISS_NOFETCH. Neighbours will thus only fetch hits). ' +
            '<code>TUNNEL</code> when a binary tunnel was established for this transaction.'
    },

    'web_log.squid_transport_errors': {
        info: 'These tags are optional and describe some error conditions which occurred during response delivery (if any). ' +
            '<code>ABORTED</code> when the response was not completed due to the connection being aborted (usually by the client). ' +
            '<code>TIMEOUT</code>, when the response was not completed due to a connection timeout.'
    },

     // ------------------------------------------------------------------------
    // go web_log

    'web_log.type_requests': {
        info: 'Web server responses by type. <code>success</code> includes <b>1xx</b>, <b>2xx</b>, <b>304</b> and <b>401</b>, <code>error</code> includes <b>5xx</b>, <code>redirect</code> includes <b>3xx</b> except <b>304</b>, <code>bad</code> includes <b>4xx</b> except <b>401</b>, <code>other</code> are all the other responses.',
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="success"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Successful"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="redirect"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Redirects"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="bad"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Bad Requests"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            },

            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="error"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Server Errors"'
                    + ' data-units="requests/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-common-max="' + id + '"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="0"'
                    + ' role="application"></div>';
            }
        ]
    },

    'web_log.request_processing_time': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="avg"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Average Response Time"'
                    + ' data-units="milliseconds"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    // ------------------------------------------------------------------------
    // Fronius Solar Power




    // ------------------------------------------------------------------------
    // Stiebel Eltron Heat pump installation


    // ------------------------------------------------------------------------
    // Port check

    'portcheck.latency': {
        info: 'The <code>latency</code> describes the time spent connecting to a TCP port. No data is sent or received. ' +
            'Currently, the accuracy of the latency is low and should be used as reference only.'
    },

    'portcheck.status': {
        valueRange: "[0, 1]",
        info: 'The <code>status</code> chart verifies the availability of the service. ' +
            'Each status dimension will have a value of <code>1</code> if triggered. Dimension <code>success</code> is <code>1</code> only if connection could be established. ' +
            'This chart is most useful for alarms and third-party apps.'
    },

    // ------------------------------------------------------------------------

    'chrony.stratum': {
        info: 'The stratum indicates the distance (hops) to the computer with the reference clock. The higher the stratum number, the more the timing accuracy and stability degrades.',
    },
    'chrony.current_correction': {
        info: 'Any error in the system clock is corrected by slightly speeding up or slowing down the system clock until the error has been removed, and then returning to the system clock’s normal speed. A consequence of this is that there will be a period when the system clock (as read by other programs) will be different from chronyd\'s estimate of the current true time (which it reports to NTP clients when it is operating as a server). The reported value is the difference due to this effect.',
    },

    'chrony.root_delay': {
        info: 'The total of the network path delays to the stratum-1 computer from which the computer is ultimately synchronised.'
    },

    'chrony.root_dispersion': {
        info: 'The total dispersion accumulated through all the computers back to the stratum-1 computer from which the computer is ultimately synchronised. Dispersion is due to system clock resolution, statistical measurement variations, etc.'
    },

    'chrony.last_offset': {
        info: 'The estimated local offset on the last clock update. A positive value indicates the local time (as previously estimated true time) was ahead of the time sources.',
    },

    'chrony.frequency': {
        info: 'The <b>frequency</b> is the rate by which the system’s clock would be wrong if chronyd was not correcting it. It is expressed in ppm (parts per million). For example, a value of 1 ppm would mean that when the system’s clock thinks it has advanced 1 second, it has actually advanced by 1.000001 seconds relative to true time.',
    },

    'chrony.residual_frequency': {
        info: 'The <b>residual frequency</b> for the currently selected reference source. This reflects any difference between what the measurements from the reference source indicate the frequency should be and the frequency currently being used. The reason this is not always zero is that a smoothing procedure is applied to the frequency.',
    },

    'chrony.skew': {
        info: 'The estimated error bound on the frequency.',
    },

    'chrony.ref_measurement_time': {
        info: 'The time elapsed since the last measurement from the reference source was processed.',
    },

    'chrony.leap_status': {
        info: '<p>The current leap status of the source.</p><p><b>Normal</b> - indicates the normal status (no leap second). <b>InsertSecond</b> - indicates that a leap second will be inserted at the end of the month. <b>DeleteSecond</b> - indicates that a leap second will be deleted at the end of the month. <b>Unsynchronised</b> - the server has not synchronized properly with the NTP server.</p>',
    },
    'chrony.activity': {
        info: '<p>The number of servers and peers that are online and offline.</p><p><b>Online</b> - the server or peer is currently online (i.e. assumed by chronyd to be reachable). <b>Offline</b> - the server or peer is currently offline (i.e. assumed by chronyd to be unreachable, and no measurements from it will be attempted). <b>BurstOnline</b> - a burst command has been initiated for the server or peer and is being performed. After the burst is complete, the server or peer will be returned to the online state. <b>BurstOffline</b> - a burst command has been initiated for the server or peer and is being performed. After the burst is complete, the server or peer will be returned to the offline state. <b>Unresolved</b> - the name of the server or peer was not resolved to an address yet.</p>',
    },

    'couchdb.active_tasks': {
        info: 'Active tasks running on this CouchDB <b>cluster</b>. Four types of tasks currently exist: indexer (view building), replication, database compaction and view compaction.'
    },

    'couchdb.replicator_jobs': {
        info: 'Detailed breakdown of any replication jobs in progress on this node. For more information, see the <a href="http://docs.couchdb.org/en/latest/replication/replicator.html" target="_blank">replicator documentation</a>.'
    },

    'couchdb.open_files': {
        info: 'Count of all files held open by CouchDB. If this value seems pegged at 1024 or 4096, your server process is probably hitting the open file handle limit and <a href="http://docs.couchdb.org/en/latest/maintenance/performance.html#pam-and-ulimit" target="_blank">needs to be increased.</a>'
    },

    'btrfs.disk': {
        info: 'Physical disk usage of BTRFS. The disk space reported here is the raw physical disk space assigned to the BTRFS volume (i.e. <b>before any RAID levels</b>). BTRFS uses a two-stage allocator, first allocating large regions of disk space for one type of block (data, metadata, or system), and then using a regular block allocator inside those regions. <code>unallocated</code> is the physical disk space that is not allocated yet and is available to become data, metadata or system on demand. When <code>unallocated</code> is zero, all available disk space has been allocated to a specific function. Healthy volumes should ideally have at least five percent of their total space <code>unallocated</code>. You can keep your volume healthy by running the <code>btrfs balance</code> command on it regularly (check <code>man btrfs-balance</code> for more info).  Note that some of the space listed as <code>unallocated</code> may not actually be usable if the volume uses devices of different sizes.',
        colors: [NETDATA.colors[12]]
    },

    'btrfs.data': {
        info: 'Logical disk usage for BTRFS data. Data chunks are used to store the actual file data (file contents). The disk space reported here is the usable allocation (i.e. after any striping or replication). Healthy volumes should ideally have no more than a few GB of free space reported here persistently. Running <code>btrfs balance</code> can help here.'
    },

    'btrfs.metadata': {
        info: 'Logical disk usage for BTRFS metadata. Metadata chunks store most of the filesystem internal structures, as well as information like directory structure and file names. The disk space reported here is the usable allocation (i.e. after any striping or replication). Healthy volumes should ideally have no more than a few GB of free space reported here persistently. Running <code>btrfs balance</code> can help here.'
    },

    'btrfs.system': {
        info: 'Logical disk usage for BTRFS system. System chunks store information about the allocation of other chunks. The disk space reported here is the usable allocation (i.e. after any striping or replication). The values reported here should be relatively small compared to Data and Metadata, and will scale with the volume size and overall space usage.'
    },

    // ------------------------------------------------------------------------
    // RabbitMQ

    // info: the text above the charts
    // heads: the representation of the chart at the top the subsection (second level menu)
    // mainheads: the representation of the chart at the top of the section (first level menu)
    // colors: the dimension colors of the chart (the default colors are appended)
    // height: the ratio of the chart height relative to the default

    'rabbitmq.queued_messages': {
        info: 'Overall total of ready and unacknowledged queued messages.  Messages that are delivered immediately are not counted here.'
    },

    'rabbitmq.message_rates': {
        info: 'Overall messaging rates including acknowledgements, deliveries, redeliveries, and publishes.'
    },

    'rabbitmq.global_counts': {
        info: 'Overall totals for channels, consumers, connections, queues and exchanges.'
    },

    'rabbitmq.file_descriptors': {
        info: 'Total number of used filed descriptors. See <code><a href="https://www.rabbitmq.com/production-checklist.html#resource-limits-file-handle-limit" target="_blank">Open File Limits</a></code> for further details.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.sockets': {
        info: 'Total number of used socket descriptors.  Each used socket also counts as a used file descriptor.  See <code><a href="https://www.rabbitmq.com/production-checklist.html#resource-limits-file-handle-limit" target="_blank">Open File Limits</a></code> for further details.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.processes': {
        info: 'Total number of processes running within the Erlang VM.  This is not the same as the number of processes running on the host.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.erlang_run_queue': {
        info: 'Number of Erlang processes the Erlang schedulers have queued to run.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.memory': {
        info: 'Total amount of memory used by the RabbitMQ.  This is a complex statistic that can be further analyzed in the management UI.  See <code><a href="https://www.rabbitmq.com/production-checklist.html#resource-limits-ram" target="_blank">Memory</a></code> for further details.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.disk_space': {
        info: 'Total amount of disk space consumed by the message store(s).  See <code><a href="https://www.rabbitmq.com/production-checklist.html#resource-limits-disk-space" target=_"blank">Disk Space Limits</a></code> for further details.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.queue_messages': {
        info: 'Total amount of messages and their states in this queue.',
        colors: NETDATA.colors[3]
    },

    'rabbitmq.queue_messages_stats': {
        info: 'Overall messaging rates including acknowledgements, deliveries, redeliveries, and publishes.',
        colors: NETDATA.colors[3]
    },

    // ------------------------------------------------------------------------
    // ntpd

    'ntpd.sys_offset': {
        info: 'For hosts without any time critical services an offset of &lt; 100 ms should be acceptable even with high network latencies. For hosts with time critical services an offset of about 0.01 ms or less can be achieved by using peers with low delays and configuring optimal <b>poll exponent</b> values.',
        colors: NETDATA.colors[4]
    },

    'ntpd.sys_jitter': {
        info: 'The jitter statistics are exponentially-weighted RMS averages. The system jitter is defined in the NTPv4 specification; the clock jitter statistic is computed by the clock discipline module.'
    },

    'ntpd.sys_frequency': {
        info: 'The frequency offset is shown in ppm (parts per million) relative to the frequency of the system. The frequency correction needed for the clock can vary significantly between boots and also due to external influences like temperature or radiation.',
        colors: NETDATA.colors[2],
        height: 0.6
    },

    'ntpd.sys_wander': {
        info: 'The wander statistics are exponentially-weighted RMS averages.',
        colors: NETDATA.colors[3],
        height: 0.6
    },

    'ntpd.sys_rootdelay': {
        info: 'The rootdelay is the round-trip delay to the primary reference clock, similar to the delay shown by the <code>ping</code> command. A lower delay should result in a lower clock offset.',
        colors: NETDATA.colors[1]
    },

    'ntpd.sys_stratum': {
        info: 'The distance in "hops" to the primary reference clock',
        colors: NETDATA.colors[5],
        height: 0.3
    },

    'ntpd.sys_tc': {
        info: 'Time constants and poll intervals are expressed as exponents of 2. The default poll exponent of 6 corresponds to a poll interval of 64 s. For typical Internet paths, the optimum poll interval is about 64 s. For fast LANs with modern computers, a poll exponent of 4 (16 s) is appropriate. The <a href="http://doc.ntp.org/current-stable/poll.html" target="_blank">poll process</a> sends NTP packets at intervals determined by the clock discipline algorithm.',
        height: 0.5
    },

    'ntpd.sys_precision': {
        colors: NETDATA.colors[6],
        height: 0.2
    },

    'ntpd.peer_offset': {
        info: 'The offset of the peer clock relative to the system clock in milliseconds. Smaller values here weight peers more heavily for selection after the initial synchronization of the local clock. For a system providing time service to other systems, these should be as low as possible.'
    },

    'ntpd.peer_delay': {
        info: 'The round-trip time (RTT) for communication with the peer, similar to the delay shown by the <code>ping</code> command. Not as critical as either the offset or jitter, but still factored into the selection algorithm (because as a general rule, lower delay means more accurate time). In most cases, it should be below 100ms.'
    },

    'ntpd.peer_dispersion': {
        info: 'This is a measure of the estimated error between the peer and the local system. Lower values here are better.'
    },

    'ntpd.peer_jitter': {
        info: 'This is essentially a remote estimate of the peer\'s <code>system_jitter</code> value. Lower values here weight highly in favor of peer selection, and this is a good indicator of overall quality of a given time server (good servers will have values not exceeding single digit milliseconds here, with high quality stratum one servers regularly having sub-millisecond jitter).'
    },

    'ntpd.peer_xleave': {
        info: 'This variable is used in interleaved mode (used only in NTP symmetric and broadcast modes). See <a href="http://doc.ntp.org/current-stable/xleave.html" target="_blank">NTP Interleaved Modes</a>.'
    },

    'ntpd.peer_rootdelay': {
        info: 'For a stratum 1 server, this is the access latency for the reference clock. For lower stratum servers, it is the sum of the <code>peer_delay</code> and <code>peer_rootdelay</code> for the system they are syncing off of. Similarly to <code>peer_delay</code>, lower values here are technically better, but have limited influence in peer selection.'
    },

    'ntpd.peer_rootdisp': {
        info: 'Is the same as <code>peer_rootdelay</code>, but measures accumulated <code>peer_dispersion</code> instead of accumulated <code>peer_delay</code>.'
    },

    'ntpd.peer_hmode': {
        info: 'The <code>peer_hmode</code> and <code>peer_pmode</code> variables give info about what mode the packets being sent to and received from a given peer are. Mode 1 is symmetric active (both the local system and the remote peer have each other declared as peers in <code>/etc/ntp.conf</code>), Mode 2 is symmetric passive (only one side has the other declared as a peer), Mode 3 is client, Mode 4 is server, and Mode 5 is broadcast (also used for multicast and manycast operation).',
        height: 0.2
    },

    'ntpd.peer_pmode': {
        height: 0.2
    },

    'ntpd.peer_hpoll': {
        info: 'The <code>peer_hpoll</code> and <code>peer_ppoll</code> variables are log2 representations of the polling interval in seconds.',
        height: 0.5
    },

    'ntpd.peer_ppoll': {
        height: 0.5
    },

    'ntpd.peer_precision': {
        height: 0.2
    },

    'spigotmc.tps': {
        info: 'The running 1, 5, and 15 minute average number of server ticks per second.  An idealized server will show 20.0 for all values, but in practice this almost never happens.  Typical servers should show approximately 19.98-20.0 here.  Lower values indicate progressively more server-side lag (and thus that you need better hardware for your server or a lower user limit).  For every 0.05 ticks below 20, redstone clocks will lag behind by approximately 0.25%.  Values below approximately 19.50 may interfere with complex free-running redstone circuits and will noticeably slow down growth.'
    },

    'spigotmc.users': {
        info: 'The number of currently connected users on the monitored Spigot server.'
    },

    'boinc.tasks': {
        info: 'The total number of tasks and the number of active tasks.  Active tasks are those which are either currently being processed, or are partially processed but suspended.'
    },

    'boinc.states': {
        info: 'Counts of tasks in each task state.  The normal sequence of states is <code>New</code>, <code>Downloading</code>, <code>Ready to Run</code>, <code>Uploading</code>, <code>Uploaded</code>.  Tasks which are marked <code>Ready to Run</code> may be actively running, or may be waiting to be scheduled.  <code>Compute Errors</code> are tasks which failed for some reason during execution.  <code>Aborted</code> tasks were manually cancelled, and will not be processed.  <code>Failed Uploads</code> are otherwise finished tasks which failed to upload to the server, and usually indicate networking issues.'
    },

    'boinc.sched': {
        info: 'Counts of active tasks in each scheduling state.  <code>Scheduled</code> tasks are the ones which will run if the system is permitted to process tasks.  <code>Preempted</code> tasks are on standby, and will run if a <code>Scheduled</code> task stops running for some reason.  <code>Uninitialized</code> tasks should never be present, and indicate tha the scheduler has not tried to schedule them yet.'
    },

    'boinc.process': {
        info: 'Counts of active tasks in each process state.  <code>Executing</code> tasks are running right now.  <code>Suspended</code> tasks have an associated process, but are not currently running (either because the system isn\'t processing any tasks right now, or because they have been preempted by higher priority tasks).  <code>Quit</code> tasks are exiting gracefully.  <code>Aborted</code> tasks exceeded some resource limit, and are being shut down.  <code>Copy Pending</code> tasks are waiting on a background file transfer to finish.  <code>Uninitialized</code> tasks do not have an associated process yet.'
    },

    'w1sensor.temp': {
        info: 'Temperature derived from 1-Wire temperature sensors.'
    },

    'logind.sessions': {
        info: 'Shows the number of active sessions of each type tracked by logind.'
    },

    'logind.users': {
        info: 'Shows the number of active users of each type tracked by logind.'
    },

    'logind.sessions_state': {
        info: '<p>Sessions in each session state.</p><p><b>Online</b> - logged in and running in the background. <b>Closing</b> - nominally logged out, but some processes belonging to it are still around. <b>Active</b> - logged in and running in the foreground.</p>'
    },
    'logind.users_state': {
        info: '<p>Users in each user state.</p><p><b>Offline</b> - users are not logged in. <b>Closing</b> - users are in the process of logging out without lingering. <b>Online</b> - users are logged in, but have no active sessions. <b>Lingering</b> - users are not logged in, but have one or more services still running. <b>Active</b> - users are logged in, and have at least one active session.</p>'
    },

    // ------------------------------------------------------------------------
    // ProxySQL

    'proxysql.pool_status': {
        info: '后端服务器的状态。 ' +
            '<code>1=ONLINE</code>：后端服务器完全可操作， ' +
            '<code>2=SHUNNED</code>：后端服务器由于连接错误过多或复制延迟超过允许的阈值而暂时停用， ' +
            '<code>3=OFFLINE_SOFT</code>：当服务器处于OFFLINE_SOFT模式时，不再接受新的传入连接，而现有连接保持活动状态，直到它们变为非活动状态。换句话说，连接保持使用，直到当前事务完成。这允许优雅地分离后端， ' +
            '<code>4=OFFLINE_HARD</code>：当服务器处于OFFLINE_HARD模式时，现有连接被丢弃，而新的传入连接也不再接受。这相当于从主机组中删除服务器，或者暂时将其从主机组中移出以进行维护工作， ' +
            '<code>-1</code>：未知状态。'
    },

    'proxysql.pool_net': {
        info: '发送到/接收自后端的数据量（不包括元数据（数据包的标头、OK/ERR数据包、字段描述等）。'
    },

    'proxysql.pool_overall_net': {
        info: '发送到/接收自所有后端的数据量（不包括元数据（数据包的标头、OK/ERR数据包、字段描述等）。'
    },

    'proxysql.questions': {
        info: '<code>questions</code>：从前端发送的查询总数， ' +
            '<code>slow_queries</code>：运行时间超过全局变量 <code>mysql-long_query_time</code> 中定义的毫秒阈值的查询数量。'
    },

    'proxysql.connections': {
        info: '<code>aborted</code>：因无效凭据或达到最大连接数而中止的前端连接数， ' +
            '<code>connected</code>：当前连接的前端连接数， ' +
            '<code>created</code>：创建的前端连接数， ' +
            '<code>non_idle</code>：当前未处于空闲状态的前端连接数。 '
    },

    'proxysql.pool_latency': {
        info: '从监视器报告的当前ping时间，以微秒为单位。'
    },

    'proxysql.queries': {
        info: '路由到该特定后端服务器的查询数量。'
    },

    'proxysql.pool_used_connections': {
        info: 'ProxySQL当前正在使用的连接数，用于将查询发送到后端服务器。'
    },

    'proxysql.pool_free_connections': {
        info: '当前空闲的连接数。它们保持打开状态，以最小化将查询发送到后端服务器的时间成本。'
    },

    'proxysql.pool_ok_connections': {
        info: '成功建立的连接数。'
    },

    'proxysql.pool_error_connections': {
        info: '未成功建立的连接数。'
    },

    'proxysql.commands_count': {
        info: '执行的该类型命令的总数。'
    },

    'proxysql.commands_duration': {
        info: '执行该类型命令所花费的总时间，以毫秒计。'
    },

    // ------------------------------------------------------------------------
    // Power Supplies

    'powersupply.capacity': {
        info: '当前电池电量。'
    },

    'powersupply.charge': {
        info: '<p>电池电量，以安时（Ah）表示。</p>' +
            '<p><b>now</b> - 当前电量值。 ' +
            '<b>full</b>, <b>empty</b> - 电池充满/耗尽时的电量值。 ' +
            '它也可以表示“在给定条件（温度、年龄）下，电池被视为充满/耗尽时的电量值”。 ' +
            '即这些属性代表实际的阈值，而不是设计值。 ' +
            '<b>full_design</b>, <b>empty_design</b> - 设计时的电量值，电池被视为充满/耗尽时的电量。</p>'
    },

    'powersupply.energy': {
        info: '<p>电池电量，以瓦时（Wh）表示。</p>' +
            '<p><b>now</b> - 当前电量值。 ' +
            '<b>full</b>, <b>empty</b> - 电池充满/耗尽时的电量值。 ' +
            '它也可以表示“在给定条件（温度、年龄）下，电池被视为充满/耗尽时的电量值”。 ' +
            '即这些属性代表实际的阈值，而不是设计值。 ' +
            '<b>full_design</b>, <b>empty_design</b> - 设计时的电量值，电池被视为充满/耗尽时的电量。</p>'
    },

    'powersupply.voltage': {
        info: '<p>电源电压。</p>' +
            '<p><b>now</b> - 当前电压。 ' +
            '<b>max</b>, <b>min</b> - 硬件能够猜测（测量和保留）给定电源的阈值的电压值。 ' +
            '<b>max_design</b>, <b>min_design</b> - 最大和最小电源电压的设计值。 ' +
            '最大/最小值意味着在正常条件下，电池被视为“充满”/“耗尽”时的电压值。</p>'
    },

    // ------------------------------------------------------------------------
    // VMware vSphere

    // Host specific
    'vsphere.host_mem_usage_percentage': {
        info: '已使用的机器内存的百分比：<code>consumed</code> / <code>machine-memory-size</code>。'
    },

    'vsphere.host_mem_usage': {
        info:
            '<code>granted</code> 是为主机映射的机器内存量，它等于所有已启动虚拟机的已授予指标之和，再加上主机上 vSphere 服务的机器内存量。' +
            '<code>consumed</code> 是主机上已使用的机器内存量，其中包括用于服务控制台、VMkernel、vSphere 服务的内存，以及所有运行虚拟机的总消耗指标。' +
            '<code>consumed</code> = <code>total host memory</code> - <code>free host memory</code>。' +
            '<code>active</code> 是所有已启动虚拟机的活动指标之和，再加上主机上的 vSphere 服务（例如 COS、vpxa）。' +
            '<code>shared</code> 是所有已启动虚拟机的共享指标之和，再加上主机上 vSphere 服务的机器内存量。' +
            '<code>sharedcommon</code> 是所有已启动虚拟机和主机上 vSphere 服务共享的机器内存量。' +
            '<code>shared</code> - <code>sharedcommon</code> = 机器内存（主机内存）节省量（KB）。' +
            '详情请参阅<a href="https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.resmgmt.doc/GUID-BFDC988B-F53D-4E97-9793-A002445AFAE1.html" target="_blank">衡量和区分内存使用类型</a>和' +
            '<a href="https://vdc-repo.vmware.com/vmwb-repository/dcr-public/fe08899f-1eec-4d8d-b3bc-a6664c168c2c/7fdf97a1-4c0d-4be0-9d43-2ceebbc174d9/doc/memory_counters.html" target="_blank">内存计数器</a>文章。'
    },

    'vsphere.host_mem_swap_rate': {
        info:
            '此统计数据涉及 VMkernel 交换，而不涉及客户操作系统交换。' +
            '<code>in</code> 是主机上所有已启动虚拟机的 <code>swapinRate</code> 值之和。' +
            '<code>swapinRate</code> 是 VMKernel 从交换文件向机器内存读取数据的速率。' +
            '<code>out</code> 是主机上所有已启动虚拟机的 <code>swapoutRate</code> 值之和。' +
            '<code>swapoutRate</code> 是 VMKernel 从机器内存向虚拟机的交换文件写入数据的速率。'
    },

    'vsphere.vm_mem_usage_percentage': {
        info: '已使用的虚拟机“物理”内存的百分比：<code>active</code> / <code>虚拟机配置大小</code>。'
    },

    'vsphere.vm_mem_usage': {
        info:
            '<code>granted</code> 是映射到机器内存的客户“物理”内存的数量，其中包括<code>shared</code>内存量。' +
            '<code>consumed</code> 是虚拟机为客户内存而消耗的客户“物理”内存量，' +
            '<code>consumed</code> = <code>granted</code> - <code>由于内存共享而节省的内存</code>。' +
            '<code>active</code> 是根据 VMkernel 基于最近访问的内存页面估算出的活动使用的内存量。' +
            '<code>shared</code> 是与其他虚拟机共享的客户“物理”内存量（通过 VMkernel 的透明页共享机制，一种 RAM 去重技术）。' +
            '详情请参阅<a href="https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.resmgmt.doc/GUID-BFDC988B-F53D-4E97-9793-A002445AFAE1.html" target="_blank">衡量和区分内存使用类型</a>和' +
            '<a href="https://vdc-repo.vmware.com/vmwb-repository/dcr-public/fe08899f-1eec-4d8d-b3bc-a6664c168c2c/7fdf97a1-4c0d-4be0-9d43-2ceebbc174d9/doc/memory_counters.html" target="_blank">内存计数器</a>文章。'
    },

    'vsphere.vm_mem_swap_rate': {
        info:
            '此统计数据涉及 VMkernel 交换，而不涉及客户操作系统交换。' +
            '<code>in</code> 是 VMKernel 从交换文件向机器内存读取数据的速率。' +
            '<code>out</code> 是 VMKernel 从机器内存向虚拟机的交换文件写入数据的速率。'
    },

    'vsphere.vm_mem_swap': {
        info:
            '此统计数据涉及 VMkernel 交换，而不涉及客户操作系统交换。' +
            '<code>swapped</code> 是由 VMkernel 交换到虚拟机交换文件的客户物理内存的数量。' +
            '交换的内存会一直保留在磁盘上，直到虚拟机需要它。'
    },

    // Common
    'vsphere.cpu_usage_total': {
        info: '所有 CPU/核心的汇总 CPU 使用率统计信息。'
    },

    'vsphere.net_bandwidth_total': {
        info: '所有网络接口的接收/发送统计信息汇总。'
    },

    'vsphere.net_packets_total': {
        info: '所有网络接口的接收/发送统计信息汇总。'
    },

    'vsphere.net_errors_total': {
        info: '所有网络接口的接收/发送统计信息汇总。'
    },

    'vsphere.net_drops_total': {
        info: '所有网络接口的接收/发送统计信息汇总。'
    },

    'vsphere.disk_usage_total': {
        info: '所有磁盘的读取/写入统计信息汇总。'
    },

    'vsphere.disk_max_latency': {
        info: '<code>latency</code> 表示所有磁盘中的最高延迟值。'
    },

    'vsphere.overall_status': {
        info: '<code>0</code> 表示未知，<code>1</code> 表示正常，<code>2</code> 表示可能存在问题，<code>3</code> 表示肯定存在问题。'
    },

    // ------------------------------------------------------------------------
    // VCSA
    'vcsa.system_health': {
        info:
            '<code>-1</code>: 未知；' +
            '<code>0</code>: 所有组件正常；' +
            '<code>1</code>: 一个或多个组件可能很快会过载；' +
            '<code>2</code>: 设备中的一个或多个组件可能已降级；' +
            '<code>3</code>: 一个或多个组件可能处于不可用状态，设备可能很快会无响应；' +
            '<code>4</code>: 没有可用的健康数据。'
    },

    'vcsa.components_health': {
        info:
            '<code>-1</code>: 未知；' +
            '<code>0</code>: 健康；' +
            '<code>1</code>: 健康，但可能存在一些问题；' +
            '<code>2</code>: 降级，并可能存在严重问题；' +
            '<code>3</code>: 不可用，或将很快停止运行；' +
            '<code>4</code>: 没有可用的健康数据。'
    },

    'vcsa.software_updates_health': {
        info:
            '<code>softwarepackages</code> 表示远程 vSphere Update Manager 存储库中可用软件更新的信息。<br>' +
            '<code>-1</code>: 未知；' +
            '<code>0</code>: 没有可用更新；' +
            '<code>2</code>: 有非安全更新可用；' +
            '<code>3</code>: 有安全更新可用；' +
            '<code>4</code>: 检索软件更新信息时出错。'
    },

    // ------------------------------------------------------------------------
    // Zookeeper

    'zookeeper.server_state': {
        info:
            '<code>0</code>: 未知，' +
            '<code>1</code>: 领导者，' +
            '<code>2</code>: 跟随者，' +
            '<code>3</code>: 观察者，' +
            '<code>4</code>: 单机模式。'
    },

    // ------------------------------------------------------------------------
    // Squidlog

    'squidlog.requests': {
        info: '请求总数（读取的日志行数）。它包括<code>unmatched</code>。'
    },

    'squidlog.excluded_requests': {
        info: '<code>unmatched</code> 统计日志文件中未被插件解析器匹配的行数（<a href="https://github.com/netdata/netdata/issues/new?title=squidlog%20reports%20unmatched%20lines&body=squidlog%20plugin%20reports%20unmatched%20lines.%0A%0AThis%20is%20my%20log:%0A%0A%60%60%60txt%0A%0Aplease%20paste%20your%20squid%20server%20log%20here%0A%0A%60%60%60" target="_blank">如果有未匹配的行，请告诉我们</a>）。'
    },

    'squidlog.type_requests': {
        info: '按响应类型的请求数：<br>' +
            '<ul>' +
            ' <li><code>success</code> 包括1xx、2xx、0、304、401。</li>' +
            ' <li><code>error</code> 包括5xx和6xx。</li>' +
            ' <li><code>redirect</code> 包括3xx（除了304）。</li>' +
            ' <li><code>bad</code> 包括4xx（除了401）。</li>' +
            ' </ul>'
    },

    'squidlog.http_status_code_class_responses': {
        info: 'HTTP响应状态码类别。根据<a href="https://tools.ietf.org/html/rfc7231" target="_blank">rfc7231</a>：<br>' +
            '<ul>' +
            ' <li><code>1xx</code> 是信息响应。</li>' +
            ' <li><code>2xx</code> 是成功响应。</li>' +
            ' <li><code>3xx</code> 是重定向。</li>' +
            ' <li><code>4xx</code> 是坏请求。</li>' +
            ' <li><code>5xx</code> 是内部服务器错误。</li>' +
            ' </ul>' +
            'Squid还使用<code>0</code>表示结果代码不可用，<code>6xx</code>表示无效的头部、代理错误。'
    },

    'squidlog.http_status_code_responses': {
        info: '每个HTTP响应状态码的响应数目。'
    },

    'squidlog.uniq_clients': {
        info: '每次数据收集迭代中的唯一客户端（请求实例）。如果数据收集是<b>每秒</b>进行的，则此图表显示<b>每秒的唯一客户端数</b>。'
    },

    'squidlog.bandwidth': {
        info: '大小表示传递给客户端的数据量。请注意，这不构成净对象大小，因为标头也被计算在内。此外，失败的请求可能会传递错误页面，其大小也记录在此处。'
    },

    'squidlog.response_time': {
        info: '经过的时间考虑了事务占用缓存的毫秒数。在TCP和UDP之间的解释不同：' +
            '<ul>' +
            ' <li><code>TCP</code> 基本上是从接收请求到Squid完成发送响应的最后一个字节所用的时间。</li>' +
            ' <li><code>UDP</code> 这是安排回复和实际发送之间的时间。</li>' +
            ' </ul>' +
            '请注意，<b>条目在回复完成发送后记录</b>，而不是事务的生命周期中。'
    },

    'squidlog.cache_result_code_requests': {
        info: 'Squid结果代码由几个标签组成（用下划线字符分隔），它们描述发送给客户端的响应。请查阅有关它们的<a href="https://wiki.squid-cache.org/SquidFaq/SquidLogs#Squid_result_codes" target="_blank">Squid文档</a>。'
    },

    'squidlog.cache_result_code_transport_tag_requests': {
        info: '这些标签始终存在，并描述交付方法。<br>' +
            '<ul>' +
            ' <li><code>TCP</code> 在HTTP端口（通常为3128）上的请求。</li>' +
            ' <li><code>UDP</code> 在ICP端口（通常为3130）或HTCP端口（通常为4128）上的请求。</li>' +
            ' <li><code>NONE</code> Squid提供了异常响应或根本没有响应。在cachemgr请求和错误中看到，通常是当事务在被分类为上述任何一种结果之前失败时。也可在对CONNECT请求的响应中看到。</li>' +
            ' </ul>'
    },

    'squidlog.cache_result_code_handling_tag_requests': {
        info: '这些标签是可选的，描述特定处理是为什么或请求来自哪里。<br>' +
            '<ul>' +
            ' <li><code>CF</code> 此事务中至少有一个请求被折叠。有关请求折叠的更多详细信息，请参见<a href="http://www.squid-cache.org/Doc/config/collapsed_forwarding/" target="_blank">collapsed_forwarding</a>。</li>' +
            ' <li><code>CLIENT</code> 通常与客户端发出了“no-cache”或类似的缓存控制命令一起看到。因此，缓存必须验证对象。</li>' +
            ' <li><code>IMS</code> 客户端发送了重新验证（条件）请求。</li>' +
            ' <li><code>ASYNC</code> 请求是由Squid内部生成的。通常，这是用于缓存信息交换的后台获取，从<i>stale-while-revalidate</i>缓存控制的后台重新验证，或加载ESI子对象。</li>' +
            ' <li><code>SWAPFAIL</code> 认为对象在缓存中，但无法访问。从服务器请求了一个新的副本。</li>' +
            ' <li><code>REFRESH</code> 发送了一个重新验证（条件）请求到服务器。</li>' +
            ' <li><code>SHARED</code> 此请求通过折叠转发与现有事务合并。</li>' +
            ' <li><code>REPLY</code> 来自服务器或对等体的HTTP回复。通常在由于<a href="http://www.squid-cache.org/Doc/config/http_reply_access/" target="_blank">http_reply_access</a> ACL阻止将服务器响应对象传递给客户端的<code>DENIED</code>上看到。</li>' +
            ' </ul>'
    },

    'squidlog.cache_code_object_tag_requests': {
        info: '这些标签是可选的，描述了生成的对象的类型。<br>' +
            '<ul>' +
            ' <li><code>NEGATIVE</code> 仅在命中响应中出现，表示响应是一个缓存的错误响应。例如：<b>404 not found</b>。</li>' +
            ' <li><code>STALE</code> 对象被缓存并提供陈旧的内容。这通常是由于 <i>stale-while-revalidate</i> 或 <i>stale-if-error</i> 缓存控制引起的。</li>' +
            ' <li><code>OFFLINE</code> 在<a href="http://www.squid-cache.org/Doc/config/offline_mode/" target="_blank">offline_mode</a>期间从缓存中检索到请求的对象。离线模式永远不会验证任何对象。</li>' +
            ' <li><code>INVALID</code> 收到一个无效的请求。传递了一个错误响应，指示问题所在。</li>' +
            ' <li><code>FAILED</code> 仅在<code>REFRESH</code>上看到，表示重新验证请求失败。响应对象可能是服务器提供的网络错误，也可能是正在重新验证的陈旧对象，具体取决于stale-if-error缓存控制。</li>' +
            ' <li><code>MODIFIED</code> 仅在<code>REFRESH</code>响应中看到，表示重新验证产生了新的修改对象。</li>' +
            ' <li><code>UNMODIFIED</code> 仅在<code>REFRESH</code>响应中看到，表示重新验证产生了304（未修改）状态。客户端将根据客户端请求和其他细节获得完整的200（OK）、304（未修改）或（理论上）另一个响应。</li>' +
            ' <li><code>REDIRECT</code> Squid生成了HTTP重定向响应以响应此请求。</li>' +
            ' </ul>'
    },

    'squidlog.cache_code_load_source_tag_requests': {
        info: '这些标签是可选的，描述响应是从缓存、网络还是其他位置加载的。<br>' +
            '<ul>' +
            ' <li><code>HIT</code> 提供的响应对象是本地缓存对象。</li>' +
            ' <li><code>MEM</code> 响应对象来自内存缓存，避免了磁盘访问。仅在命中响应中可见。</li>' +
            ' <li><code>MISS</code> 提供的响应对象是网络响应对象。</li>' +
            ' <li><code>DENIED</code> 请求被访问控制拒绝。</li>' +
            ' <li><code>NOFETCH</code> 是ICP特定类型，表示服务是活动的，但不适用于此请求。</li>' +
            ' <li><code>TUNNEL</code> 为此事务建立了二进制隧道。</li>' +
            ' </ul>'
    },

    'squidlog.cache_code_error_tag_requests': {
        info: '这些标签是可选的，描述了在响应交付过程中发生的一些错误条件。<br>' +
            '<ul>' +
            ' <li><code>ABORTED</code>：由于连接被中止（通常是由客户端）而导致响应未完成。</li>' +
            ' <li><code>TIMEOUT</code>：由于连接超时而导致响应未完成。</li>' +
            ' <li><code>IGNORED</code>：在刷新先前缓存的响应 A 时，Squid 获取到比 A 更旧的响应 B（由 Date 标头字段确定）。Squid 忽略了响应 B（并尝试使用 A）。 </li>' +
            ' </ul>'
    },

    'squidlog.http_method_requests': {
        info: '用于获取对象的请求方法。请参阅<a href="https://wiki.squid-cache.org/SquidFaq/SquidLogs#Request_methods" target="_blank">请求方法</a>部分，了解可用方法及其描述。'
    },

    'squidlog.hier_code_requests': {
        info: '解释请求处理方式的代码，例如将其转发到对等方或直接访问源。' +
            '任何层次标记都可以以 <code>TIMEOUT_</code> 为前缀，如果在等待所有 ICP 回复从邻居返回时发生超时。如果未设置<a href="http://www.squid-cache.org/Doc/config/icp_query_timeout/" target="_blank">icp_query_timeout</a>，则超时是动态的，或者已经配置了该超时时间。' +
            '有关层次代码的详细信息，请参阅<a href="https://wiki.squid-cache.org/SquidFaq/SquidLogs#Hierarchy_Codes" target="_blank">Hierarchy Codes</a>。'
    },

    'squidlog.server_address_forwarded_requests': {
        info: '请求（如果是未命中）被转发的IP地址或主机名。对于发送到源服务器的请求，这是源服务器的IP地址。' +
            '对于发送到邻居缓存的请求，这是邻居的主机名。注意：较旧版本的Squid会将源服务器主机名放在这里。'
    },

    'squidlog.mime_type_requests': {
        info: '对象的内容类型，如在HTTP回复头中所见。请注意，ICP交换通常不具有任何内容类型。'
    },

    // ------------------------------------------------------------------------
    // CockroachDB

    'cockroachdb.process_cpu_time_combined_percentage': {
        info: '当前的综合CPU利用率，计算公式为 <code>(用户时间+系统时间)/逻辑CPU的数量</code>。'
    },

    'cockroachdb.host_disk_bandwidth': {
        info: '系统主机磁盘上的汇总磁盘带宽统计。'
    },

    'cockroachdb.host_disk_operations': {
        info: '系统主机磁盘上的汇总磁盘操作统计。'
    },

    'cockroachdb.host_disk_iops_in_progress': {
        info: '系统主机磁盘上的汇总磁盘IOPS进行中统计。'
    },

    'cockroachdb.host_network_bandwidth': {
        info: '系统主机网络接口上的汇总网络带宽统计。'
    },

    'cockroachdb.host_network_packets': {
        info: '系统主机网络接口上的汇总网络数据包统计。'
    },

    'cockroachdb.live_nodes': {
        info: '如果此节点本身不活跃，则为 <code>0</code>。'
    },

    'cockroachdb.total_storage_capacity': {
        info: '整个磁盘容量。包括非CR数据、CR数据和空闲空间。'
    },

    'cockroachdb.storage_capacity_usability': {
        info: '<code>usable</code> 是空闲空间和CR数据的总和，<code>unusable</code> 是非CR数据使用的空间。'
    },

    'cockroachdb.storage_usable_capacity': {
        info: '<code>usable</code> 空间的详细信息。'
    },

    'cockroachdb.storage_used_capacity_percentage': {
        info: '<code>total</code> 是已使用空间的百分比，<code>usable</code> 是已使用空间的百分比。'
    },

    'cockroachdb.sql_bandwidth': {
        info: 'SQL客户端网络流量的总量。'
    },

    'cockroachdb.sql_errors': {
        info: '<code>statement</code> 是导致计划或运行时错误的语句，<code>transaction</code> 是SQL事务中的中止错误。'
    },

    'cockroachdb.sql_started_ddl_statements': {
        info: '已启动的DDL（数据定义语言）语句数量。这种类型表示数据库模式更改。包括 <code>CREATE</code>、<code>ALTER</code>、<code>DROP</code>、<code>RENAME</code>、<code>TRUNCATE</code> 和 <code>COMMENT</code> 语句。'
    },

    'cockroachdb.sql_executed_ddl_statements': {
        info: '已执行的DDL（数据定义语言）语句数量。这种类型表示数据库模式更改。包括 <code>CREATE</code>、<code>ALTER</code>、<code>DROP</code>、<code>RENAME</code>、<code>TRUNCATE</code> 和 <code>COMMENT</code> 语句。'
    },

    'cockroachdb.sql_started_dml_statements': {
        info: '已启动的DML（数据操作语言）语句数量。'
    },

    'cockroachdb.sql_executed_dml_statements': {
        info: '已执行的DML（数据操作语言）语句数量。'
    },

    'cockroachdb.sql_started_tcl_statements': {
        info: '已启动的TCL（事务控制语言）语句数量。'
    },

    'cockroachdb.sql_executed_tcl_statements': {
        info: '已执行的TCL（事务控制语言）语句数量。'
    },

    'cockroachdb.live_bytes': {
        info: '应用程序和CockroachDB系统使用的活跃数据量。'
    },

    'cockroachdb.kv_transactions': {
        info: 'KV事务细分：<br>' +
            '<ul>' +
            ' <li><code>committed</code> 已提交的KV事务（包括1PC）。</li>' +
            ' <li><code>fast-path_committed</code> KV事务在单阶段提交尝试中。</li>' +
            ' <li><code>aborted</code> 已中止的KV事务。</li>' +
            ' </ul>'
    },

    'cockroachdb.kv_transaction_restarts': {
        info: 'KV事务重新启动细分：<br>' +
            '<ul>' +
            ' <li><code>write too old</code> 由于并发写入者先提交而导致的重新启动。</li>' +
            ' <li><code>write too old (multiple)</code> 由于多个并发写入者先提交而导致的重新启动。</li>' +
            ' <li><code>forwarded timestamp (iso=serializable)</code> 由于转发的提交时间戳和隔离=可串行化而导致的重新启动。</li>' +
            ' <li><code>possible replay</code> 由于存储层可能重放命令批次而导致的重新启动。</li>' +
            ' <li><code>async consensus failure</code> 由于异步共识写入未留下意图而导致的重新启动。</li>' +
            ' <li><code>read within uncertainty interval</code> 在不确定间隔内读取新值而导致的重新启动。</li>' +
            ' <li><code>aborted</code> 由于并发事务中止而导致的重新启动（通常是由于死锁）。</li>' +
            ' <li><code>push failure</code> 由于事务推送失败而导致的重新启动。</li>' +
            ' <li><code>unknown</code> 由于未知原因而导致的重新启动。</li>' +
            ' </ul>'
    },

    'cockroachdb.ranges': {
        info: 'CockroachDB将所有用户数据（表、索引等）和几乎所有系统数据存储在键值对的巨大排序映射中。 ' +
            '这个键空间被划分为“范围”，键空间的连续块，以便每个键总是可以在单个范围中找到。'
    },

    'cockroachdb.ranges_replication_problem': {
        info: '副本数量不理想的范围：<br>' +
            '<ul>' +
            ' <li><code>unavailable</code> 拥有的存活副本少于需要的法定数量的范围。</li>' +
            ' <li><code>under replicated</code> 拥有的存活副本少于复制目标的范围。</li>' +
            ' <li><code>over replicated</code> 拥有的存活副本多于复制目标的范围。</li>' +
            ' </ul>'
    },

    'cockroachdb.replicas': {
        info: 'CockroachDB默认情况下复制每个范围（默认情况下为3次），并将每个副本存储在不同的节点上。'
    },

    'cockroachdb.replicas_leaders': {
        info: '对于每个范围，其中一个副本是写请求的<code>leader</code>，<code>not leaseholders</code>是由另一个存储持有范围租约的Raft leader数量。'
    },

    'cockroachdb.replicas_leaseholders': {
        info: '对于每个范围，其中一个副本持有“范围租约”。这个副本称为<code>leaseholder</code>，它是接收和协调范围的所有读写请求的副本。'
    },

    'cockroachdb.queue_processing_failures': {
        info: '由队列引起的失败副本分解：<br>' +
            '<ul>' +
            ' <li><code>gc</code> 在GC队列中处理失败的副本。</li>' +
            ' <li><code>replica gc</code> 在副本GC队列中处理失败的副本。</li>' +
            ' <li><code>replication</code> 在复制队列中处理失败的副本。</li>' +
            ' <li><code>split</code> 在分裂队列中处理失败的副本。</li>' +
            ' <li><code>consistency</code> 在一致性检查器队列中处理失败的副本。</li>' +
            ' <li><code>raft log</code> 在Raft日志队列中处理失败的副本。</li>' +
            ' <li><code>raft snapshot</code> 在Raft修复队列中处理失败的副本。</li>' +
            ' <li><code>time series maintenance</code> 在时间序列维护队列中处理失败的副本。</li>' +
            ' </ul>'
    },

    'cockroachdb.rebalancing_queries': {
        info: '存储每秒接收到的KV级请求数量，平均值用于重新平衡决策的较长时间段内。'
    },

    'cockroachdb.rebalancing_writes': {
        info: '每秒写入的键数（即由raft应用），平均值用于重新平衡决策的较长时间段内。'
    },

    'cockroachdb.slow_requests': {
        info: '长时间处于挂起状态的请求。'
    },

    'cockroachdb.timeseries_samples': {
        info: '写入磁盘的度量样本数量。'
    },

    'cockroachdb.timeseries_write_errors': {
        info: '尝试将度量写入磁盘时遇到的错误数量。'
    },

    'cockroachdb.timeseries_write_bytes': {
        info: '写入磁盘的度量样本大小。'
    },

    // ------------------------------------------------------------------------
    // Perf

    'perf.instructions_per_cycle': {
        info: 'IPC < 1.0 可能意味着受内存限制，IPC > 1.0 可能意味着受指令限制。有关此度量的更多详细信息，请参阅此<a href="https://www.brendangregg.com/blog/2017-05-09/cpu-utilization-is-wrong.html" target="_blank">博文</a>。'
    },

    // ------------------------------------------------------------------------
    // Filesystem

    'filesystem.vfs_deleted_objects': {
        title: 'VFS删除',
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS unlinker函数</a>的次数。如果文件系统使用其他函数存储数据，则此图表可能不会显示所有文件系统事件。如果启用了<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">应用程序</a>或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup (systemd服务)</a>插件，则Netdata将按<a href="#ebpf_apps_vfs_unlink">应用程序</a>和<a href="#ebpf_services_vfs_unlink">cgroup (systemd服务)</a>显示虚拟文件系统指标。' + ebpfChartProvides + ' 监控<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_unlink"></div>'
    },

    'filesystem.vfs_io': {
        title: 'VFS I/O',
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS I/O函数</a>的次数。如果文件系统使用其他函数存储数据，则此图表可能不会显示所有文件系统事件。如果启用了<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">应用程序</a>或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup (systemd服务)</a>插件，则Netdata将按<a href="#ebpf_apps_vfs_write">应用程序</a>和<a href="#ebpf_services_vfs_write">cgroup (systemd服务)</a>显示虚拟文件系统指标。' + ebpfChartProvides + ' 监控<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_io"></div>'
    },

    'filesystem.vfs_io_bytes': {
        title: 'VFS字节写入量',
        info: '使用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS I/O函数</a>成功读取或写入的总字节数。如果使用其他函数将数据存储到磁盘上，此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup（systemd服务）</a>插件，则Netdata会按<a href="#ebpf_apps_vfs_write_bytes">应用程序</a>和<a href="#ebpf_services_vfs_write_bytes">cgroup（systemd服务）</a>显示虚拟文件系统指标。' + ebpfChartProvides + '监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_io_bytes"></div>'
    },

    'filesystem.vfs_io_error': {
        title: 'VFS IO错误',
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS I/O函数</a>失败的次数。如果使用其他函数将数据存储到磁盘上，此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup（systemd服务）</a>插件，则Netdata会按<a href="#ebpf_apps_vfs_write_error">应用程序</a>和<a href="#ebpf_services_vfs_write_error">cgroup（systemd服务）</a>显示虚拟文件系统指标。' + ebpfChartProvides + '监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_io_error"></div>'
    },

    'filesystem.vfs_fsync': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS同步器函数</a>的次数。如果使用其他函数将数据同步到磁盘上，此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup（systemd服务）</a>插件，则Netdata会按<a href="#ebpf_apps_vfs_sync">应用程序</a>和<a href="#ebpf_services_vfs_sync">cgroup（systemd服务）</a>显示虚拟文件系统指标。' + ebpfChartProvides + '监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_sync"></div>'
    },

    'filesystem.vfs_fsync_error': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS同步器函数</a>失败的次数。如果使用其他函数将数据同步到磁盘上，此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup（systemd服务）</a>插件，则Netdata会按<a href="#ebpf_apps_vfs_sync_error">应用程序</a>和<a href="#ebpf_services_vfs_sync_error">cgroup（systemd服务）</a>显示虚拟文件系统指标。' + ebpfChartProvides + '监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_sync_error"></div>'
    },

    'filesystem.vfs_open': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS打开器函数</a>的次数。如果使用其他函数打开文件，则此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="#ebpf_apps_vfs_open">cgroup (systemd服务)</a>插件，Netdata会按<a href="#ebpf_services_vfs_open">应用程序</a>和<a href="#ebpf_services_vfs_open">cgroup (systemd服务)</a>显示每个虚拟文件系统的指标，以便监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_open"></div>'
    },

    'filesystem.vfs_open_error': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS打开器函数</a>失败的次数。如果使用其他函数打开文件，则此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="#ebpf_apps_vfs_open_error">cgroup (systemd服务)</a>插件，Netdata会按<a href="#ebpf_services_vfs_open_error">应用程序</a>和<a href="#ebpf_services_vfs_open_error">cgroup (systemd服务)</a>显示每个虚拟文件系统的指标，以便监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_open_error"></div>'
    },

    'filesystem.vfs_create': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS创建器函数</a>的次数。如果使用其他函数创建文件，则此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="#ebpf_apps_vfs_create">cgroup (systemd服务)</a>插件，Netdata会按<a href="#ebpf_services_vfs_create">应用程序</a>和<a href="#ebpf_services_vfs_create">cgroup (systemd服务)</a>显示每个虚拟文件系统的指标，以便监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_create"></div>'
    },

    'filesystem.vfs_create_error': {
        info: '调用<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#vfs" target="_blank">VFS创建器函数</a>失败的次数。如果使用其他函数创建文件，则此图表可能不会显示所有文件系统事件。如果启用了应用程序或<a href="#ebpf_apps_vfs_create_error">cgroup (systemd服务)</a>插件，Netdata会按<a href="#ebpf_services_vfs_create_error">应用程序</a>和<a href="#ebpf_services_vfs_create_error">cgroup (systemd服务)</a>显示每个虚拟文件系统的指标，以便监视<a href="#menu_filesystem">文件系统</a>。<div id="ebpf_global_vfs_create_error"></div>'
    },

    'filesystem.ext4_read_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个读取请求的延迟</a>，监视 ext4 读取器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#ext4" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.ext4_write_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个写入请求的延迟</a>，监视 ext4 写入器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#ext4" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.ext4_open_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个打开请求的延迟</a>，监视 ext4 打开器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#ext4" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.ext4_sync_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个同步请求的延迟</a>，监视 ext4 同步器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#ext4" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.xfs_read_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个读取请求的延迟</a>，监视 xfs 读取器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#xfs" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.xfs_write_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个写入请求的延迟</a>，监视 xfs 写入器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#xfs" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.xfs_open_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个打开请求的延迟</a>，监视 xfs 打开器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#xfs" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.xfs_sync_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个同步请求的延迟</a>，监视 xfs 同步器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#xfs" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.nfs_read_latency': {
        info: '<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#latency-algorithm" target="_blank">每个读取请求的延迟</a>，监视 nfs 读取器 <a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#nfs" target="_blank">函数</a>。' + ebpfChartProvides + ' 用于监视 <a href="#menu_filesystem">文件系统</a>。'
    },

    'filesystem.nfs_write_latency': {
        info: '监控每个写入请求的延迟，用于监控 NFS 写入器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.nfs_open_latency': {
        info: '监控每个打开请求的延迟，用于监控 NFS 打开器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.nfs_attribute_latency': {
        info: '监控每个获取属性请求的延迟，用于监控 NFS 属性函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.zfs_read_latency': {
        info: '监控每个读取请求的延迟，用于监控 ZFS 读取器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.zfs_write_latency': {
        info: '监控每个写入请求的延迟，用于监控 ZFS 写入器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.zfs_open_latency': {
        info: '监控每个打开请求的延迟，用于监控 ZFS 打开器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.zfs_sync_latency': {
        info: '监控每个同步请求的延迟，用于监控 ZFS 同步器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.btrfs_read_latency': {
        info: '监控每个读取请求的延迟，用于监控 Btrfs 读取器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.btrfs_write_latency': {
        info: '监控每个写入请求的延迟，用于监控 Btrfs 写入器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.btrfs_open_latency': {
        info: '监控每个打开请求的延迟，用于监控 Btrfs 打开器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.btrfs_sync_latency': {
        info: '监控每个同步请求的延迟，用于监控 Btrfs 同步器函数。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'mount_points.call': {
        info: '监控负责挂载（mount(2)）或卸载文件系统（umount(2)）的系统调用。此图表与文件系统相关。' + ebpfChartProvides
    },

    'mount_points.error': {
        info: '监控挂载（mount(2)）或卸载文件系统（umount(2)）时出现的错误的系统调用。此图表与文件系统相关。' + ebpfChartProvides
    },

    'filesystem.file_descriptor': {
        info: '监控 Linux 内核中负责打开和关闭文件的内部函数的调用次数。Netdata 根据启用了应用程序或 cgroup（systemd 服务）插件来显示每个应用程序和 cgroup（systemd 服务）的文件访问。' + ebpfChartProvides + ' 用于监控文件系统。'
    },

    'filesystem.file_error': {
        info: '内核内部函数调用失败次数，该函数负责<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#file-descriptor" target="_blank">打开和关闭文件</a>。 ' +

            // ------------------------------------------------------------------------
            // eBPF

            'Netdata显示每个<a href="#ebpf_apps_file_open_error">应用程序</a>和<a href="#ebpf_services_file_open_error">cgroup（systemd服务）</a>的文件错误，如果<a href="https://learn.netdata.cloud/guides/troubleshoot/monitor-debug-applications-ebpf" target="_blank">应用程序</a> ' +

            '或<a href="https://learn.netdata.cloud/docs/agent/collectors/ebpf.plugin#integration-with-cgroupsplugin" target="_blank">cgroup（systemd服务）</a>插件已启用。' + ebpfChartProvides + ' 用于监视<a href="#menu_filesystem">文件系统</a>。'
    },

    // ------------------------------------------------------------------------
    // ACLK Internal Stats
    'netdata.aclk_status': {
        valueRange: "[0, 1]",
        info: '此图表显示了在样本持续时间内 ACLK 是否在线。'
    },

    'netdata.aclk_query_per_second': {
        info: '此图表显示了添加到 ACLK_query 线程以处理的查询数量以及实际处理的数量。'
    },

    'netdata.aclk_latency_mqtt': {
        info: '测量消息的 MQTT 发布和其 PUB_ACK 被接收之间的延迟。'
    },

    // ------------------------------------------------------------------------
    // VerneMQ

    'vernemq.sockets': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="open_sockets"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Connected Clients"'
                    + ' data-units="clients"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="16%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'vernemq.queue_processes': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="queue_processes"'
                    + ' data-chart-library="gauge"'
                    + ' data-title="Queues Processes"'
                    + ' data-units="processes"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="16%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'vernemq.queue_messages': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="queue_message_in"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="MQTT Receive Rate"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="queue_message_out"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="MQTT Send Rate"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
        ]
    },
    'vernemq.average_scheduler_utilization': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="system_utilization"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Average Scheduler Utilization"'
                    + ' data-units="percentage"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="16%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },

    // ------------------------------------------------------------------------
    // Apache Pulsar
    'pulsar.messages_rate': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="pulsar_rate_in"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Publish"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="pulsar_rate_out"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Dispatch"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
        ]
    },
    'pulsar.subscription_msg_rate_redeliver': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="pulsar_subscription_msg_rate_redeliver"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Redelivered"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'pulsar.subscription_blocked_on_unacked_messages': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="pulsar_subscription_blocked_on_unacked_messages"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Blocked On Unacked"'
                    + ' data-units="subscriptions"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'pulsar.msg_backlog': {
        mainheads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="pulsar_msg_backlog"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Messages Backlog"'
                    + ' data-units="messages"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },

    'pulsar.namespace_messages_rate': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="publish"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Publish"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[0] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="dispatch"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Dispatch"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[1] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
        ]
    },
    'pulsar.namespace_subscription_msg_rate_redeliver': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="redelivered"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Redelivered"'
                    + ' data-units="messages/s"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'pulsar.namespace_subscription_blocked_on_unacked_messages': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="blocked"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Blocked On Unacked"'
                    + ' data-units="subscriptions"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'pulsar.namespace_msg_backlog': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="backlog"'
                    + ' data-chart-library="gauge"'
                    + ' data-gauge-max-value="100"'
                    + ' data-title="Messages Backlog"'
                    + ' data-units="messages"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="14%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            },
        ],
    },

    // ------------------------------------------------------------------------
    // Nvidia-smi

    'nvidia_smi.fan_speed': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="speed"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Fan Speed"'
                    + ' data-units="percentage"'
                    + ' data-easypiechart-max-value="100"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'nvidia_smi.temperature': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="temp"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Temperature"'
                    + ' data-units="celsius"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[3] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'nvidia_smi.memory_allocated': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="used"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Used Memory"'
                    + ' data-units="MiB"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[4] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },
    'nvidia_smi.power': {
        heads: [
            function (os, id) {
                void (os);
                return '<div data-netdata="' + id + '"'
                    + ' data-dimensions="power"'
                    + ' data-chart-library="easypiechart"'
                    + ' data-title="Power Utilization"'
                    + ' data-units="watts"'
                    + ' data-gauge-adjust="width"'
                    + ' data-width="12%"'
                    + ' data-before="0"'
                    + ' data-after="-CHART_DURATION"'
                    + ' data-points="CHART_DURATION"'
                    + ' data-colors="' + NETDATA.colors[2] + '"'
                    + ' data-decimal-digits="2"'
                    + ' role="application"></div>';
            }
        ]
    },

    // ------------------------------------------------------------------------
    // Supervisor

    'supervisord.process_state_code': {
        info: '<a href="http://supervisord.org/subprocess.html#process-states" target="_blank">进程状态映射</a>: ' +
            '<code>0</code> - 已停止, <code>10</code> - 启动中, <code>20</code> - 运行中, <code>30</code> - 重试中,' +
            '<code>40</code> - 停止中, <code>100</code> - 已退出, <code>200</code> - 致命错误, <code>1000</code> - 未知状态.'
    },

    // ------------------------------------------------------------------------
    // Systemd units

    'systemd.service_units_state': {
        info: '服务单元启动和控制守护进程及其组成的进程。 ' +
            '有关详细信息，请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.service.html#" target="_blank">systemd.service(5)</a>。'
    },

    'systemd.socket_unit_state': {
        info: 'Socket units封装了系统中的本地IPC或网络套接字，对于基于套接字的激活非常有用。 ' +
            '有关套接字单元的详细信息，请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.socket.html#" target="_blank">systemd.socket(5)</a>， ' +
            '有关基于套接字激活和其他形式激活的详细信息，请参阅<a href="https://www.freedesktop.org/software/systemd/man/daemon.html#" target="_blank">daemon(7)</a>。'
    },

    'systemd.target_unit_state': {
        info: '目标单元非常有用，可以将单元分组，或在引导过程中提供众所周知的同步点， ' +
            '请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.target.html#" target="_blank">systemd.target(5)</a>。'
    },

    'systemd.path_unit_state': {
        info: '路径单元可用于在文件系统对象更改或修改时激活其他服务。 ' +
            '请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.path.html#" target="_blank">systemd.path(5)</a>。'
    },

    'systemd.device_unit_state': {
        info: '设备单元在systemd中公开内核设备，并可用于实现基于设备的激活。 ' +
            '有关详细信息，请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.device.html#" target="_blank">systemd.device(5)</a>。'
    },

    'systemd.mount_unit_state': {
        info: '挂载单元控制文件系统中的挂载点。 ' +
            '有关详细信息，请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.mount.html#" target="_blank">systemd.mount(5)</a>。'
    },

    'systemd.automount_unit_state': {
        info: '自动挂载单元提供自动挂载功能，可按需挂载文件系统以及并行化引导过程。 ' +
            '请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.automount.html#" target="_blank">systemd.automount(5)</a>。'
    },

    'systemd.swap_unit_state': {
        info: '交换单元与挂载单元非常相似，封装了操作系统的内存交换分区或文件。 ' +
            '详细信息请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.swap.html#" target="_blank">systemd.swap(5)</a>。'
    },

    'systemd.timer_unit_state': {
        info: '定时器单元对基于定时器触发其他单元的激活非常有用。 ' +
            '您可以在<a href="https://www.freedesktop.org/software/systemd/man/systemd.timer.html#" target="_blank">systemd.timer(5)</a>中找到详细信息。'
    },

    'systemd.scope_unit_state': {
        info: 'Slice单元可用于对系统进程（例如服务单元和作用域单元）进行分组，以进行资源管理。 ' +
            '请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.scope.html#" target="_blank">systemd.scope(5)</a>。'
    },

    'systemd.slice_unit_state': {
        info: '作用域单元类似于服务单元，但管理的是外部进程而不是启动它们。 ' +
            '详细信息请参阅<a href="https://www.freedesktop.org/software/systemd/man/systemd.slice.html#" target="_blank">systemd.slice(5)</a>。'
    },

    'anomaly_detection.dimensions': {
        info: '被视为异常或正常的维度总数。 '
    },

    'anomaly_detection.anomaly_rate': {
        info: '异常尺寸的百分比。 '
    },

    'anomaly_detection.detector_window': {
        info: '检测器使用的活动窗口的长度。 '
    },

    'anomaly_detection.detector_events': {
        info: '显示检测器何时触发异常事件的标志（0 或 1）。'
    },

    'anomaly_detection.prediction_stats': {
        info: '与异常检测的预测时间相关的诊断指标。'
    },

    'anomaly_detection.training_stats': {
        info: '与异常检测训练时间相关的诊断指标。'
    },

    // ------------------------------------------------------------------------
    // Supervisor

    'fail2ban.failed_attempts': {
        info: '<p>失败尝试次数。</p>' +
            '<p>此图表反映了“Found”行的数量。 ' +
            'Found表示服务日志文件中的一行与其过滤器中的failregex匹配。</p>'
    },

    'fail2ban.bans': {
        info: '<p>封禁次数。</p>' +
            '<p>此图表反映了“Ban”和“Restore Ban”行的数量。 ' +
            '当在上一个配置的时间间隔（findtime）内发生失败尝试次数（maxretry）时，将执行封禁操作。</p>'
    },

    'fail2ban.banned_ips': {
        info: '<p>被封禁的IP地址数量。</p>'
    },

    'k8s_state.node_allocatable_cpu_requests_utilization': {
        info: 'Pod请求使用的已分配CPU资源的百分比。 ' +
            '只有当节点有足够的CPU资源可用来满足Pod的CPU请求时，才会在节点上调度Pod。'
    },
    'k8s_state.node_allocatable_cpu_requests_used': {
        info: 'Pod请求使用的已分配CPU资源量。 ' +
            '1000 millicpu相当于' +
            '<a href="https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/#cpu-units" target="_blank">1个物理或虚拟CPU核心</a>。'
    },
    'k8s_state.node_allocatable_cpu_limits_utilization': {
        info: 'Pod限制使用的已分配CPU资源的百分比。 ' +
            '总限制可能超过100％（过度分配）。'
    },
    'k8s_state.node_allocatable_cpu_limits_used': {
        info: 'Pod限制使用的已分配CPU资源量。 ' +
            '1000 millicpu相当于' +
            '<a href="https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/#cpu-units" target="_blank">1个物理或虚拟CPU核心</a>。'
    },
    'k8s_state.node_allocatable_mem_requests_utilization': {
        info: 'Pod请求使用的已分配内存资源的百分比。 ' +
            '只有在节点有足够的内存资源可用来满足Pod内存请求时，才会在节点上调度Pod。'
    },
    'k8s_state.node_allocatable_mem_requests_used': {
        info: 'Pod请求使用的已分配内存资源量。'
    },
    'k8s_state.node_allocatable_mem_limits_utilization': {
        info: 'Pod限制使用的已分配内存资源的百分比。 ' +
            '总限制可能超过100％（过度分配）。'
    },
    'k8s_state.node_allocatable_mem_limits_used': {
        info: 'Pod限制使用的已分配内存资源量。'
    },
    'k8s_state.node_allocatable_pods_utilization': {
        info: 'Pod限制使用情况。'
    },
    'k8s_state.node_allocatable_pods_usage': {
        info: '<p>Pods限制使用情况。</p>' +
            '<p><b>可用</b> - 可用于调度的Pod数量。 ' +
            '<b>已分配</b> - 已经被调度的Pod数量。</p>'
    },
    'k8s_state.node_condition': {
        info: '健康状态。 ' +
            '如果Ready条件的状态持续为False的时间超过<code>pod-eviction-timeout</code>（默认为5分钟）， ' +
            '则节点控制器将触发对该节点分配的所有Pod的API启动的驱逐。 ' +
            '<a href="https://kubernetes.io/docs/concepts/architecture/nodes/#condition" target="_blank">更多信息。</a>'
    },
    'k8s_state.node_pods_readiness': {
        info: '就绪服务请求的Pod的百分比。'
    },
    'k8s_state.node_pods_readiness_state': {
        info: '<p>Pod的就绪状态。</p>' +
            '<p><b>就绪</b> - Pod已通过就绪探针并准备好服务请求。 ' +
            '<b>未就绪</b> - Pod尚未通过就绪探针。</p>'
    },
    'k8s_state.node_pods_condition': {
        info: '<p>Pod的状态。 ' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions" target="_blank">更多信息。</a></p>' +
            '<b>PodReady</b> -  Pod能够服务请求，并应添加到所有匹配服务的负载均衡池中。 ' +
            '<b>PodScheduled</b> - Pod已被调度到节点。 ' +
            '<b>PodInitialized</b> - 所有初始化容器已成功完成。 ' +
            '<b>ContainersReady</b> - Pod中的所有容器都已就绪。</p>'
    },
    'k8s_state.node_pods_phase': {
        info: '<p>Pod的阶段。 Pod的阶段是其生命周期中的高级摘要。 ' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase" target="_blank">更多信息。</a></p>' +
            '<p><b>Running</b> - Pod已绑定到节点，并且所有容器已创建。 ' +
            '至少有一个容器仍在运行，或正在启动或重新启动的过程中。 ' +
            '<b>Failed</b> - Pod中的所有容器都已终止，并且至少有一个容器以失败状态终止。 ' +
            '即，容器要么以非零状态退出，要么被系统终止。 ' +
            '<b>成功</b> - Pod中的所有容器都已成功终止，并且不会重新启动。 ' +
            '<b>Pending</b> - Pod已被Kubernetes集群接受，但是一个或多个容器尚未设置并准备好运行。</p>'
    },
    'k8s_state.node_containers': {
        info: '节点上的容器总数。'
    },
    'k8s_state.node_containers_state': {
        info: '<p>不同生命周期状态下的容器数量。 ' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states" target="_blank">更多信息。</a></p>' +
            '<p><b>Running</b> - 容器正在执行且没有问题。 ' +
            '<b>Waiting</b> - 容器仍在执行启动所需的操作。 ' +
            '<b>Terminated</b> - 容器开始执行，然后要么完成运行，要么由于某些原因失败。</p>'
    },
    'k8s_state.node_init_containers_state': {
        info: '<p>不同生命周期状态下的初始化容器数量。 ' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states" target="_blank">更多信息。</a></p>' +
            '<p><b>Running</b> - 容器正在执行且没有问题。 ' +
            '<b>Waiting</b> - 容器仍在执行启动所需的操作。 ' +
            '<b>Terminated</b> - 容器开始执行，然后要么完成运行，要么由于某些原因失败。</p>'
    },
    'k8s_state.node_age': {
        info: '节点的生命周期。'
    },
    'k8s_state.pod_cpu_requests_used': {
        info: 'Pod的总CPU资源请求。 ' +
            '这是Pod中所有容器CPU请求的总和。 ' +
            '只要系统有空闲的CPU时间，容器就可以保证被分配与其请求的CPU数量相同。 ' +
            '1000 millicpu 相当于 ' +
            '<a href="https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/#cpu-units" target="_blank">1个物理或虚拟CPU核心</a>。'
    },
    'k8s_state.pod_cpu_limits_used': {
        info: 'Pod的总CPU资源限制。 ' +
            '这是Pod中所有容器CPU限制的总和。 ' +
            '如果设置，容器不能使用超过配置限制的CPU。 ' +
            '1000 millicpu 相当于 ' +
            '<a href="https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/#cpu-units" target="_blank">1个物理或虚拟CPU核心</a>。'
    },
    'k8s_state.pod_mem_requests_used': {
        info: 'Pod的总内存资源请求。 ' +
            '这是Pod中所有容器内存请求的总和。'
    },
    'k8s_state.pod_mem_limits_used': {
        info: 'Pod的总内存资源限制。' +
            '这是Pod中所有容器内存限制的总和。' +
            '如果设置，容器不能使用超过配置限制的RAM。'
    },
    'k8s_state.pod_condition': {
        info: 'Pod的当前状态。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions" target="_blank">更多信息。</a></p>' +
            '<p><b>PodReady</b> - Pod能够处理请求，并应该被添加到所有匹配服务的负载平衡池中。 ' +
            '<b>PodScheduled</b> - Pod已被调度到一个节点。 ' +
            '<b>PodInitialized</b> - 所有初始化容器都已成功完成。 ' +
            '<b>ContainersReady</b> - Pod中的所有容器都已准备就绪。'
    },
    'k8s_state.pod_phase': {
        info: 'Pod在其生命周期中所处的高级总结。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase" target="_blank">更多信息。</a></p>' +
            '<p><b>Running</b> - Pod已经绑定到一个节点，并且所有容器都已创建。' +
            '至少有一个容器仍在运行，或正在启动或重启的过程中。 ' +
            '<b>Failed</b> - Pod中的所有容器都已终止，并且至少有一个容器以失败结束。' +
            '即，容器要么以非零状态退出，要么被系统终止。 ' +
            '<b>Succedeed</b> - Pod中的所有容器都已成功终止，并且不会重新启动。 ' +
            '<b>Pending</b> - Pod已被Kubernetes集群接受，但一个或多个容器尚未设置并准备好运行。 ' +
            '这包括Pod等待被调度的时间以及通过网络下载容器镜像的时间。'
    },
    'k8s_state.pod_age': {
        info: 'Pod的<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-lifetime" target="_blank">生命周期</a>。'
    },
    'k8s_state.pod_containers': {
        info: '属于Pod的容器和初始化容器的数量。'
    },
    'k8s_state.pod_containers_state': {
        info: '此Pod内每个容器的状态。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states" target="_blank">更多信息。</a> ' +
            '<p><b>Running</b> - 一个容器正在无问题地执行。' +
            '<b>Waiting</b> - 一个容器仍在执行其启动所需的操作。' +
            '<b>Terminated</b> - 一个容器开始执行然后不是运行完成就是因某种原因失败。</p>'
    },
    'k8s_state.pod_init_containers_state': {
        info: '此Pod内每个初始化容器的状态。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states" target="_blank">更多信息。</a> ' +
            '<p><b>Running</b> - 一个容器正在无问题地执行。' +
            '<b>Waiting</b> - 一个容器仍在执行其启动所需的操作。' +
            '<b>Terminated</b> - 一个容器开始执行然后不是运行完成就是因某种原因失败。</p>'
    },
    'k8s_state.pod_container_readiness_state': {
        info: '指定容器是否通过了其就绪探测。' +
            'Kubelet使用就绪探测来知道何时容器准备好开始接受流量。'
    },
    'k8s_state.pod_container_restarts': {
        info: '容器已重启的次数。'
    },
    'k8s_state.pod_container_state': {
        info: '容器的当前状态。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-states" target="_blank">更多信息。</a> ' +
            '<p><b>Running</b> - 容器正在执行且没有问题。' +
            '<b>Waiting</b> - 容器仍在运行其启动所需的操作。' +
            '<b>Terminated</b> - 容器开始执行，然后要么完成了执行，要么由于某种原因失败。</p>'
    },
    'k8s_state.pod_container_waiting_state_reason': {
        info: '容器尚未运行的原因。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting" target="_blank">更多信息。</a>'
    },
    'k8s_state.pod_container_terminated_state_reason': {
        info: '容器最后一次终止的原因。' +
            '<a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-state-terminated" target="_blank">更多信息。</a>'
    },
    'ping.host_rtt': {
        info: '往返时间（RTT）是数据包从源地址到达目的地址并返回到原始源地址所花费的时间。'
    },
    'ping.host_std_dev_rtt': {
        info: '往返时间（RTT）的标准偏差。每个ping的RTT与平均RTT的差异的平均值。'
    },
    'ping.host_packet_loss': {
        info: '数据包丢失发生在一个或多个传输的数据包未到达其目的地时。通常由数据传输错误、网络拥塞或防火墙阻止引起。ICMP回显数据包通常被路由器和目标主机视为较低优先级，因此ping测试的数据包丢失不一定会转化为应用程序的数据包丢失。'
    },
    'ping.host_packets': {
        info: '发送和接收的ICMP消息数量。如果没有数据包丢失，这些计数器应该相等。'
    },
    'nvme.device_estimated_endurance_perc': {
        info: '基于实际使用和制造商对NVM寿命的预测，使用的NVM子系统寿命。值为100表示设备的预估耐久性已用完，但可能不表示设备故障。如果您将存储器用超出计划寿命，该值可以大于100。'
    },
    'nvme.device_available_spare_perc': {
        info: '可用的剩余容量。SSD提供一组内部备用容量，称为备用块，可用于替换已达到其写入操作限制的块。在使用完所有备用块之后，下一个达到其限制的块会导致磁盘故障。'
    },
    'nvme.device_composite_temperature': {
        info: '控制器及其关联的命名空间的当前复合温度。计算此值的方式是实现特定的，并且可能不代表NVM子系统中任何物理点的实际温度。'
    },
    'nvme.device_io_transferred_count': {
        info: '主机读写的数据总量。'
    },
    'nvme.device_power_cycles_count': {
        info: '电源周期反映了主机重启的次数或设备从睡眠状态唤醒的次数。较高的电源周期数不会影响设备的使用寿命。'
    },
    'nvme.device_power_on_time': {
        info: '<a href="https://en.wikipedia.org/wiki/Power-on_hours" target="_blank">上电时间</a>是设备供电的持续时间。'
    },
    'nvme.device_unsafe_shutdowns_count': {
        info: '不安全关闭次数是指在没有发送关闭通知的情况下发生的断电次数。根据您使用的NVMe设备，不安全的关闭可能会损坏用户数据。'
    },
    'nvme.device_critical_warnings_state': {
        info: '<p>控制器状态的临界警告。如果设置为1，则状态为活跃。</p><p><b>AvailableSpare</b> - 可用备用容量低于阈值。 <b>TempThreshold</b> - 组合温度大于或等于过温度阈值，或小于或等于欠温度阈值。 <b>NvmSubsystemReliability</b> - 由于媒体或内部错误过多，NVM子系统可靠性降低。 <b>ReadOnly</b> - 媒体处于只读模式。 <b>VolatileMemBackupFailed</b> - 挥发性存储器备份设备已失败。 <b>PersistentMemoryReadOnly</b> - 持久内存区域已变为只读或不可靠。</p>'
    },
    'nvme.device_media_errors_rate': {
        info: '控制器检测到无法恢复的数据完整性错误的发生次数。此计数器包括不可纠正的ECC、CRC校验和失败或LBA标记不匹配等错误。'
    },
    'nvme.device_error_log_entries_rate': {
        info: '错误信息日志中的条目数。单独看，记录数量的增加不是任何故障条件的指标。'
    },
    'nvme.device_warning_composite_temperature_time': {
        info: '设备在警告组合温度阈值（WCTEMP）以上并在临界组合温度阈值（CCTEMP）以下运行的时间。'
    },
    'nvme.device_critical_composite_temperature_time': {
        info: '设备在临界组合温度阈值（CCTEMP）以上运行的时间。'
    },
    'nvme.device_thermal_mgmt_temp1_transitions_rate': {
        info: '控制器进入较低的活动功率状态或执行供应商特定的热管理操作的次数，以尝试通过主机管理的热管理功能降低组合温度，<b>最小化性能影响</b>。'
    },
    'nvme.device_thermal_mgmt_temp2_transitions_rate': {
        info: '控制器进入较低的活动功率状态或执行供应商特定的热管理操作的次数，<b>不考虑对性能的影响（例如，严重限制）</b>，以尝试通过主机管理的热管理功能降低组合温度。'
    },
    'nvme.device_thermal_mgmt_temp1_time': {
        info: '控制器进入较低的活动功率状态或执行供应商特定的热管理操作的时间，<b>最小化性能影响</b>，以尝试通过主机管理的热管理功能降低组合温度。'
    },
    'nvme.device_thermal_mgmt_temp2_time': {
        info: '控制器进入较低的活动功率状态或执行供应商特定的热管理操作的时间，<b>不考虑对性能的影响（例如，严重限制）</b>，以尝试通过主机管理的热管理功能降低组合温度。'
    },
};
