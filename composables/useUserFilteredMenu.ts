import { computed } from 'vue'
import { userMenuItems } from '~/core/auth/constants/user-filtered-menu';
import type { UserRoles } from '~/core/auth/constants/user-roles';
import type { UserInfoDataModel } from '~/core/auth/data-access/models/auth.model';


function canShow(item: any, role: UserRoles): boolean {
  if(!item.isDesktop)  return false
  if (item.allowRoles.length>0) return item.allowRoles.includes(role);
  if (item.denyRoles.length>0) return !item.denyRoles.includes(role);
  return true
}

function canShowMobile(item: any, role: UserRoles): boolean {
  if(!item.isMobile)  return false
  if (item.allowRoles.length>0) return item.allowRoles.includes(role);
  if (item.denyRoles.length>0) return !item.denyRoles.includes(role);
  return true
}

export function useFilteredMenu() {
  const { data } = useAuth()
  const userData = computed(() => data.value as UserInfoDataModel);
  const role = computed(() => userData.value?.role)
  const filteredMenu = computed(() =>
    userMenuItems.filter(item => canShow(item,role.value))
  )

  const filteredMenuMobile = computed(() =>
      userMenuItems.filter(item=>canShowMobile(item,role.value))
  )

  return {
    filteredMenu,
    filteredMenuMobile
  }
}
