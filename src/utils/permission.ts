import { useUserStore } from '@/stores'

export function hasPermission(permission: string) {
  return useUserStore().hasPermission(permission)
}

export function hasAnyPermission(permissions: string[]) {
  const userStore = useUserStore()
  return permissions.some(permission => userStore.hasPermission(permission))
}

export function hasRole(role: string) {
  return useUserStore().roles.includes(role)
}
