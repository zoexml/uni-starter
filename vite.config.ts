import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import optimizer from '@uni-ku/bundle-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'
import TransformPages from 'uni-read-pages-vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import ViteRestart from 'vite-plugin-restart'
// import vitePluginDirectives from './vite-plugin/vite-plugin-directives'

export default async ({ command, mode }) => {
  const UnoCSS = (await import('unocss/vite')).default
  // const mode = process.env.NODE_ENV
  const { UNI_PLATFORM } = process.env
  // mode: 区分生产环境还是开发环境
  console.log('command, mode -> ', command, mode, 'UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等
  const env = loadEnv(mode, path.resolve(process.cwd()))

  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
  } = env
  console.log('环境变量 env -> ', env)

  return defineConfig ({
    plugins: [
      // vitePluginDirectives({
      //   directives: 'v-perms', // 自定义指令名称（默认：v-perms）
      // }),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniPages({
        exclude: ['**/components/**/**.*', '**/C/**.*'],
        routeBlockLang: 'json5', // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
        // homePage 通过 vue 文件的 route-block 的type="home"来设定
        homePage: 'pages/index/index',
        // pages 目录为 src/pages，分包目录不能配置在pages目录下
        subPackages: ['src/pages-sub'], // 是个数组，可以配置多个，但是不能为pages里面的目录
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
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniComponents({
        dts: 'src/types/components.d.ts',
        directoryAsNamespace: true,
      }),
      // UniXXX 需要在 Uni 之前引入
      uni(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          'uni-app',
          'pinia',
          {
            from: 'uni-mini-router',
            imports: ['createRouter', 'useRouter', 'useRoute'],
          },
          { 'alova/client': ['useRequest', 'usePagination', 'useAutoRequest', 'useWatcher'] },
        ],
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores', 'src/utils'],
        vueTemplate: true,
      }),
      UnoCSS(),
      // https://github.com/uni-ku/bundle-optimizer
      optimizer({
        dts: { base: 'src/types' },
        // logger: true,
      }),

      // 打包分析插件
      mode === 'production'
      && visualizer({
        filename: './node_modules/.cache/visualizer/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),

      ViteRestart({
        // 监听vite.config.ts文件修改,无需重启
        restart: ['vite.config.js'],
      }),
    ],
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@img': fileURLToPath(new URL('./src/static/images', import.meta.url)), // 图片路径别名
      },
    },
    // 开发配置
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: path => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
            },
          }
        : undefined,
    },
    define: {
      ROUTES: new TransformPages().routes,
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      // __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
    },
    // 构建配置
    build: {
      sourcemap: JSON.parse(VITE_SHOW_SOURCEMAP),
      target: 'es6',
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      terserOptions: {
        compress: {
          // 禁用字段名压缩
          properties: false,
          drop_console: JSON.parse(VITE_DELETE_CONSOLE),
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      exclude: [
        'vue-demi',
      ],
    },
  })
}
