/*
 * @Description: constants
 */
import type { ConfigProviderThemeVars } from '@wot-ui/ui'

export type ThemeMode = 'light' | 'dark'

export interface ThemeColorOption {
  value: `#${string}`
  label: string
  primary5: `#${string}`
  primary7: `#${string}`
  soft: string
}

export const themeColorOptions: ThemeColorOption[] = [
  {
    value: '#0055FE',
    label: '蓝色',
    primary5: '#3377FE',
    primary7: '#0044CB',
    soft: 'rgb(0 85 254 / 10%)',
  },
  {
    value: '#CD5C5C',
    label: '红色',
    primary5: '#D77D7D',
    primary7: '#A44A4A',
    soft: 'rgb(205 92 92 / 12%)',
  },
  {
    value: '#228B22',
    label: '绿色',
    primary5: '#4EA24E',
    primary7: '#1B6F1B',
    soft: 'rgb(34 139 34 / 12%)',
  },
]

export const DEFAULT_PRIMARY_COLOR = themeColorOptions[0].value
export const DEFAULT_THEME_MODE: ThemeMode = 'light'
export const DEFAULT_WOT_THEME_VARS: ConfigProviderThemeVars = {
  primary6: DEFAULT_PRIMARY_COLOR,
}
