local http_module = require "luci.http"
local sys_module  = require "luci.sys"
local i18n_module = require "luci.i18n"

module("luci.controller.tinynote", package.seeall)

function index()
    entry({"admin", "nas", "tinynote"}, cbi("tinynote"), _("TinyNote"), 2).dependent = true
    entry({"admin", "nas", "tinynote", "action_run"}, call("action_run"), nil).leaf = true
end

function send_json_response(output)
    http_module.prepare_content("application/json")
    http_module.write_json(output)
end

function process_command_result(result_output, exit_code, command_name, file_path)
    if exit_code == 0 then
        if #result_output > 2 then
            return send_json_response({
                result = "success", data = result_output
            })
        else
            return send_json_response({
                result = i18n_module.translatef("Execution '%s %s' has no output!", command_name, file_path)
            })
        end
    else
        return send_json_response({
            result = i18n_module.translatef("Failed to execute '%s %s'! Exit code: %d. \nError message: <div style='color: red';>%s</div>", command_name, file_path, exit_code, result_output)
        })
    end
end

function action_run()
    local input_command_name = http_module.formvalue('command')
    local input_file_path    = http_module.formvalue('file_path')

    if input_command_name == '' and input_file_path == '' then
        return send_json_response({
            result = i18n_module.translate("No input for the command line yet. Don't click 'Execute Command'!")
        })
    end

    input_command_name = input_command_name == '' and input_file_path ~= '' and 'lua' or input_command_name
    local command_fullpath = input_command_name ~= '' and sys_module.exec("/usr/bin/which " .. input_command_name:match("^([^%s]+)")) or ''

    if #command_fullpath < 4 or command_fullpath:find("no ") == 1 then
        return send_json_response({
            result = i18n_module.translatef("The current system cannot find the command '%s' you entered!", input_command_name:match("^%S+"))
        })
    end

    local command_handle = io.popen(string.format("%s %s 2>&1; echo $?", input_command_name, input_file_path))
    local command_result = command_handle:read("*a")
    command_handle:close()

    local result_data      = command_result:sub(1, -3)
    local result_exit_code = tonumber(command_result:sub(-2))
    process_command_result(result_data, result_exit_code, input_command_name, input_file_path)
end
