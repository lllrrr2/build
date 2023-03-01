local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20230301

local note_type_array = {
	["sh"]  = "#!/usr/bin/env sh",
	["lua"] = "#!/usr/bin/env lua",
	["py"]  = "#!/usr/bin/env python",
}

if not uci:get("luci", "tinynote") then
	uci:set("luci", "tinynote", "tinynote")
	uci:commit("luci")
end

local contains = function(list, value)
	for k, v in pairs(list) do
		if v == value then
			return true
		end
		if k == value then
			return v
		end
	end
	return false
end

local delenote = function(list1, list2)
	for _, x in pairs(list1) do
		if not contains(list2, x) then
			fs.remove(x)
		end
	end
end

local new_note = function(file, note_type)
	if contains(note_type_array, note_type) then
		sys.exec('echo "' .. contains(note_type_array, note_type) ..'"  > ' .. file)
	else
		sys.exec(":> " .. file)
	end
end

m = Map("luci", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))

f = m:section(TypedSection, "tinynote")
-- f.template = "cbi/tblsection"
f.anonymous = true -- 删除
-- f.addremove = true -- 添加
-- f.extedit   = true -- 修改
-- f.sortable  = true -- 移动

f:tab("note", translate("Note设置"))
note_path = f:taboption("note", Value, "note_path", translate("保存路径"))
note_path.default = "/etc/tinynote"

note_sum = f:taboption("note", Value, "note_sum", translate("文本数量"))
note_sum.default = "8"
note_sum.datatype = "ufloat"

note_type = f:taboption("note", Value, "note_type", translate("文本类形"))
note_type.default = "txt"
note_type:value('txt', translate('txt'))
note_type:value('sh', translate('sh'))
note_type:value('js', translate('js'))
note_type:value('py', translate('py'))
note_type:value('lua', translate('lua'))


f:tab("codemirror", translate("高级设置"))
enable = f:taboption("codemirror", Flag, "enable", translate("enable"), translate("启用codemirror后支持语法高亮，行号显示，语法错误检查等等"))
enable.default = '0'

theme = f:taboption("codemirror", Value, "theme", translate("主题"))
theme.default = "monokai"
theme:value('monokai', translate('monokai'))
theme:value('material', translate('material'))
theme:value('3024-day', translate('3024-day'))
theme:value('3024-night', translate('3024-night'))
theme:value('lesser-dark', translate('lesser-dark'))
theme:depends("enable", 1)

font_size = f:taboption("codemirror", Value, "font_size", translate("字体大小"))
font_size.default = "14"
font_size:value('12', translate('12'))
font_size:value('14', translate('14'))
font_size:value('16', translate('16'))
font_size:depends("enable", 1)

line_spacing = f:taboption("codemirror", Value, "line_spacing", translate("行距"))
line_spacing.default = "140"
line_spacing:value('100', translate('100'))
line_spacing:value('140', translate('140'))
line_spacing:value('150', translate('150'))
line_spacing:depends("enable", 1)

height = f:taboption("codemirror", Value, "height", translate("显示高度"))
height.default = "600"
height:value('500', translate('500'))
height:value('600', translate('600'))
height:value('800', translate('800'))
height:depends("enable", 1)

width = f:taboption("codemirror", Value, "width", translate("显示宽度"))
width.default = "auto"
width:value('auto', translate('auto'))
width:value('1000', translate('1000'))
width:value('1300', translate('1300'))
width:value('1500', translate('1500'))
width:depends("enable", 1)

only = f:taboption("codemirror", Flag, "only", translate("只读模式"))
only:depends("enable", 1)

s = m:section(TypedSection, "tinynote")
s.anonymous = true
s.addremove = false

local config	= uci:get_all("luci", "tinynote")
local enable	= config.enable    or "0"
local note_sum	= config.note_sum  or "1"
local note_type = config.note_type or "txt"
local note_path = config.note_path or "/etc/tinynote"
if sys.call("test ! -d " .. note_path) == 0 then fs.mkdirr(note_path) end
local arg1,arg2 = {},{}

for sum = 1, note_sum do
	local file = note_path .. "/tinynote" .. sum .. "." .. note_type
	arg2[sum] = file
	if sys.call("[ -s " .. file .. " ]") == 1 then new_note(file, note_type) end

	if sys.call("[ -s " .. file .. " ]") then
		local note = ("note" .. sum)
		s:tab(note, translate("笔记 " .. sum))

		-- if sys.call("[ $(sed -n '$=' " .. file .. ") -gt 1 ]") == 0 then
		-- 	o = s:taboption(note, Button, "note" .. sum)
		-- 	o.inputtitle = translate("清空笔记 " .. sum)
		-- 	o.inputstyle = "reset"
		-- 	function o.write()
		-- 		new_note(file, note_type)
		-- 		if uci:changes("luci") then uci:commit("luci") end
		-- 		luci.http.redirect(luci.dispatcher.build_url("admin/nas/tinynote"))
		-- 	end
		-- end

		note = s:taboption(note, Value, "note" .. sum .. "." .. note_type)
		note.template = "cbi/tvalue"
		note.rows = 35
		note.wrap = "off"
		function note.cfgvalue(self, section)
			return fs.readfile(file) or ""
		end
		function note.write(self, section, value)
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

for i in fs.dir(note_path) do arg1[i] = note_path .. "/" .. i end
if not rawequal(arg1,arg2) then delenote(arg1,arg2) end
arg1,arg2 = nil,nil

if enable == "1" then
	m:append(Template("codemirror"))
end

return m
