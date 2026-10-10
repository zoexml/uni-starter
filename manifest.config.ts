import path from 'node:path'
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { loadEnv } from 'vite'
import pkg from './package.json'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd()))
const { VITE_APP_TITLE, VITE_UNI_APPID, VITE_WX_APPID, VITE_APP_PUBLIC_BASE, VITE_FALLBACK_LOCALE } = env

/**
 * 微信小程序隐私协议检查开关（对应 app.json 的 `__usePrivacyCheck__`）。
 *
 * 关闭时微信不在运行时拦截隐私接口；开启后必须先到
 * 「公众平台 → 设置 → 服务内容声明 → 用户隐私保护指引」声明对应收集类型，
 * 否则 chooseImage / getLocation 等接口会直接 fail（api scope is not declared in the privacy agreement）。
 * 需要开启时把这里改成 true，并确认后台已声明。
 *
 * 当前 @uni-helper/vite-plugin-uni-manifest 的类型未声明该字段，
 * 单独声明后用展开的方式合并，避免对象字面量的多余属性检查报错。
 */
const mpWeixinPrivacyCheck = { __usePrivacyCheck__: false }

export default defineManifestConfig({
  'name': VITE_APP_TITLE,
  'appid': VITE_UNI_APPID,
  'description': '',
  'versionName': pkg.version,
  'versionCode': String(Number(pkg.version.replace(/\./g, ''))),
  'transformPx': false,
  'locale': VITE_FALLBACK_LOCALE, // 'zh-Hans'
  /* 5+App特有相关 */
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    /* 模块配置 */
    modules: {},
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
      },
      /* ios打包配置 */
      ios: {},
      /* SDK配置 */
      sdkConfigs: {},
    },
  },
  /* 快应用特有相关 */
  'quickapp': {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
    darkmode: true,
    themeLocation: 'theme.json',
    optimization: { subPackages: true },
    // 开启后隐私接口才会走 wx.onNeedPrivacyAuthorization 授权流程，详见 composables/usePrivacy.ts
    ...mpWeixinPrivacyCheck,
  },
  'mp-alipay': {
    usingComponents: true,
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  'h5': {
    darkmode: true,
    themeLocation: 'theme.json',
    router: {
      base: VITE_APP_PUBLIC_BASE,
    },
  },
  'uniStatistics': {
    enable: false,
  },
  'vueVersion': '3',
})
