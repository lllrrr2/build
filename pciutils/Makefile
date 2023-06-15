include $(TOPDIR)/rules.mk

PKG_NAME:=pciutils
PKG_VERSION:=3.10.0
PKG_RELEASE:=2
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/pciutils/pciutils/archive/refs/tags/v$(PKG_VERSION).tar.gz?
PKG_HASH:=skip
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
    SECTION:=utils
    CATEGORY:=Utilities
    TITLE:=Linux PCI Utilities
    DEPENDS:=+libkmod +libpci +pciids
endef

define Package/$(PKG_NAME)/description
    Contains collection of programs for inspecting and manipulating configuration
    of PCI devices.
endef

define Package/libpci
    SECTION:=libs
    CATEGORY:=Libraries
    TITLE:=Linux PCI Libraries
endef

TARGET_CFLAGS += $(FPIC)
MAKE_FLAGS += \
    CFLAGS="$(TARGET_CFLAGS) $(TARGET_CPPFLAGS)" \
    PREFIX="/usr" \
    HOST="Linux" \
    HWDB="no" \
    ZLIB="no" \
    SHARED="yes"

ifneq ($(CONFIG_USE_GLIBC),)
    TARGET_LDFLAGS += -lresolv
endif

define Build/InstallDev
    $(INSTALL_DIR) $(1)/usr/lib $(1)/usr/lib/pkgconfig $(1)/usr/include/pci
    $(CP) $(PKG_INSTALL_DIR)/usr/lib/libpci.so.3 $(PKG_INSTALL_DIR)/usr/lib/libpci.so
    $(CP) $(PKG_INSTALL_DIR)/usr/lib/*.so* $(1)/usr/lib
    $(CP) $(PKG_BUILD_DIR)/lib/libpci.pc $(1)/usr/lib/pkgconfig
    $(SED) 's,/usr/include,$$$${prefix}/include,g' $(1)/usr/lib/pkgconfig/libpci.pc
    $(SED) 's,/usr/lib,$$$${prefix}/lib,g' $(1)/usr/lib/pkgconfig/libpci.pc
    $(CP) $(foreach i,pci.h config.h header.h types.h, $(PKG_BUILD_DIR)/lib/$(i)) $(1)/usr/include/pci
endef

define Package/$(PKG_NAME)/install
    $(INSTALL_DIR) $(1)/usr/sbin $(1)/usr/bin
    $(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/lspci $(1)/usr/bin
    $(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/sbin/setpci $(1)/usr/sbin/
endef

define Package/libpci/install
    $(INSTALL_DIR) $(1)/usr/lib
    $(CP) $(PKG_INSTALL_DIR)/usr/lib/*.so* $(1)/usr/lib/
endef

$(eval $(call BuildPackage,libpci))
$(eval $(call BuildPackage,$(PKG_NAME)))
