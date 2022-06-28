include $(TOPDIR)/rules.mk

LUCI_TITLE:=Docker Manager interface for LuCI
LUCI_DEPENDS:=@(aarch64||arm||x86_64) +luci-lib-docker +luci-lib-ip +docker +dockerd +ttyd
PKG_NAME:=luci-app-dockerman
PKG_VERSION:=v0.5.25
PKG_RELEASE:=1
PKG_MAINTAINER:=lisaac <lisaac.cn@gmail.com>
PKG_LICENSE:=AGPL-3.0

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
