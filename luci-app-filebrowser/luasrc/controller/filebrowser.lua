local fs   = require "nixio.fs"
local util = require "luci.util"
local http = require "luci.http"
module("luci.controller.filebrowser", package.seeall)
function index()
    entry({"admin", "system", "filebrowser"}, template("filebrowser"), _("File management"), 60).dependent = true
    entry({"admin", "system", "filebrowser_list"}, call("filebrowser_list"), nil).leaf = true
    entry({"admin", "system", "filebrowser_open"}, call("filebrowser_open"), nil).leaf = true
    entry({"admin", "system", "filebrowser_delete"}, call("filebrowser_delete"), nil).leaf = true
    entry({"admin", "system", "filebrowser_rename"}, call("filebrowser_rename"), nil).leaf = true
    entry({"admin", "system", "filebrowser_upload"}, call("filebrowser_upload"), nil).leaf = true
    entry({"admin", "system", "filebrowser_modify"}, call("filebrowser_modify"), nil).leaf = true
    entry({"admin", "system", "fileassistant", "install"}, call("fileassistant_install"), nil).leaf = true
end

local MIME_TYPES = {
    txt   = "text/plain",
    conf  = "text/plain",
    ovpn  = "text/plain",
    log   = "text/plain",
    js    = "text/javascript",
    json  = "application/json",
    css   = "text/css",
    htm   = "text/html",
    html  = "text/html",
    patch = "text/x-patch",
    c     = "text/x-csrc",
    h     = "text/x-chdr",
    o     = "text/x-object",
    ko    = "text/x-object",
    bmp   = "image/bmp",
    gif   = "image/gif",
    png   = "image/png",
    jpg   = "image/jpeg",
    jpeg  = "image/jpeg",
    svg   = "image/svg+xml",
    zip   = "application/zip",
    pdf   = "application/pdf",
    xml   = "application/xml",
    xsl   = "application/xml",
    doc   = "application/msword",
    ppt   = "application/vnd.ms-powerpoint",
    xls   = "application/vnd.ms-excel",
    odt   = "application/vnd.oasis.opendocument.text",
    odp   = "application/vnd.oasis.opendocument.presentation",
    pl    = "application/x-perl",
    sh    = "application/x-shellscript",
    php   = "application/x-php",
    deb   = "application/x-deb",
    iso   = "application/x-cd-image",
    tgz   = "application/x-compressed-tar",
    mp3   = "audio/mpeg",
    ogg   = "audio/x-vorbis+ogg",
    wav   = "audio/x-wav",
    mpg   = "video/mpeg",
    mpeg  = "video/mpeg",
    avi   = "video/x-msvideo"
}

function list_response(path, success)
    http.prepare_content("application/json")
    http.write_json({
        status = success and 0 or 1,
        data = success and scandir(path) or nil
    })
end

local success = false
function scandir(dir)
    local linkFiles, regularFiles = {}, {}
    for fileinfo in util.execi("ls -Ah --full-time --group-directories-first '%s'" %dir) do
        if fileinfo:sub(1, 2) == 'lr' then
            util.append(linkFiles, fileinfo)
        else
            util.append(regularFiles, fileinfo)
        end
    end
    return util.combine(regularFiles, linkFiles)
end

function to_mime(filename)
    if type(filename) ~= "string" then
        return "application/octet-stream"
    end

    local ext = filename:match("[^%.]+$")
    return MIME_TYPES[ext and ext:lower()] or "application/octet-stream"
end

function installIPK(filepath)
    success = util.exec('opkg --force-depends install "%s"' %filepath)
    if success then
        util.exec('rm -rf "%s"' %filepath)
    end
    return success
end

function filebrowser_list()
    list_response(http.formvalue("path"), true)
end

function filebrowser_open()
    local path = http.formvalue("path")
    local filename = http.formvalue("filename")
    local mime = to_mime(filename)

    http.header('Content-Disposition', 'inline; filename="%s"' %filename)
    http.prepare_content(mime)
    luci.ltn12.pump.all(luci.ltn12.source.file(io.open(path .. filename, "r")), http.write)
end

function filebrowser_delete()
    local isdir = http.formvalue("isdir")
    local path = http.formvalue("path"):gsub("<>", "/"):gsub(" ", "\\ ")
    success = isdir and util.exec('rm -rf "%s"' %path) or fs.remover(path)
    list_response(fs.dirname(path), success)
end

function filebrowser_rename()
    local filepath = http.formvalue("filepath")
    local newpath = http.formvalue("newpath")
    success = fs.move(filepath, newpath)
    list_response(fs.dirname(filepath), success)
end

function filebrowser_modify()
    local path = luci.http.formvalue("path")
    local permissions = luci.http.formvalue("permissions")
    success = permissions and fs.chmod(path, permissions)
    list_response(fs.dirname(path), success)
end

function fileassistant_install()
    local filepath = http.formvalue("filepath"):gsub("<>", "/"):gsub(" ", "\\ ")
    if filepath:match(".+%.(%w+)$") == "ipk" then
        success = installIPK(filepath)
    end
    list_response(fs.dirname(filepath), success)
end

function filebrowser_upload()
    local filecontent = http.formvalue("upload-file")
    local filename = http.formvalue("upload-filename")
    local uploaddir = http.formvalue("upload-dir")

    local fp
    http.setfilehandler(
        function(meta, chunk, eof)
            if not fp and meta and meta.name == "upload-file" then
                fp = io.open(uploaddir .. filename, "w")
            end
            if fp and chunk then
                fp:write(chunk)
            end
            if fp and eof then
                fp:close()
            end
      end
    )

    list_response(uploaddir, true)
end
