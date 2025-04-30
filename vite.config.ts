import { fileURLToPath, URL } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import ViteRestart from 'vite-plugin-restart'

export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return {
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniPages({
        exclude: ['**/components/**/**.*', '**/C/**.*'],
        routeBlockLang: 'json5', // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
        // homePage 通过 vue 文件的 route-block 的type="home"来设定
        homePage: 'pages/index/index',
        // pages 目录为 src/pages，分包目录不能配置在pages目录下
        // subPackages: ['src/pages-sub'], // 是个数组，可以配置多个，但是不能为pages里面的目录
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
      // UniXXX 需要在 Uni 之前引入
      uni(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'uni-app', {
          from: 'uni-mini-router',
          imports: ['createRouter', 'useRouter', 'useRoute'],
        }],
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        vueTemplate: true,
      }),
      UnoCSS(),
      ViteRestart({
        // 在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@img': fileURLToPath(new URL('./src/static/images', import.meta.url)), // 图片路径别名
      },
    },
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
