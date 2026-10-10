# 更新日志

本文件记录 uni-starter 的版本更新记录，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-10-10

首个正式版本。模板基建与业务示例齐备，可直接作为新项目起点。

### ✨ Features | 新功能

- **登录注册**
  - 手机号验证码登录 / 注册，未注册手机号自动创建账号 ([104ce73](https://github.com/zoexml/uni-starter/commit/104ce73))
  - 微信授权登录
  - 微信一键手机号授权登录：新增 `AuthPhone` 授权弹窗组件与 `usePhoneAuth` composable，补齐 `PhoneAuthPayload` 类型、mock 实现与真实接口入口 ([2b3c3de](https://github.com/zoexml/uni-starter/commit/2b3c3de))
- **用户中心**：资料卡片、角色与权限码展示、`hasPermission` 权限判断、退出登录
- **业务分包页面**：关于我们、协议与条款（含富文本详情）、设置（主题色 / 清缓存 / 退出登录）、我的收藏、搜索（历史记录 + 热门关键词）([2cd5a4e](https://github.com/zoexml/uni-starter/commit/2cd5a4e))
- **自定义 tabbar**：策略切换为 `CUSTOM_TABBAR_WITH_CACHE`，基于 `wd-tabbar` 重写实现，新增「发现」「消息」两个 tab ([934826e](https://github.com/zoexml/uni-starter/commit/934826e))
- **首页重构**：登录态感知的问候区、四格快捷入口、内置能力清单 ([7c8bff4](https://github.com/zoexml/uni-starter/commit/7c8bff4))
- **请求层**：alova + 响应拦截统一处理状态码与业务错误码，token 注入与刷新逻辑预留
- **主题系统**：主题色切换与持久化、明暗模式、跟随 Wot UI 主题变量注入
- **埋点上报**：内存队列 + 批量冲刷 + 失败持久化重试，页面浏览自动上报
- **WebView 容器**：统一页面入口、域名白名单、桥接协议（`setTitle` / `close` / `navigate` / `share` / `getToken` / `getUserInfo` / `getEnv`）
- **统一分享**：`useShare` 注册转发卡片与朋友圈，H5 端天然降级
- **通用组件**：ActionSheet、ConfirmDialog、DatePicker、OptionPicker、TouchDialog、ExpandableText、GoodsCard、InformationCard、FloatingService、AuthPhone

### ♻️ Refactors | 重构

- 登录页视觉重设计：渐变品牌头部 + 悬浮表单卡片，移除导航栏标题，底部背景通栏铺满 ([104ce73](https://github.com/zoexml/uni-starter/commit/104ce73))
- 页面目录统一收敛为 `src/pages/main`（主包）+ `src/pages/business`（分包）两级，消除平级的 `pages-xxx` 目录 ([68135cb](https://github.com/zoexml/uni-starter/commit/68135cb))
- 抽出 `useLoginRedirect` 统一登录后回跳规则，供验证码登录与手机号授权登录共用 ([104ce73](https://github.com/zoexml/uni-starter/commit/104ce73))
- 首页、示例中心等页面改用语义色变量与卡片化布局，统一底部安全区留白

### 🐛 Fixes | 修复

- 登录回跳目标页增加路由白名单校验：旧链接、分享卡片或外部桥接传入的失效路径不再触发 `switchTab: page not found`，改为回退默认页 ([68135cb](https://github.com/zoexml/uni-starter/commit/68135cb))
- tabbar 切换与 WebView 内部跳转补充失败兜底，统一回退首页 ([68135cb](https://github.com/zoexml/uni-starter/commit/68135cb))
- `wd-icon` 的 `size` 静态属性会被 UnoCSS attributify 剥离，改用 `custom-style` 设置字号
- 自定义 tabbar 遮挡页面内容：新增 `--app-tabbar-height` 变量，各 tab 页根容器据此留出底部空间 ([934826e](https://github.com/zoexml/uni-starter/commit/934826e))

### 🔧 Chores | 工程

- 移除页面中 `useShare` 的手动导入，改用自动引入 ([930ace9](https://github.com/zoexml/uni-starter/commit/930ace9))
- 开启 pnpm `shamefullyHoist` 提升依赖兼容性 ([2cf4597](https://github.com/zoexml/uni-starter/commit/2cf4597))
- 「关于我们」页版本号改为读取 `package.json`，与 manifest 的 `versionName` / `versionCode` 同源

### ⚠️ Breaking Changes | 破坏性变更

- 页面路径全面调整：主包 `pages/index/index` → `pages/main/index/index`，其余 tab 页同理；原 `pages-business/*` 统一变为 `pages/business/*`。**升级已有分支时需同步修改 `homePage`、`tabbar` 的 `pagePath`、登录页与回跳路径等硬编码路径，并重新编译小程序产物** ([68135cb](https://github.com/zoexml/uni-starter/commit/68135cb))

### 📦 环境要求

- Node.js >= 22，包管理器固定为 pnpm（`preinstall` 钩子强制）

## [0.1.0]

早期模板基础版本：z-paging 接入、基础工具函数与 Loading 组件等。