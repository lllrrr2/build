local fs  = require "nixio.fs" --加载函数
local sys = require "luci.sys" --加载函数
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20210804

if (uci:get("luci", "tinynote") ~= "tinynote") then
	uci:set("luci", "tinynote", "tinynote")
	uci:commit("luci")
end

m = Map("luci", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))
s = m:section(TypedSection, "tinynote")
s.anonymous = true

if (sys.call("test ! -d /etc/tinynote")) then --判断目录是否存在
	fs.mkdir("/etc/tinynote") --新建文件夹
end

for i,v in ipairs({1,2,3,4,5,6,7,8}) do
	local file = ("/etc/tinynote/tinynote" .. v .. ".txt")
	if not fs.access(file) then --判断文件是否存在
		sys.exec(":> " .. file) --新建文件
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
