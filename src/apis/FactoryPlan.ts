/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/utils/http';

import * as API from './types';

/** 获取门店日历计划数据 */
export const masterMdShopGetMdShopCalender = (
  data?: API.MasterMdShopGetMdShopCalenderBody,
  config?: any
) => {
  return http.Post<API.MasterMdShopGetMdShopCalenderResponse>(
    '/Udx/Master/IMasterMdShopService/GetMdShopCalenderAsync',
    { ObjectData: data },
    config
  );
};

/** 根据MDID获取店长计划的营销计划 */
export const masterMdShopGetMdShopView = (
  data?: API.MasterMdShopGetMdShopViewBody,
  config?: any
) => {
  return http.Post<API.MasterMdShopGetMdShopViewResponse>(
    '/Udx/Master/IMasterMdShopService/GetMdShopViewAsync',
    { ObjectData: data },
    config
  );
};
