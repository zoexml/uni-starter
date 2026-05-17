import type { ConfigProviderThemeVars } from '@wot-ui/ui'
import type { ThemeColorOption, ThemeMode } from '@/common/constants'
import { DEFAULT_PRIMARY_COLOR, DEFAULT_THEME_MODE, DEFAULT_WOT_THEME_VARS, themeColorOptions } from '@/common/constants'

const PRIMARY_COLOR_STORAGE_KEY = 'app-theme-primary-color'

const themeMode = shallowRef<ThemeMode>(DEFAULT_THEME_MODE)
const currentPrimaryColor = shallowRef<ThemeColorOption['value']>(DEFAULT_PRIMARY_COLOR)
let hasLoadedStoredPrimaryColor = false

const findThemeColorOption = (color: string) => {
  return themeColorOptions.find(item => item.value === color)
}

const getStoredPrimaryColor = () => {
  try {
    const storedColor = uni.getStorageSync(PRIMARY_COLOR_STORAGE_KEY)
    const matchedOption = typeof storedColor === 'string' ? findThemeColorOption(storedColor) : undefined

    return matchedOption?.value ?? DEFAULT_PRIMARY_COLOR
  } catch {
    return DEFAULT_PRIMARY_COLOR
  }
}

const loadStoredPrimaryColor = () => {
  if (hasLoadedStoredPrimaryColor) return

  currentPrimaryColor.value = getStoredPrimaryColor()
  hasLoadedStoredPrimaryColor = true
}

const currentColorOption = computed(() => {
  return findThemeColorOption(currentPrimaryColor.value) ?? themeColorOptions[0]
})

const wotThemeVars = computed<ConfigProviderThemeVars>(() => ({
  ...DEFAULT_WOT_THEME_VARS,
  primary5: currentColorOption.value.primary5,
  primary6: currentColorOption.value.value,
  primary7: currentColorOption.value.primary7,
}))

const appThemeStyle = computed(() => {
  const { primary5, primary7, soft, value } = currentColorOption.value

  return [
    'background-color: #F9F9F8',
    'min-height: 100vh',
    `--wot-primary-5: ${primary5}`,
    `--wot-primary-6: ${value}`,
    `--wot-primary-7: ${primary7}`,
    `--app-primary-soft: ${soft}`,
  ].join(';')
})

const currentPrimaryColorLabel = computed(() => {
  return currentColorOption.value.label
})

const applyPrimaryColorVariablesToDocument = () => {
  const { primary5, primary7, soft, value } = currentColorOption.value

  // #ifdef H5
  if (typeof document === 'undefined') return

  const styleEntries = [
    ['--wot-primary-5', primary5],
    ['--wot-primary-6', value],
    ['--wot-primary-7', primary7],
    ['--app-primary-soft', soft],
  ] as const
  const rootStyle = document.documentElement.style
  const bodyStyle = document.body?.style

  styleEntries.forEach(([name, color]) => {
    rootStyle.setProperty(name, color)
    bodyStyle?.setProperty(name, color)
  })
  // #endif
}

const applyNativeTabBarPrimaryColor = () => {
  uni.setTabBarStyle({
    color: '#999999',
    selectedColor: currentColorOption.value.value,
    fail: () => undefined,
  })
}

const applyPrimaryColor = () => {
  applyPrimaryColorVariablesToDocument()
  applyNativeTabBarPrimaryColor()
}

export const useTheme = () => {
  const setNavigationBarColor = () => {
    uni.setNavigationBarColor({
      frontColor: themeMode.value === 'light' ? '#000000' : '#ffffff',
      backgroundColor: themeMode.value === 'light' ? '#ffffff' : '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn',
      },
    })
  }

  const toggleThemeMode = (mode?: ThemeMode) => {
    themeMode.value = mode || (themeMode.value === 'light' ? 'dark' : 'light')
    setNavigationBarColor()
  }

  const setPrimaryColor = (color: ThemeColorOption['value']) => {
    currentPrimaryColor.value = color

    try {
      uni.setStorageSync(PRIMARY_COLOR_STORAGE_KEY, color)
    } catch {
      // Theme color still updates in memory if persistence is unavailable.
    }

    applyPrimaryColor()
  }

  const initializeTheme = () => {
    loadStoredPrimaryColor()
    setNavigationBarColor()
    applyPrimaryColor()
  }

  return {
    themeMode: readonly(themeMode),
    wotThemeVars,
    appThemeStyle,
    currentPrimaryColor: readonly(currentPrimaryColor),
    currentPrimaryColorLabel,
    initializeTheme,
    themeColorOptions,
    setPrimaryColor,
    toggleThemeMode,
  }
}
