import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG_FILE = path.resolve(__dirname, '../iconfont.config.mjs')

const defaultOptions = {
  url: '',
  base: '//at.alicdn.com/t/c/',
  css: true,
  symbol: true,
  distPath: './public',
  inject: true,
  dts: false,
  iconJson: false,
}

// interface Options {
//   base: string
//   url: string
//   symbol: boolean
//   css: boolean
//   distPath?: string
//   inject?: boolean
//   dts?: boolean | string
//   iconJson?: boolean | string
// }

// 1. 加载 iconfont 配置
async function loadUserConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('❌ 未找到 iconfont.config.mjs 配置文件')
    process.exit(1)
  }

  const configModule = await import(pathToFileURL(CONFIG_FILE).href)
  const userOptions = configModule.default || configModule

  return { ...defaultOptions, ...userOptions }
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`❌ 请求失败: ${url}, 状态码: ${res.statusCode}`))
      }

      const fileStream = fs.createWriteStream(outputPath)
      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close(() => resolve(outputPath))
      })
    }).on('error', reject)
  })
}

const getOutputFile = (filename, ext) => {
  return /\.\w+$/.test(filename) ? filename : `${filename}${ext}`
}

// 处理 CSS 文件内容的函数
const processCSSContent = (cssContent) => {
  const timestamp = `/* 自动处理于 ${new Date().toLocaleString()} */\n`
  // 1. 修复 URL 协议（精准匹配 alicdn 域名） // 2. 转换字体大小（精准定位.iconfont类）
  let processed = cssContent.replace(
    /url\(['"]?(\/\/at\.alicdn\.com\/[^'")]+)['"]?\)/g,
    (_, p1) => `url('https:${p1}')`,
  ).replace(
    /(\.iconfont\s*\{[^}]*font-size:\s*)16px([^}]*\})/g,
    '$132rpx$2',
  )

  // 3. 添加处理标记（保留原始注释，或追加到文件头部）
  const commentMatch = processed.match(/^(\/\*[\s\S]*?\*\/)(\s*\n)?/)
  if (commentMatch) {
    processed = processed.replace(commentMatch[0], `${commentMatch[0]}${timestamp}`)
  } else {
    processed = timestamp + processed
  }

  return processed
}

// 下载并处理 CSS 文件的异步函数
async function downloadAndProcessCSS(cssUrl, cssPath) {
  await downloadFile(cssUrl, cssPath) // 下载文件
  const cssContent = fs.readFileSync(cssPath, 'utf-8') // 读取 CSS 内容
  const processedCSS = processCSSContent(cssContent) // 处理 CSS 内容
  fs.writeFileSync(cssPath, processedCSS, 'utf-8') // 写回处理后的内容
}

// 2. 下载资源
async function downloadIconfontResources(options) {
  const { url, base, css, symbol, distPath } = options

  if (!url) {
    console.error('❌ iconfont 配置错误，缺少 url 字段')
    process.exit(1)
  }

  console.log('🎯 开始下载 Iconfont 资源...')
  // 下载 JS / CSS / 字体文件到 distPath
  const fullDistPath = path.resolve(process.cwd(), distPath)
  if (!fs.existsSync(fullDistPath)) {
    fs.mkdirSync(fullDistPath, { recursive: true })
  }

  const baseUrl = base.endsWith('/') ? base : `${base}/`
  const filename = url.replace(/^\.\/|\/$/g, '') // 去除开头 ./ 和结尾 /

  const tasks = []

  if (symbol) {
    const jsUrl = `https:${baseUrl}${filename}.js`
    const jsPath = path.join(fullDistPath, getOutputFile(options.filenames?.js || url, '.js'))
    tasks.push(downloadFile(jsUrl, jsPath))
  }

  if (css) {
    const cssUrl = `https:${baseUrl}${filename}.css`
    const cssPath = path.join(fullDistPath, getOutputFile(options.filenames?.css || url, '.css'))
    tasks.push(downloadAndProcessCSS(cssUrl, cssPath))
  }

  await Promise.all(tasks)
  console.log('✅ Iconfont 资源下载完成')
}

// 4. 主入口
async function main() {
  const options = await loadUserConfig()
  await downloadIconfontResources(options)
}

main()
