import { fileURLToPath, URL } from 'node:url'

import uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import UniRoot from '@uni-ku/root'
import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'

export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniPages({
        exclude: ['**/components/**/**.*', '**/C/**.*'],
        routeBlockLang: 'json5', // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
        dts: 'src/types/uni-pages.d.ts',
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-platform
      UniPlatform(),
      // https://github.com/uni-helper/vite-plugin-uni-platform-modifier
      UniPlatformModifier(),
      // https://github.com/uni-helper/vite-plugin-uni-middleware
      UniMiddleware(),
      // https://github.com/uni-ku/root
      UniRoot(),
      // UniXXX 需要在 Uni 之前引入
      uni(),
      UnoCSS(),
      ViteRestart({
        // 在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
    ],
    build: {
      target: 'es6',
      cssTarget: 'chrome61',
    },
    optimizeDeps: {
      exclude: [
        'vue-demi',
      ],
    },
  }
})
