-- Copyright (C) 2020 <wulishui@gmail.com>
module("luci.controller.tinynote", package.seeall)
function index()
	entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("Note"), 2).dependent = true
end
