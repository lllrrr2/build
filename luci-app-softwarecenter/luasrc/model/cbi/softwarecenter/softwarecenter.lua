local fs   = require "nixio.fs"
local sys  = require "luci.sys"
local util = require "luci.util"
local uci  = require "luci.model.uci".cursor()

local disks, dev_map = {}, {}
for disk in io.popen("df -h | awk '/dev.*mnt/{print $6,$2,$3,$5,$1}'"):lines() do
    local fields = util.split(disk, " ")
    local dev = fields[5]
    if not dev_map[dev] then
        dev_map[dev] = true
        table.insert(disks, fields)
    end
end

m = Map("softwarecenter", translate("Entware"),
    translate("Entware是一个适用于嵌入式系统的软件包库，提供超过2000多个不同平台的软件包<br>可以自动部署Entware-opt/Nginx/MySQ/PHP(ONMP)和应用安装，原项目地址：<a href='https://github.com/jsp1256/openwrt-package' target='_blank'> github</a>"))

local software_status = sys.call("pidof nginx > /dev/null") == 0
if software_status then
    m:section(SimpleSection).template = "softwarecenter/software_status"
end

s = m:section(TypedSection, "softwarecenter", translate("设置"))
s.addremove = false
s.anonymous = true

s:tab("entware", translate("ONMP部署"))
p = s:taboption("entware", Flag, "entware_enable",
    translate("启用"), translate("部署ONMP环境"))

delaytime = s:taboption("entware", Value, "a_delaytime",
    translate("开机延迟"), translate("单位分钟"))
for _, sum in ipairs({1, 2, 3, 5}) do
    delaytime:value(sum, translatef(("%d 分"), sum))
end
delaytime.default = "2"
delaytime.rmempty = true
delaytime.datatype = "ufloat"
delaytime:depends("entware_enable", 1)

local model = sys.exec("echo -n $(uname -m)")
local cpu_model = s:taboption("entware", ListValue, "cpu_model", translate("CPU架构"))
cpu_model:value(model, translate("当前架构是：%s") %model)
cpu_model:depends("entware_enable", 1)

p = s:taboption("entware", ListValue,"disk_mount", translate("安装路径"))
for _, disk in ipairs(disks) do
    p:value(disk[1], translatef(("%s/%s (大小: %s) (已用: %s/%s)"), disk[1], 'opt', disk[2], disk[3], disk[4]))
end
p:depends("entware_enable", 1)

p = s:taboption("entware", Flag, "deploy_entware", translate("部署ONMP"),
    translate("安装过程可以在运行日志中查看进度<br>如只安装应用软件可不用部署 Nginx / MySQL"))
p:depends("entware_enable", 1)

deploy_nginx = s:taboption("entware", Flag, "deploy_nginx", translate("部署Nginx/PHP"),
    translate("自动部署Nginx服务器和其所需的PHP7运行环境<br><b style='color:red'>安装后如取消选择会删除以有的部署</b>"))

p = s:taboption("entware", Flag, "nginx_enabled", translate("Enabled"),
    translate("部署完成后启动Nginx/PHP7(依赖Entware软件仓库)"))
p:depends("deploy_nginx", 1)
deploy_nginx:depends("deploy_entware", 1)

deploy_mysql = s:taboption("entware", Flag, "deploy_mysql", translate("部署MySQL"),
    translate("部署MySQL数据库服务器(依赖Entware软件仓库)<br><b style='color:red'>安装后如取消选择会删除以有的部署</b>"))

p = s:taboption("entware", Flag, "mysql_enabled", translate("Enabled"),
    translate("留空是默认登录用户  root  密码  123456"))
p:depends("deploy_mysql", 1)

-- p = s:taboption("entware", Value, "user", translate("用户"),
--     translate("MySQL数据库服务器登录用户"))
-- p.placeholder = "root"
-- p:depends("mysql_enabled", 1)

p = s:taboption("entware", Value, "pass", translate("密码"),
    translate("MySQL数据库服务器登录密码"))
-- p.password = true
p.placeholder = "123456"
p:depends("mysql_enabled", 1)
deploy_mysql:depends("deploy_entware", 1)

-- s:tab("partition", translate("磁盘分区"))
-- local o = nixio.util.consume((nixio.fs.glob("/dev/sd[a-g]")), o)
-- local size = {}
-- for i, l in ipairs(o) do
    -- local s = tonumber((nixio.fs.readfile("/sys/class/block/%s/size" % l:sub(6))))
    -- size[l] = s and math.floor(s / 2048 / 1024)
    -- t="%s"%{nixio.fs.readfile("/sys/class/block/%s/device/model"%nixio.fs.basename(l))}
-- end
-- p = s:taboption("partition", ListValue, "partition_disk", translate("可用磁盘"),
-- translate("当加入的磁盘没有分区，此工具可简单的分区挂载"))
-- for i, a in ipairs(o) do
    -- p:value(a,translate("%s | %s | 可用:%sGB" % {a, t, size[a]}))
-- end

-- p = s:taboption("partition", Button, "_rescan", translate("扫描磁盘"),
-- translate("重新加载加入后没有显示的磁盘"))
-- p.inputtitle = translate("开始扫描")
-- p.inputstyle = "reload"
-- p.forcewrite = true
-- function p.write(self, section, value)
  -- util.exec("echo '- - -' | tee /sys/class/scsi_host/host*/scan > /dev/null")
-- end

-- p = s:taboption("partition", Button, "_add",translate("磁盘分区"), translate("默认只分一个区，并格式化EXT4文件系统。如已挂载要先缷载<br><b style=\"color:red\">注意：分区前确认选择的磁盘没有重要数据，分区后数据不可恢复！</b>"))
-- p.inputtitle = translate("开始分区")
-- p.inputstyle = "apply"
    -- function p.write(self, section)
        -- util.exec("/usr/bin/softwarecenter/lib_functions.sh system_check &")
        -- luci.http.redirect(luci.dispatcher.build_url("admin/services/softwarecenter/log"))
    -- end

s:tab("swap", translate("swap交换分区设置"))
swap_enable = s:taboption("swap", Flag, "swap_enabled", translate("Enabled"),
    translate("如果物理内存不足或php-fpm和mysqld 启动失败的可以开启<br>闲置数据可自动移到 swap 区暂存，以增加可用的 RAM"))

p = s:taboption("swap", Value, "swap_path", translate("安装路径"),
    translate("交换分区挂载点，不选择是安装在opt所在盘"))
local descr = translate([[交换分区挂载点，不选择是安装在opt所在盘<br>已经挂载的列表：<ol>]])
for _, disk in pairs(disks) do
    descr = descr .. "<li style='font-weight: bold; color:green'>" .. translatef(("%s (大小: %s) (已用: %s/%s)"), disk[1], disk[2], disk[3], disk[4]) .. "</li>"
end
p.description = descr .. "</ol>"
p:depends("swap_enabled", 1)

p = s:taboption("swap", Value, "swap_size", translate("空间大小"),
    translate("交换空间大小(M)，默认512M"))
p.default = "512"
p:depends("swap_enabled", 1)
swap_enable:depends("deploy_entware", 1)

return m
