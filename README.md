# uniapp-template
一个注重"功能"和"开发体验"的 uniapp 模板。

## 🛠️ 技术栈

- ⚡️ [vite6](https://vitejs.dev/) - 构建工具
- 🖖 [vue3](https://vuejs.org/) - 渐进式框架
- 🎨 [unocss](https://unocss.dev/) - 原子化 CSS 引擎
- 🚦 [uni-mini-router](https://github.com/uni-helper/uni-mini-router) - 小程序路由管理器
- 🚀 [alova](https://alova.js.org/) - 轻量级请求策略库
- 🎯 [Wot UI](https://wot-ui.cn/) - Vue3 UI 框架
- 📜 [z-paging](https://z-paging.zxlee.cn/) - 上拉加载下拉刷新组件
- 📦 [pinia](https://pinia.vuejs.org/) - 状态管理
- 🔷 [typescript](https://www.typescriptlang.org/) - JavaScript 超集
- 🔧 [antfu eslint config](https://github.com/antfu/eslint-config) - 代码规范

## 待使用的优化方案

- [root](https://github.com/uni-ku/root) - root
- [bundle-optimizer](https://github.com/uni-ku/bundle-optimizer) - 分包优化

## 🔨 快速开始

```bash
# node 版本大于等于 node22@latest
# 安装依赖
pnpm install

# 开发
pnpm dev            # H5
pnpm dev:mp-weixin     # 微信小程序

# 打包
pnpm build
```

## ✨ 特性

- 用rimraf实现“秒删” npm install rimraf -g
- 检查项目中的依赖是否有新版本，谨慎更新 npx npm-check-updates
- @see https://github.com/raineorshine/npm-check-updates
- update:icon 更新图标

### 🎨 主题系统

- 运行时动态切换主题
- 基于 CSS 变量实现
- 支持小程序和 H5

### ⚡️ 请求管理

- 基于 alova 的请求策略
- OpenAPI 自动生成
- 全局加载状态管理
- 使用 alova 内置请求共享，避免重复请求
- Token 自动注入，支持可选双 token 刷新
- 需要重试的请求优先使用 alova 官方 `useRetriableRequest`
- 推荐安装 alova 的 vscode 插件提升开发体验

### 🛡️ 全局错误处理

- Vue 组件错误通过 `app.config.errorHandler` 捕获
- uni-app 应用错误通过 `onError` 捕获
- 未处理的 Promise 异常通过 `onUnhandledRejection` 捕获
- 支持生产环境上报到 Sentry 或自定义错误收集接口
- 内置短时间重复错误去重，避免同一异常连续刷屏

### 🚀 开发体验

- API 自动引入(Vue/Pinia/Alova)
- ESLint + UnoCSS 代码规范
- TypeScript 类型支持、Vue3 代码片段
- store、hook、Vue 和 uniapp API 自动引入
- 支持 $ 开头的功能直接使用，并拥有完整的类型提示
- 支持自动压缩上传服务器或者阿里云OSS或者你可以定义其他上传方式
- 全局等待加载，优雅处理全局异步状态管理、不阻塞ui渲染，可选并行或等待

### 📱 路由增强

- 如何使用: [uni-mini-router](https://moonofweisheng.github.io/uni-mini-router/guide/usage.html)
- 基于 name 的路由跳转
- 路由守卫拦截、权限控制、页面预加载
- 按钮权限自定义 hasPermission 函数，然后添加自动导入，或者挂载到vue实例上，在页面中使用 v-if 判断

### 📦 分包优化

- 异步跨包调用
- 组件异步加载
- 分包预加载
- 支持小程序和 H5 来自 [uni-ku/bundle-optimizer](https://github.com/uni-ku/bundle-optimizer)

## 📖 开发指南

### 开发环境

- Node.js: 20+(现在很多项目都要求node20以上)
- 包管理器: pnpm(节省磁盘空间)
- IDE: VSCode(会自动推荐插件安装)

### 文档说明

- 代码中包含详细的示例和注释，建议通过阅读源码来掌握框架用法
- 代码结构清晰简单，容易理解和上手

### 组件说明

- 支持 `component is` 动态组件
- 内置 `z-paging` 列表组件
- 优化的自定义 TabBar
- 自定义组件使用说明见 [src/components/README.md](./src/components/README.md)

### 工具函数

- 缓存管理(默认7天)
- 全局模板变量(支持ts类型定义)
- 加密解密，md5，base64，aes

### HTTP 请求

HTTP 实例在 `src/utils/http.ts` 中统一创建，业务接口优先放到 `src/apis/` 下复用同一个 `http` 实例。

当前请求层约定：

- 基于 `@alova/adapter-uniapp` 和 `alova/vue`，适配 uni-app 多端请求。
- `shareRequest: true` 显式开启 alova 请求共享，相同 method、url、headers、params、body 的并发请求会共享进行中的请求。
- 请求超时时间统一为 `5000ms`。
- 请求前通过 `createServerTokenAuthentication` 自动注入 `Authorization: Bearer <token>`。
- `401` 会进入 token 过期处理；`VITE_AUTH_MODE = 'double'` 且存在 `refreshToken` 时会尝试刷新 token，失败后清空登录态并跳转登录页。
- 上传、下载请求会直接返回原始响应，不走业务响应解包。
- 普通请求默认按 `IResponse<T>` 解包，业务成功返回 `data`，业务错误和 HTTP 错误会统一抛出 `Error`。

请求 meta 支持：

```ts
http.Get('/example', {
  meta: {
    toast: false,
  },
})
```

- `meta.toast = false`：关闭当前请求的全局错误 toast。
- `meta.authRole = 'login'`：登录类接口标记，避免被鉴权逻辑当作普通业务请求处理。
- `meta.authRole = 'refresh'`：刷新 token 接口标记，避免刷新流程递归触发自身。

请求重试不在全局拦截器中处理。需要重试的页面请求优先使用 alova 官方 `useRetriableRequest`：

```ts
import { useRetriableRequest } from 'alova/client'
import { http } from '@/utils/http'

const userRequest = http.Get('/user/profile')
const { data, loading, error } = useRetriableRequest(userRequest, {
  retry: 2,
  backoff: {
    delay: 1000,
    multiplier: 2,
  },
})
```

不要对非幂等请求默认开启重试，例如创建订单、支付、提交表单等操作应由业务显式确认是否可以重试。

### 全局错误处理与 Sentry

全局错误处理入口在 `src/main.ts` 和 `src/App.vue`：

- `src/main.ts` 调用 `installVueErrorHandler(app)`，用于捕获 Vue 组件运行时错误。
- `src/App.vue` 调用 `useGlobalErrorHandling()`，用于捕获 uni-app 的 `onError` 和 `onUnhandledRejection`。

错误会统一进入 `src/utils/global-error-reporting.ts`，再根据运行时配置决定只打印日志，还是远程上报：

- 开发环境默认只输出到控制台。
- 生产环境下，`VITE_ENABLE_ERROR_REPORT` 不为 `false` 且配置了上报地址时才会上报。
- 同时配置 `VITE_SENTRY_DSN` 和 `VITE_ERROR_REPORT_URL` 时，优先使用 Sentry。

生产环境启用 Sentry：

```env
VITE_ENABLE_ERROR_REPORT = true
VITE_SENTRY_DSN = 'https://public@example.ingest.sentry.io/42'
VITE_SENTRY_RELEASE = 'uni-temp@0.0.1'
```

如果不用 Sentry，也可以配置自定义接口：

```env
VITE_ENABLE_ERROR_REPORT = true
VITE_ERROR_REPORT_URL = 'https://example.com/api/client-errors'
```

当前 Sentry 接入没有额外引入 `@sentry/vue` SDK，而是通过 `uni.request` 发送 Sentry Envelope，适合小程序、H5、App 共用同一套上报逻辑。

### 注意事项

- 关于 public 文件夹，原则上来说静态图片都应该放在 static 下面，public 的存在是为了放一些需要在web服务器根目录的给某些app嵌套h5要求放一些文件
- 关于 hooks，拥有自动导入，定义的 hooks 只要使用 export 导出，就可以自动导入
- 组件库使用 wot-design(开发体验最好用的组件库)
- 环境变量配置在 .env 和 .env.\* 文件
- 分包配置在 vite.config.ts，分包优化在 pages.config.ts
- 如果自动格式化 eslint 插件没生效。请安装依赖后重启 vscode
- 如果 ts 服务出现异常，请使用 ctrl + shift + p 然后输入 ts server restart，或者重启 vscode
- 如果对 tabbar 有严格要求，可以把 custom 移除，使用原生的
- 关于 pinia 持久化，推荐使用 watch 手动控制，然后在初始化时获取

### 项目结构

```bash

```

## 🤝 贡献

## 📄 开源协议

完全免费开源

[MIT © 2025-present, Joet桀](./LICENSE)

## 😄 维护者

[Joet桀](https://gitee.com/joetoo_admin)

## 🤔 如何贡献

非常欢迎您的加入！[提一个 Issue](https://gitee.com/learn_15/uni-temp/issues) 或者提交一个 `Pull Request`

**Pull Request:**

1. `Fork` 代码到自己的项目下，不要直接在仓库下建分支
2. 请选择 `dev` 分支，进行 `PR`
3. 提交 `PR` 前请 `rebase`，确保 `commit` 记录的整洁
4. 注意 `commit` 信息规范，要以 `emoji type: 描述信息` 的形式填写，注意 `type` 得是下面规范之中的一个
5. 示例 `commit` 信息：`🐞 fix: 修复 无感刷新 重试失败问题`
6. 可以使用项目中的 `pnpm commit` 进行 `commit` 提交，这样就会默认为 `type` 前面添加 `emoji`
7. 等待作者 `review` 通过后，即可合并

## ⌛ Git 贡献提交规范

- `✨ feat` 新增功能
- `🐞 fix` 修复 bug
- `📃 docs` 文档变更
- `🌈 style` 代码格式（仅仅修改了空格、缩进、逗号等等，不改变代码逻辑）
- `🦄 refactor` 代码重构，没有加新功能或修复 bug
- `🎈 perf` 代码优化，比如提升性能、体验
- `🔧 build` 构建流程、外部依赖变更 (如升级 npm 包、修改打包配置等)
- `🐳 chore` 对构建过程或辅助工具和库的更改 (不影响源文件、测试用例)
- `⏳️ workflow` 工作流程改进

## ⭐ Star

非常感谢留下星星的 `小哥哥 、小姐姐`，感谢您的支持 ❤
