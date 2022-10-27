include $(TOPDIR)/rules.mk

PKG_NAME:=AmuleWebUI-Reloaded
PKG_SOURCE_DATE:=20220923
PKG_SOURCE_VERSION:=1a85ead05e26202de8d98af4248189a869a24795
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_SOURCE_DATE).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/MatteoRagni/AmuleWebUI-Reloaded/tar.gz/$(PKG_SOURCE_VERSION)?
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_SOURCE_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
	SECTION:=net
	CATEGORY:=Network
	SUBMENU:=Download Manager
	URL:=https://github.com/MatteoRagni/AmuleWebUI-Reloaded
	DEPENDS:=@(aarch64||arm||x86_64) +amule
	TITLE:=An interface to interact with amule
	PKGARCH:=all
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/share/amule/webserver/AmuleWebUI-Reloaded
	$(CP) \
		$(PKG_BUILD_DIR)/doc-images \
		$(PKG_BUILD_DIR)/{*.ico,*.gif,*.png,*.js,*.html,*.php,*.css} \
		$(1)/usr/share/amule/webserver/AmuleWebUI-Reloaded
	/bin/sed -i 's/ajax.googleapis.com/ajax.lug.ustc.edu.cn/g' $(1)/usr/share/amule/webserver/AmuleWebUI-Reloaded/amuleweb-main*.php >/dev/null 2>&1
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
