local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()
local con  = uci:get_all("softwarecenter", "main")
local font_red   = [[<b><font color="red">]]
local font_green = [[<b><font color="green">]]

if fs.access("/etc/init.d/entware") then
    local commands = {
        init    = "/opt/etc/init.d/",
        remove  = "/usr/bin/*/app*.sh remove ",
        install = "/usr/bin/*/app*.sh install "
    }

    local function set_config(config, value)
        uci:set("softwarecenter", config, value)
        uci:commit("softwarecenter")
    end

    local function redirect(value)
        luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/" .. value))
    end

    local function op_webui(elementText, port, url)
        local finalPort = port and tostring(port) or url
        local finalUrl  = port and [[' + window.location.host + ':]] .. finalPort or finalPort
        return translatef([[&nbsp;&nbsp;&nbsp;<input class="cbi-button cbi-button-apply" type="button" value="%s" onclick="window.open('http://%s', '%s')"/>]], translate(elementText), finalUrl, sys.uniqueid(3))
    end

    local aria2_webui = "<br>" ..
        op_webui("Open AriNG Local WebUI", "/ariang") ..
        op_webui("Open WebUI-Aria2 Local WebUI", "/webui-aria2") ..
        op_webui("Open AriNG Remote WebUI", nil, "ariang.mayswind.net/latest") ..
        op_webui("Open WebUI-Aria2 Remote WebUI", nil, "webui-aria2.1ge.fun")

    local function ExecutableFile(binary)
        return fs.access(("/opt/bin/%s" % binary), "x")
    end

    local function running(binary, port)
        if not ExecutableFile(binary) then
            return translatef([[<br><br>Running status: %sis not installed%s]], font_red, [[</font></b>]])
        end

        local isRunning = sys.call(("ps 2>/dev/null | grep %s 2>/dev/null | grep opt >/dev/null" % binary)) == 0
        local status    = isRunning and (font_green .. translate("Running")) or (font_red .. translate("Not Running"))
        local webui     = isRunning and (port and op_webui("Open Web Interface", port) or aria2_webui) or ""
        
        return translatef([[<br><br>Running status: %s%s%s]], status, translate(webui), [[</font></b>]])
    end

    local function execute(action)
        function p.write()
            if action:match("install") or action:match("remove") then
                set_config(self, value)
                redirect("log")
                util.exec(action)
            else
                util.exec(action)
                util.exec("sleep 2")
                redirect("app")
            end
        end
    end

    function createButtonOptions(binary, Restart, Stop, Start, Delete)
        local webUIRunning = running(binary):find("WebUI") ~= nil
        local startAction = webUIRunning and "Restart" or "Start"
        p = s:taboption(binary, Button, binary .. "_" .. startAction, translatef(startAction))
        p.inputstyle = webUIRunning and "reload" or "apply"
        p.forcewrite = true
        execute(commands.init .. (webUIRunning and Restart or Start))

        local stopAction = webUIRunning and "Stop" or "Delete"
        p = s:taboption(binary, Button, binary .. "_" .. stopAction, translatef(stopAction))
        p.inputstyle = "reset"
        p.forcewrite = true
        execute(commands.init .. (webUIRunning and Stop or Delete))
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
    s:tab("amuled", translate("aMule"),
        translate("aMule is an open-source, free P2P file-sharing software similar to eMule. <br>Based on xMule and lMule. It can use the eDonkey network protocol and also supports the KAD network.") .. 
        running("amuled", am_port))
    s:tab("aria2c", translate("Aria2"),
        translate("Aria2 is an open-source, lightweight command-line download tool that supports multiple protocols like HTTP/HTTPS, FTP, SFTP, BitTorrent, and Metalink. <br>It has been enhanced and extended by <a href='https://github.com/P3TERX/aria2.conf'target='_blank'>P3TERX</a>.") ..
        running("aria2c"))
    s:tab("deluge", translate("Deluge"),
        translate("Deluge is a free and easy-to-use BT download software that uses libtorrent as its backend. <br>It has multiple user interfaces, low system resource usage, and a rich set of plugins for additional functionality.") ..
        running("deluge", de_port))
    s:tab("rtorrent", translate("rTorrent"),
        translate("rTorrent is a console-based BT client for Linux. <br>ruTorrent has been replaced with a stable plugin version by <a href='https://github.com/Novik/ruTorrent'target='_blank'>Novik</a>.") ..
        running("rtorrent", rt_port .. "/rutorrent"))
    s:tab("qbittorrent-nox", translate("qBittorrent"),
        translate("qBittorrent is a cross-platform free BitTorrent client.") ..
        running("qbittorrent-nox", qb_port))
    s:tab("transmission-daemon", translate("Transmission"),
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
    o = s:taboption("amuled", Flag, "amule_boot", translate("Start on Boot"))
    o = s:taboption("amuled", Value, "am_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "4711"

    if ExecutableFile("amuled") then
        createButtonOptions('amuled', "S57am* restart", "S57am* stop", "S57am* start", "amule")
    else
        p = s:taboption("amuled", Button, "aae", translate("Install"))
        p.inputtitle = translatef("Install %s", "aMule")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "amule")
    end

    -- aria2
    o = s:taboption("aria2c", Flag, "aria2_boot", translate("Start on Boot"))
    o = s:taboption("aria2c", Value, "ar_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "6800"

    if ExecutableFile("aria2c") then
        createButtonOptions('aria2c', "S81ar* restart", "S81ar* stop", "S81ar* start", "aria2")
    else
        p = s:taboption("aria2c", Button, "abe", translate("Install"))
        p.inputtitle = translatef("Install %s", "Aria2")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "aria2")
    end

    -- Deluge
    o = s:taboption("deluge", Flag, "deluged_boot", translate("Start on Boot"))
    o = s:taboption("deluge", Value, "de_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "888"

    if ExecutableFile("deluge") then
        createButtonOptions('deluge', "S80de* restart", "S80de* stop", "S80de* start", "deluge-ui-web")
    else
        p = s:taboption("deluge", Button, "ace", translate("Install"))
        p.inputtitle = translatef("Install %s", "Deluge")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "deluged")
    end

    -- qbittorrent
    o = s:taboption("qbittorrent-nox", Flag, "qbittorrent_boot", translate("Start on Boot"))
    o = s:taboption("qbittorrent-nox", Value, "qb_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "8080"

    if ExecutableFile("qbittorrent-nox") then
        createButtonOptions('qbittorrent-nox', "S89qb* restart", "S89qb* stop", "S89qb* start", "qbittorrent")
    else
        p = s:taboption("qbittorrent-nox", Button, "ade", translate("Install"))
        p.inputtitle = translatef("Install %s", "qBittorrent")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "qbittorrent")
    end

     -- rTorrent
    o = s:taboption("rtorrent", Flag, "rtorrent_boot", translate("Start on Boot"))
    o = s:taboption("rtorrent", Value, "rt_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "1099"

    if ExecutableFile("rtorrent") then
        createButtonOptions('rtorrent', "S85rt* restart", "S85rt* stop", "S85rt* start", "rtorrent-easy-install")
    else
        p = s:taboption("rtorrent", Button, "aee", translate("Install"))
        p.inputtitle = translatef("Install %s", "rTorrent")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "rtorrent")
    end

    -- transmission
    o = s:taboption("transmission-daemon", Flag, "transmission_boot", translate("Start on Boot"))
    o = s:taboption("transmission-daemon", Value, "tr_port", translate("WebUI Login Port"))
    o.datatype = "port"
    o.default = "9091"

    if ExecutableFile("transmission-daemon") then
        createButtonOptions('transmission-daemon', "S88tr* restart", "S88tr* stop", "S88tr* start", "transmission-cfp-daemon transmission-cfp-cli transmission-cfp-remote transmission-daemon transmission-cli transmission-remote")
    else
        p = s:taboption("transmission-daemon", Button, "afe", translate("Install 4"))
        p.inputtitle = translatef("Install %s", "transmission 4")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "transmission 1")

        p = s:taboption("transmission-daemon", Button, "aff", translate("Install 2.77plus"))
        p.inputtitle = translatef("Install %s", "transmission 2.77plus")
        p.inputstyle = "apply"
        p.forcewrite = true
        execute(commands.install .. "transmission 2")
    end
else
    m = SimpleForm("softwarecenter")
    m.reset = false
    m.submit = false
    s = m:section(SimpleSection)
    m.title = translate([[<font color='red' size='2'>Entware has not been deployed yet</font>]])
end

return m
