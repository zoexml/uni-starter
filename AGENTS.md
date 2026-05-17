# AGENTS.md

本文件用于给后续代码代理提供这个仓库的项目上下文、约束和交付规则。

## 项目概览

这是一个 uni-app 启动模板项目，主要技术栈包括：

- Vue 3
- TypeScript
- Vite
- Pinia
- UnoCSS
- Wot Design Uni
- alova
- z-paging
- uni-mini-router

请优先沿用项目已有技术栈和代码风格。除非用户明确要求，不要替换框架、包管理器、UI 组件库、路由方案或请求层。

## 环境要求

- Node.js: `>=22`
- 包管理器: `pnpm`
- pnpm 版本: `10.15.0`
- 安装依赖: `pnpm install`

项目通过 `preinstall` 脚本限制只能使用 pnpm。

## 常用命令

- `pnpm dev` 或 `pnpm dev:h5`: 启动 H5 开发
- `pnpm dev:mp-weixin`: 启动微信小程序开发
- `pnpm build`: 构建 H5
- `pnpm build:mp-weixin`: 构建微信小程序
- `pnpm type-check`: 执行 TypeScript/Vue 类型检查
- `pnpm lint`: 执行 ESLint 检查
- `pnpm lint:fix`: 执行 ESLint 自动修复
- `pnpm lint:stylelint`: 执行 Stylelint 自动修复
- `pnpm openapi`: 根据 OpenAPI 配置生成接口代码

验证时优先选择和改动范围匹配的最小命令。涉及共享逻辑、组件、页面或类型时，能运行的话至少执行 `pnpm type-check` 和 `pnpm lint`。

## 目录结构

- `src/main.ts`: 应用入口
- `src/App.vue`: 根组件
- `src/pages/`: 主包页面
- `src/pages-business/`: 通用业务分包页面
- `src/layouts/`: 布局组件
- `src/components/`: 通用组件
- `src/composables/`: 组合式逻辑
- `src/stores/`: Pinia 状态管理
- `src/router/`: 路由配置
- `src/apis/`: API 模块，部分文件可能由 OpenAPI 生成
- `src/utils/`: 通用工具函数
- `src/styles/`: 全局样式
- `src/static/`: uni-app 静态资源
- `src/tabbar/`: 自定义 tabbar
- `pages.config.ts`: 页面和分包配置
- `manifest.config.ts`: uni-app manifest 配置
- `vite.config.ts`: Vite 和 uni 插件配置
- `uno.config.ts`: UnoCSS 配置

## 编码约定

- Vue 单文件组件优先使用 Vue 3 Composition API 和 `<script setup lang="ts">`。
- SFC 代码块顺序保持为：`<script>`、`<template>`、`<style>`。
- 页面组件主要负责页面级编排和状态衔接；可复用 UI 放到 `src/components/`，可复用逻辑放到 `src/composables/`。
- WebView 相关页面放在 `src/pages-business/webview/`，相关常量、白名单、跳转构造和桥接逻辑统一维护在 `src/composables/useWebView.ts`，不要再拆到 `src/utils/webview.ts`。
- 组件的 props 和 emits 必须保持类型明确。
- 跨页面或跨功能共享状态使用 Pinia。能用 `computed` 推导的状态不要重复存储。
- 平台差异逻辑要尽量小且显式，优先复用 `src/utils/platform.ts` 中已有能力。
- 请求相关逻辑优先复用现有 alova、OpenAPI 和 `src/utils/http.ts` 模式，不要额外引入新的 HTTP 客户端。
- 样式优先遵循 `src/styles/`、`src/uni.scss` 和现有组件的写法。
- **所有页面的 SCSS 必须使用嵌套写法**，即用 `&` 和嵌套选择器组织样式，禁止在 style 块中使用平铺的顶层类名选择器。
- 不要在小需求中顺手做大范围重构。

## 生成文件和构建产物

除非任务明确要求处理生成结果，否则不要手动编辑生成文件或构建产物。

常见生成或构建相关路径包括：

- `node_modules/`
- `dist/`
- `src/pages.json`
- `auto-imports.d.ts`
- `components.d.ts`
- `uni-pages.d.ts`
- `async-component.d.ts`
- `async-import.d.ts`

如果需要调整 `src/apis/` 下的生成接口代码，优先修改 `openapi-ts-request.config.ts` 或源 OpenAPI 输入，然后运行 `pnpm openapi`。只有在用户明确要求小范围手动修补时，才直接改生成后的 API 文件。

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
