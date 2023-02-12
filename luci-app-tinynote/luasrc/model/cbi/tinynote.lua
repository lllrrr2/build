local fs = require "nixio.fs" --加载函数
local sys = require "luci.sys" --加载函数
--wulishui 20200108-20210804

m = Map("tinynote", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))
s = m:section(TypedSection, "tinynote")
s.anonymous=true

if (sys.call("test ! -d /etc/tinynote")) then --判断目录是否存在
	fs.mkdir("/etc/tinynote") --新建文件夹
end

array = {1,2,3,4,5,6,7,8} --数组
for i,v in ipairs(array) do
	local file= (v .. ".txt")
	if not fs.access("/etc/tinynote/tinynote" .. file) then --判断文件是否存在
		sys.exec(":>/etc/tinynote/tinynote" .. file) --新建文件
	end

	if fs.access("/etc/tinynote/tinynote" .. file) then
		local Note= ("Note" .. v)
		s:tab(Note, translate("笔记" .. v))
		Note = s:taboption(Note, Value, "editNote" .. v, nil)
		Note.template = "cbi/tvalue"
		Note.rows = 35
		Note.wrap = "off"
		function Note.cfgvalue(self, section)
			return fs.readfile("/etc/tinynote/tinynote" .. file) or ""
		end
		function Note.write(self, section, value)
			if value then
				value = value:gsub("\r\n?", "\n")
				fs.writefile("/tmp/tinynote" .. file, value)
				if (sys.call("cmp -s /tmp/tinynote" .. file .. " /etc/tinynote/tinynote" .. file) == 1) then
					fs.writefile("/etc/tinynote/tinynote" .. file, value)
				end
				fs.remove("/tmp/tinynote" .. file)
			end
		end
	end
end

return m
