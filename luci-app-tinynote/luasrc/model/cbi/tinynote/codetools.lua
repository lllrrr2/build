m = SimpleForm("tinynote", translate(""))
m.submit = false
m.reset = false
f = m:section(TypedSection)
f.cfgsections = function()
    return {""}
end

f:tab("JS", translate("JavaScript"))
f:tab("HTML", translate("HTML"))
f:tab("CSS", translate("CSS"))
f:tab("JSON", translate("JSON"))
f:tab("YAML", translate("YAML"))

x = f:taboption("JS", Button, "examineJavaScript")
x.inputstyle = "apply"
x.inputtitle = "语法检查"
x.onclick    = "examineJavaScript();"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JS", Button, "JsFormat")
x.inputstyle = "apply"
x.inputtitle = "美化/格式化"
x.onclick    = "JsCompression('beautify');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JS", Button, "JsCompressionpack")
x.inputstyle = "apply"
x.inputtitle = "常规压缩"
x.onclick    = "JsCompression('minify');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JS", Button, "JsCompressionminify")
x.inputstyle = "apply"
x.inputtitle = "加密压缩"
x.onclick    = "JsCompression('pack');"
x.template   = "tinynote/inlinebutton"

x = f:taboption("HTML", Button, "FormatHTMLformat")
x.inputstyle = "apply"
x.inputtitle = "美化/格式化"
x.onclick    = "FormatHTML('format');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("HTML", Button, "FormatHTMLmin")
x.inputstyle = "apply"
x.inputtitle = "压缩"
x.onclick    = "FormatHTML('min');"
x.template   = "tinynote/inlinebutton"

x = f:taboption("CSS", Button, "CSSFormat")
x.inputstyle = "apply"
x.inputtitle = "美化/格式化"
x.onclick    = "CSSFormat('format');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("CSS", Button, "CSSFormatpack")
x.inputstyle = "apply"
x.inputtitle = "常规压缩"
x.onclick    = "CSSFormat('pack');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("CSS", Button, "CSSFormatpackAdv")
x.inputstyle = "apply"
x.inputtitle = "极限压缩"
x.onclick    = "CSSFormat('min');"
x.template   = "tinynote/inlinebutton"

x = f:taboption("JSON", Button, "examineJSON")
x.inputstyle = "apply"
x.inputtitle = "语法检查"
x.onclick    = "jsonFormat('safeLoad');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "jsonFormat")
x.inputstyle = "apply"
x.inputtitle = "美化/格式化"
x.onclick    = "jsonFormat('format');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "jsonmin")
x.inputstyle = "apply"
x.inputtitle = "压缩"
x.onclick    = "jsonFormat('min');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "jsonToYAML")
x.inputstyle = "apply"
x.inputtitle = "JSON 转 YAML"
x.onclick    = "FormatYAML('yaml');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "jsonToXML")
x.inputstyle = "apply"
x.inputtitle = "JSON 转 XML"
x.onclick    = "jsonToXML();"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "jsonTocsv")
x.inputstyle = "apply"
x.inputtitle = "JSON 转 CSV"
x.onclick    = "jsonTocsv();"
x.template   = "tinynote/inlinebutton"
x = f:taboption("JSON", Button, "getExampleJson")
x.inputstyle = "apply"
x.inputtitle = "获取示例"
x.onclick    = "getExampleJson();"
x.template   = "tinynote/inlinebutton"

x = f:taboption("YAML", Button, "examineYAML")
x.inputstyle = "apply"
x.inputtitle = "语法检查"
x.onclick    = "FormatYAML('safeLoad');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("YAML", Button, "examineYAMLdump")
x.inputstyle = "apply"
x.inputtitle = "美化/格式化"
x.onclick    = "FormatYAML('format');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("YAML", Button, "examineYAMLJSON")
x.inputstyle = "apply"
x.inputtitle = "YAML 转 JSON"
x.onclick    = "FormatYAML('json');"
x.template   = "tinynote/inlinebutton"
x = f:taboption("YAML", Button, "getExampleYaml")
x.inputstyle = "apply"
x.inputtitle = "获取示例"
x.onclick    = "getExampleYaml();"
x.template   = "tinynote/inlinebutton"

m:append(Template("tinynote/codetools"))
return m
