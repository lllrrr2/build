include $(TOPDIR)/rules.mk

PKG_NAME:=libtorrent-rasterbar
PKG_VERSION:=1.2.16
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/arvidn/libtorrent/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=2ee435c3e2e6dd8825903230b41fbaf0741b7aed57094f2ca0e6214d89fef9d4
PKG_BUILD_DIR:=$(BUILD_DIR)/libtorrent-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk
include $(INCLUDE_DIR)/nls.mk
include $(TOPDIR)/feeds/packages/lang/python/python3-version.mk

define Package/libtorrent-rasterbar
	SECTION:=libs
	CATEGORY:=Libraries
	TITLE:=Rasterbar BitTorrent library
	URL:=https://www.libtorrent.org/
	DEPENDS:=+boost-system +libatomic +libopenssl +libstdcpp $(ICONV_DEPENDS) $(INTL_DEPENDS)
endef

define Package/rblibtorrent
	SECTION:=libs
	CATEGORY:=Libraries
	TITLE:=Rasterbar BitTorrent library
	URL:=https://www.libtorrent.org/
	DEPENDS:=+boost-system +libatomic +libopenssl +libstdcpp $(ICONV_DEPENDS) $(INTL_DEPENDS)
endef

define Package/python3-libtorrent
	SECTION:=lang
	CATEGORY:=Languages
	TITLE:=Rasterbar BitTorrent library
	URL:=https://libtorrent.org/
	SUBMENU:=Python
	TITLE+= (Python 3)
	DEPENDS:=+libtorrent-rasterbar +boost-python3
endef

define Package/libtorrent-rasterbar/description
	Rasterbar libtorrent is a C++ library that aims to be a good alternative to
	all the other bittorrent implementations around.
endef

define Package/rblibtorrent/description
	$(call Package/libtorrent-rasterbar/description)
endef

define Package/python3-libtorrent/description
	$(call Package/libtorrent-rasterbar/description)
	This package contains Python 3 bindings for the libtorrent-rasterbar library.
endef

TARGET_CXXFLAGS += -DBOOST_BIND_GLOBAL_PLACEHOLDERS
TARGET_LDFLAGS += -latomic $(if $(INTL_FULL),-liconv) $(if $(INTL_FULL),-lintl)
TARGET_CFLAGS += $(if $(CONFIG_SOFT_FLOAT),-DBOOST_NO_FENV_H) -fPIC
EXTRA_CXXFLAGS += $(if $(CONFIG_GCC_VERSION_4_8),-std=gnu++11,-std=gnu++14)

CMAKE_OPTIONS += \
	-Dpython-bindings:BOOL=ON \
	-Dboost-python-module-name="python" \
	-DPYTHON_EXECUTABLE:FILEPATH=$(STAGING_DIR_HOSTPKG)/bin/python$(PYTHON3_VERSION) \
	-DPYTHON_SITE_PACKAGES="/usr/lib/python$(PYTHON3_VERSION)/site-packages" \
	-DPYTHON_EXT_SUFFIX=""

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/libtorrent $(1)/usr/include/
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libtorrent-rasterbar.so* $(1)/usr/lib/
	$(INSTALL_DIR) $(1)/usr/lib/pkgconfig
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/pkgconfig/libtorrent-rasterbar.pc $(1)/usr/lib/pkgconfig/
endef

define Package/rblibtorrent/install
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libtorrent-rasterbar.so* $(1)/usr/lib
endef

define Package/libtorrent-rasterbar/install
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libtorrent-rasterbar.so* $(1)/usr/lib/
endef

define Package/python3-libtorrent/install
	$(INSTALL_DIR) $(1)/usr/lib/python$(PYTHON3_VERSION)/site-packages
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/python$(PYTHON3_VERSION)/site-packages/*.so $(1)/usr/lib/python$(PYTHON3_VERSION)/site-packages
endef

$(eval $(call BuildPackage,rblibtorrent))
$(eval $(call BuildPackage,libtorrent-rasterbar))
$(eval $(call BuildPackage,python3-libtorrent))
