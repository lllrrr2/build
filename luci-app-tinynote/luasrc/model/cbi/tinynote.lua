local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20210804

if (uci:get("luci", "tinynote") ~= "tinynote") then
	uci:set("luci", "tinynote", "tinynote")
	uci:commit("luci")
end

if (sys.call("test ! -d /etc/tinynote") == 0) then
	fs.mkdir("/etc/tinynote")
end

m = Map("luci", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))

f = m:section(TypedSection, "tinynote")
f.template = "cbi/tblsection"
f.anonymous = true -- 删除
f.addremove = true -- 添加
f.extedit   = true -- 修改
f.sortable  = true -- 移动

note_type = f:option(Value, "note_type", translate("文本类形"))
note_type.default = "txt"
note_type.datatype = ""
note_type:value('txt', translate('txt'))
note_type:value('sh', translate('sh'))
note_type:value('js', translate('js'))
note_type:value('py', translate('py'))
note_type:value('lua', translate('lua'))

note_sum = f:option(Value, "note_sum", translate("文本数量"))
note_sum.default = "8"
note_sum.datatype = "ufloat"

s = m:section(TypedSection, "tinynote")
s.anonymous = true
s.addremove = false

local note_type_array = {
	"#!/usr/bin/env sh",
	"#!/usr/bin/env lua",
	"#!/usr/bin/env python"
}

local note_sum = uci:get("luci", "tinynote", "note_sum")
if not note_sum then note_sum = 1 end
local xx = sys.exec("seq 1 " .. note_sum)
for sum in string.gmatch(xx, "%w") do
	local file = ("/etc/tinynote/tinynote" .. sum .. ".txt")
	if not fs.access(file) then
		sys.exec(":> " .. file)
	end

	if fs.access(file) then
		local Note = ("Note" .. sum)
		s:tab(Note, translate("笔记" .. sum))
		if (sys.call("test -s " .. file) == 0) then
			o = s:taboption(Note, Button, "editNote" .. sum)
			o.inputtitle = translate("清空笔记 " .. sum)
			o.inputstyle = "reset"
			function o.write()
				if sys.call(":>" .. file) == 0 then
					luci.http.redirect(luci.dispatcher.build_url("admin/nas/tinynote"))
				end
			end
		end

		Note = s:taboption(Note, Value, "editNote" .. sum, nil)
		Note.template = "cbi/tvalue"
		Note.rows = 35
		Note.wrap = "off"
		function Note.cfgvalue(self, section)
			return fs.readfile(file) or ""
		end
		function Note.write(self, section, value)
			if value then
				value = value:gsub("\r\n?", "\n")
				local old_value = fs.readfile(value)
				if value ~= old_value then
					fs.writefile(file, value)
				end
			end
		end
	end
end

return m
