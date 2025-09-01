export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref()
    return {
      userInfo,
    }
  },
  {
    persist: true,
  },
)
