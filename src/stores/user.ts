import type { MockAuthSession, MockUserInfo } from '@/mocks/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = shallowRef('')
    const userInfo = ref<MockUserInfo | null>(null)
    const roles = ref<string[]>([])
    const permissions = ref<string[]>([])

    const isLogin = computed(() => Boolean(token.value))

    function setLoginSession(session: MockAuthSession) {
      token.value = session.token
      userInfo.value = session.userInfo
      roles.value = session.roles
      permissions.value = session.permissions
    }

    function setUserInfo(info: Partial<MockUserInfo>) {
      if (!userInfo.value) return
      userInfo.value = {
        ...userInfo.value,
        ...info,
      }
    }

    function hasPermission(permission: string) {
      return permissions.value.includes(permission)
    }

    function logout() {
      token.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []
    }

    return {
      token,
      userInfo,
      roles,
      permissions,
      isLogin,
      setLoginSession,
      setUserInfo,
      hasPermission,
      logout,
    }
  },
  {
    persist: true,
  },
)
