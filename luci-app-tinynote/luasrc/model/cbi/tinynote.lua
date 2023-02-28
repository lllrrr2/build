local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20210804

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

note_path = f:option(Value, "note_path", translate("保存路径"))
note_path.default = "/etc/tinynote"

note_sum = f:option(Value, "note_sum", translate("文本数量"))
note_sum.default = "8"
note_sum.datatype = "ufloat"

note_type = f:option(Value, "note_type", translate("文本类形"))
note_type.default = "txt"
note_type:value('txt', translate('txt'))
note_type:value('sh', translate('sh'))
note_type:value('js', translate('js'))
note_type:value('py', translate('py'))
note_type:value('lua', translate('lua'))

width = f:option(Value, "width", translate("显示宽度"))
width.default = "auto"
width:value('auto', translate('auto'))
width:value('1000px', translate('1000px'))
width:value('1300px', translate('1300px'))
width:value('1500px', translate('1500px'))

height = f:option(Value, "height", translate("显示高度"))
height.default = "600px"
height:value('500px', translate('500px'))
height:value('600px', translate('600px'))
height:value('800px', translate('800px'))

readOnly = f:option(Flag, "readOnly", translate("只读模式"))

s = m:section(TypedSection, "tinynote")
s.anonymous = true
s.addremove = false

local note_sum  = uci:get("luci", "tinynote", "note_sum")  or "1"
local note_type = uci:get("luci", "tinynote", "note_type") or "txt"
local note_path = uci:get("luci", "tinynote", "note_path") or "/etc/tinynote"
if sys.call("test ! -d /etc/tinynote") == 0 then fs.mkdirr(note_path) end
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

m:append(Template("tinynote/config_editor"))

return m
