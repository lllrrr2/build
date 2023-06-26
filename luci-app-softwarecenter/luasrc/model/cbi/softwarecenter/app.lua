local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()
local con  = uci:get_all("softwarecenter", "main")
local font_off   = [[</font></b>]]
local font_red   = [[<b><font color="red">]]
local font_green = [[<b><font color="green">]]
local font_op    = [[" onclick="window.open('http://'+window.location.hostname+':]]
local font_apply = [[<input class="cbi-button cbi-button-apply" type="button" value="]]

if fs.access("/etc/init.d/entware") then

    local function redirect_app()
        luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/app"))
    end

    local function redirect_log()
        luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/log"))
    end

    local function op_webui(port)
        return string.format("&nbsp;&nbsp;&nbsp;%s打开WebUI管理%s%s')\"/>", font_apply, font_op, tostring(port))
    end

    local aria2_webui = "<br>" ..
        font_apply .. [[打开AriNG远程WebUI管理" onclick="window.open('http://ariang.mayswind.net/latest')"/>&nbsp;&nbsp;&nbsp;]] ..
        font_apply .. [[打开WebUI-Aria2远程WebUI管理" onclick="window.open('http://webui-aria2.1ge.fun/')"/><br><br>]] ..
        font_apply .. [[打开AriNG本地WebUI管理]] .. font_op .. [[/ariang')"/>&nbsp;&nbsp;&nbsp;]] ..
        font_apply .. [[打开WebUI-Aria2本地WebUI管理]] .. font_op .. [[/webui-aria2')"/><br>]]

    local function init(...)
        local exist = false
        for _, param in ipairs({...}) do
            if fs.access("/opt/etc/init.d/" .. param) then
                exist = true
                break
            end
        end
        return exist
    end

    local function running(binary, port)
        local isInstalled = binary and sys.call("[ -x /opt/bin/" .. binary .. " ]") == 0
        local isRunning   = sys.call("ps 2>/dev/null | grep " .. binary .. " 2>/dev/null | grep opt >/dev/null") == 0
        local status      = isInstalled and (isRunning and (font_green .. "运行中") or (font_red .. "没有运行")) or ""
        local message     = isInstalled and "" or (font_red .. "没有安装")

        if isRunning then
            webui = port and op_webui(port) or aria2_webui
        else
            webui = ""
        end

        return translate(string.format("<br><br>运行状态：%s%s" .. font_off .. '%s', status, message, webui))
    end

    local commands = {
        stop = "/opt/etc/init.d/",
        start = "/opt/etc/init.d/",
        restart = "/opt/etc/init.d/",
        remove = "/usr/bin/softwarecenter/app_install.sh ",
        install = "/usr/bin/softwarecenter/app_install.sh "
    }

    local function executeCommand(action, ...)
        local actionSuffix = (action == 'install' or action == 'remove') and ' ' or action
        local service = table.concat({...}, ' ')

        if service:find('S88transmission') ~= nil then
            service = fs.access("/opt/etc/init.d/S88transmission") and "S88transmission" or
                      fs.access("/opt/etc/init.d/S88transmission-cfp") and "S88transmission-cfp"
         end
        local command = ""
        if actionSuffix == ' ' then
            command = string.format("%s%s %s &", commands[action], action, service)
        else
            command = string.format("%s%s %s &", commands[action], service, action)
        end

        function p.write()
            util.exec(command)
            if actionSuffix ~= ' ' then
                util.exec("sleep 3")
                redirect_app()
            else
                redirect_log()
            end
        end
    end

    m = Map("softwarecenter", translate(" "))
    s = m:section(TypedSection, "softwarecenter")
    s.anonymous = true

    local am_port = con.am_port or 4711
    local rt_port = con.rt_port or 1099
    local de_port = con.de_port or 888
    local qb_port = con.qb_port or 9080
    local tr_port = con.tr_port or 9091
    s:tab("site", translate("设置"),
        translate("所有配置文件都软链接在 /opt/etc/config下，方便查看和修改"))
    s:tab("aMule", translate("aMule"),
        translate("aMule是一个开源免费的P2P文件共享软件，类似于eMule<br>基于xMule和lMule。可应用eDonkey网络协议，也支持KAD网络。") ..
        running('amuled', am_port))
    s:tab("Aria2", translate("Aria2"),
        translate([[Aria2 是一款开源、轻量级的多协议命令行下载工具<br>支持 HTTP/HTTPS、FTP、SFTP、BitTorrent 和 Metalink 协议<br>添加了 <a href="https://github.com/P3TERX/aria2.conf"target="_blank"> P3TERX </a>的增强和扩展功能]]) ..
        running('aria2c'))
    s:tab("Deluge", translate("Deluge"),
        translate("Deluge是一个免费好用的BT下载软件，使用libtorrent作为其后端<br>多种用户界面，占用系统资源少，有丰富的插件来实现核心以外的众多功能") ..
        running('deluge', de_port))
    s:tab("rTorrent", translate("rTorrent"),
        translate([[rTorrent是一个Linux下控制台的BT客户端<br>ruTorrent替换为<a href="https://github.com/Novik/ruTorrent"target="_blank"> Novik </a>的稳定插件版]]) ..
        running('rtorrent', rt_port .. "/rutorrent"))
    s:tab("qBittorrent", translate("qBittorrent"),
        translate("qBittorrent是一个跨平台的自由BitTorrent客户端") ..
        running('qbittorrent-nox', qb_port))
    s:tab("Transmission", translate("Transmission"),
        translate("Transmission 是一个快速、精简的 bittorrent 客户端") ..
        running('transmission-daemon', tr_port))

    p = s:taboption("site", Value, "download_dir", translate("文件保存路径"),
        translate("所有文件下载的统一保存路径"))
    p.default="/opt/downloads"

    p = s:taboption("site", Value, "webui_name", translate("WebUI用户名"),
        translate("统一设置qBittorrent，Transmission的初始用户名"))
    p.default="admin"

    p = s:taboption("site", Value, "webui_pass", translate("WebUI密码"),
        translate("统一设置aMule，Aria2，Deluge，qBittorrent，Transmission的初始密码"))
    p.default="admin"

    p = s:taboption("site", Value, "delaytime", translate("延时启动"),
        translate("开机后延时启动以下的应用，单位：秒。"))
    p.default=20

    -- aMule
    o = s:taboption("aMule", Flag, "amule_boot", translate("开机运行"))

    o = s:taboption("aMule", Value, "am_port", translate("WebUI登录端口"))
    o.datatype = "port"
    o.default = "4711"

    if init('S57amuled') then
        if running('amuled'):find('green') ~= nil then
            p = s:taboption("aMule", Button, "aaa", translate("重启 aMule"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S57amuled')
            
            p = s:taboption("aMule", Button, "aab", translate("关闭 aMule"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S57amuled')
        else
            p = s:taboption("aMule", Button, "aac", translate("运行 aMule"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S57amuled')

            p = s:taboption("aMule", Button, "aad", translate("删除 aMule"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'amule')
        end
    else
        p = s:taboption("aMule", Button, "aae", translate("安装"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'amule')
    end

    -- aria2
    o = s:taboption("Aria2", Flag, "aria2_boot", translate("开机运行"))
    o.rmempty = false

    o = s:taboption("Aria2", Value, "ar_port", translate("WebUI登录端口"))
    o.datatype = "port"
    o.default = "6800"

    if init('S81aria2') then
        if running('aria2c'):find('green') ~= nil then
            p = s:taboption("Aria2", Button, "aba", translate("重启 Aria2"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S81aria2')

            p = s:taboption("Aria2", Button, "abb", translate("关闭 Aria2"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S81aria2')
        else
            p = s:taboption("Aria2", Button, "abc", translate("运行 Aria2"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S81aria2')

            p = s:taboption("Aria2", Button, "abd", translate("删除 Aria2"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'aria2')
        end
    else
        p = s:taboption("Aria2", Button, "abe", translate("安装"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'aria2')
    end

    -- Deluge
    o = s:taboption("Deluge", Flag, "deluged_boot", translate("开机运行"))

    o = s:taboption("Deluge", Value, "de_port", translate("WebUI登录端口"))
    o.datatype = "port"
    o.default = "888"

    if init('S80deluged') then
        if running('deluge'):find('green') ~= nil then
            p = s:taboption("Deluge", Button, "aca", translate("重启 Deluge"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S80deluged')

            p = s:taboption("Deluge", Button, "acb", translate("关闭 Deluge"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S80deluged')
        else
            p = s:taboption("Deluge", Button, "acc", translate("运行 Deluge"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S80deluged')

            p = s:taboption("Deluge", Button, "acd", translate("删除 Deluge"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'deluge-ui-web')
        end
    else
        p = s:taboption("Deluge", Button, "ace", translate("安装"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'deluged')
    end

    -- qbittorrent
    o = s:taboption("qBittorrent", Flag, "qbittorrent_boot", translate("开机运行"))

    o = s:taboption("qBittorrent", Value, "qb_port", translate("WebUI登录端口"))
    o.datatype = "port"
    o.default = "9080"

    if init('S89qbittorrent') then
        if running('qbittorrent-nox'):find('green') ~= nil then
            p = s:taboption("qBittorrent", Button, "ada", translate("重启 qBittorrent"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S89qbittorrent')

            p = s:taboption("qBittorrent", Button, "adb", translate("关闭 qBittorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S89qbittorrent')
        else
            p = s:taboption("qBittorrent", Button, "adc", translate("运行 qBittorrent"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S89qbittorrent')

            p = s:taboption("qBittorrent", Button, "add", translate("删除 qBittorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'qbittorrent')
        end
    else
        p = s:taboption("qBittorrent", Button, "ade", translate("安装"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'qbittorrent')
    end

    --- rTorrent
    o = s:taboption("rTorrent", Flag, "rtorrent_boot", translate("开机运行"))

    o = s:taboption("rTorrent", Value, "rt_port", translate("WebUI登录端口"),
        translate("默认端口：1099"))
    o.datatype = "port"
    o.default = "1099"

    if init('S85rtorrent') then
        if running('rtorrent'):find('green') ~= nil then
            p = s:taboption("rTorrent", Button, "aea", translate("重启 rTorrent"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S85rtorrent')

            p = s:taboption("rTorrent", Button, "aeb", translate("关闭 rTorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S85rtorrent')
        else
            p = s:taboption("rTorrent", Button, "aec", translate("运行 rTorrent"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S85rtorrent')

            p = s:taboption("rTorrent", Button, "aed", translate("删除 rTorrent"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'rtorrent-easy-install')
        end
    else
        p = s:taboption("rTorrent", Button, "aee", translate("安装"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'rtorrent')
    end

    -- transmission
    o = s:taboption("Transmission", Flag, "transmission_boot", translate("开机运行"))

    o = s:taboption("Transmission", Value, "tr_port", translate("WebUI登录端口"))
    o.datatype = "port"
    o.default = "9091"

    if init('S88transmission', 'S88transmission-cfp') then
        if running('transmission-daemon'):find('green') ~= nil then
            p = s:taboption("Transmission", Button, "afa", translate("重启 Transmission"))
            p.inputstyle = "reload"
            p.forcewrite = true
            executeCommand('restart', 'S88transmission')

            p = s:taboption("Transmission", Button, "afb", translate("关闭 Transmission"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('stop', 'S88transmission')
        else
            p = s:taboption("Transmission", Button, "afc", translate("运行 Transmission"))
            p.inputstyle = "apply"
            p.forcewrite = true
            executeCommand('start', 'S88transmission')

            p = s:taboption("Transmission", Button, "afd", translate("删除 Transmission"))
            p.inputstyle = "reset"
            p.forcewrite = true
            executeCommand('remove', 'transmission-cfp-daemon transmission-cfp-cli transmission-cfp-remote transmission-daemon transmission-cli transmission-remote')
        end
    else
        p = s:taboption("Transmission", Button, "afe", translate("安装 4.00"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'transmission 1')

        p = s:taboption("Transmission", Button, "aff", translate("安装2.77plus"))
        p.inputtitle = "开始安装"
        p.inputstyle = "apply"
        p.forcewrite = true
        executeCommand('install', 'transmission 2')
    end
else
    m = SimpleForm("softwarecenter")
    m.reset = false
    m.submit = false
    s = m:section(SimpleSection)
    m.title = translate([[<font color="red" size="2">还没有部署Entware</font>]])
end

return m
