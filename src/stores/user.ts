import type { MockAuthSession, MockUserInfo } from '@/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = shallowRef('')
    const refreshToken = shallowRef('')
    const userInfo = ref<MockUserInfo | null>(null)
    const roles = ref<string[]>([])
    const permissions = ref<string[]>([])

    const isLogin = computed(() => Boolean(token.value))

    function setLoginSession(session: MockAuthSession) {
      token.value = session.token
      refreshToken.value = session.refreshToken ?? ''
      userInfo.value = session.userInfo
      roles.value = session.roles
      permissions.value = session.permissions
    }

    function setToken(newToken: string) {
      token.value = newToken
    }

    function setRefreshToken(newRefreshToken: string) {
      refreshToken.value = newRefreshToken
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
      refreshToken.value = ''
      userInfo.value = null
      roles.value = []
      permissions.value = []
    }

    return {
      token,
      refreshToken,
      userInfo,
      roles,
      permissions,
      isLogin,
      setLoginSession,
      setToken,
      setRefreshToken,
      setUserInfo,
      hasPermission,
      logout,
    }
  },
  {
    persist: true,
  },
)
