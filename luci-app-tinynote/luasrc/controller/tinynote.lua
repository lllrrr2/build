-- Copyright (C) 2020 <wulishui@gmail.com>
--[[local fs  = require "nixio.fs"
local sys = require "luci.sys"
local uci = require "luci.model.uci".cursor()
local con = uci:get_all("luci", "tinynote")--]]
module("luci.controller.tinynote", package.seeall)
function index()
	entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("随手笔记"), 2).dependent = true
	-- entry({"admin", "nas", "tinynote", "status"}, call("act_status")).leaf = true
end

--[[function act_status()
	local con = uci:get_all("luci", "tinynote")
	local id_model = {}
	for sum in sys.exec("seq -w 01 " .. con.note_sum):gmatch("%d+") do
	  local id = 'cbid.luci.tinynote.note' .. sum .. '.' .. con.note_type
	  id_model[id] = {}
	  id_model[id]['path_note' .. sum] = con.note_type
	  id_model[id]['only_note' .. sum] = con.only or '0'
	  for note, model in pairs(con) do
	      if note:find('path_note' .. sum) then
	          id_model[id][note] = model
	      elseif note:find('only_note' .. sum) then
	          id_model[id][note] = model
	      end
	  end
	end
	luci.http.prepare_content("application/json")
	luci.http.write_json(id_model)
end--]]
