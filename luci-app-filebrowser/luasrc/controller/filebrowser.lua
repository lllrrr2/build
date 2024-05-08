local nfs  = require "nixio.fs"
local lfs  = require "luci.fs"
local util = require "luci.util"
local http = require "luci.http"
module("luci.controller.filebrowser", package.seeall)
function index()
    entry({"admin", "system", "filebrowser"}, template("filebrowser"), _("File management"), 60).dependent = true
    entry({"admin", "system", "dpfile"}, call("dpfile"), nil).leaf = true
    entry({"admin", "system", "file_list"}, call("file_list"), nil).leaf = true
    entry({"admin", "system", "createLink"}, call("createLink"), nil).leaf = true
    entry({"admin", "system", "renamefile"}, call("renamefile"), nil).leaf = true
    entry({"admin", "system", "uploadfile"}, call("uploadfile"), nil).leaf = true
    entry({"admin", "system", "installipk"}, call("installipk"), nil).leaf = true
    entry({"admin", "system", "deletefiles"}, call("deletefiles"), nil).leaf = true
    entry({"admin", "system", "createnewfile"}, call("createnewfile"), nil).leaf = true
    entry({"admin", "system", "checkdirectory"}, call("checkdirectory"), nil).leaf = true
    entry({"admin", "system", "modifypermissions"}, call("modifypermissions"), nil).leaf = true
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
        stat = stat and 0 or 1,
        data = stat and arrangefiles(path) or nil
    })
end

function arrangefiles(dir)
    local linkFiles, regularFiles = {}, {}
    for fileinfo in util.execi('ls -Ah --full-time --group-directories-first "%s"' %{dir}) do
        local dir_name = fileinfo:match("%s([^%s]+)$")
        if fileinfo:sub(1, 2) == 'lr' then
            util.append(linkFiles, fileinfo)
        elseif fileinfo:sub(1, 2) == 'dr' and dir_name ~= "proc" then
            local dir_path = '/%s/%s' %{dir, dir_name}
            for sizeinfo in util.execi('du -sh "%s"' %{dir_path:gsub("/+", "/")}) do
                fileinfo = fileinfo:gsub("(%s+%S+%s+%S+%s+%S+%s+)(%S+)(%s+.+)$", "%1" .. sizeinfo:match("(%S+)") .. "%3")
                util.append(regularFiles, fileinfo)
            end
        else
            util.append(regularFiles, fileinfo)
        end
    end
    return util.combine(regularFiles, linkFiles)
end

function file_list()
    list_response(http.formvalue("path"), true)
end

function deletefiles()
    local path, isdir = http.formvalue("path"), http.formvalue("isdir")
    stat = isdir == '1' and util.exec('rm -rf "%s"' %{path}) or nfs.remover(path)
    list_response(nfs.dirname(path), stat)
end

function renamefile()
    local newname, oldname = http.formvalue("newname"), http.formvalue("oldname")
    stat = nfs.move(oldname, newname)
    list_response(nfs.dirname(oldname), stat)
end

function createnewfile()
    local permissions = http.formvalue("permissions")
    local data, newfile = http.formvalue("data"), http.formvalue("newfile")
    if http.formvalue("createdirectory") == "true" then
        stat = nfs.mkdirr(newfile)
    else
        local file_handle = io.open(newfile, "w")
        file_handle:setvbuf("full", 1024 * 1024)
        stat = file_handle:write(data)
        file_handle:close()
    end
    nfs.chmod(newfile, permissions)
    list_response(nfs.dirname(newfile), stat)
end

function createLink()
    local linkPath   = http.formvalue("linkPath")
    local isHardLink = http.formvalue("isHardLink")
    local targetPath = http.formvalue("targetPath")
    local sym = (isHardLink == 'false') and true or false
    stat = lfs.link(targetPath, linkPath, sym)
    list_response(nfs.dirname(targetPath), stat)
end

function modifypermissions()
    local path, modify = http.formvalue("path"), http.formvalue("permissions")
    stat = nfs.chmod(path, modify)
    list_response(nfs.dirname(path), stat)
end

function uploadfile()
    local filedir, filename = http.formvalue("filedir"), http.formvalue("filename")
    if filename:match(".*%.(.*)$") == "ipk" then
        filedir = '/tmp/ipkdir/'
        if not nfs.access(filedir) then nfs.mkdir(filedir) end
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

function installipk()
    local filepath = http.formvalue("filepath")
    if filepath:match(".*%.(.*)$") == "ipk" then
        stat = util.exec('opkg --force-depends install "%s"' %{filepath})
    end
    http.prepare_content("application/json")
    http.write_json({ data = stat, stat = stat and 0 or 1 })
end

function downloadfile(filepath)
    local fd, filename, isDir = nil, nil, lfs.isdirectory(filepath)
    if isDir then
        fd = io.popen('tar -C "%s" -cz .' %{filepath}, "r")
        filename = lfs.basename(filepath) .. ".tar.gz"
        http.header('Content-Type', 'application/x-tar')
    else
        fd = io.open(filepath, "r")
        filename = lfs.basename(filepath)
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

function checkdirectory()
    local state, filepath = 1, http.formvalue("path")
    if lfs.isdirectory(filepath) then
        state = 0
    end
    http.prepare_content("application/json")
    http.write_json({ stat = state })
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
            http.write("无法打开文件：%s" %{filepath})
        end
    end
end
