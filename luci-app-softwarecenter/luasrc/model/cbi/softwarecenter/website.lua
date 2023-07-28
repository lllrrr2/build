if nixio.fs.access("/opt/etc/init.d/S80nginx") and nixio.fs.access("/opt/etc/init.d/S70mysqld") and nixio.fs.access("/opt/etc/init.d/S79php8-fpm") then
	m = Map("softwarecenter", translate("Website Management"),
		translate("Automatically deploy PHP probe, phpMyAdmin, KodCloud, Typecho, and more."))
	m:section(SimpleSection).template = "softwarecenter/website_status"
	s = m:section(TypedSection, "website", translate("Website Deployment"),
		translate("Automatically and quickly deploy websites, and automatically obtain random ports."))
	s.anonymous = true
	s.addremove = true
	s.sortable = true
	s.rmempty = false
	s.template = "cbi/tblsection"

	p = s:option(Flag, "autodeploy_enable", translate("Deploy / Remove"))

	p = s:option(Flag, "website_enabled", translate("Enabled"))

	p = s:option(DummyValue, "website_name", translate(" "))

	p = s:option(Value, "port", translate("Access Port, leave blank for automatic assignment."))

	-- p = s:option(Flag,"redis_enabled", translate("Enable Redis"), translate("Nextcloud<br>Owncloud"))

	remarks = s:option(Value, "remarks", translate("Remarks"))
	remarks.size = 8
else
	m = SimpleForm("softwarecenter")
	m.reset = false
	m.submit = false
	s = m:section(SimpleSection)
	m.title = translate([[<font color='red' size='2'>Please make sure Nginx/PHP/MySQL are running before deploying websites.</font>]])
end

return m
