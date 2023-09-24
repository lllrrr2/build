local fs   = require "nixio.fs"
local util = require "luci.util"
module("luci.controller.filebrowser", package.seeall)
function index()
    entry({"admin", "system", "filebrowser"}, template("filebrowser"), _("File management"), 60).dependent = true
    entry({"admin", "system", "filebrowser_list"}, call("filebrowser_list"), nil).leaf = true
    entry({"admin", "system", "filebrowser_open"}, call("filebrowser_open"), nil).leaf = true
    entry({"admin", "system", "filebrowser_delete"}, call("filebrowser_delete"), nil).leaf = true
    entry({"admin", "system", "filebrowser_rename"}, call("filebrowser_rename"), nil).leaf = true
    entry({"admin", "system", "filebrowser_upload"}, call("filebrowser_upload"), nil).leaf = true
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

function scandir(directory)
    local t, linkFiles, dirFiles, normalFiles = {}, {}, {}, {}
    for fileinfo in util.execi("ls -lA '%s'" %directory) do
        if string.sub(fileinfo, 1, 1) == 'd' then
            dirFiles[#dirFiles+1] = fileinfo
        elseif string.sub(fileinfo, 1, 1) == 'l' then
            linkFiles[#linkFiles+1] = fileinfo
        else
            normalFiles[#normalFiles+1] = fileinfo
        end
    end

    for _, file in ipairs(dirFiles) do
        t[#t+1] = file
    end
    for _, file in ipairs(normalFiles) do
        t[#t+1] = file
    end
    for _, file in ipairs(linkFiles) do
        t[#t+1] = file
    end

    return t
end

function list_response(path, success)
    luci.http.prepare_content("application/json")
    luci.http.write_json({
        ec = success and 0 or 1,
        data = success and scandir(path) or nil
    })
end

function to_mime(filename)
    if type(filename) ~= "string" then
        return "application/octet-stream"
    end

    local ext = filename:match("[^%.]+$")
    return MIME_TYPES[ext and ext:lower()] or "application/octet-stream"
end

function installIPK(filepath)
    util.exec('opkg --force-depends install "'..filepath..'"')
    util.exec('rm -rf /tmp/luci-*')
    return true
end

function filebrowser_list()
    list_response(luci.http.formvalue("path"), true)
end

function filebrowser_open()
    local path = luci.http.formvalue("path")
    local filename = luci.http.formvalue("filename")
    local mime = to_mime(filename)
    local file = path .. filename

    luci.http.header('Content-Disposition', 'inline; filename="' .. filename .. '"')
    luci.http.prepare_content(mime)
    luci.ltn12.pump.all(luci.ltn12.source.file(io.open(file, "r")), luci.http.write)
end

function filebrowser_delete()
    local path = luci.http.formvalue("path")
    local isdir = luci.http.formvalue("isdir")
    path = path:gsub("<>", "/"):gsub(" ", "\\ ")
    local success = isdir and fs.remove(path)
    list_response(fs.dirname(path), success)
end

function filebrowser_rename()
    local filepath = luci.http.formvalue("filepath")
    local newpath = luci.http.formvalue("newpath")
    local success = fs.mover(filepath, newpath)
    list_response(fs.dirname(filepath), success)
end

function fileassistant_install()
    local filepath = luci.http.formvalue("filepath")
    local ext = filepath:match(".+%.(%w+)$")
    filepath = filepath:gsub("<>", "/"):gsub(" ", "\\ ")

    local success = false
    if ext == "ipk" then
        success = installIPK(filepath)
    end

    list_response(fs.dirname(filepath), success)
end

function filebrowser_upload()
    local filecontent = luci.http.formvalue("upload-file")
    local filename = luci.http.formvalue("upload-filename")
    local uploaddir = luci.http.formvalue("upload-dir")
    local filepath = uploaddir..filename

    local fp
    luci.http.setfilehandler(
        function(meta, chunk, eof)
            if not fp and meta and meta.name == "upload-file" then
                fp = io.open(filepath, "w")
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
