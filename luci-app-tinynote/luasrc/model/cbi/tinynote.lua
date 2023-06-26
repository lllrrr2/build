local fs   = require "nixio.fs"
local uci  = require "luci.model.uci".cursor()

local function new_write_file(file, note_suffix, value)
    local note_suffix_array = {
        sh  = "#!/bin/sh /etc/rc.common\n",
        py  = "#!/usr/bin/env python\n" ..
              "import os   # 用于导入系统变量\n" ..
              "import sys  # 实现 sys.exit\n" ..
              "import time # 时间\n" ..
              "import re   # 正则过滤\n",
        lua = "#!/usr/bin/env lua\n" ..
              "local fs   = require \"nixio.fs\"\n" ..
              "local sys  = require \"luci.sys\"\n" ..
              "local util = require \"luci.util\"\n" ..
              "local uci  = require \"luci.model.uci\".cursor()\n",
    }
    local content = value or note_suffix_array[note_suffix]
    local file_handle = assert(io.open(file, "w"))
    if content ~= nil then
        file_handle:write(content)
    end
    file_handle:close()
end

if not uci:get("luci", "tinynote") then
    uci:set("luci", "tinynote", "tinynote")
    uci:commit("luci")
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
    { "shell",            "sh"            },
    { "javascript",       "js"            },
    { "lua",              "lua"           },
    { "python",           "py"            },
    { "htmlmixed",        "html"          },
    { "cmake",            "cmake"         },
    { "yaml",             "yaml"          },
    { "diff",             "patch(diff)"   },
    { "css",              "css"           },
    { "xml",              "xml"           },
    { "ttcn-cfg",         "cfg"           },
    { "http",             "http"          },
    { "perl",             "pl"            },
    { "php",              "php"           },
    { "sql",              "sql"           },
    { "vb",               "vb"            },
    { "vbscript",         "vbs"           },
    { "velocity",         "vm"            },
    { "apl",              "apl"           },
    { "asciiarmor",       "asc"           },
    { "asn.1",            "asn1"          },
    { "asterisk",         "asterisk"      },
    { "brainfuck",        "bf"            },
    { "clike",            "c"             },
    { "clojure",          "clj"           },
    { "cobol",            "cobol"         },
    { "coffeescript",     "coffee"        },
    { "commonlisp",       "lisp"          },
    { "crystal",          "cr"            },
    { "cypher",           "cypher"        },
    { "d",                "d"             },
    { "dart",             "dart"          },
    { "django",           "django"        },
    { "dockerfile",       "dockerfile"    },
    { "dtd",              "dtd"           },
    { "dylan",            "dylan"         },
    { "ebnf",             "ebnf"          },
    { "ecl",              "ecl"           },
    { "eiffel",           "eiffel"        },
    { "elm",              "elm"           },
    { "erlang",           "erl"           },
    { "factor",           "factor"        },
    { "fcl",              "fcl"           },
    { "forth",            "forth"         },
    { "fortran",          "f90"           },
    { "gas",              "gas"           },
    { "gfm",              "gfm"           },
    { "gherkin",          "gherkin"       },
    { "go",               "go"            },
    { "groovy",           "groovy"        },
    { "haml",             "haml"          },
    { "handlebars",       "hbs"           },
    { "haskell",          "hs"            },
    { "haskell-literate", "lhs"           },
    { "haxe",             "hx"            },
    { "idl",              "idl"           },
    { "jinja2",           "jinja2"        },
    { "jsx",              "jsx"           },
    { "julia",            "jl"            },
    { "livescript",       "ls"            },
    { "markdown",         "md"            },
    { "mathematica",      "m"             },
    { "mbox",             "mbox"          },
    { "mirc",             "mirc"          },
    { "mllike",           "sml"           },
    { "modelica",         "mo"            },
    { "mscgen",           "mscgen"        },
    { "mumps",            "mumps"         },
    { "nginx",            "nginx"         },
    { "nsis",             "nsi"           },
    { "ntriples",         "ntriples"      },
    { "octave",           "octave"        },
    { "oz",               "oz"            },
    { "pascal",           "pascal"        },
    { "pegjs",            "pegjs"         },
    { "pig",              "pig"           },
    { "powershell",       "ps1"           },
    { "properties",       "properties"    },
    { "protobuf",         "protobuf"      },
    { "pug",              "pug"           },
    { "puppet",           "pp"            },
    { "q",                "q"             },
    { "r",                "r"             },
    { "rpm",              "rpm"           },
    { "rst",              "rst"           },
    { "ruby",             "rb"            },
    { "rust",             "rs"            },
    { "sas",              "sas"           },
    { "sass",             "sass"          },
    { "scheme",           "scheme"        },
    { "sieve",            "sieve"         },
    { "slim",             "slim"          },
    { "smalltalk",        "st"            },
    { "smarty",           "smarty"        },
    { "solr",             "solr"          },
    { "soy",              "soy"           },
    { "sparql",           "sparql"        },
    { "spreadsheet",      "spreadsheet"   },
    { "stex",             "latex"         },
    { "stylus",           "styl"          },
    { "swift",            "swift"         },
    { "tcl",              "tcl"           },
    { "textile",          "textile"       },
    { "tiddlywiki",       "tiddlywiki"    },
    { "tiki",             "tiki"          },
    { "toml",             "toml"          },
    { "tornado",          "tornado"       },
    { "troff",            "troff"         },
    { "ttcn",             "ttcn"          },
    { "turtle",           "turtle"        },
    { "twig",             "twig"          },
    { "verilog",          "v"             },
    { "vhdl",             "vhdl"          },
    { "vue",              "vue"           },
    { "wast",             "wast"          },
    { "webidl",           "webidl"        },
    { "xquery",           "xq"            },
    { "yacas",            "ys"            },
    { "yaml-frontmatter", "yfm"           },
    { "z80",              "z80"           },
}

m = Map("luci", translate(""))

f = m:section(TypedSection, "tinynote")
-- f.template = "cbi/tblsection"
f.anonymous = true -- 删除
-- f.addremove = true -- 添加
-- f.extedit   = true -- 修改
-- f.sortable  = true -- 移动

if uci:get("luci", "tinynote", "note_path") then
    f:tab("note1", translate("Note display"))
    note_path = f:taboption("note1", DummyValue, "", nil)
end

f:tab("note", translate("Note Settings"))

f:tab("codemirror", translate("CodeMirror Support"),
    translate("CodeMirror supports syntax highlighting, line number display, automatic indentation, etc.<br><b>") ..
    translate("<a href='https://www.staticfile.org/?ln=zh' target='_blank'> Staticfile Resources </a>&nbsp;&nbsp;&nbsp;") ..
    translate("<a href='https://www.tun6.com/projects/code_mirror/' target='_blank'> User Manual </a>&nbsp;&nbsp;&nbsp;") ..
    translate("<a href='https://www.tun6.com/projects/code_mirror/demo/demos/theme.html' target='_blank'> Theme Preview </a></b>")
)

note_path = f:taboption("note", Value, "note_path",
    translate("Save Path"))
note_path.default = "/etc/tinynote"

note_sum = f:taboption("note", Value, "note_sum",
    translate("Number of Texts"))
note_sum.default = 1
note_sum.rmempty = false
note_sum.datatype = "uinteger"
note_sum.validate = function(self, value)
    local count = tonumber(value) or 0
    if count < 1 or count > 20 then
        return nil,
        translate("Please enter a number between 1 and 20.")
    end
    return Value.validate(self, value)
end

note_suffix = f:taboption("note", ListValue, "note_suffix",
    translate("Text Type"))
note_suffix.default = "txt"
note_suffix:value('txt', translate('txt'))
note_suffix:value('sh', translate('sh'))
note_suffix:value('lua', translate('lua'))
note_suffix:value('py', translate('py'))
note_suffix:value('js', translate('js'))

enable = f:taboption("note", Flag, "enable",
    translate("Enable CodeMirror Support"))
enable.default = '0'

theme = f:taboption("codemirror", ListValue, "theme",
    translate("Design"))
theme.default = "monokai"
for _, k in ipairs(note_theme_array) do
    theme:value(k[1], k[2])
end
theme:depends("enable", 1)

font_size = f:taboption("codemirror", Value, "font_size",
    translate("Font Size"))
font_size.default = "14"
font_size:value('12', translate('12'))
font_size:value('14', translate('14'))
font_size:value('16', translate('16'))
font_size.datatype = "uinteger"
font_size:depends("enable", 1)

line_spacing = f:taboption("codemirror", Value, "line_spacing",
    translate("Line Spacing"))
line_spacing.default = "140"
line_spacing:value('100', translate('100'))
line_spacing:value('140', translate('140'))
line_spacing:value('150', translate('150'))
line_spacing.datatype = "uinteger"
line_spacing:depends("enable", 1)

height = f:taboption("codemirror", Value, "height",
    translate("Display Height"))
height.default = "500"
height:value('auto', translate('auto'))
height:value('500', translate('500'))
height:value('600', translate('600'))
height:value('800', translate('800'))
height:depends("enable", 1)

width = f:taboption("codemirror", Value, "width",
    translate("Display Width"))
width.default = "auto"
width:value('auto', translate('auto'))
width:value('1000', translate('1000'))
width:value('1300', translate('1300'))
width:value('1500', translate('1500'))
width:depends("enable", 1)

only = f:taboption("codemirror", Flag, "only",
    translate("Read-Only Mode"))
only:depends("enable", 1)

s = m:section(TypedSection, "tinynote")
s.anonymous = true
s.addremove = false

local con         = uci:get_all("luci", "tinynote")
local note_sum    = con.note_sum  or "1"
local note_suffix = con.note_suffix or "txt"
local code_enable = con.enable    or nil
local note_path   = con.note_path or "/etc/tinynote"

if not fs.access(note_path) then
    fs.mkdirr(note_path)
end

local note_arg, note_files = {}, {}
for sum_str = 1, note_sum do
    local sum = string.format("%02d", sum_str)
    local file = string.format("%s/note%s.%s", note_path, sum, note_suffix)
    note_arg[sum] = file

    if not fs.access(file) then
        new_write_file(file, note_suffix)
    end

    if fs.access(file, 'w') then
        local note = "note" .. sum
        s:tab(note, translate("Note %s") %sum)

        enablenote = s:taboption(note, Flag, "enablenote" .. sum,
            translate("Note %s Settings") %sum)
        enablenote.enabled = 'true'
        enablenote.disabled = 'false'
        enablenote.default = enablenote.disabled

        path = s:taboption(note, ListValue, "model_note" .. sum,
            translate("Type"))
        path:depends('enablenote' .. sum, 'true')
        path.remove_empty = true
        path:value('')
        for _, k in ipairs(note_mode_array) do
            path:value(k[1], k[2])
        end

        note_only = s:taboption(note, Flag, "only_note" .. sum,
            translate("Read-only"))
        note_only:depends("enablenote" .. sum, 'true')
        note_only.enabled = 'true'
        note_only.disabled = 'false'
        note_only.default = note_only.disabled

        local a = s:taboption(note, TextValue, "note" .. sum)
        a.template = "cbi/tvalue"
        a.rows = 20
        a.wrap = "off"

        function a.cfgvalue(self, section)
            local file_handle = io.open(file, "r")
            if not file_handle then return "" end

            local chunks = {}
            repeat
                local chunk = file_handle:read(1024 * 512)
                if chunk then table.insert(chunks, chunk) end
                coroutine.yield()
            until not chunk

            file_handle:close()
            return table.concat(chunks)
        end

        function a.write(self, section, note_content)
            if not note_content or note_content == "" then
                return
            end
            note_content = note_content:gsub("\r\n?", "\n")
            local old_note_content = fs.readfile(file) or ""
            if note_content ~= old_note_content then
                new_write_file(file, nil, note_content)
            end
        end

        local clear_button = s:taboption(note, Button, "_clear_note" .. sum,
            translate("Reset Notes %s") %sum)
        clear_button.inputstyle = "reset"
        clear_button.template = "tinynote/clear_button"
        clear_button.write = function(self, section)
            a.value = ""
            new_write_file(file, note_suffix)
        end

        local run_button = s:taboption(note, Button, "_run_note" .. sum,
            translate("Run Note %s") %sum)
        run_button.template = "tinynote/run_button"
        run_button.inputstyle = "apply"
        run_button.file_path = file
    end
end

for file_name in fs.dir(note_path) do
    local file_path = string.format("%s/%s", note_path, file_name)
    table.insert(note_files, file_path)
end

-- 逆序循环保证下标不会发生变化
for i = #note_files, 1, -1 do
    local file_path = note_files[i]
    local found = false
    for _, value in pairs(note_arg) do
        if value == file_path then
            found = true
            break
        end
    end
    -- 如果文件路径未在 note_arg 数组中出现过且该文件存在
    if not found and fs.access(file_path) then
        os.remove(file_path)
        table.remove(note_files, i)
    end
end

if code_enable then
    m:append(Template("tinynote/codemirror"))
end

return m
