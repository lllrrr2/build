#
# Copyright (C) 2008-2014 The LuCI Team <luci@lists.subsignal.org>
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-deluge
PKG_VERSION:=1
PKG_RELEASE:=20220126

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for deluge
  PKGARCH:=all
  DEPENDS:=+deluge +deluge-ui-web
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
rm -f /tmp/luci-*
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/deluge
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR)  $(1)/usr/lib/lua/luci \
			$(1)/etc/config \
			$(1)/etc/init.d \
			$(1)/etc/uci-defaults
	$(CP) ./luasrc/* $(1)/usr/lib/lua/luci
	$(INSTALL_BIN) ./root/etc/init.d/* $(1)/etc/init.d/
	$(INSTALL_CONF) ./root/etc/config/* $(1)/etc/config/
	$(INSTALL_BIN) ./root/etc/uci-defaults/* $(1)/etc/uci-defaults/
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
