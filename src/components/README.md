# 自定义组件使用说明

本目录存放项目通用组件。项目已通过 UniComponents 实现自动导入，页面里可以直接使用组件标签，不需要手动 `import`。

## 命名约定

- 组件目录使用大驼峰命名，例如 `ActionSheet`、`FloatingService`。
- 组件入口统一为 `index.vue`，例如 `src/components/ActionSheet/index.vue`。
- 使用时直接写组件名，例如 `<ActionSheet />`，不需要 `E` 前缀。
- 可复用 UI 放在 `src/components/`，页面只负责状态编排和业务衔接。

## 体验入口

启动微信小程序或 H5 后：

1. 进入首页。
2. 点击 `进入 demo 页`。
3. 在 `组件示例` 页面体验反馈组件、选择器、卡片、长文本和浮动客服。

## 组件清单

| 组件 | 用途 | 主要入口 |
| --- | --- | --- |
| `ActionSheet` | 底部操作面板 | `v-model`、`actions`、`select` |
| `ConfirmDialog` | 确认弹窗 | `v-model`、`confirm`、`cancel` |
| `DatePicker` | 年/月/日选择器 | `v-model`、`v-model:visible`、`confirm` |
| `ExpandableText` | 长文本展开收起 | `content`、`threshold`、`lines` |
| `FloatingService` | 可拖拽悬浮客服按钮 | `label`、`direction`、`snapToEdge`、`click` |
| `GoodsCard` | 商品卡片 | `item`、`click` |
| `InformationCard` | 资讯卡片 | `item`、`click` |
| `BannerSwiper` | 首页轮播图 | `banner`、`items`、`interval` |
| `Loading` | 居中加载动画 | 直接使用 |
| `Navbar` | Wot UI 导航栏封装 | `title`、`leftArrow` |
| `OptionPicker` | 单列选项选择器 | `v-model`、`v-model:visible`、`options` |
| `TouchDialog` | 可拖拽底部弹窗 | `visible`、`title`、`close` |

## ActionSheet

底部弹出的操作面板，适合上传方式、更多操作、危险操作确认前的入口选择。

```vue
<script setup lang="ts">
const visible = shallowRef(false)
const actions = [
  { name: '拍照上传', value: 'camera' },
  { name: '从相册选择', value: 'album' },
  { name: '删除当前文件', type: 'danger' as const, value: 'delete' },
]

const handleSelect = (item: { name: string }) => {
  uni.showToast({ icon: 'none', title: `选择了：${item.name}` })
}
</script>

<template>
  <wd-button @click="visible = true">
    打开操作面板
  </wd-button>
  <ActionSheet v-model="visible" title="上传材料" :actions="actions" @select="handleSelect" />
</template>
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `modelValue` | 是否显示，配合 `v-model` 使用 | 必填 |
| `actions` | 操作项数组，`name` 为展示文本 | 必填 |
| `title` | 面板标题 | `''` |
| `showCancel` | 是否显示取消按钮 | `true` |
| `cancelText` | 取消按钮文案 | `取消` |
| `closeOnOverlay` | 点击遮罩是否关闭 | `true` |

事件：

| 事件 | 说明 |
| --- | --- |
| `select` | 点击非禁用操作项后触发，参数为 `(item, index)` |
| `cancel` | 点击取消按钮后触发 |
| `close` | 面板关闭后触发 |

## ConfirmDialog

居中确认弹窗，适合删除、退出、二次确认等场景。

```vue
<ConfirmDialog
  v-model="confirmVisible"
  title="确认操作"
  message="确定继续执行？"
  @confirm="handleConfirm"
/>
```

支持默认插槽和 `title` 插槽，可替换标题和内容区域。

## DatePicker

底部日期选择器，支持 `day`、`month`、`year` 三种类型。

```vue
<DatePicker
  v-model="selectedDate"
  v-model:visible="datePickerVisible"
  title="选择日期"
  type="day"
  @confirm="handleDateConfirm"
/>
```

## OptionPicker

单列选项选择器，适合方案、分类、状态等轻量选择。

```vue
<OptionPicker
  v-model="selectedOption"
  v-model:visible="optionPickerVisible"
  title="选择方案"
  :options="[
    { label: '香港优才', value: 'hk' },
    { label: '高端人才通行证', value: 'top-talent' },
  ]"
  @confirm="handleOptionConfirm"
/>
```

`options` 支持字符串数组，也支持对象数组。对象数组默认读取 `label` 和 `value`，也可以通过 `labelKey`、`valueKey` 改字段名。

## FloatingService

可拖拽悬浮客服按钮。默认支持上下左右拖动，拖动结束后按位置自动吸附到左右边缘。

```vue
<FloatingService label="客服" @click="handleServiceClick" />
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `visible` | 是否显示 | `true` |
| `label` | 按钮文字 | `客服` |
| `icon` | 图标地址 | `/static/images/logo.svg` |
| `direction` | 拖拽方向：`all`、`vertical`、`horizontal`、`none` | `all` |
| `snapToEdge` | 拖动结束是否吸附边缘 | `true` |
| `edgeGap` | 距离屏幕边缘的间距，单位 px | `12` |
| `x` / `y` | 初始位置，单位 px | `620` / `760` |

事件：

| 事件 | 说明 |
| --- | --- |
| `click` | 未发生拖动时点击按钮触发 |
| `change` | 拖动结束后返回位置 |

## BannerSwiper

首页轮播图组件，数据由 `banner` 配置驱动。单图时显示为静态图，多图支持自动播放、循环和指示点；触摸轮播后自动播放暂停 5 秒恢复。

```vue
<BannerSwiper :banner="homepageConfig.banner" />
```

`banner` 结构：

| 字段 | 说明 |
| --- | --- |
| `enabled` | 是否启用轮播 |
| `items` | 轮播项数组，元素为 `{ image, link }`，`image` 为图片地址 |
| `interval` | 自动播放间隔，默认 `3000`ms |

点击轮播项时，`link` 以 `http(s)://` 开头会复用 WebView 容器打开外部链接；以 `/` 开头视为项目内页面路径，走 `uni.navigateTo`。

## TouchDialog

可拖拽的底部弹窗：手指向下拖动可关闭；向上拖过阈值后展开为近全屏并支持内容滚动。

```vue
<TouchDialog :visible="visible" title="标题" @close="visible = false">
  <template #subtitle>副标题</template>
  <template #content>内容</template>
</TouchDialog>
```

常用参数：

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `visible` | 是否显示 | `false` |
| `title` | 标题 | `''` |
| `expandThreshold` | 展开阈值（相对窗口高度的比例），拖过该值展开为全屏 | `0.35` |
| `initialRatio` | 展开后弹窗初始高度占窗口的比例 | `0.68` |

插槽：

| 插槽 | 说明 |
| --- | --- |
| `subtitle` | 标题下方的副标题区域 |
| `content` | 主体内容，展开后支持滚动 |

事件：

| 事件 | 说明 |
| --- | --- |
| `close` | 弹窗关闭后触发 |

## 展示组件

### GoodsCard

商品卡片，展示图片、标题、描述、价格和原价。

```vue
<GoodsCard :item="goodsItem" @click="handleGoodsClick" />
```

`item.title` 必填，其他字段可选：`id`、`image`、`desc`、`price`、`originPrice`。

### InformationCard

资讯卡片，展示标题、时间和封面图。

```vue
<InformationCard :item="informationItem" @click="handleInformationClick" />
```

`item.title` 必填，其他字段可选：`id`、`image`、`time`。

### ExpandableText

长文本折叠与展开。

```vue
<ExpandableText :content="longText" :threshold="80" :lines="3" />
```

当 `content.length > threshold` 时显示展开/收起按钮。

## 基础组件

### Navbar

Wot UI `wd-navbar` 的项目封装，默认开启顶部安全区、占位和固定定位。

```vue
<Navbar title="页面标题" :left-arrow="false" />
```

点击左侧返回箭头时默认调用 `uni.navigateBack()`。

### Loading

居中加载动画。

```vue
<Loading />
```
