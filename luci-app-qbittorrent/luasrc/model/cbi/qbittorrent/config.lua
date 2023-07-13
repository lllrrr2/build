local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()
local BinaryLocation = uci:get("qbittorrent", "main", "BinaryLocation") or "/usr/bin/qbittorrent-nox"
local v = sys.exec("export HOME=/tmp/qbittorrent;" .. BinaryLocation .. " -v 2>/dev/null | awk '{print $2}'")

function titlesplit(e)
	return "<p style = 'font-size:15px;font-weight:bold;color: DodgerBlue'>" .. translate(e) .. "</p>"
end

a = Map("qbittorrent", translate("qBittorrent Downloader"),
	translate("A cross-platform open source BitTorrent client based on QT<br>") ..
	translate("WebUI default username: admin password: adminadmin<br><b>") ..
	translate('Current version: </b><b style=\"color:red\">') ..
	translate(v .. "</b>"))
a:section(SimpleSection).template = "qbittorrent/qbittorrent_status"

t = a:section(NamedSection, "main", "qbittorrent")
t:tab("basic", translate("Basic Settings"))
t:tab("connection", translate("Connection Settings"))
t:tab("downloads", translate("Downloads Settings"))
t:tab("bittorrent", translate("Bittorrent Settings"))
t:tab("webgui", translate("WebUI Settings"))
t:tab("logger", translate("Log Settings"))
t:tab("advanced", translate("Advance Settings"))

e = t:taboption("basic", Flag, "EnableService", translate("Enabled"))
e.default = '0'

e = t:taboption("basic", ListValue, "user", translate("Run daemon as user"),
	translate("Leave blank to use the default user."))
for t in util.execi("cut -d ':' -f1 /etc/passwd") do
	e:value(t)
end

e = t:taboption("basic", Value, "RootProfilePath", translate("Root Path of the Profile"),
	translate("Specify the root path of all profiles which is equivalent to the commandline parameter: <b>--profile [PATH]</b>. The default value is /tmp."))
e.default = '/tmp'

local download_location = t:taboption("basic", Value, "SavePath", translate("Save Path"),
    translate("The files are stored in the download directory automatically created under the selected mounted disk"))
local dev_map = {}
for disk in util.execi("df -h | awk '/dev.*mnt/{print $6,$2,$3,$5,$1}'") do
    local diskInfo = util.split(disk, " ")
    local dev = diskInfo[5]
    if not dev_map[dev] then
        dev_map[dev] = true
        download_location:value(diskInfo[1] .. "/download", translatef(("%s/download (size: %s) (used: %s/%s)"), diskInfo[1], diskInfo[2], diskInfo[3], diskInfo[4]))
    end
end

e = t:taboption("basic", Value, "Locale", translate("Locale Language"),
	translate("The supported language codes can be used to customize the setting."))
e:value("zh_CN", translate("Simplified Chinese"))
e:value("en", translate("English"))
e.default = "zh_CN"

--[[ if v:sub(2,4) <= '4.1' then
	e = t:taboption("basic", Value, "Username", translate("Username"),
		translate("The login name for WebUI."))
	e.placeholder = "admin"

	e = t:taboption("basic", Value, "Password", translate("Password"),
		translate("The login password for WebUI."))
	e.password = true
end ]]

e = t:taboption("basic", Value, "Port", translate("Listening Port"),
	translate("The listening port for WebUI."))
e.datatype = "port"
e.default = "8080"

-- e = t:taboption("basic", Value, "ConfigurationName", translate("The Suffix of the Profile Root Path"),
-- 	translate("Specify the suffix of the profile root path and a new profile root path will be formated as <b>[ROOT_PROFILE_PATH]_[SUFFIX]</b>. This value is empty by default."))

e = t:taboption("basic", Flag, "EnableBinaryLocation", translate("Enable additional qBittorrent"))
e.enabled = 'true'
e.disabled = 'false'
e.default = e.disabled

e = t:taboption("basic", Value, "BinaryLocation", translate(" "),
	translate("Specify the binary location of qBittorrent."))
e:depends('EnableBinaryLocation', 'true')
e.placeholder = "/usr/sbin/qbittorrent-nox"

e = t:taboption("basic", Flag, "Overwrite", translate("Overwrite the settings"),
	translate("If this option is enabled, the configuration set in WebUI will be replaced by the one in the LuCI."))
e.enabled = 'true'
e.disabled = 'false'
e.default = e.enabled

e = t:taboption("connection", Flag, "UPnP", translate("Use UPnP for Connections"),
	translate("Using the UPnP / NAT-PMP port of the router for connecting to WebUI."))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("connection", Flag, "UseRandomPort", translate("Use Random Port"),
	translate("Assign a different port randomly every time when qBittorrent starts up," ..
	' which will invalidate the customized options.'))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

o = t:taboption("connection", Value, "PortRangeMin",
	translate("Connection Port"), translate(" "))
o:depends("UseRandomPort", false)
o.datatype = "range(1024,65535)"
o.template = "qbittorrent/qbt_value"
o.btntext = translate("Generate Randomly")
o.btnclick = "randomToken();"

e = t:taboption("connection", Value, "GlobalDLLimit", translate("Global Download Speed"))
e.datatype = "float"
e.placeholder = "0"
e.description = translate("Global Download Speed Limit(KiB/s).")

e = t:taboption("connection", Value, "GlobalUPLimit", translate("Global Upload Speed"),
	translate("Global Upload Speed Limit(KiB/s)."))
e.datatype = "float"
e.placeholder = "0"

e = t:taboption("connection", Value, "GlobalDLLimitAlt", translate("Alternative Download Speed"),
	translate("Alternative Download Speed Limit(KiB/s)."))
e.datatype = "float"
e.placeholder = "10"

e = t:taboption("connection", Value, "GlobalUPLimitAlt", translate("Alternative Upload Speed"),
	translate("Alternative Upload Speed Limit(KiB/s)."))
e.datatype = "float"
e.placeholder = "10"

e = t:taboption("connection", ListValue, "BTProtocol", translate("Protocol Enabled"))
e:value("Both", translate("TCP and μTP"))
e:value("TCP", translate("TCP"))
e:value("UTP", translate("μTP"))
e.default = "Both"

e = t:taboption("connection", Value, "InetAddress", translate("Inet Address"),
	translate("The address that respond to the trackers."))

e = t:taboption("downloads", DummyValue, "Saving Management", titlesplit("Saving Management"))

e = t:taboption("downloads", Flag, "CreateTorrentSubfolder", translate("Create Subfolder"),
	translate("Create subfolder for torrents with multiple files."))
e.enabled = "true"
e.disabled = "false"
 e.default = e.enabled

e = t:taboption("downloads", Flag, "StartInPause", translate("Start In Pause"),
	translate("Do not start the download automatically."))
e.enabled = "true"
e.disabled = "false"
 e.default = e.disabled

e = t:taboption("downloads", Flag, "AutoDeleteAddedTorrentFile", translate("Auto Delete Torrent File"),
	translate("The .torrent files will be deleted afterwards."))
e.enabled = "IfAdded"
e.disabled = "Never"
 e.default = e.disabled

e = t:taboption("downloads", Flag, "PreAllocation", translate("Pre Allocation"),
	translate("Pre-allocate disk space for all files."))
e.enabled = "true"
e.disabled = "false"
 e.default = e.disabled

e = t:taboption("downloads", Flag, "UseIncompleteExtension", translate("Use Incomplete Extension"),
	translate("The incomplete tasks will be added the extension of !qB."))
e.enabled = "true"
e.disabled = "false"
 e.default = e.enabled

e = t:taboption("downloads", Flag, "TempPathEnabled", translate("Enable Temp Path"))
e.enabled = "true"
e.disabled = "false"
 e.default = e.disabled

e = t:taboption("downloads", Value, "TempPath", translate("Temp Path"),
	translate("The absolute and relative path can be set."))
e:depends("TempPathEnabled", "true")
e.placeholder = "temp/"

e = t:taboption("downloads", Value, "DiskWriteCacheSize", translate("Disk Cache Size"),
	translate("By default, this value 64. Besides, -1 is auto and 0 is disable. (Unit: MiB)"))
e.datatype = "integer"
e.placeholder = "64"

e = t:taboption("downloads", Value, "DiskWriteCacheTTL",
	translate("Disk Cache TTL"), translate("By default, this value is 60. (Unit: s)"))
e.datatype = "integer"
e.placeholder = "60"

e = t:taboption("downloads", DummyValue, "Saving Management", titlesplit("torrent Management"))

e = t:taboption("downloads", ListValue, "DisableAutoTMMByDefault",
	translate("Default Torrent Management Mode"))
e:value("true", translate("Manual"))
e:value("false", translate("Auto"))
e.default = "true"

e = t:taboption("downloads", ListValue, "CategoryChanged", translate("Torrent Category Changed"),
	translate("Choose the action when torrent category changed."))
e:value("true", translate("Switch torrent to Manual Mode"))
e:value("false", translate("Relocate torrent"))
e.default = "false"

e = t:taboption("downloads", ListValue, "DefaultSavePathChanged", translate("Default Save Path Changed"),
	translate("Choose the action when default save path changed."))
e:value("true", translate("Switch affected torrent to Manual Mode"))
e:value("false", translate("Relocate affected torrent"))
e.default = "true"

e = t:taboption("downloads", ListValue, "CategorySavePathChanged", translate("Category Save Path Changed"),
	translate("Choose the action when category save path changed."))
e:value("true", translate("Switch affected torrent to Manual Mode"))
e:value("false", translate("Relocate affected torrent"))
e.default = "true"

e = t:taboption("downloads", Value, "TorrentExportDir", translate("Torrent Export Dir"),
	translate("The .torrent files will be copied to the target directory."))

e = t:taboption("downloads", Value, "FinishedTorrentExportDir", translate("Finished Torrent Export Dir"),
	translate("The .torrent files for finished downloads will be copied to the target directory."))

e = t:taboption("bittorrent", Flag, "DHT", translate("Enable DHT"),
	translate("Enable DHT (decentralized network) to find more peers."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("bittorrent", Flag, "PeX", translate("Enable PeX"),
	translate("Enable Peer Exchange (PeX) to find more peers."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("bittorrent", Flag, "LSD", translate("Enable LSD"),
	translate("Enable Local Peer Discovery to find more peers."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("bittorrent", Flag, "uTP_rate_limited", translate("μTP Rate Limit"),
	translate("Apply rate limit to μTP protocol."))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("bittorrent", ListValue, "Encryption", translate("Encryption Mode"))
e:value("0", translate("Prefer Encryption"))
e:value("1", translate("Require Encryption"))
e:value("2", translate("Disable Encryption"))
e.default = "0"

e = t:taboption("bittorrent", Value, "MaxConnecs", translate("Max Connections"))
e.datatype = "integer"
e.placeholder = "500"

e = t:taboption("bittorrent", Value, "MaxConnecsPerTorrent",
	translate("Max Connections Per Torrent"))
e.datatype = "integer"
e.placeholder = "100"

e = t:taboption("bittorrent", Value, "MaxUploads", translate("Max Uploads"),
	translate("The max number of connected peers."))
e.datatype = "integer"
e.placeholder = "8"

e = t:taboption("bittorrent", Value, "MaxUploadsPerTorrent", translate("Max Uploads Per Torrent"),
	translate("The max number of connected peers per torrent."))
e.datatype = "integer"
e.default = "4"

e = t:taboption("bittorrent", Value, "GlobalMaxRatio", translate("Max Ratio"),
	translate("The max ratio for seeding. -1 is not to limit the seeding."))
e.datatype = "float"
e.placeholder = "-1"

e = t:taboption("bittorrent", ListValue, "MaxRatioAction", translate("Max Ratio Action"),
	translate("The action when reach the max seeding ratio."))
e:value("0", translate("Pause torrent"))
e:value("1", translate("Remove torrent"))
e:value('2', translate('Enable super seeding for torrent'))
e:value('3', translate('Remove torrent and its files'))
e.defaule = "0"

e = t:taboption("bittorrent", Value, "GlobalMaxSeedingMinutes",
	translate("Max Seeding Minutes"), translate("Units: minutes"))
e.datatype = "integer"

e = t:taboption("bittorrent", DummyValue, "Queueing Setting", titlesplit("Queueing Setting"))

e = t:taboption("bittorrent", Flag, "QueueingEnabled", translate("Enable Torrent Queueing"))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("bittorrent", Value, "MaxActiveDownloads",
	translate("Maximum Active Downloads"))
e.datatype = "integer"
e.placeholder = "3"

e = t:taboption("bittorrent", Value, "MaxActiveUploads", translate("Max Active Uploads"))
e.datatype = "integer"
e.placeholder = "3"

e = t:taboption("bittorrent", Value, "MaxActiveTorrents", translate("Max Active Torrents"))
e.datatype = "integer"
e.placeholder = "5"

e = t:taboption("bittorrent", Flag, "IgnoreSlowTorrents",
	translate("Ignore Slow Torrents"), translate("Do not count slow torrents in these limits."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("bittorrent", Value, "SlowTorrentsDownloadRate",
	translate("Download rate threshold"), translate("Units: KiB/s"))
e.datatype = "integer"
e.placeholder = "2"

e = t:taboption("bittorrent", Value, "SlowTorrentsUploadRate",
	translate("Upload rate threshold"), translate("Units: KiB/s"))
e.datatype = "integer"
e.placeholder = "2"

e = t:taboption("bittorrent", Value, "SlowTorrentsInactivityTimer",
	translate("Torrent inactivity timer"), translate("Units: s"))
e.datatype = "integer"
e.placeholder = "60"

e = t:taboption("webgui", Flag, "UseUPnP", translate("Use UPnP for WebUI"),
	translate("Using the UPnP / NAT-PMP port of the router for connecting to WebUI."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

--[[ e = t:taboption("webgui", Value, "WebUIa", translate("Use Alternate Web UI"))
e.enabled = "true"
e.disabled = "false"
e.placeholder = translate('file path') ]]

e = t:taboption("webgui", Flag, "CSRFProtection", translate("CSRF Protection"),
	translate("Enable Cross-Site Request Forgery (CSRF) protection."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("webgui", Flag, "ClickjackingProtection", translate("Clickjacking Protection"),
	translate("Enable clickjacking protection."))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("webgui", Flag, "HostHeaderValidation", translate("Host Header Validation"),
translate("Validate the host header."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("webgui", Flag, "LocalHostAuth", translate("Bypass Local Host Authentication"),
	translate("Bypass authentication for clients on localhost."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("webgui", Flag, "AuthSubnetWhitelistEnabled", translate("Subnet Whitelist"),
	translate("Bypass authentication for clients in Whitelisted IP Subnets."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("webgui", DynamicList, "AuthSubnetWhitelist", translate(" "))
e.placeholder = translate('Example: 172.17.32.0/24, fdff:ffff:c8::/40')
e:depends("AuthSubnetWhitelistEnabled", "true")

e = t:taboption('webgui', Flag, 'CustomHTTPHeadersEnabled',
	translate('Add Custom HTTP Headers'))
e.enabled = 'true'
e.disabled = 'false'
e.default = e.disabled

e = t:taboption('webgui', DynamicList, 'CustomHTTPHeaders', translate(' '))
e:depends('CustomHTTPHeadersEnabled', 'true')
e.placeholder = translate('Header: value pairs, one per line')
        
e = t:taboption("advanced", Flag, "AnonymousMode", translate("Anonymous Mode"),
	translate('When enabled, qBittorrent will take certain measures to try to mask its identity.'))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption('logger', Flag, 'Enabled', translate('Enable Log'),
	translate('Enable logger to log file.'))
e.enabled = 'true'
e.disabled = 'false'
e.default = e.disabled

e = t:taboption('logger', Value, 'Path', translate('Log Path'))
e:depends('Enabled', 'true')
e.placeholder = translate('The path for qBittorrent log.')

e = t:taboption('logger', Flag, 'Backup', translate('Enable Backup'),
	translate('Backup log file when oversize the given size.'))
e:depends('Enabled', 'true')
e.enabled = 'true'
e.disabled = 'false'
e.default = e.enabled

e = t:taboption('logger', Flag, 'DeleteOld', translate('Delete Old Backup'),
	translate('When enabled, the overdue log files will be deleted after given keep time.'))
e:depends('Enabled', 'true')
e.enabled = 'true'
e.disabled = 'false'
e.default = e.enabled

e = t:taboption('logger', Value, 'MaxSizeBytes', translate('Log Max Size'),
	translate('The max size for qBittorrent log (Unit: Bytes).'))
e:depends('Enabled', 'true')
e.placeholder = '66560'

e = t:taboption('logger', Value, 'SaveTime', translate('Log Keep Time'),
	translate('Give the ' .. 'time for keeping the old log, refer the setting "Delete Old Backup", eg. 1d' .. ' for one day, 1m for one month and 1y for one year.'))
e:depends('Enabled', 'true')
e.datatype = 'string'

e = t:taboption('connection', Flag, 'UPnP', translate('Use UPnP for Connections'),
	translate('Use UPnP/ NAT-PMP port forwarding from the router.'))
e.enabled = 'true'
e.disabled = 'false'
e.default = e.enabled

e = t:taboption("advanced", Flag, "IncludeOverhead", translate("Limit Overhead Usage"),
	translate("The overhead usage is been limitted."))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("advanced", Flag, "IgnoreLimitsLAN", translate("Ignore LAN Limit"),
	translate("Ignore the speed limit to LAN."))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("advanced", Flag, "osCache", translate("Use os Cache"))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

e = t:taboption("advanced", Value, "OutgoingPortsMax",
	translate("Max Outgoing Port"), translate("The max outgoing port."))
e.datatype = "port"

e = t:taboption("advanced", Value, "OutgoingPortsMin",
	translate("Min Outgoing Port"), translate("The min outgoing port."))
e.datatype = "port"

e = t:taboption("advanced", ListValue, "SeedChokingAlgorithm",
	translate("Choking Algorithm"), translate("The strategy of choking algorithm."))
e:value("RoundRobin", translate("Round Robin"))
e:value("FastestUpload", translate("Fastest Upload"))
e:value("AntiLeech", translate("Anti-Leech"))
e.default = "FastestUpload"

e = t:taboption("advanced", Flag, "AnnounceToAllTrackers",
	translate("Announce To All Trackers"))
e.enabled = "true"
e.disabled = "false"
e.default = e.disabled

e = t:taboption("advanced", Flag, "AnnounceToAllTiers",
	translate("Announce To All Tiers"))
e.enabled = "true"
e.disabled = "false"
e.default = e.enabled

return a
