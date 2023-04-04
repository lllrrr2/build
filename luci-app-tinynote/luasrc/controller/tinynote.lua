-- Copyright (C) 2020 <wulishui@gmail.com>
local fs  = require "nixio.fs"
local sys = require "luci.sys"
local utl = require "luci.util"
local uci = require "luci.model.uci".cursor()
local con = uci:get_all("luci", "tinynote")

module("luci.controller.tinynote", package.seeall)
function index()
	entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("随手笔记"), 2).dependent = true
	entry({"admin", "nas", "tinynote", "id"}, call("act_id")).leaf = true
	entry({"admin", "nas", "tinynote", "nat_config"}, call("nat_config"), nil).leaf = true
	entry({"admin", "nas", "tinynote", "set_infos"}, call("set_infos"), nil).leaf = true
end

function nat_config()
    --解析链接中的数据
    -- local value1 = luci.http.formvalue('value1')
    -- local value2 = luci.http.formvalue('value2')
    -- local value3 = luci.http.formvalue('value3')
    -- local value4 = luci.http.formvalue('value4')
    -- local action = luci.http.formvalue('value99')
    -- if '1' == action then
    --     sys.exec('lua /etc/tinynote/note05.lua')
    -- else
        -- sys.exec('lua /etc/tinynote/note04.lua')
    -- end
    local o = {}
    o['data'] = "ok"
    o['result'] = 'success'
    o['errno'] = tostring(val)
    luci.http.prepare_content("application/json")
    luci.http.write_json(o)  --把json格式的数据串写到一个空白网页里
end

function set_infos(status)
	luci.http.prepare_content("text/plain")
	if 'success' == status then
		luci.http.write("Success !")
	else
		luci.http.status(0,"Failed !")
		return
	end
	luci.http.write("\n")
	luci.http.status(0,"return 0")
end

function act_id()
	local id_model = {}
	for sum in sys.exec("seq -w 01 " .. con.note_sum):gmatch("%d+") do
	  local id = 'cbid.luci.tinynote.note' .. sum .. '.' .. con.note_type
	  id_model[id] = {}
	  id_model[id]['model_note' .. sum] = con.note_type
	  id_model[id]['only_note' .. sum] = con.only or '0'
	  for note, model in pairs(con) do
	      if note:find('model_note' .. sum) then
	          id_model[id][note] = model
	      elseif note:find('only_note' .. sum) then
	          id_model[id][note] = model
	      end
	  end
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json(id_model)
end
