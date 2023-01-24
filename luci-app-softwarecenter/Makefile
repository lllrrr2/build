# Copyright (C) 2019 Jianpeng Xiang (1505020109@mail.hnust.edu.cn)

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI Support for Software Center
LUCI_DEPENDS:=@(aarch64||arm||x86_64||mipsel) +parted
PKG_VERSION:=2.2.3
PKG_RELEASE:=20230120

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
