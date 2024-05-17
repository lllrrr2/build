local fs   = require "luci.fs"
local nfs  = require "nixio.fs"
local util = require "luci.util"
local http = require "luci.http"
module("luci.controller.filebrowser", package.seeall)
function index()
    entry({"admin", "system", "filebrowser"}, template("filebrowser"), _("File management"), 60).dependent = true
    entry({"admin", "system", "dpfile"}, call("dpfile"), nil).leaf = true
    entry({"admin", "system", "file_list"}, call("file_list"), nil).leaf = true
    entry({"admin", "system", "uploadfile"}, call("uploadfile"), nil).leaf = true
    entry({"admin", "system", "file_tools"}, call("file_tools"), nil).leaf = true
    entry({"admin", "system", "createnewfile"}, call("createnewfile"), nil).leaf = true
    entry({"admin", "system", "handleDocument"}, call("handleDocument"), nil).leaf = true
end

local MIME_TYPES = {
    avi    = "video/x-msvideo",
    bmp    = "image/bmp",
    c      = "text/plain; charset=UTF-8",
    conf   = "text/plain; charset=UTF-8",
    css    = "text/plain; charset=UTF-8",
    deb    = "application/x-debian-package",
    doc    = "application/msword",
    gif    = "image/gif",
    h      = "text/plain; charset=UTF-8",
    htm    = "text/plain; charset=UTF-8",
    html   = "text/plain; charset=UTF-8",
    iso    = "application/x-iso9660-image",
    js     = "text/plain; charset=UTF-8",
    json   = "text/plain; charset=UTF-8",
    jpg    = "image/jpeg",
    jpeg   = "image/jpeg",
    ko     = "text/plain; charset=UTF-8",
    lua    = "text/plain; charset=UTF-8",
    log    = "text/plain; charset=UTF-8",
    mpg    = "video/mpeg",
    mpeg   = "video/mpeg",
    mp3    = "audio/mpeg",
    o      = "text/plain; charset=UTF-8",
    odp    = "application/vnd.oasis.opendocument.presentation",
    odt    = "application/vnd.oasis.opendocument.text",
    ogg    = "application/ogg",
    ovpn   = "application/x-openvpn-profile",
    pdf    = "application/pdf",
    patch  = "text/plain; charset=UTF-8",
    php    = "text/plain; charset=UTF-8",
    pl     = "text/plain; charset=UTF-8",
    png    = "image/png",
    ppt    = "application/vnd.ms-powerpoint",
    sh     = "text/plain; charset=UTF-8",
    svg    = "text/plain; charset=UTF-8",
    tar    = "application/x-tar",
    txt    = "text/plain; charset=UTF-8",
    wav    = "audio/x-wav",
    xsl    = "text/plain; charset=UTF-8",
    xls    = "application/vnd.ms-excel",
    xml    = "text/plain; charset=UTF-8",
    yaml   = "text/plain; charset=UTF-8",
    zip    = "application/zip",
}

local stat = false
function list_response(path, stat)
    http.prepare_content("application/json")
    http.write_json({
        stat = stat and true or false,
        data = stat and fs.isdirectory(path) and arrangefiles(path) or nil
    })
end

function arrangefiles(dir)
    local linkFiles, regularFiles = {}, {}
    local cmd = util.execi('ls -Ah --full-time --group-directories-first "%s"' %{dir})
    for fileinfo in cmd do
        local dir_name = fileinfo:match("%s([^%s]+)$")
        local dir_path = dir .. dir_name
        if fileinfo:sub(1, 2) == 'lr' then
            util.append(linkFiles, fileinfo)
        elseif fileinfo:sub(1, 2) == 'dr' and dir_name ~= "proc" then
            for sizeinfo in util.execi('du -sh %s | cut -f1' %{dir_path}) do
                fileinfo = fileinfo:gsub("(%s+%S+%s+%S+%s+%S+%s+)(%S+)(%s+.+)$", "%1" .. sizeinfo .. "%3")
            end
            util.append(regularFiles, fileinfo)
        else
            util.append(regularFiles, fileinfo)
        end
    end
    return util.combine(regularFiles, linkFiles)
end

function file_list()
    list_response(http.formvalue("path"), true)
end

function handleDocument()
    local path = http.formvalue("path")
    local content = http.formvalue("content")
    http.prepare_content("application/json")

    if not fs.isfile(path) then
        return http.write_json({ success = false, error = luci.i18n.translatef("%s file does not exist", path)})
    end

    if content and #content ~= 0 then
        content = content:gsub("\r\n?", "\n")
        local success, code, msg = fs.writefile(path, content)
        return http.write_json({ success = success, error = not success and msg or nil })
    end

    local data, code, msg = fs.readfile(path)
    if type(data) ~= "string" and #data == 0 and not data then
        return http.write_json({ success = false, error = luci.i18n.translatef("Unable to read file: %s", msg)})
    end
    return http.write_json({ data = data, success = true })
end

function file_tools()
    local path       = http.formvalue("path") or nil
    local filepath   = http.formvalue("filepath") or nil
    local dir_path   = http.formvalue("dir_path") or nil
    local newname    = http.formvalue("newname") or nil
    local oldname    = http.formvalue("oldname") or nil
    local linkPath   = http.formvalue("linkPath") or nil
    local targetPath = http.formvalue("targetPath") or nil
    local modify     = http.formvalue("permissions") or nil
    local isHardLink = http.formvalue("isHardLink") ~= 'true'

    if dir_path then
        stat = fs.isdirectory(dir_path)
        http.prepare_content("application/json")
        http.write_json({ stat = stat })
    elseif modify then
        stat = fs.chmod(path, modify)
        list_response(fs.dirname(path), stat)
    elseif oldname and newname then
        stat = fs.move(oldname, newname)
        list_response(fs.dirname(oldname), stat)
    elseif linkPath and targetPath then
        stat = fs.link(targetPath, linkPath, isHardLink)
        list_response(fs.dirname(targetPath), stat)
    elseif filepath then
        stat = filepath:match(".*%.(.*)$") == "ipk" and util.exec('opkg --force-depends install "%s"' %{filepath})
        http.prepare_content("application/json")
        http.write_json({ data = stat, stat = stat and true or false })
    else
        stat = fs.isdirectory(path) and util.exec('rm -rf "%s"' %{path}) or nfs.remover(path)
        list_response(fs.dirname(path), stat)
    end
end

function createnewfile()
    local permissions = http.formvalue("permissions")
    local data, newfile = http.formvalue("data"), http.formvalue("newfile")
    if http.formvalue("createdirectory") == "true" then
        stat = fs.mkdir(newfile, newfile:match("/"))
    else
        local file_handle = io.open(newfile, "w")
        file_handle:setvbuf("full", 1024 * 1024)
        stat = file_handle:write(data)
        file_handle:close()
    end
    fs.chmod(newfile, permissions)
    list_response(fs.dirname(newfile), stat)
end

function uploadfile()
    local filedir, filename = http.formvalue("filedir"), http.formvalue("filename")
    if filename:match(".*%.(.*)$") == "ipk" then
        filedir = '/tmp/ipkdir/'
        if not fs.access(filedir) then fs.mkdir(filedir) end
    end
    local fd
    http.setfilehandler(function(meta, chunk, eof)
        if not fd then
            if meta and chunk then
                fd = io.open(filedir .. filename, "w")
            end
        end
        if chunk and fd then
            fd:write(chunk)
        end
        if eof and fd then
            fd:close()
            fd = nil
        end
    end)
    http.prepare_content("application/json")
    http.write_json({
        stat = eof and 0 or 1, filename = filename, filedir = filedir
    })
end

function downloadfile(filepath)
    local fd, filename, isDir = nil, nil, fs.isdirectory(filepath)
    if isDir then
        fd = io.popen('tar -C "%s" -cz .' %{filepath}, "r")
        filename = fs.basename(filepath) .. ".tar.gz"
        http.header('Content-Type', 'application/x-tar')
    else
        fd = io.open(filepath, "r")
        filename = fs.basename(filepath)
    end
    if not fd then return end
    http.header('Content-Disposition', 'inline; filename="%s"' %{filename})
    luci.ltn12.pump.all(luci.ltn12.source.file(fd), luci.http.write)
end

function to_mime(filename, download)
    if download == 'open' then
        local ext = filename:match("%.(%w+)$")
        return MIME_TYPES[ext and ext:lower()] or "text/plain; charset=UTF-8"
    elseif download == 'true' or type(filename) ~= "string" then
        return "application/octet-stream"
    end
end

function dpfile()
    local path = http.formvalue("path")
    local linkfile = http.formvalue("linkfile")
    local filename = http.formvalue("filename")
    local download = http.formvalue("download")
    local filepath = ((linkfile == "1") and "" or path) .. filename
    local mime = to_mime(filename, download)
    http.prepare_content(mime)
    if mime == "application/octet-stream" then
        downloadfile(filepath)
    else
        http.header('Content-Disposition', 'inline; filename="%s"' %{filename})
        local stat = luci.ltn12.pump.all(luci.ltn12.source.file(io.open(filepath, "r")), http.write)
        if not stat then
            http.write(luci.i18n.translatef("Unable to open file: %s", filepath))
        end
    end
end
