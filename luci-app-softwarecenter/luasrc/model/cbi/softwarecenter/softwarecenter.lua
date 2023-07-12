local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local disks, dev_map = {}, {}
for disk in util.execi("df -h | awk '/dev.*mnt/{print $6,$2,$3,$5,$1}'") do
    local fields = util.split(disk, " ")
    local dev = fields[5]
    if not dev_map[dev] then
        dev_map[dev] = true
        disks[#disks + 1] = fields
    end
end

m = Map("softwarecenter", translate("Entware"),
    translate("Entware is a software package repository for embedded systems, providing over 2000 packages for various platforms.<br>It can automatically deploy Entware-opt/Nginx/MySQL/PHP (ONMP) and applications installation. Original project repository: <a href='https://github.com/jsp1256/openwrt-package' target='_blank'>Github</a>"))

if sys.call("pidof nginx >/dev/null") == 0 then
    m:section(SimpleSection).template = "softwarecenter/software_status"
end

s = m:section(TypedSection, "softwarecenter", translate("Settings"))
s.addremove = false
s.anonymous = true

s:tab("entware", translate("ONMP Deployment"))
p = s:taboption("entware", Flag, "entware_enable",
    translate("Enabled"), translate("Deploy ONMP environment"))

delaytime = s:taboption("entware", Value, "a_delaytime",
    translate("Delay on Boot"), translate("In minutes"))
for _, sum in ipairs({1, 2, 3, 5}) do
    delaytime:value(sum, translatef(("%d minutes"), sum))
end
delaytime.default = "2"
delaytime.rmempty = true
delaytime.datatype = "ufloat"
delaytime:depends("entware_enable", 1)

local model = sys.exec("echo -n $(uname -m)")
local cpu_model = s:taboption("entware", Value, "cpu_model",
    translate("CPU Architecture"))
cpu_model:value(model, translatef("Current Architecture: %s", model))
cpu_model:depends("entware_enable", 1)

p = s:taboption("entware", Value, "disk_mount", translate("Installation Path"))
for _, disk in ipairs(disks) do
    p:value(disk[1], translatef(("%s/%s (Size: %s) (Used: %s/%s)"), disk[1], 'opt', disk[2], disk[3], disk[4]))
end
p:depends("entware_enable", 1)

p = s:taboption("entware", Flag, "deploy_entware", translate("Deploy ONMP"),
    translate("View installation progress in the run log<br>If only installing application software, Nginx / MySQL deployment is not necessary."))
p:depends("entware_enable", 1)

deploy_nginx = s:taboption("entware", Flag, "deploy_nginx", translate("Deploy Nginx/PHP"),
    translate("Automatically deploy Nginx server and the required PHP8 runtime environment<br><b style='color:red'>Unchecking after installation will remove existing deployments</b>"))

p = s:taboption("entware", Flag, "nginx_enabled", translate("Enabled"),
    translate("Start Nginx/PHP8 after deployment"))
p:depends("deploy_nginx", 1)
deploy_nginx:depends("deploy_entware", 1)

deploy_mysql = s:taboption("entware", Flag, "deploy_mysql", translate("Deploy MySQL"),
    translate("Deploy MySQL database server<br><b style='color:red'>Unchecking after installation will remove existing deployments</b>"))

p = s:taboption("entware", Flag, "mysql_enabled", translate("Enabled"),
    translate("Leave empty to use default login user: root, password: 123456"))
p:depends("deploy_mysql", 1)

-- p = s:taboption("entware", Value, "user", translate("User"),
--     translate("Login user for MySQL database server"))
-- p.placeholder = "root"
-- p:depends("mysql_enabled", 1)

p = s:taboption("entware", Value, "pass", translate("Password"),
    translate("Login password for MySQL database server"))
p.placeholder = "123456"
p:depends("mysql_enabled", 1)
deploy_mysql:depends("deploy_entware", 1)

-- s:tab("partition", translate("Disk Partition"))
-- p = s:taboption("partition", ListValue, "partition_disk", translate("Available Disks"),
--     translate("If the added disk is not partitioned, this tool can easily partition and mount it"))
-- for _, disk in ipairs(disks) do
--     p:value(disk[1], translatef(("%s (Size: %s) (Used: %s/%s)"), disk[1], disk[2], disk[3], disk[4]))
-- end

-- p = s:taboption("partition", Button, "_rescan", translate("Scan Disks"),
--     translate("Reload disks that have not been displayed after adding"))
-- p.inputtitle = translate("Start Scan")
-- p.inputstyle = "reload"
-- p.forcewrite = true
-- function p.write()
--     util.exec("echo '- - -' | tee /sys/class/scsi_host/host*/scan > /dev/null")
-- end

-- p = s:taboption("partition", Button, "_add", translate("Disk Partition"),
--     translate("By default, only one partition is created and formatted with the EXT4 file system. If mounted, unmount it first.<br><b style=\"color:red\">Note: Before partitioning, make sure the selected disk does not contain important data, as the data cannot be recovered after partitioning!</b>"))
-- p.inputtitle = translate("Start Partition")
-- p.inputstyle = "apply"
-- function p.write()
--     util.exec("/usr/bin/softwarecenter/lib_functions.sh system_check &")
--     luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/log"))
-- end

s:tab("swap", translate("Swap Partition Settings"))
swap_enable = s:taboption("swap", Flag, "swap_enabled", translate("Enabled"),
    translate("If there is insufficient physical memory or php-fpm and mysqld fail to start, enable swap<br>Idle data can be automatically moved to the swap area to increase available RAM"))
p = s:taboption("swap", Value, "swap_path", translate("Installation Path"))
local descr = translate("Swap partition mount point. If not selected, it is installed on the same disk as opt.<br>Mounted list:</ol>")
for _, disk in pairs(disks) do
    descr = descr .. "<li style='font-weight: bold; color:green'>" .. translatef(("%s (Size: %s) (Used: %s/%s)"), disk[1], disk[2], disk[3], disk[4]) .. "</li>"
end
p.description = descr .. "</ol>"
p:depends("swap_enabled", 1)

p = s:taboption("swap", Value, "swap_size", translate("Size"),
    translate("Swap space size (in MB), default is 512M"))
p.default = "512"
p:depends("swap_enabled", 1)
swap_enable:depends("deploy_entware", 1)

return m
