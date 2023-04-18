f = SimpleForm("deluge")
f.reset = false
f.submit = false
f:append(Template("deluge/log"))
return f
