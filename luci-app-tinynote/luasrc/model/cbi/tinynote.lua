local fs = require "nixio.fs"
local sys = require "luci.sys"
--wulishui 20200108-20210804

m = Map("tinynote", translate(""), translate([[<font color="green"><b>只能记录少量文本内容。文本内容勿大于90Kb（约1000行），否则无法保存。</b></font>]]))
s = m:section(TypedSection, "tinynote")
s.anonymous=true

if (sys.call("[ -d /etc/tinynote ]") == 1) then
	fs.mkdirr("/etc/tinynote")
end

if fs.access("/etc/tinynote/tinynote1.txt") then
	s:tab("Note1", translate("便签1"))
	o = s:taboption("Note1", Value, "editNote1", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote1.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote1.txt", value)
			if (sys.call("cmp -s /tmp/tinynote1.txt /etc/tinynote/tinynote1.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote1.txt", value)
			end
			fs.remove("/tmp/tinynote1.txt")
		end
	end
else
	sys.call("touch /etc/tinynote/tinynote1.txt")
end

if fs.access("/etc/tinynote/tinynote2.txt") then
	s:tab("Note2", translate("便签2"))
	o = s:taboption("Note2", Value, "editNote2", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote2.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote2.txt", value)
			if (sys.call("cmp -s /tmp/tinynote2.txt /etc/tinynote/tinynote2.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote2.txt", value)
			end
			fs.remove("/tmp/tinynote2.txt")
		end
	end
else
	sys.call("touch /etc/tinynote/tinynote2.txt")
end

if fs.access("/etc/tinynote/tinynote3.txt") then
	s:tab("Note3", translate("便签3"))
	o = s:taboption("Note3", Value, "editNote3", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote3.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote3.txt", value)
			if (sys.call("cmp -s /tmp/tinynote3.txt /etc/tinynote/tinynote3.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote3.txt", value)
			end
			fs.remove("/tmp/tinynote3.txt")
		end
	end
else
	sys.call("touch /etc/tinynote/tinynote3.txt")
end

if fs.access("/etc/tinynote/tinynote4.txt") then
	s:tab("Note4", translate("便签4"))
	o = s:taboption("Note4", Value, "editNote4", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote4.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote4.txt", value)
			if (sys.call("cmp -s /tmp/tinynote4.txt /etc/tinynote/tinynote4.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote4.txt", value)
			end
			fs.remove("/tmp/tinynote4.txt")
		end
	end
else
	sys.call("touch /etc/tinynote/tinynote4.txt")
end

if fs.access("/etc/tinynote/tinynote5.txt") then
	s:tab("Note5", translate("便签5"))
	o = s:taboption("Note5", Value, "editNote5", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote5.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote5.txt", value)
			if (sys.call("cmp -s /tmp/tinynote5.txt /etc/tinynote/tinynote5.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote5.txt", value)
			end
			fs.remove("/tmp/tinynote5.txt")
		end
	end
else
	sys.call("> /etc/tinynote/tinynote5.txt")
end

if fs.access("/etc/tinynote/tinynote6.txt") then
	s:tab("Note6", translate("便签6"))
	o = s:taboption("Note6", Value, "editNote6", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote6.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote6.txt", value)
			if (sys.call("cmp -s /tmp/tinynote6.txt /etc/tinynote/tinynote6.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote6.txt", value)
			end
			fs.remove("/tmp/tinynote6.txt")
		end
	end
else
	sys.call("&> /etc/tinynote/tinynote6.txt")
end

if fs.access("/etc/tinynote/tinynote7.txt") then
	s:tab("Note7", translate("便签7"))
	o = s:taboption("Note7", Value, "editNote7", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote7.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote7.txt", value)
			if (sys.call("cmp -s /tmp/tinynote7.txt /etc/tinynote/tinynote7.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote7.txt", value)
			end
			fs.remove("/tmp/tinynote7.txt")
		end
	end
else
	sys.call("cat /dev/null > /etc/tinynote/tinynote7.txt")
end

if fs.access("/etc/tinynote/tinynote8.txt") then
	s:tab("Note8", translate("便签8"))
	o = s:taboption("Note8", Value, "editNote8", nil)
	o.template = "cbi/tvalue"
	o.rows = 35
	o.wrap = "off"
	function o.cfgvalue(self, section)
		return fs.readfile("/etc/tinynote/tinynote8.txt") or ""
	end
	function o.write(self, section, value)
		if value then
			value = value:gsub("\r\n?", "\n")
			fs.writefile("/tmp/tinynote8.txt", value)
			if (sys.call("cmp -s /tmp/tinynote8.txt /etc/tinynote/tinynote8.txt") == 1) then
				fs.writefile("/etc/tinynote/tinynote8.txt", value)
			end
			fs.remove("/tmp/tinynote8.txt")
		end
	end
else
	sys.call(":> /etc/tinynote/tinynote8.txt")
end

return m
