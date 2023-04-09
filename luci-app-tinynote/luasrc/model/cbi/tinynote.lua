local fs  = require "nixio.fs"
local sys = require "luci.sys"
local util = require "luci.util"
local uci = require "luci.model.uci".cursor()
-- wulishui 20200108-20230301

local note_type_array = {
	["sh"]  = "#!/bin/sh /etc/rc.common",
	["lua"] = [[#!/usr/bin/env lua
local fs   = require \"nixio.fs\"
local sys  = require \"luci.sys\"
local util = require \"luci.util\"
local uci  = require \"luci.model.uci\".cursor()]],
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
		return sys.exec('echo "' .. contains(note_type_array, note_type) ..'"  > ' .. file)
	else
		return sys.exec(":> " .. file)
	end
end

local note_theme_array = {
    { "3024-day",         "3024 Day"         },
    { "3024-night",       "3024 Night"       },
    { "abcdef",           "Abcdef"           },
    { "ambiance-mobile",  "Ambiance Mobile"  },
    { "ambiance",         "Ambiance"         },
    { "base16-dark",      "Base16 (dark)"    },
    { "bespin",           "Bespin"           },
    { "blackboard",       "Blackboard"       },
    { "cobalt",           "Cobalt"           },
    { "colorforth",       "Colorforth"       },
    { "darcula",          "Darcula"          },
    { "dracula",          "Dracula"          },
    { "duotone-dark",     "Duotone (dark)"   },
    { "duotone-light",    "Duotone (light)"  },
    { "eclipse",          "Eclipse"          },
    { "elegant",          "Elegant"          },
    { "erlang-dark",      "Erlang (dark)"    },
    { "gruvbox-dark",     "Gruvbox (dark)"   },
    { "hopscotch",        "Hopscotch"        },
    { "icecoder",         "Icecoder"         },
    { "idea",             "Idea"             },
    { "isotope",          "Isotope"          },
    { "lesser-dark",      "Lesser Dark"      },
    { "liquibyte",        "Liquibyte"        },
    { "lucario",          "Lucario"          },
    { "material",         "Material"         },
    { "mbo",              "MBO"              },
    { "mdn-like",         "MDN-like"         },
    { "midnight",         "Midnight"         },
    { "monokai",          "Monokai"          },
    { "neat",             "Neat"             },
    { "neo",              "Neo"              },
    { "night",            "Night"            },
    { "nord",             "Nord"             },
    { "oceanic-next",     "Oceanic Next"     },
    { "panda-syntax",     "Panda"            },
    { "paraiso-dark",     "Paraiso (dark)"   },
    { "paraiso-light",    "Paraiso (light)"  },
    { "pastel-on-dark",   "Pastel on dark"   },
    { "railscasts",       "Railscasts"       },
    { "rubyblue",         "Rubyblue"         },
    { "seti",             "Seti"             },
    { "shadowfox",        "Shadowfox"        },
    { "solarized",        "Solarized"        },
    { "ssms",             "SSMS"             },
    { "the-matrix",       "Matrix"           },
    { "tomorrow-night-bright", "Tomorrow Night Bright"},
    { "tomorrow-night-eighties", "Tomorrow Night Eighties"},
    { "ttcn",             "TTCN"             },
    { "twilight",         "Twilight"         },
    { "vibrant-ink",      "Vibrant Ink"      },
    { "xq-dark",          "XQ (dark)"        },
    { "xq-light",         "XQ (light)"       },
    { "yeti",             "Yeti"             },
    { "yonce",            "Yonce"            },
    { "zenburn",          "Zenburn"          }
}

local note_mode_array = {
	"apl", "asciiarmor", "asn.1", "asterisk", "brainfuck", "clike", "clojure", "cmake", "cobol",
	"coffeescript", "commonlisp", "crystal", "css", "cypher", "d", "dart", "diff", "django",
	"dockerfile", "dtd", "dylan", "ebnf", "ecl", "eiffel", "elm", "erlang", "factor", "fcl",
	"forth", "fortran", "gas", "gfm", "gherkin", "go", "groovy", "haml", "handlebars", "haskell",
	"haskell-literate", "haxe", "htmlembedded", "htmlmixed", "http", "idl", "javascript", "jinja2",
	"jsx", "julia", "livescript", "lua", "markdown", "mathematica", "mbox", "mirc", "mllike",
	"modelica", "mscgen", "mumps", "nginx", "nsis", "ntriples", "octave", "oz", "pascal",
	"pegjs", "perl", "php", "pig", "powershell", "properties", "protobuf", "pug", "puppet",
	"python", "q", "r", "rpm", "rst", "ruby", "rust", "sas", "sass", "scheme", "shell",
	"sieve", "slim", "smalltalk", "smarty", "solr", "soy", "sparql", "spreadsheet", "sql",
	"stex", "stylus", "swift", "tcl", "textile", "tiddlywiki", "tiki", "toml", "tornado",
	"troff", "ttcn", "ttcn-cfg", "turtle", "twig", "vb", "vbscript", "velocity", "verilog",
	"vhdl", "vue", "wast", "webidl", "xml", "xquery", "yacas", "yaml", "yaml-frontmatter", "z80",
}

m = Map("luci", translate(""), translate([[<font color="red"><strong>文本内容不能大于90Kb（约1000行），否则失去响应。</strong></font>]]))

f = m:section(TypedSection, "tinynote")
-- f.template = "cbi/tblsection"
f.anonymous = true -- 删除
-- f.addremove = true -- 添加
-- f.extedit   = true -- 修改
-- f.sortable  = true -- 移动

f:tab("note", translate("Note设置"))
local note_path = f:taboption("note", Value, "note_path", translate("保存路径"))
note_path.default = "/etc/tinynote"

local note_sum = f:taboption("note", Value, "note_sum", translate("文本数量"))
note_sum.default = 1
note_sum.rmempty = false
note_sum.datatype = "uinteger"
note_sum.validate = function(self, value)
	local count = tonumber(value) or 0
	if count < 1 or count > 20 then
		return nil, translate("请输入1到20之间的数字。")
	end
	return Value.validate(self, value)
end

local note_type = f:taboption("note", ListValue, "note_type", translate("文本类形"))
note_type.default = "txt"
note_type:value('txt', translate('txt'))
note_type:value('sh', translate('sh'))
note_type:value('js', translate('js'))
note_type:value('py', translate('py'))
note_type:value('lua', translate('lua'))


f:tab("codemirror", translate("CodeMirror 支持"),
	translate("CodeMirror 支持语法高亮，行号显示，自动缩进等等<br><b>") ..
	translate("<a href='https://www.staticfile.org/?ln=zh' target='_blank'> staticfile资源 </a>&nbsp;&nbsp;&nbsp;") ..
	translate("<a href='https://www.tun6.com/projects/code_mirror/' target='_blank'> 中文用户手册 </a>&nbsp;&nbsp;&nbsp;") ..
	translate("<a href='https://www.tun6.com/projects/code_mirror/demo/demos/theme.html' target='_blank'> 主题预览 </a></b>"))
enable = f:taboption("codemirror", Flag, "enable", translate("enable"))
-- enable.rmempty = false -- 值为空时不删除
enable.default = '0'

theme = f:taboption("codemirror", ListValue, "theme", translate("Design"))
theme.default = "monokai"
for _, k in ipairs(note_theme_array) do
    theme:value(k[1], k[2])
end
theme:depends("enable", 1)

font_size = f:taboption("codemirror", Value, "font_size", translate("字体大小"))
font_size.default = "14"
font_size:value('12', translate('12'))
font_size:value('14', translate('14'))
font_size:value('16', translate('16'))
font_size.datatype = "uinteger"
font_size:depends("enable", 1)

line_spacing = f:taboption("codemirror", Value, "line_spacing", translate("文本行距"))
line_spacing.default = "140"
line_spacing:value('100', translate('100'))
line_spacing:value('140', translate('140'))
line_spacing:value('150', translate('150'))
line_spacing.datatype = "uinteger"
line_spacing:depends("enable", 1)

height = f:taboption("codemirror", Value, "height", translate("显示高度"))
height.default = "500"
height:value('auto', translate('auto'))
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

local con	= uci:get_all("luci", "tinynote")
local enable	= con.enable    or "0"
local note_sum	= con.note_sum  or "1"
local note_type = con.note_type or "txt"
local note_path = con.note_path or "/etc/tinynote"
if sys.call("test ! -d " .. note_path) == 0 then fs.mkdirr(note_path) end
local path_arg,note_arg = {},{}

for sum in string.gmatch(sys.exec("seq -w 01 " .. note_sum), "%d+") do
	local file = note_path .. "/note" .. sum .. "." .. note_type
	note_arg[sum] = file
	if sys.call("[ -e " .. file .. " ]") == 1 then new_note(file, note_type) end

	if sys.call("[ -f " .. file .. " ]") == 0 then
		local note = ("note" .. sum)
		s:tab(note, translate("笔记 " .. sum), translate("笔记" .. sum .. "设置"))
		
		path = s:taboption(note, Value, "model_note" .. sum, translate("类形"))
		path.default = ""
		path:value('txt', translate('txt'))
		path:value('sh', translate('sh'))
		path:value('js', translate('js'))
		path:value('py', translate('py'))
		path:value('lua', translate('lua'))
		path:value('htmlmixed', translate('html'))
		for _, v in pairs(note_mode_array) do
			path:value(v)
		end
		
		note_only = s:taboption(note, Flag, "only_note" .. sum, translate("只读"))

--[[		if sys.call("[ $(sed -n '$=' " .. file .. ") -gt 1 ]") == 0 then
			button = s:taboption(note, Button, sum .. ".rm")
			button.inputtitle = translate("清空笔记 " .. sum)
			button.template = "tinynote/button"
			button.inputstyle = "remove"
		end
		
		button = s:taboption(note, Button, sum .. ".st")
		button.inputtitle = translate("运行笔记 " .. sum)
		button.template = "tinynote/button"
		button.inputstyle = "apply"
		button.forcewrite = true--]]

		local a = s:taboption(note, TextValue, "note" .. sum .. "." .. note_type)
		a.template = "cbi/tvalue"
		a.rows = 35
		a.wrap = "off"
		function a.cfgvalue(self, section)
			return fs.readfile(file) or ""
		end
		function a.write(self, section, value)
			if value and value ~= nil and value ~= "" then
				value = value:gsub("\r\n?", "\n")
				local old_value = fs.readfile(value)
				if value ~= old_value then
					fs.writefile(file, value)
				end
			end
		end

--[[		if sys.call("[ $(sed -n '$=' " .. file .. ") -gt 1 ]") == 0 then
			button = s:taboption(note, Button, sum .. ".rm")
			button.inputtitle = translate("清空笔记 " .. sum)
			button.template = "tinynote/button"
			button.inputstyle = "remove"
		end
		
		button = s:taboption(note, Button, sum .. ".st")
		button.inputtitle = translate("运行笔记 " .. sum)
		button.template = "tinynote/button"
		button.inputstyle = "apply"
		button.forcewrite = true--]]
	end
end

for i in fs.dir(note_path) do path_arg[i] = note_path .. "/" .. i end
if not rawequal(path_arg,note_arg) then delenote(path_arg,note_arg) end
path_arg,note_arg = nil,nil

if enable == "1" then
	m:append(Template("tinynote/codemirror"))
end

return m
