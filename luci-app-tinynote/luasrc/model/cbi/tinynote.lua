local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20210804

if (uci:get("luci", "tinynote") ~= "tinynote") then
	uci:set("luci", "tinynote", "tinynote")
	uci:commit("luci")
end

if (sys.call("test ! -d /etc/tinynote")) then
	fs.mkdir("/etc/tinynote")
end

m = Map("luci", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))

f = m:section(TypedSection, "tinynote")
f.template = "cbi/tblsection"
f.anonymous = true -- 删除
f.addremove = true -- 添加
f.extedit   = true -- 修改
f.sortable  = true -- 移动

note_type = f:option(Value, "note_type", translate("类形"))
note_type.default = "txt"
note_type.datatype = ""
note_type:value('txt', translate('txt'))
note_type:value('sh', translate('sh'))
note_type:value('js', translate('js'))
note_type:value('py', translate('py'))
note_type:value('lua', translate('lua'))

note_sum = f:option(Value, "note_sum", translate("数量"))
note_sum.default = "8"
note_sum.datatype = "ufloat"

s = m:section(TypedSection, "tinynote")
s.anonymous = true

local note_type = {
"#!/usr/bin/env sh",
"#!/usr/bin/env lua",
"#!/usr/bin/env python"
}

local note_sum = uci:get("luci", "tinynote", "note_sum")
for v = 1,note_sum do
	local file = ("/etc/tinynote/tinynote" .. v .. ".txt")
	if not fs.access(file) then
		sys.exec(":> " .. file)
	end

	if fs.access(file) then
		local Note = ("Note" .. v)
		s:tab(Note, translate("笔记" .. v))
		Note = s:taboption(Note, Value, "editNote" .. v, nil)
		Note.template = "cbi/tvalue"
		Note.rows = 35
		Note.wrap = "off"
		function Note.cfgvalue(self, section)
			return fs.readfile(file) or ""
		end
		function Note.write(self, section, value)
			if value then
				value = value:gsub("\r\n?", "\n")
				fs.writefile("/tmp/tinynote" .. v .. ".txt", value)
				if (sys.call("cmp -s /tmp/tinynote" .. v .. ".txt" .. " " .. file) == 1) then
					fs.writefile(file, value)
				end
				os.remove("/tmp/tinynote" .. v .. ".txt")
			end
		end
	end
end

return m
