import type { GenerateServiceProps } from 'openapi-ts-request'
// import type { ITypeItem } from 'openapi-ts-request/dist/generator/type'
// import type { RequestOptions } from './src/utils/request'

// 映射 HTTP 方法到 http.xxx
const methodMap: Record<string, string> = {
  get: 'Get',
  post: 'Post',
  put: 'Put',
  delete: 'Delete',
  patch: 'Patch',
}

// tagName 映射表
const tagNameMap: Record<string, string> = {
  renzheng: 'Authentication',
  yonghumokuai: 'UserModule',
  dianchangjihua: 'FactoryPlan',
  fupanbiji: 'ReviewNote',
  bianlidianjihua: 'ConvenienceStorePlan',
  yingxiaojihua: 'MarketingPlan',
  appshengjizhongxin: 'AppUpgradeCenter',
  peizhizhongxin: 'ConfigCenter',
  tianqi: 'Weather',
  xitongguanli: 'SystemManagement',
  shanghumokuai: 'MerchantModule',
  jihuarenwu: 'PlanTask',
  renwumokuai: 'TaskModule',
  zuzhimokuai: 'OrganizationModule',
  shujumokuai: 'DataModule',
  tongzhifuwu: 'NotificationService',
  fupankanban: 'ReviewDashboard',
}

const re = /controller[-_ .](\w)/gi

export default [
  {
    serversPath: './src/apis',
    // full: false, // 是否全量替换, 建议第一次全量替换，后续增量替换
    apifoxConfig: {
      projectId: '4066605',
      apifoxToken: 'APS-iDWZgxMYZmWJvNjclH3K0r2GfgaKE49t',
      // 指定是否在标签字段中包含接口的目录名称, 不使用目录名称时, 则建议给每个接口添加标签, 以便生成的代码进行分类
      addFoldersToTags: true,
    },
    // 自定义网络请求函数路径
    requestImportStatement: `
/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from "@/http"
      `,

    hook: {
      // 自定义请求方法函数名称
      customFunctionName(data) {
        const { path, summary } = data

        if (!path) {
          console.warn('[Warning] no path', summary)
          return
        }
        const initFunName = path.split('/').filter(Boolean).slice(-2).map(segment => segment.replace(/^I/, '').replace(/Service/, '').replace(/Async$/, '')).join('')
        // 小驼峰
        return initFunName.replace(re, (_all, letter) => letter.toUpperCase())
      },

      customClassName(tagName) {
        // console.log('🚀 ~ customClassName ~ tagName:', tagName)
        return tagNameMap[tagName] || tagName
      },
      /**
       * 自定义类型生成
       * 服务端常见respond固定格式 ['code', 'message', 'data'], 我司['ObjectData', 'Successful', 'Code', 'Message']
       * 这里可以对类型进行修改
       */
      customType({ schemaObject, namespace, originGetType, schemas }) {
        if (schemaObject.type === 'object' && schemaObject.properties && schemaObject.properties.ObjectData) {
          schemaObject = schemaObject.properties.ObjectData
          // console.log('🚀 ~ customType ~ schemaObject:', schemaObject)
        }

        return originGetType(schemaObject, namespace, schemas)
      },
      // 自定义生成 serviceController 函数
      customTemplates: {
        serviceController: (item: any, _context) => {
          const { functionName, method, summary, body, response, path } = item
          const httpMethod = methodMap[method.toLowerCase()] || 'Post'

          // 添加空值检查
          const bodyType = body?.type || 'any'
          const responseType = response?.type || 'any'

          /** 自定义Post接口模板 */
          return `
/** ${summary} */
export const ${functionName} = (data?: ${bodyType}, config?: any) => {
  return http.${httpMethod}<${responseType}>(
    '${path}',
    {ObjectData: data},
    config
  )
}

                  `
        },

      },
    },

  },
] as GenerateServiceProps[]
