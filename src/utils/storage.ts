/**
 * 本地缓存的读取与清理。
 *
 * 抽成共用方法的原因：设置页与「我的」页各自实现过一份清缓存，
 * 保留白名单还不一致（一个会把主题色、搜索历史、埋点待重试队列一起清掉），
 * 同一个功能两套行为。这里统一来源，两处都调用本文件。
 */

/**
 * 清缓存时保留的 key：
 * - `user`：user store 的持久化数据（登录态）
 * - `app-theme-primary-color`：主题色
 * - `search-history`：搜索页历史记录
 * - `tracker_queue`：埋点失败待重试队列
 */
export const PRESERVED_STORAGE_KEYS = ['user', 'app-theme-primary-color', 'search-history', 'tracker_queue']

/** 读取本地缓存占用，返回形如 `12KB` 的文本；失败时返回 `0KB` */
export const readStorageSize = (): string => {
  try {
    const { currentSize } = uni.getStorageInfoSync()
    return `${currentSize}KB`
  } catch {
    return '0KB'
  }
}

/**
 * 清理业务缓存，保留 {@link PRESERVED_STORAGE_KEYS} 中的 key。
 * @returns 被清理的 key 列表，调用方可用于提示或埋点
 * @throws storage 异常时抛出，由调用方决定如何提示
 */
export const clearAppCache = (): string[] => {
  const { keys } = uni.getStorageInfoSync()
  const clearedKeys = keys.filter(key => !PRESERVED_STORAGE_KEYS.includes(key))

  clearedKeys.forEach(key => uni.removeStorageSync(key))

  return clearedKeys
}
