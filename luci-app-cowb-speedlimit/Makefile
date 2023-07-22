include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-cowb-speedlimit
PKG_VERSION:=v4.0.4
PKG_RELEASE:=20210515

LUCI_TITLE:=LuCI support for deluge
LUCI_PKGARCH:=all
LUCI_DEPENDS:=+tc +bash +kmod-ifb +kmod-sched +kmod-sched-core

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
