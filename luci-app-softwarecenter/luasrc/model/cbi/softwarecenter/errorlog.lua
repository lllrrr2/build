f = SimpleForm("softwarecenter")
f.reset = false
f.submit = false

if nixio.fs.access("/opt/etc/init.d/S80nginx") then
	f:append(Template("softwarecenter/access_log"))
	f:append(Template("softwarecenter/error_log"))
else
	s = f:section(SimpleSection)
	f.title = translate([[<font color="red" size="2">还没有部署Nginx</font>]])
end

return f
