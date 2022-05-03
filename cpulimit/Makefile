include $(TOPDIR)/rules.mk

PKG_NAME:=cpulimit
PKG_VERSION:=0.3.2
PKG_RELEASE:=9

# PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
# PKG_SOURCE_URL:=https://codeload.github.com/denji/cpulimit/tar.gz/$(PKG_VERSION)?
# PKG_HASH:=skip

include $(INCLUDE_DIR)/package.mk

define Package/cpulimit
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=CPU usage limiter
  URL:=https://github.com/denji/cpulimit
endef

define Package/cpulimit/description
  Cpulimit is a tool which limits the CPU usage of a process
  (expressed in percentage, not in CPU time).
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
endef

define Package/cpulimit/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/cpulimit $(1)/usr/bin
endef

$(eval $(call BuildPackage,cpulimit))
