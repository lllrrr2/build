include $(TOPDIR)/rules.mk

PKG_NAME:=deluge
PKG_VERSION:=2.0.5
PKG_RELEASE:=6

PYPI_NAME:=deluge
PKG_HASH:=a00a3920413c6c191e89e0cb22184f05387f5f26062fdb2c3ed8753adede385b

include $(TOPDIR)/feeds/packages/lang/python/pypi.mk
include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/python/python3-package.mk

define Package/deluge/Default
	SUBMENU:=BitTorrent
	SECTION:=net
	CATEGORY:=Network
	TITLE:=A lightweight BitTorrent client
	URL:=http://deluge-torrent.org/
endef

define Package/deluge
	$(call Package/deluge/Default)
	TITLE+= (console UI & daemon)
	DEPENDS:= \
	    +python3-asyncio \
	    +python3-base \
	    +python3-cffi \
	    +python3-cgitb \
	    +python3-chardet \
	    +python3-codecs \
	    +python3-ctypes \
	    +python3-dbm \
	    +python3-decimal \
	    +python3-distutils \
	    +python3-libtorrent \
	    +python3-logging \
	    +python3-lzma \
	    +python3-mako \
	    +python3-markupsafe \
	    +python3-multiprocessing \
	    +python3-ncurses \
	    +python3-openssl \
	    +python3-pillow \
	    +python3-pip \
	    +python3-ply \
	    +python3-pyasn1-modules \
	    +python3-pyxdg \
	    +python3-readline \
	    +python3-rencode \
	    +python3-setproctitle \
	    +python3-setuptools \
	    +python3-sqlite3 \
	    +python3-twisted \
	    +python3-unittest \
	    +python3-uuid
endef

define Package/deluge-ui-web
	$(call Package/deluge/Default)
	TITLE+= (Web UI)
	DEPENDS:=deluge
endef

define Package/deluge/description
	BitTorrent client with a client/server model.
endef

define Package/deluge/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(CP) $(PKG_INSTALL_DIR)/usr/bin/* $(1)/usr/bin/
	$(INSTALL_DIR) $(1)$(PYTHON3_PKG_DIR)
	$(CP) $(PKG_INSTALL_DIR)$(PYTHON3_PKG_DIR)/* $(1)$(PYTHON3_PKG_DIR)/
	rm -rf $(1)/usr/bin/deluge-gtk
	rm -rf $(1)/usr/bin/deluge-web
	rm -rf $(1)$(PYTHON3_PKG_DIR)/deluge/ui/web
	rm -rf $(1)$(PYTHON3_PKG_DIR)/deluge/ui/gtk3
	$(call Python3/FixShebang,$(1)/usr/bin/* $(1)$(PYTHON3_PKG_DIR)/deluge/path_*.py)
endef

define Package/deluge-ui-web/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(CP) $(PKG_INSTALL_DIR)/usr/bin/deluge-web $(1)/usr/bin/
	$(INSTALL_DIR) $(1)$(PYTHON3_PKG_DIR)/deluge/ui
	$(CP) $(PKG_INSTALL_DIR)$(PYTHON3_PKG_DIR)/deluge/ui/web $(1)$(PYTHON3_PKG_DIR)/deluge/ui/
	$(call Python3/FixShebang,$(1)/usr/bin/*)
endef

$(eval $(call Py3Package,deluge))
$(eval $(call BuildPackage,deluge))
$(eval $(call Py3Package,deluge-ui-web))
$(eval $(call BuildPackage,deluge-ui-web))
