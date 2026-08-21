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
pnpm openapi                 # 根据 OpenAPI 配置生成接口代码
```

验证改动时，涉及组件/页面/类型的最小命令组合为 `pnpm type-check && pnpm lint`；尽量选择和改动范围匹配的最小命令组合。

## 目录结构

- `src/main.ts` / `src/App.vue` — 应用入口与根组件
- `src/pages/` — 主包页面
- `src/pages-business/` — 通用业务分包页面
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

通用业务分包目录为 `src/pages-business/`，在 `vite.config.ts` 的 `UniPages({ subPackages: ['src/pages-business'] })` 中注册。不要再新增或引用旧的 `src/pages-sub/` 目录。

### 状态管理

Pinia + `pinia-plugin-persistedstate`，使用 `uni.getStorageSync`/`uni.setStorageSync` 实现跨端持久化。

- `stores/user.ts` — 用户认证（token、userInfo、roles、permissions），支持权限判断 `hasPermission()`
- 新增 store 模块后需在 `stores/index.ts` 中 `export *` 以启用自动引入

### 请求层

基于 `alova` + `@alova/adapter-uniapp` + `alova/vue` 构建：

- 响应拦截器统一处理 HTTP 状态码和业务错误码（`{ code, message, data }` 格式），自动 `uni.showToast`
- Token 注入和刷新逻辑已预留但被注释，需对接真实后端后启用
- 所有页面 API 调用应使用 `http.get/post/put/delete` 或 alova hooks（`useRequest`、`usePagination` 等）

### 主题系统

- `src/composables/useTheme.ts` — `useTheme()` composable 控制主题色和明暗模式切换
- `src/styles/base.scss` — 应用级 CSS 语义色变量，例如 `--app-color-text`、`--app-color-border`、`--app-primary-soft`
- `src/App.ku.vue` — 通过 `wd-config-provider` 注入 Wot UI 主题变量
- 支持小程序和 H5 的 CSS 变量主题

### WebView 容器

- 页面入口：`src/pages-business/webview/index.vue`
- 统一逻辑入口：`src/composables/useWebView.ts`
- `useWebView.ts` 同时维护 WebView 页面路径、访问白名单、URL 构造、桥接 payload 校验和容器运行时状态，避免在 `utils` 和 `composables` 两处维护同一套逻辑。
- 所有外部 WebView 统一通过 `src/pages-business/webview/index.vue` 公共页面打开，不为单个链接新增页面。
- 页面跳转优先使用 `buildWebViewPageRoute({ title, url })` 配合 `uni-mini-router` 的 name 模式；无 router 上下文时可用 `openWebView({ title, url })`。当前页面路径常量为 `/pages-business/webview/index`。
- 访问控制通过 `DEFAULT_WEBVIEW_ACCESS_RULES` 配置；默认公共规则允许 HTTPS 链接，特定业务域名规则应放在通配规则之前。

### 分享/Share

- 统一分享封装：`src/composables/useShare.ts` — `useShare({ title, path?, query?, imageUrl? })` 注册 `onShareAppMessage`（转发卡片）与 `onShareTimeline`（朋友圈），`path` 缺省取当前页路径，`query` 自动拼接。
- 各页面 setup 内调用一次即可；`imageUrl` 缺省时微信自动使用页面截图，H5 上钩子为 no-op 天然降级。

### TabBar 策略

通过 `src/tabbar/config.ts` 控制，支持四种模式（详见 `TABBAR_STRATEGY_MAP`）：

1. `NO_TABBAR` — 无 TabBar
2. `NATIVE_TABBAR` — 原生 TabBar（当前使用）
3. `CUSTOM_TABBAR_WITH_CACHE` — 自定义 + 缓存
4. `CUSTOM_TABBAR_WITHOUT_CACHE` — 自定义无缓存

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

示例页面统一放在 `src/pages-business/example/` 分包（示例中心入口页 + `example/tracker` 埋点示例页 + `example/demo` 组件示例页，由 `example/index.vue` 汇总入口）。

## 内置组件与 composable

通用组件统一放在 `src/components/`，通过 `vite-plugin-uni-components` 自动引入，页面中直接使用组件名，无需手动 `import`。完整组件清单、props 与用法以 `src/components/README.md` 为准，不要在本文件重复维护组件列表。

已有 composable：

- `useTheme` — 主题色与明暗模式切换
- `useWebView` — WebView 容器统一逻辑（见「WebView 容器」）
- `useShare` — 统一分享卡片（见「分享/Share」）
- `useGlobalErrorHandling` — 全局错误处理
- `useTracker` / `useTrackPageView` — 埋点上报（见「埋点/Analytics」）

## 编码约定

- Vue SFC 使用 `<script setup lang="ts">`，块顺序：`<script>` → `<template>` → `<style>`
- 页面组件负责编排，可复用 UI 放 `src/components/`，可复用逻辑放 `src/composables/`
- 主包页面放 `src/pages/`，通用业务分包页面放 `src/pages-business/`
- Props 和 emits 必须类型明确
- SCSS 必须使用嵌套选择器（`&`），禁止平铺顶层类名
- 请求层复用现有 alova 模式，不引入新的 HTTP 客户端
- 平台差异逻辑优先复用 `src/utils/platform.ts`
- 跨页面或跨功能共享状态使用 Pinia；能用 `computed` 推导的状态不要重复存储
- 避免小需求做大重构

## 生成文件

以下文件为自动生成，不要手动编辑：

- `src/pages.json` — 页面路由配置
- `src/manifest.json` — uni-app manifest
- `src/types/` 下的 `auto-imports.d.ts`、`components.d.ts`、`uni-pages.d.ts`、`async-component.d.ts`、`async-import.d.ts`

如需调整自动生成的 API 代码，修改 `openapi-ts-request.config.ts` 后运行 `pnpm openapi`。

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
