local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()
local con  = uci:get_all("softwarecenter", "main")
local font_off   = [[</font></b>]]
local font_red   = [[<b><font color="red">]]
local font_green = [[<b><font color="green">]]

if fs.access("/etc/init.d/entware") then
    local commands = {
        init    = "/opt/etc/init.d/",
        remove  = "/usr/bin/*/app_install.sh remove ",
        install = "/usr/bin/*/app_install.sh install "
    }

    local function redirect_app()
        luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/app"))
    end

    local function redirect_log()
        luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/log"))
    end

    local function op_webui(elementText, port, url)
        local finalPort = port and tostring(port) or url
        local finalUrl  = port and [[' + window.location.host + ':]] .. finalPort or finalPort
        return translatef([[&nbsp;&nbsp;&nbsp;<input class="cbi-button cbi-button-apply" type="button" value="%s" onclick="window.open('http://%s', '%s')"/>]], translate(elementText), finalUrl, tostring(math.random(100, 999)))
    end

    local aria2_webui = "<br>" ..
        op_webui("Open AriNG Local WebUI", "/ariang") ..
        op_webui("Open WebUI-Aria2 Local WebUI", "/webui-aria2") ..
        op_webui("Open AriNG Remote WebUI", nil, "ariang.mayswind.net/latest") ..
        op_webui("Open WebUI-Aria2 Remote WebUI", nil, "webui-aria2.1ge.fun")

    local function isExecutableFileExist(param)
        return sys.call(string.format("[ -x /opt/bin/%s ]", param)) == 0
    end

    local function running(binary, port)
        if not isExecutableFileExist(binary) then
            return translatef([[<br><br>Running status: %sis not installed%s]], font_red, font_off)
        end

        local isRunning = sys.call(string.format("ps 2>/dev/null | grep %s 2>/dev/null | grep opt >/dev/null", binary)) == 0
        local status    = isRunning and (font_green .. translate("Running")) or (font_red .. translate("Not Running"))
        local webui     = isRunning and (port and op_webui("Open Web Interface", port) or aria2_webui) or ""
        
        return translatef([[<br><br>Running status: %s%s%s]], status, translate(webui), font_off)
    end

    local function executeCommand(action)
        local actionSuffix = (action:find("install") or action:find("remove")) and "" or action

        function p.write()
            if actionSuffix ~= "" then
                util.exec(action)
                util.exec("sleep 3")
                redirect_app()
            else
                redirect_log()
                util.exec(action)
            end
        end
    end

    m = Map("softwarecenter", translate(" "))
    s = m:section(TypedSection, "softwarecenter")
    s.anonymous = true

    local am_port = con.am_port or 4711
    local de_port = con.de_port or 888
    local qb_port = con.qb_port or 9080
    local rt_port = con.rt_port or 1099
    local tr_port = con.tr_port or 9091
    s:tab("site", translate("Settings"),
        translate("All configuration files are symlinked in /opt/etc/config, making it easy to view and modify."))
    s:tab("aMule", translate("aMule"),
        translate("aMule is an open-source, free P2P file-sharing software similar to eMule. <br>Based on xMule and lMule. It can use the eDonkey network protocol and also supports the KAD network.") .. 
        running("amuled", am_port))
    s:tab("Aria2", translate("Aria2"),
        translate("Aria2 is an open-source, lightweight command-line download tool that supports multiple protocols like HTTP/HTTPS, FTP, SFTP, BitTorrent, and Metalink. <br>It has been enhanced and extended by <a href='https://github.com/P3TERX/aria2.conf'target='_blank'>P3TERX</a>.") ..
        running("aria2c"))
    s:tab("Deluge", translate("Deluge"),
        translate("Deluge is a free and easy-to-use BT download software that uses libtorrent as its backend. <br>It has multiple user interfaces, low system resource usage, and a rich set of plugins for additional functionality.") ..
        running("deluge", de_port))
    s:tab("rTorrent", translate("rTorrent"),
        translate("rTorrent is a console-based BT client for Linux. <br>ruTorrent has been replaced with a stable plugin version by <a href='https://github.com/Novik/ruTorrent'target='_blank'>Novik</a>.") ..
        running("rtorrent", rt_port .. "/rutorrent"))
    s:tab("qBittorrent", translate("qBittorrent"),
        translate("qBittorrent is a cross-platform free BitTorrent client.") ..
        running("qbittorrent-nox", qb_port))
    s:tab("Transmission", translate("Transmission"),
        translate("Transmission is a fast and lightweight BitTorrent client.") ..
        running("transmission-daemon", tr_port))

    p = s:taboption("site", Value, "download_dir", translate("File Save Path"),
        translate("Unified path for saving all downloaded files"))
    p.default = "/opt/downloads"

    p = s:taboption("site", Value, "webui_name", translate("WebUI Username"),
        translate("Set the initial username for qBittorrent and Transmission"))
    p.default = "admin"

    p = s:taboption("site", Value, "webui_pass", translate("WebUI Password"),
        translate("Set the initial password for aMule, Aria2, Deluge, qBittorrent, and Transmission"))
    p.default = "admin"

    p = s:taboption("site", Value, "delaytime", translate("Delayed Startup"),
        translate("Delay in starting the above application in seconds"))
    p.default = 20

    -- aMule
    o = s:taboption("aMule", Flag, "amule_boot", translate("Start on Boot"))
    o = s:taboption("aMule", Value, "am_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "4711"

    if isExecutableFileExist("amuled") then
        if running("amuled"):find("WebUI") then
            p = s:taboption("aMule", Button, "aaa", translatef("Restart %s", "aMule"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S57am* restart")

            p = s:taboption("aMule", Button, "aab", translatef("Stop %s", "aMule"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S57am* stop")
        else
            p = s:taboption("aMule", Button, "aac", translatef("Run %s", "aMule"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S57am* start")

            p = s:taboption("aMule", Button, "aad", translatef("Delete %s", "aMule"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "amule")
        end
    else
        p = s:taboption("aMule", Button, "aae", translate("Install"))
        p.inputtitle = translatef("Install %s", "aMule")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "amule")
    end

    -- aria2
    o = s:taboption("Aria2", Flag, "aria2_boot", translate("Start on Boot"))
    o = s:taboption("Aria2", Value, "ar_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "6800"

    if isExecutableFileExist("aria2c") then
        if running("aria2c"):find("WebUI") then
            p = s:taboption("Aria2", Button, "aba", translatef("Restart %s", "Aria2"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S81ar* restart")

            p = s:taboption("Aria2", Button, "abb", translatef("Stop %s", "Aria2"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S81ar* stop")
        else
            p = s:taboption("Aria2", Button, "abc", translatef("Run %s", "Aria2"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S81ar* start")

            p = s:taboption("Aria2", Button, "abd", translatef("Delete %s", "Aria2"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "aria2")
        end
    else
        p = s:taboption("Aria2", Button, "abe", translate("Install"))
        p.inputtitle = translatef("Install %s", "Aria2")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "aria2")
    end

    -- Deluge
    o = s:taboption("Deluge", Flag, "deluged_boot", translate("Start on Boot"))
    o = s:taboption("Deluge", Value, "de_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "888"

    if isExecutableFileExist("deluge") then
        if running("deluge"):find("WebUI") then
            p = s:taboption("Deluge", Button, "aca", translatef("Restart %s", "Deluge"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S80de* restart")

            p = s:taboption("Deluge", Button, "acb", translatef("Stop %s", "Deluge"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S80de* stop")
        else
            p = s:taboption("Deluge", Button, "acc", translatef("Run %s", "Deluge"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S80de* start")

            p = s:taboption("Deluge", Button, "acd", translatef("Delete %s", "Deluge"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "deluge-ui-web")
        end
    else
        p = s:taboption("Deluge", Button, "ace", translate("Install"))
        p.inputtitle = translatef("Install %s", "Deluge")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "deluged")
    end

    -- qbittorrent
    o = s:taboption("qBittorrent", Flag, "qbittorrent_boot", translate("Start on Boot"))
    o = s:taboption("qBittorrent", Value, "qb_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "8080"

    if isExecutableFileExist("qbittorrent-nox") then
        if running("qbittorrent-nox"):find("WebUI") then
            p = s:taboption("qBittorrent", Button, "ada", translatef("Restart %s", "qBittorrent"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S89qb* restart")

            p = s:taboption("qBittorrent", Button, "adb", translatef("Stop %s", "qBittorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S89qb* stop")
        else
            p = s:taboption("qBittorrent", Button, "adc", translatef("Run %s", "qBittorrent"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S89qb* start")

            p = s:taboption("qBittorrent", Button, "add", translatef("Delete %s", "qBittorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "qbittorrent")
        end
    else
        p = s:taboption("qBittorrent", Button, "ade", translate("Install"))
        p.inputtitle = translatef("Install %s", "qBittorrent")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "qbittorrent")
    end

     -- rTorrent
    o = s:taboption("rTorrent", Flag, "rtorrent_boot", translate("Start on Boot"))
    o = s:taboption("rTorrent", Value, "rt_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "1099"

    if isExecutableFileExist("rtorrent") then
        if running("rtorrent"):find("WebUI") then
            p = s:taboption("rTorrent", Button, "aea", translatef("Restart %s", "rTorrent"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S85rt* restart")

            p = s:taboption("rTorrent", Button, "aeb", translatef("Stop %s", "rTorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S85rt* stop")
        else
            p = s:taboption("rTorrent", Button, "aec", translatef("Run %s", "rTorrent"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S85rt* start")

            p = s:taboption("rTorrent", Button, "aed", translatef("Delete %s", "rTorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "rtorrent-easy-install")
        end
    else
        p = s:taboption("rTorrent", Button, "aee", translate("Install"))
        p.inputtitle = translatef("Install %s", "rTorrent")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "rtorrent")
    end

    -- transmission
    o = s:taboption("Transmission", Flag, "transmission_boot", translate("Start on Boot"))

    o = s:taboption("Transmission", Value, "tr_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "9091"

    if isExecutableFileExist("transmission-daemon") then
        if running("transmission-daemon"):find("WebUI") then
            p = s:taboption("Transmission", Button, "afa", translatef("Restart %s", "Transmission"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand(commands.init .. "S88tr* restart")

            p = s:taboption("Transmission", Button, "afb", translatef("Stop %s", "Transmission"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.init .. "S88tr* stop")
        else
            p = s:taboption("Transmission", Button, "afc", translatef("Run %s", "Transmission"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand(commands.init .. "S88tr* start")

            p = s:taboption("Transmission", Button, "afd", translatef("Delete %s", "Transmission"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand(commands.remove .. "transmission-cfp-daemon transmission-cfp-cli transmission-cfp-remote transmission-daemon transmission-cli transmission-remote")
        end
    else
        p = s:taboption("Transmission", Button, "afe", translate("Install 4"))
        p.inputtitle = translatef("Install %s", "transmission 4")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "transmission 1")

        p = s:taboption("Transmission", Button, "aff", translate("Install 2.77plus"))
        p.inputtitle = translatef("Install %s", "transmission 2.77plus")
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand(commands.install .. "transmission 2")
    end
else
    m = SimpleForm("softwarecenter")
    m.reset = false
    m.submit = false
    s = m:section(SimpleSection)
    m.title = translate([[<font color='red' size='2'>Entware has not been deployed yet</font>]])
end

return m
