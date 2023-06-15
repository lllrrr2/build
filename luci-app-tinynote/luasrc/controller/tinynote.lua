module("luci.controller.tinynote", package.seeall)

function index()
    entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("TinyNote"), 2).dependent = true
    entry({"admin", "nas", "tinynote", "action_run"}, call("action_run"), nil).leaf = true
end

function send_json_response(output)
    luci.http.prepare_content("application/json")
    luci.http.write_json(output)
end

function process_result(result_output, exit_code, command, file_path)
    if exit_code == 0 then
        if #result_output > 2 then
            return send_json_response({
                result = "success", data = luci.util.pcdata(result_output)
            })
        else
            return send_json_response({
                result = luci.i18n.translatef("Execution '%s %s' has no output!", command, file_path)
            })
        end
    else
        return send_json_response({
            result = luci.i18n.translatef("Failed to execute <div style='color: #f92672;'>%s %s</div><div style='text-align: left;'>Exit code: %d<br>Error message: <div style='color: #e6db74;'>%s</div>", command, file_path, exit_code, result_output)
        })
    end
end

function action_run()
    local command   = luci.http.formvalue('command')
    local file_path = luci.http.formvalue('file_path')

    if command == '' and (file_path == '' or not nixio.fs.access(file_path)) then
        return send_json_response({
            result = luci.i18n.translate("No input for the command line yet. Don't click 'Execute Command'!")
        })
    elseif command == '' and file_path ~= '' then
        local uci = require "luci.model.uci".cursor()
        local con = uci:get_all("luci", "tinynote")
        local sum = 'model_note' .. file_path:match('%d+')
        if con[sum] == 'shell' or con[sum] == 'python' then
            command = con[sum] == 'shell' and "sh" or con[sum]
        else
            command = con.note_suffix ~= '' and con.note_suffix or "lua"
        end
    end

    local command_name = command ~= '' and luci.sys.exec("/usr/bin/which " .. command:match("^([^%s]+)")) or ''

    if #command_name < 4 or command_name:find("no ") == 1 then
        return send_json_response({
            result = luci.i18n.translatef("The current system cannot find the command '%s' you entered!", command:match("^([^%s]+)"))
        })
    end

    local handle = io.popen(string.format("%s %s 2>&1; echo $?", command, file_path))
    local output = handle:read("*a")
    handle:close()

    local data      = output:sub(1, -3)
    local exit_code = tonumber(output:sub(-2))
    process_result(data, exit_code, command, file_path)
end
