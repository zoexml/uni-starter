/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/utils/http';

import * as API from './types';

/** 获取便利店计划数据（一个月数据） */
export const masterMdStoreGetMdStoreCalender = (
  data?: API.MasterMdStoreGetMdStoreCalenderBody,
  config?: any
) => {
  return http.Post<API.MasterMdStoreGetMdStoreCalenderResponse>(
    '/Udx/Master/IMasterMdStoreService/GetMdStoreCalenderAsync',
    { ObjectData: data },
    config
  );
};

/** 根据计划id获取便利店计划详情 */
export const masterMdStoreGetMdStoreView = (
  data?: API.MasterMdStoreGetMdStoreViewBody,
  config?: any
) => {
  return http.Post<API.MasterMdStoreGetMdStoreViewResponse>(
    '/Udx/Master/IMasterMdStoreService/GetMdStoreViewAsync',
    { ObjectData: data },
    config
  );
};
