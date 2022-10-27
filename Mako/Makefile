# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=Mako
PKG_VERSION:=1.2.3
PKG_RELEASE:=1

PYPI_NAME:=$(PKG_NAME)
PKG_HASH:=7fde96466fcfeedb0eed94f187f20b23d85e4cb41444be0e542e2c8c65c396cd

PKG_MAINTAINER:=Daniel Golle <daniel@makrotopia.org>
PKG_LICENSE:=BSD-3-Clause
PKG_LICENSE_FILES:=LICENSE.rst
PKG_CPE_ID:=cpe:/a:palletsprojects:flask

HOST_BUILD_DEPENDS:=python3/host

include $(TOPDIR)/feeds/packages/lang/python/pypi.mk
include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/python/python3-package.mk

define Package/python3-mako
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Python
  TITLE:=Mako
  URL:=https://www.makotemplates.org/
  DEPENDS:=+python3-light
endef

define Package/python3-mako/description
 Mako is a template library written in Python.
endef

define Host/Compile
	$(call HostPython3/ModSetup,,install --prefix="" --root="$(STAGING_DIR_HOSTPKG)")
endef

Host/Install:=

$(eval $(call Py3Package,python3-mako))
$(eval $(call BuildPackage,python3-mako))
$(eval $(call BuildPackage,python3-mako-src))
$(eval $(call HostBuild))
