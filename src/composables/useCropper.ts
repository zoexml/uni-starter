// Image cropper composable — adapted from diy-mini/components/cropper
// Refactored to TypeScript with uni-app Canvas 2D API
//
// Usage:
//   const cropper = useCropper('#my-canvas')
//   cropper.loadImage(imageUrl)           // load an image
//   cropper.getCroppedRegion()            // => { x, y, w, h } (in original image coords)

import { nextTick, reactive, ref } from 'vue'

// #region Types

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface Point {
  x: number
  y: number
}

interface ImageSize {
  width: number
  height: number
}

// #endregion

// #region Utilities

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// Get system info for pixel ratio
function getPixelRatio(): number {
  // #ifdef MP-WEIXIN || MP-QQ
  try {
    const sysInfo = uni.getSystemInfoSync()
    return (sysInfo as any).pixelRatio || 2
  } catch {
    return 2
  }
  // #endif
  // #ifndef MP-WEIXIN || MP-QQ
  return (typeof window !== 'undefined' ? window.devicePixelRatio : 2) || 2
  // #endif
}

// #endregion

export function useCropper(selector: string) {
  // Reactive state
  const ready = ref(false)
  const imageSrc = ref('')
  const rotate = ref(0)
  const canvasSize = reactive<{ width: number, height: number }>({ width: 375, height: 250 })
  const imgOriginalSize = reactive<ImageSize>({ width: 500, height: 500 })
  const selectRect = reactive<Rect>({ x: 0, y: 0, w: 375, h: 250 })
  const touchActive = ref(false)
  let cursorIndex = 8

  // Internal state (non-reactive for performance)
  let dpr = 2
  let canvas: any = null
  let ctx: any = null
  let img: any = null
  let scaleW = 1
  let scaleH = 1
  let touchStartPoint: Point = { x: 0, y: 0 }

  // #region Mouse position calculations

  function getMouseRects(x: number, y: number, w: number, h: number): [number, number, number, number][] {
    return [
      [x, y, 15, 15],
      [x + w - 15, y, 15, 15],
      [x + w - 15, y + h - 15, 15, 15],
      [x, y + h - 15, 15, 15],
      [x + 15, y, w - 15, 15],
      [x + w - 15, y + 15, 15, h - 15],
      [x + 15, y + h - 15, w - 15, 15],
      [x, y + 15, 15, h - 15],
      [x + 15, y + 15, w - 15, h - 15],
    ]
  }

  function getOperatePoints(x: number, y: number, w: number, h: number): [number, number, number, number][] {
    return [
      [x, y, 8, 8],
      [x + w - 8, y, 8, 8],
      [x + w - 8, y + h - 8, 8, 8],
      [x, y + h - 8, 8, 8],
    ]
  }

  // #endregion

  // #region Canvas drawing

  function drawCoverLayer() {
    ctx.save()
    ctx.fillStyle = 'rgba(80, 80, 80, 0.6)'
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
    ctx.globalCompositeOperation = 'source-atop'
    ctx.restore()
  }

  function drawImage(clear = true) {
    if (!img) return

    if (clear) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)
    }

    let cw = canvasSize.width
    let ch = canvasSize.height

    ctx.save()
    ctx.globalCompositeOperation = 'destination-over'
    ctx.translate(cw / 2, ch / 2)
    ctx.rotate((Math.PI / 180) * rotate.value)
    if (rotate.value % 180 !== 0) {
      ;[cw, ch] = [ch, cw]
    }
    ctx.translate(-cw / 2, -ch / 2)
    ctx.drawImage(img, 0, 0, cw, ch)
    ctx.restore()
  }

  function drawSelect(x: number, y: number, w: number, h: number) {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    drawCoverLayer()

    // Clear selection area
    ctx.save()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.clearRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)

    // Draw drag handles
    const points = getOperatePoints(x, y, w, h)
    for (const rect of points) {
      ctx.save()
      ctx.fillStyle = '#fff'
      ctx.fillRect(...rect)
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(...rect)
      ctx.restore()
    }

    ctx.restore()
    drawImage(false)
  }

  // #endregion

  // #region Image loading & sizing

  function calcScale() {
    let iw = imgOriginalSize.width
    let ih = imgOriginalSize.height

    if (rotate.value % 180 !== 0) {
      ;[iw, ih] = [ih, iw]
    }

    const initCvsW = getInitCanvasWidth()
    const initCvsH = getInitCanvasHeight()

    if (iw < initCvsW && ih < initCvsH) {
      scaleW = 1
      scaleH = 1
      return
    }

    scaleW = initCvsW / iw
    scaleH = initCvsH / ih
  }

  function getInitCanvasWidth(): number {
    try {
      const { windowWidth } = uni.getSystemInfoSync()
      return windowWidth - 50
    } catch {
      return 325
    }
  }

  function getInitCanvasHeight(): number {
    try {
      const { windowHeight } = uni.getSystemInfoSync()
      return windowHeight - 300
    } catch {
      return 500
    }
  }

  function calcCanvasSize() {
    const initCvsW = getInitCanvasWidth()
    const initCvsH = getInitCanvasHeight()

    let cw = Math.min(initCvsW, imgOriginalSize.width * scaleW)
    let ch = Math.min(initCvsH, imgOriginalSize.height * scaleH)

    if (rotate.value % 180 !== 0) {
      ;[cw, ch] = [ch, cw]
    }

    canvasSize.width = cw
    canvasSize.height = ch
    selectRect.x = 0
    selectRect.y = 0
    selectRect.w = cw
    selectRect.h = ch
    dpr = getPixelRatio()

    if (canvas) {
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.scale(dpr, dpr)
    }
  }

  // #endregion

  // #region Touch handling

  function getCursorIndex(px: number, py: number): number {
    const rects = getMouseRects(selectRect.x, selectRect.y, selectRect.w, selectRect.h)
    for (let i = 0; i < rects.length; i++) {
      const [rx, ry, rw, rh] = rects[i]
      if (px >= rx && px <= rx + rw && py >= ry && py <= ry + rh) {
        return i
      }
    }
    return 8
  }

  function applySelectChange(index: number, dx: number, dy: number): Rect {
    const s = { ...selectRect }
    switch (index) {
      case 0:
        s.x += dx
        s.y += dy
        s.w -= dx
        s.h -= dy
        break
      case 1:
        s.y += dy
        s.w += dx
        s.h -= dy
        break
      case 2:
        s.w += dx
        s.h += dy
        break
      case 3:
        s.x += dx
        s.w -= dx
        s.h += dy
        break
      case 4:
        s.y += dy
        s.h -= dy
        break
      case 5:
        s.w += dx
        break
      case 6:
        s.h += dy
        break
      case 7:
        s.x += dx
        s.w -= dx
        break
      case 8:
        s.x += dx
        s.y += dy
        break
    }
    return s
  }

  function clampRect(rect: Rect): Rect {
    rect.x = clamp(rect.x, 0, canvasSize.width)
    rect.y = clamp(rect.y, 0, canvasSize.height)
    rect.w = clamp(rect.w, 50, canvasSize.width)
    rect.h = clamp(rect.h, 50, canvasSize.height)
    if (rect.x + rect.w > canvasSize.width) rect.w = canvasSize.width - rect.x
    if (rect.y + rect.h > canvasSize.height) rect.h = canvasSize.height - selectRect.y
    return rect
  }

  // #endregion

  // #region Public API

  /**
   * Load an image into the cropper.
   * Must be called on mounted (after Canvas node is available).
   */
  async function loadImage(src: string): Promise<void> {
    imageSrc.value = src
    ready.value = false

    await nextTick()

    // #ifdef MP-WEIXIN || MP-QQ
    const query = uni.createSelectorQuery()
    const result: any = await new Promise((resolve) => {
      query.select(selector)
        .fields({ node: true, size: true }, () => {})
        .exec((res: any) => resolve(res[0]))
    })

    if (!result || !result.node) {
      console.error('[useCropper] Canvas node not found for selector:', selector)
      return
    }

    canvas = result.node
    ctx = canvas.getContext('2d')
    // #endif

    // #ifndef MP-WEIXIN || MP-QQ
    const el = document.querySelector(selector) as HTMLCanvasElement | null
    if (!el) {
      console.error('[useCropper] Canvas element not found for selector:', selector)
      return
    }
    canvas = el
    ctx = canvas.getContext('2d')
    // #endif

    if (!ctx) {
      console.error('[useCropper] Canvas 2D context unavailable')
      return
    }

    // Load image
    await new Promise<void>((resolve, reject) => {
      // #ifdef MP-WEIXIN || MP-QQ
      img = canvas.createImage()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
      // #endif

      // #ifndef MP-WEIXIN || MP-QQ
      img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
      // #endif
    })

    imgOriginalSize.width = img.width
    imgOriginalSize.height = img.height

    calcScale()
    calcCanvasSize()
    drawSelect(selectRect.x, selectRect.y, selectRect.w, selectRect.h)
    ready.value = true
  }

  /** Handle touch start event. */
  function onTouchStart(e: any) {
    if (!ready.value) return
    const touch = (e.touches || e.changedTouches)?.[0]
    if (!touch) return

    const { clientX, clientY } = touch
    let offsetLeft = 0
    let offsetTop = 0
    // #ifdef MP-WEIXIN || MP-QQ
    const target = (e.target as any) || {}
    offsetLeft = target.offsetLeft || 0
    offsetTop = target.offsetTop || 0
    // #endif
    // #ifndef MP-WEIXIN || MP-QQ
    const rect = (canvas as HTMLCanvasElement).getBoundingClientRect()
    offsetLeft = rect.left
    offsetTop = rect.top
    // #endif

    const px = clientX - offsetLeft
    const py = clientY - offsetTop

    touchStartPoint = { x: clamp(px, 0, canvasSize.width), y: clamp(py, 0, canvasSize.height) }
    cursorIndex = getCursorIndex(px, py)
    touchActive.value = true
  }

  /** Handle touch move event. */
  function onTouchMove(e: any) {
    if (!ready.value || !touchActive.value) return

    const touch = (e.touches || e.changedTouches)?.[0]
    if (!touch) return

    const { clientX, clientY } = touch
    let offsetLeft = 0
    let offsetTop = 0
    // #ifdef MP-WEIXIN || MP-QQ
    const target = (e.target as any) || {}
    offsetLeft = target.offsetLeft || 0
    offsetTop = target.offsetTop || 0
    // #endif
    // #ifndef MP-WEIXIN || MP-QQ
    const rect = (canvas as HTMLCanvasElement).getBoundingClientRect()
    offsetLeft = rect.left
    offsetTop = rect.top
    // #endif

    const mx = clamp(clientX - offsetLeft, 0, canvasSize.width)
    const my = clamp(clientY - offsetTop, 0, canvasSize.height)

    const dx = mx - touchStartPoint.x
    const dy = my - touchStartPoint.y

    const newRect = applySelectChange(cursorIndex, dx, dy)
    const clamped = clampRect(newRect)

    Object.assign(selectRect, clamped)
    touchStartPoint = { x: mx, y: my }

    drawSelect(selectRect.x, selectRect.y, selectRect.w, selectRect.h)
  }

  /** Handle touch end event. */
  function onTouchEnd() {
    touchActive.value = false
  }

  /**
   * Get the cropped region in original image coordinates.
   * Returns { x, y, w, h } — coordinates and dimensions in the original image space.
   */
  function getCroppedRegion(): Rect {
    const { x, y, w, h } = selectRect
    return {
      x: Math.round(x / scaleW),
      y: Math.round(y / scaleH),
      w: Math.round(w / scaleW),
      h: Math.round(h / scaleH),
    }
  }

  /** Reset crop to full image. */
  function reset() {
    selectRect.x = 0
    selectRect.y = 0
    selectRect.w = canvasSize.width
    selectRect.h = canvasSize.height
    if (ready.value) {
      drawSelect(0, 0, canvasSize.width, canvasSize.height)
    }
  }

  /** Set rotation angle and re-render. */
  async function setRotate(angle: number) {
    rotate.value = angle % 360
    calcScale()
    calcCanvasSize()
    await nextTick()
    if (ready.value) {
      drawSelect(selectRect.x, selectRect.y, selectRect.w, selectRect.h)
    }
  }

  return {
    // State
    ready,
    imageSrc,
    rotate,
    canvasSize,
    selectRect,
    touchActive,

    // Methods
    loadImage,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getCroppedRegion,
    reset,
    setRotate,
  }
}
