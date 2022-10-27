# Copyright (C) 2019 Openwrt.org
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-deluge
PKG_VERSION:=1
PKG_RELEASE:=20221019

LUCI_TITLE:=LuCI support for deluge
LUCI_PKGARCH:=all
LUCI_DEPENDS:=@(arm||aarch64||x86_64) +deluge +deluge-ui-web

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
