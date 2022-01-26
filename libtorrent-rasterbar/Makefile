include $(TOPDIR)/rules.mk

PKG_NAME:=libtorrent-rasterbar
PKG_VERSION:=1.2.15
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/arvidn/libtorrent/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=15b41c319955bb4df4be34458b04c483b7b0dbc366a3ac43511d2ca989600d05

PKG_MAINTAINER:=David Yang <mmyangfl@gmail.com>
PKG_LICENSE:=BSD-3-Clause
PKG_LICENSE_FILES:=COPYING

PKG_BUILD_PARALLEL:=1
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk
include $(INCLUDE_DIR)/nls.mk
include $(TOPDIR)/feeds/packages/lang/python/python3-version.mk

define Package/libtorrent-rasterbar
	SECTION:=libs
	CATEGORY:=Libraries
	TITLE:=Rasterbar BitTorrent library
	URL:=https://www.libtorrent.org/
	DEPENDS:=+librt +libpthread +boost-system +libatomic +libopenssl +libstdcpp $(ICONV_DEPENDS) $(INTL_DEPENDS)
endef

define Package/rblibtorrent
	SECTION:=libs
	CATEGORY:=Libraries
	TITLE:=Rasterbar BitTorrent library
	URL:=https://www.libtorrent.org/
	DEPENDS:=+boost +boost-chrono +boost-random +boost-system +libgcc +libopenssl +libstdcpp $(ICONV_DEPENDS) $(INTL_DEPENDS)
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
endef

define Download/try_signal
	VERSION:=334fd139e2bb387017b42d36753a03935e3bca75
	SUBDIR:=deps/try_signal
	FILE:=$(PKG_NAME)-try_signal-$$(VERSION).tar.xz
	URL:=https://github.com/arvidn/try_signal.git
	MIRROR_HASH:=c85d65352c20713cb6cfb005942b46ab7579dc7eef3b876666bff9347149d47f
	PROTO:=git
endef
$(eval $(call Download,try_signal))
PKG_UNPACK:=$(HOST_TAR) -C $(PKG_BUILD_DIR) --strip-components=1 -xzf $(DL_DIR)/$(PKG_SOURCE)

define Build/Prepare
	$(Build/Prepare/Default)
	$(eval $(Download/try_signal))
	xzcat $(DL_DIR)/$(FILE) | tar -C $(PKG_BUILD_DIR) $(TAR_OPTIONS)
endef

TARGET_CFLAGS += $(if $(CONFIG_SOFT_FLOAT),-DBOOST_NO_FENV_H) -fPIC
EXTRA_CXXFLAGS += $(if $(CONFIG_GCC_VERSION_4_8),-std=gnu++11,-std=gnu++14)
TARGET_LDFLAGS += -latomic $(if $(INTL_FULL),-liconv) $(if $(INTL_FULL),-lintl)
TARGET_CXXFLAGS += -DBOOST_BIND_GLOBAL_PLACEHOLDERS

CMAKE_OPTIONS += \
	-Dpython-bindings:BOOL=ON \
	-Dboost-python-module-name="python" \
	-DPYTHON_EXECUTABLE:FILEPATH=$(STAGING_DIR_HOSTPKG)/bin/python$(PYTHON3_VERSION) \
	-DPYTHON_SITE_PACKAGES="/usr/lib/python$(PYTHON3_VERSION)/site-packages" \
	-DPYTHON_EXT_SUFFIX=""

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/lib $(1)/usr/include $(1)/usr/lib/pkgconfig
	$(CP) $(PKG_INSTALL_DIR)/usr/include/libtorrent $(1)/usr/include/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libtorrent-rasterbar.so* $(1)/usr/lib/
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
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/python$(PYTHON3_VERSION)/site-packages/*.so \
	$(1)/usr/lib/python$(PYTHON3_VERSION)/site-packages/
endef

$(eval $(call BuildPackage,rblibtorrent))
$(eval $(call BuildPackage,libtorrent-rasterbar))
$(eval $(call BuildPackage,python3-libtorrent))
