#
# Copyright (C) 2008 David Cooper
# Copyright (C) 2008-2014 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=libqbpasswd
PKG_VERSION:=0.2
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/KozakaiAya/libqbpasswd/releases/download/v$(PKG_VERSION)
PKG_MD5SUM:=skip
 
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Plain C++ password generation library for qBittorrent v4.2
endef

define Package/libqbpasswd/description
	The libqbpasswd command lists information about SCSI devices in Linux.
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/*qbpasswd* $(1)/usr/bin/
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
