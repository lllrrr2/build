include $(TOPDIR)/rules.mk

PKG_NAME:=libqbpasswd
PKG_VERSION:=0.2
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/KozakaiAya/libqbpasswd.git
PKG_SOURCE_VERSION:=d1ad3b1e429a16d7c273f614d61cfdd3f2e1e933
PKG_MIRROR_HASH:=skip

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
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/* $(1)/usr/bin/
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
