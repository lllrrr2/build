f = SimpleForm("qbittorrent")
f.reset = false
f.submit = false
f:append(Template("qbittorrent/log"))
return f
