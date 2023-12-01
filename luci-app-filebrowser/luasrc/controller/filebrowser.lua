local nfs  = require "nixio.fs"
local lfs  = require "luci.fs"
local util = require "luci.util"
local http = require "luci.http"
module("luci.controller.filebrowser", package.seeall)
function index()
    entry({"admin", "system", "filebrowser"}, template("filebrowser"), _("File management"), 60).dependent = true
    entry({"admin", "system", "dpfile"}, call("dpfile"), nil).leaf = true
    entry({"admin", "system", "file_list"}, call("file_list"), nil).leaf = true
    entry({"admin", "system", "renamefile"}, call("renamefile"), nil).leaf = true
    entry({"admin", "system", "uploadfile"}, call("uploadfile"), nil).leaf = true
    entry({"admin", "system", "installipk"}, call("installipk"), nil).leaf = true
    entry({"admin", "system", "deletefiles"}, call("deletefiles"), nil).leaf = true
    entry({"admin", "system", "createnewfile"}, call("createnewfile"), nil).leaf = true
    entry({"admin", "system", "checkdirectory"}, call("checkdirectory"), nil).leaf = true
    entry({"admin", "system", "modifypermissions"}, call("modifypermissions"), nil).leaf = true
end

local MIME_TYPES = {
    bmp   = "image/bmp",
    gif   = "image/gif",
    jpg   = "image/jpeg",
    jpeg  = "image/jpeg",
    png   = "image/png",
    svg   = "image/svg+xml",
    pdf   = "application/pdf",
    xml   = "application/xml",
    xsl   = "application/xml",
    doc   = "application/msword",
    ppt   = "application/vnd.ms-powerpoint",
    xls   = "application/vnd.ms-excel",
    odt   = "application/vnd.oasis.opendocument.text",
    odp   = "application/vnd.oasis.opendocument.presentation",
    zip   = "application/zip",
    tgz   = "application/x-compressed-tar",
    deb   = "application/x-deb",
    iso   = "application/x-cd-image",
    txt   = "text/plain;charset=UTF-8",
    yaml  = "text/plain;charset=UTF-8",
    conf  = "text/plain;charset=UTF-8",
    ovpn  = "text/plain;charset=UTF-8",
    log   = "text/plain;charset=UTF-8",
    js    = "text/javascript;charset=UTF-8",
    json  = "application/json;charset=UTF-8",
    lua   = "text/plain;charset=UTF-8",
    css   = "text/css;charset=UTF-8",
    htm   = "text/html;charset=UTF-8",
    html  = "text/html;charset=UTF-8",
    patch = "text/x-patch;charset=UTF-8",
    c     = "text/x-csrc;charset=UTF-8",
    h     = "text/x-chdr;charset=UTF-8",
    o     = "text/x-object;charset=UTF-8",
    ko    = "text/x-object;charset=UTF-8",
    pl    = "application/x-perl",
    sh    = "text/plain;charset=UTF-8",
    php   = "application/x-php;charset=UTF-8",
    mp3   = "audio/mpeg",
    ogg   = "audio/x-vorbis+ogg",
    wav   = "audio/x-wav",
    mpg   = "video/mpeg",
    mpeg  = "video/mpeg",
    avi   = "video/x-msvideo"
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
        if fileinfo:sub(1, 2) == 'lr' then
            util.append(linkFiles, fileinfo)
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
    stat = isdir and util.exec('rm -rf "%s"' %{path}) or nfs.remover(path)
    list_response(nfs.dirname(path), stat)
end

function renamefile()
    local newname, oldname = http.formvalue("newname"), http.formvalue("oldname")
    stat = nfs.move(oldname, newname)
    list_response(nfs.dirname(oldname), stat)
end

function createnewfile()
    local data, newfile = http.formvalue("data"), http.formvalue("newfile")
    if http.formvalue("createdirectory") == "true" then
        stat = util.exec('mkdir -p "%s"' %{newfile})
    else
        local file_handle = io.open(newfile, "w")
        file_handle:setvbuf("full", 1024 * 1024)
        stat = file_handle:write(data)
        file_handle:close()
    end
    list_response(nfs.dirname(newfile), stat)
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
    local fd, block, filename, isDir = fd, block, filename, lfs.isdirectory(filepath)
    fd = (isDir and io.popen('tar -C "%s" -cz .' %{filepath}, "r")) or nixio.open(filepath, "r")
    if not fd then return end
    filename = (isDir and lfs.basename(filepath) .. ".tar.gz") or lfs.basename(filepath)
    http.header('Content-Disposition', 'inline; filename="%s"' %{filename})

    repeat
        block = fd:read(nixio.const.buffersize)
        if not block or #block == 0 then break end
        http.write(block)
    until not block

    fd:close()
end

function to_mime(filename, download)
    if download == 'open' then
        return "text/plain;charset=UTF-8"
    elseif download == 'true' or type(filename) ~= "string" then
        return "application/octet-stream"
    end

    local ext = filename:match("%.(%w+)$")
    return MIME_TYPES[ext and ext:lower()] or "application/octet-stream"
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
    local filename = http.formvalue("filename")
    local download = http.formvalue("download")
    local filepath = path .. filename
    local mime = to_mime(filename, download)
    http.prepare_content(mime)
    if mime == "application/octet-stream" then
        downloadfile(filepath)
    else
        http.header('Content-Disposition', 'inline; filename="%s"' %{filename})
        luci.ltn12.pump.all(luci.ltn12.source.file(io.open(filepath, "r")), http.write)
    end
    http.close()
end
