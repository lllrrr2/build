include $(TOPDIR)/rules.mk

include $(INCLUDE_DIR)/package.mk

LUCI_TITLE:=LuCI support for cpulimit
LUCI_DEPENDS:=+cpulimit
LUCI_PKGARCH:=all
PKG_NAME:=luci-app-cpulimit
PKG_VERSION:=1.1
PKG_RELEASE:=20230809

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
