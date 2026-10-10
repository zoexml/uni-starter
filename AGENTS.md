# AGENTS.md

> 本文件是本仓库代码代理指令的**唯一**来源，供 Claude Code、Cursor、Codex 等工具读取。
> `CLAUDE.md` 仅为兼容入口，指向本文件。项目指引的修改请直接维护本文件，不要两份同时维护。

## 项目概览

这是一个 uni-app 3.0 模板项目，目标平台包括 H5、微信小程序、支付宝小程序等。技术栈为 Vue 3 + TypeScript + Vite + Pinia + UnoCSS + Wot Design Uni + alova（另含 z-paging、uni-mini-router 等）。

除非用户明确要求，不要替换框架、包管理器、UI 组件库、路由方案或请求层。

**包管理器强制为 pnpm**（通过 `preinstall` 钩子），Node.js >= 22。

## 常用命令

```bash
pnpm install                 # 安装依赖
pnpm dev                     # H5 开发
pnpm dev:mp-weixin           # 微信小程序开发
pnpm build                   # 构建 H5
pnpm build:mp-weixin         # 构建微信小程序
pnpm type-check              # TypeScript 类型检查
pnpm lint                    # ESLint 检查
pnpm lint:fix                # ESLint 自动修复
pnpm lint:stylelint          # Stylelint 修复
pnpm api                     # 根据 worma 配置生成接口代码
```

验证改动时，涉及组件/页面/类型的最小命令组合为 `pnpm type-check && pnpm lint`；尽量选择和改动范围匹配的最小命令组合。

## 目录结构

- `src/main.ts` / `src/App.vue` — 应用入口与根组件
- `src/pages/main/` — 主包页面（index、discover、message、my、login）
- `src/pages/business/` — 业务分包页面（about、agreement、example、favorites、search、settings、webview）
- `src/layouts/` — 布局组件
- `src/components/` — 通用组件（自动引入，清单见 `src/components/README.md`）
- `src/composables/` — 组合式逻辑
- `src/stores/` — Pinia 状态管理
- `src/router/` — 路由配置
- `src/apis/` — API 模块，部分文件由 OpenAPI 生成
- `src/utils/` — 通用工具函数
- `src/styles/` — 全局样式
- `src/static/` — uni-app 静态资源
- `src/tabbar/` — TabBar 配置
- `pages.config.ts` — 页面和分包配置
- `manifest.config.ts` — uni-app manifest 配置
- `vite.config.ts` — Vite 和 uni 插件配置
- `uno.config.ts` — UnoCSS 配置

## 架构概览

### 插件体系

项目使用 `@uni-helper` 系列 Vite 插件实现约定式开发：

| 插件 | 职责 |
|------|------|
| `vite-plugin-uni-pages` | 基于文件系统自动生成路由表，`homePage` 通过 `route-block` 设置 |
| `vite-plugin-uni-layouts` | 布局系统，`src/layouts/` 下文件自动注册 |
| `vite-plugin-uni-manifest` | 从 `manifest.config.ts` 生成 `manifest.json` |
| `vite-plugin-uni-platform` | 注入当前编译平台常量 |
| `vite-plugin-uni-components` | 组件自动引入，`directoryAsNamespace: true` |
| `unplugin-auto-import` | API 自动引入（Vue、Pinia、VueUse、uni-app、alova、uni-mini-router、@wot-ui） |
| `@uni-ku/bundle-optimizer` | 分包异步组件/跨包调用优化 |
| `@uni-helper/vite-plugin-uni-middleware` | uni-app 中间件支持 |

路由表通过 `uni-read-pages-vite` 读取后以 `ROUTES` 全局常量注入，供 `uni-mini-router` 使用。

页面目录全部收敛在 `src/pages/` 下：主包为 `src/pages/main/`，业务二级页面统一放在 `src/pages/business/` 这一个分包目录，在 `vite.config.ts` 的 `UniPages({ dir: 'src/pages/main', subPackages: ['src/pages/business'] })` 中注册。新增业务页面直接放进 `src/pages/business/`；只有在页面体积较大或发布前会整体删除（如示例中心）时，才新增独立分包目录并往 `subPackages` 追加一项。不要再新增 `src/pages-xxx/` 这类平级目录，也不要引用旧的 `src/pages-sub/`、`src/pages-business/`。

注意 `dir` 与 `subPackages` 不能互相包含：`uni-pages` 扫描主包与分包时共用同一份 `exclude`，所以主包页面必须放在独立子目录，不能直接把分包放进 `src/pages/` 根下。

页面路径由文件位置推导，因此调整目录会同步改变路由路径（`/pages/index/index` → `/pages/main/index/index`）。改动目录时必须同步检查：`vite.config.ts` 的 `homePage`/`subPackages`、`src/tabbar/config.ts` 的 `pagePath`、`src/router/index.ts` 的登录页与兜底路径、`src/utils/http.ts` 的 `LOGIN_PAGE`、`src/composables/useWebView.ts` 的 `WEBVIEW_PAGE_PATH` 与内部路径白名单。

### 状态管理

Pinia + `pinia-plugin-persistedstate`，使用 `uni.getStorageSync`/`uni.setStorageSync` 实现跨端持久化。

- `stores/user.ts` — 用户认证（token、userInfo、roles、permissions），支持权限判断 `hasPermission()`
- 新增 store 模块后需在 `stores/index.ts` 中 `export *` 以启用自动引入

### 请求层

基于 `alova` + `@alova/adapter-uniapp` + `alova/vue` 构建：

- 响应拦截器统一处理 HTTP 状态码和业务错误码（`{ code, message, data }` 格式），自动 `uni.showToast`
- Token 注入与刷新已通过 alova 的 `createServerTokenAuthentication` 实现：`assignToken` 注入 token，收到 401 时 `refreshTokenOnSuccess` 触发 `handleExpiredToken`，刷新失败才跳登录页
- 认证模式由 `VITE_AUTH_MODE` 决定（`single` / `double`），接口元信息用 `meta.authRole` 区分是否需要登录
- 所有页面 API 调用应使用 `http.get/post/put/delete` 或 alova hooks（`useRequest`、`usePagination` 等）
- 请求失败提示由 `meta.toast` 控制，全局 loading 由 `meta.loading` 控制（`true` / 字符串 / `{ title, delay, mask }`），缺省都不触发；结束请求时先释放 loading 再 toast
- mock 模式下响应由 `src/mocks/adapter.ts` 统一补 uniapp 响应结构与 `{ code, message, data }` 业务信封，handler 只返回业务数据；handler 直接返回 `{ code, message }` 时按自带信封处理（可用于演示错误码）
- 写 mock handler 时注意取参：`@alova/mock` 把查询串放在 `query`，路径参数才在 `params`，用 adapter 里的 `readParam()` 取值，不要直接读 `params`

### 主题系统

- `src/composables/useTheme.ts` — `useTheme()` composable 控制主题色和明暗模式切换
- `src/styles/base.scss` — 应用级 CSS 语义色变量，例如 `--app-color-text`、`--app-color-border`、`--app-primary-soft`
- `src/App.ku.vue` — 通过 `wd-config-provider` 注入 Wot UI 主题变量
- 支持小程序和 H5 的 CSS 变量主题

### WebView 容器

- 页面入口：`src/pages/business/webview/index.vue`
- 统一逻辑入口：`src/composables/useWebView.ts`
- `useWebView.ts` 同时维护 WebView 页面路径、访问白名单、URL 构造、桥接 payload 校验和容器运行时状态，避免在 `utils` 和 `composables` 两处维护同一套逻辑。
- 所有外部 WebView 统一通过 `src/pages/business/webview/index.vue` 公共页面打开，不为单个链接新增页面。
- 页面跳转优先使用 `buildWebViewPageRoute({ title, url })` 配合 `uni-mini-router` 的 name 模式；无 router 上下文时可用 `openWebView({ title, url })`。当前页面路径常量为 `/pages/business/webview/index`。
- 访问控制通过 `DEFAULT_WEBVIEW_ACCESS_RULES` 配置；默认公共规则允许 HTTPS 链接，特定业务域名规则应放在通配规则之前。

### 小程序隐私授权

- 入口：`src/composables/usePrivacy.ts` — `usePrivacy()` 提供 `visible` / `needAuthorization` / `privacyContractName` / `lastReferrer` 状态与 `requirePrivacyAuthorize()` / `openPrivacyContract()` / `refreshPrivacyState()` / `showDialog()` / `agree()` / `disagree()`
- 弹窗：`src/components/PrivacyPopup/index.vue`，全局挂载在 `App.ku.vue`；「同意」按钮必须是 `<button open-type="agreePrivacyAuthorization">`，基础库会校验该按钮是否被真实点击过
- 开关：`manifest.config.ts` 的 `mp-weixin.__usePrivacyCheck__`，**当前为 `false`（关闭）**：关闭时微信不在运行时拦截隐私接口；改为 `true` 前必须先在后台声明收集类型，否则 `chooseImage` 等会直接 fail（当前插件类型未声明该字段，用 `mpWeixinPrivacyCheck` 展开合并）
- 注意：改完 `manifest.config.ts` 后第一次构建可能不生效（`src/manifest.json` 的写入晚于编译器读取），重新运行一次 `pnpm dev:mp-weixin` / `pnpm build:mp-weixin` 即可，可通过 `dist/build/mp-weixin/app.json` 是否含该字段确认
- `wx.onNeedPrivacyAuthorization` 是覆盖式注册，只能注册一次，因此监听统一在 `usePrivacy` 内做模块级单例注册
- 敏感操作前置预检：需要时在动作前 `await requirePrivacyAuthorize()`（会主动拉起隐私弹窗，所以只在开关打开时才加，否则会给不需要授权的场景强加一次弹窗）
- 入口：登录页勾选项旁的《用户协议》《隐私政策》都跳本地协议详情页（`agreement-detail`，小程序内打开）；未勾选时「获取验证码」「手机号登录」「手机号一键登录」都会被拦下
- `openPrivacyContract()` 打开的《隐私保护指引》由微信渲染、会跳出小程序页面栈（表现像外部浏览器），只用在隐私授权弹窗里做「查看指引」入口，不要拿它当业务侧的隐私政策页
- 非微信端全部降级为「视为已授权」，`openPrivacyContract()` 回退到本地协议页 `/pages/business/agreement/detail?type=privacy`
- 补充类型：`miniprogram-api-typings` 把 `onNeedPrivacyAuthorization` 的回调声明成了单参数，`usePrivacy` 内用 `WxPrivacyApi` 补了一份正确签名
- **隐私接口必须先在后台声明**：开了 `__usePrivacyCheck__` 后，未在「公众平台 → 设置 → 服务内容声明 → 用户隐私保护指引」中声明对应收集类型的接口会被直接拦下，报 `xxx:fail api scope is not declared in the privacy agreement`。`chooseImage` / `chooseMedia` 要声明相册（拍照还要摄像头），`getLocation` 要声明位置。H5 没有这一层，所以同一个接口两端表现不同，排查时别只看 H5
- 能力判断用「`wx` 上有没有这个接口」做特性检测，不要判断 `uniPlatform === 'mp-weixin'`：平台字符串一旦不符合预期，监听注册不上、弹窗不出现，而接口又被拦，表现就是「点了没反应」

### 登录方式

- 登录页当前只用**手机号验证码登录**（工具、真机都可用，链路完整）
- **手机号一键登录**（原生 `button open-type="getPhoneNumber"`）由 `src/common/constants.ts` 的 `ENABLE_PHONE_AUTH` 控制，**默认关闭**：该组件要求小程序为非个人主体且已微信认证，否则点击只会拿到「没有权限」。资质到位后改成 `true`，登录页会自动渲染授权按钮（`#ifdef MP-WEIXIN` 内，非微信端不渲染）
- 一键登录的 `event.detail` 解析抽在 `src/utils/phone-auth.ts`（`parsePhoneAuthEvent`），与 `AuthPhone` 组件共用；解析要区分「用户取消」（静默）与「其它失败」（透出原始 errMsg），否则无权限这类问题会被当成取消吞掉，表现为「点了没反应」
- 登录动作复用 `usePhoneAuth`（换 session、写 store、埋点、回跳），默认走 mock，接后端时传 `usePhoneAuth({ login: loginByPhoneAuthApi })`
- 不带「微信授权登录」：`wx.getUserInfo` / `wx.getUserProfile` 已不返回真实昵称头像，微信侧能拿到的只有 openid（后端 code2Session 换）与用户主动授权的手机号；需要昵称头像时用 `chooseAvatar` + `input type="nickname"` 让用户自己填
- 非微信端无 `getPhoneNumber`，一键登录按钮通过 `#ifdef MP-WEIXIN` 只在小程序端渲染

### 分享/Share

- 统一分享封装：`src/composables/useShare.ts` — `useShare({ title, path?, query?, imageUrl? })` 注册 `onShareAppMessage`（转发卡片）与 `onShareTimeline`（朋友圈），`path` 缺省取当前页路径，`query` 自动拼接。
- 各页面 setup 内调用一次即可；`imageUrl` 缺省时微信自动使用页面截图，H5 上钩子为 no-op 天然降级。

### TabBar 策略

通过 `src/tabbar/config.ts` 控制，支持四种模式（详见 `TABBAR_STRATEGY_MAP`）：

1. `NO_TABBAR` — 无 TabBar
2. `NATIVE_TABBAR` — 原生 TabBar
3. `CUSTOM_TABBAR_WITH_CACHE` — 自定义 + 缓存（当前使用）
4. `CUSTOM_TABBAR_WITHOUT_CACHE` — 自定义无缓存

自定义 tabbar 由 `src/tabbar/index.vue` 渲染（挂在 `App.ku.vue` 根节点），基于 Wot UI `wd-tabbar`/`wd-tabbar-item`：激活色跟随主题主色，badge 由组件内置 `wd-badge` 渲染，图标通过 `#icon` 插槽按 `customTabbarList` 的 `iconType` 分发（`uiLib` → `wd-icon` / `unocss` / `iconfont` / `image`），字号用组件默认类 `wd-tabbar-item__body-icon`（24px）。

策略切换后需重新运行项目以更新 `pages.json`。

### 埋点/Analytics

统一埋点封装，对照「纯工具层 + 薄 composable」拆分（同全局错误处理）：

- 统一入口：`src/composables/useTracker.ts` — `useTracker()` 返回 `track`/`trackPageView`/`flush` 与只读状态；`useTrackPageView()` 在 `onShow` 自动上报 `page_view`
- 纯核心：`src/utils/tracker.ts` — 类型、`createTrackerRuntimeConfig(env)`、适配器注册表、`tracker_queue` 存储读写、事件工厂
- 内置 HTTP 批量适配器：`src/utils/tracker-http-adapter.ts`，`uni.request` POST 事件数组，一次 flush 一次请求
- 上报流程：`track()` → 归一化 `TrackerEvent` → 内存队列 → 阈值/定时/App 隐藏触发 flush → 扇出到所有注册适配器 → 失败持久化到 storage，下次启动恢复重试
- 接三方平台（友盟/神策等）：实现 `TrackerAdapter`（`trackBatch`）后调用 `registerTrackerAdapter()` 注册
- 事件名约束：内置事件见 `TRACKER_EVENT_NAMES`（`page_view`/`user_login`/`user_logout`），`track` 同时接受任意自定义名
- userId 惰性读取 `useUserStore()`，登录/登出无需手动调用 `setUserId`

### 全局 loading

- 纯工具层：`src/utils/loading.ts` — 引用计数、延迟显示（默认 400ms）、状态订阅，不依赖 Vue
- 响应式封装：`src/composables/useLoading.ts` — 只读 `pendingCount` / `visible` / `title` + `withLoading`
- 请求层接入：`src/utils/http.ts` 的 `meta.loading`（`true` / 字符串 / `{ title, delay, mask }`），缺省不触发
- 兜底：401 跳登录、App 退到后台（`App.vue` 的 `onHide`）会调用 `forceCloseLoading()` 清空计数
- 状态只有一份（在 utils 层），`useLoading` 通过 `subscribeLoadingState` 订阅，不要另起一份计数

示例页面统一放在 `src/pages/business/example/` 目录（示例中心入口页 + `example/demo` 组件示例、`example/tracker` 埋点、`example/upload` 上传、`example/avatar` 头像裁剪、`example/form` 复杂表单、`example/bridge` 桥接、`example/loading` 请求 loading、`example/privacy` 隐私协议，由 `example/index.vue` 汇总入口）。

## 内置组件与 composable

通用组件统一放在 `src/components/`，通过 `vite-plugin-uni-components` 自动引入，页面中直接使用组件名，无需手动 `import`。完整组件清单、props 与用法以 `src/components/README.md` 为准，不要在本文件重复维护组件列表。

富文本渲染用 `mp-html`（已在 `pages.config.ts` 的 easycom 里注册，页面直接写 `<mp-html :content="html" />`，无需 import）。它渲染的是自建节点，**父页面的 scoped 样式匹配不进去**，排版要用 `tag-style` 传标签默认样式（内联样式里的 `rpx` 在 H5 端不会转换，统一用 px），正文的字号/行高/颜色靠外层容器继承。

已有 composable：

- `useTheme` — 主题色与明暗模式切换
- `useWebView` — WebView 容器统一逻辑（见「WebView 容器」）
- `useShare` — 统一分享卡片（见「分享/Share」）
- `useGlobalErrorHandling` — 全局错误处理
- `useTracker` / `useTrackPageView` — 埋点上报（见「埋点/Analytics」）
- `usePrivacy` — 微信小程序隐私授权（见「小程序隐私授权」）
- `useLoading` — 全局 loading 状态与手动控制（见「全局 loading」）
- `useUpload` — 文件直传封装（取凭证 → 上传 → 归一化结果）
- `usePhoneAuth` / `useLoginRedirect` — 手机号授权登录与登录后回跳

## 编码约定

- Vue SFC 使用 `<script setup lang="ts">`，块顺序：`<script>` → `<template>` → `<style>`
- 页面组件负责编排，可复用 UI 放 `src/components/`，可复用逻辑放 `src/composables/`
- 主包页面放 `src/pages/main/`，业务分包页面放 `src/pages/<业务名>/` 并在 `vite.config.ts` 的 `subPackages` 注册
- Props 和 emits 必须类型明确
- SCSS 必须使用嵌套选择器（`&`），禁止平铺顶层类名
- 请求层复用现有 alova 模式，不引入新的 HTTP 客户端
- 平台差异逻辑优先复用 `src/utils/tracker.ts` 导出的 `getRuntimePlatform()`（`src/utils/platform.ts` 已废弃删除）
- 跨页面或跨功能共享状态使用 Pinia；能用 `computed` 推导的状态不要重复存储
- 避免小需求做大重构

## 生成文件

以下文件为自动生成，不要手动编辑：

- `src/pages.json` — 页面路由配置
- `src/manifest.json` — uni-app manifest
- `src/types/` 下的 `auto-imports.d.ts`、`components.d.ts`、`uni-pages.d.ts`、`async-component.d.ts`、`async-import.d.ts`

如需调整自动生成的 API 代码，修改 `worma.config.js` 后运行 `pnpm api`。生成的接口代码位于 `src/apis/generated/`，其 `index.ts` 由配置中的自定义插件替换为项目现有 `http` 实例的再导出，接口函数会直接复用项目的 alova 请求层。

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_SERVER_BASEURL` | 后端 API 地址 |
| `VITE_UPLOAD_BASEURL` | 文件上传地址 |
| `VITE_AUTH_MODE` | 认证模式：`single`（单 token）/ `double`（双 token） |
| `VITE_APP_PROXY` | H5 是否启用代理 |
| `VITE_APP_PROXY_PREFIX` | 代理前缀（默认 `/api`） |
| `VITE_DELETE_CONSOLE` | 构建时是否移除 console |
| `VITE_TRACKER_ENABLE` | 埋点开关，`'true'` 启用 |
| `VITE_TRACKER_URL` | 埋点上报地址；为空时 dev 打印批次丢弃，prod 仅告警一次 |
| `VITE_TRACKER_BATCH_SIZE` | 埋点批量冲刷阈值，默认 `10` |
| `VITE_TRACKER_FLUSH_INTERVAL` | 埋点定时冲刷间隔 ms，默认 `5000` |

## Git 和工作区规则

- 保留用户已有改动，不要回滚无关文件。
- 工作区可能已有本地编辑器改动，尤其是 `.vscode/` 下的文件。
- 未经用户要求，不要执行提交、推送、建分支或暂存操作。
- 不要把依赖目录、构建产物、缓存文件加入提交。

## 交付前检查

完成改动后需要说明：

- 修改了哪些文件
- 为什么这样改
- 运行了哪些验证命令
- 如果没有运行验证，需要说明原因

文档类改动通常不需要构建；代码、配置、类型或样式相关改动应尽量运行对应检查。
