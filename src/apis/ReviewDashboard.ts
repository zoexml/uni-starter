/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 更新营销计划总结 */
export const masterMdShopUpdateSummary = (
  data?: API.MasterMdShopUpdateSummaryBody,
  config?: any
) => {
  return http.Post<API.MasterMdShopUpdateSummaryResponse>(
    '/Udx/Master/IMasterMdShopService/UpdateSummaryAsync',
    { ObjectData: data },
    config
  );
};

/** 根据ID获取计划总结详情 */
export const masterMdSummaryGetMdSummaryView = (
  data?: API.MasterMdSummaryGetMdSummaryViewBody,
  config?: any
) => {
  return http.Post<API.MasterMdSummaryGetMdSummaryViewResponse>(
    '/Udx/Master/IMasterMdSummaryService/GetMdSummaryViewAsync',
    { ObjectData: data },
    config
  );
};

/** 查询复盘列表 */
export const masterMdSummaryGetPageQueryMdSummary = (
  data?: API.MasterMdSummaryGetPageQueryMdSummaryBody,
  config?: any
) => {
  return http.Post<API.MasterMdSummaryGetPageQueryMdSummaryResponse>(
    '/Udx/Master/IMasterMdSummaryService/GetPageQueryMdSummaryAsync',
    { ObjectData: data },
    config
  );
};

/** 查看计划复盘 */
export const masterMdSummaryGetSummaryListByMd = (
  data?: API.MasterMdSummaryGetSummaryListByMdBody,
  config?: any
) => {
  return http.Post<API.MasterMdSummaryGetSummaryListByMdResponse>(
    '/Udx/Master/IMasterMdSummaryService/GetSummaryListByMdAsync',
    { ObjectData: data },
    config
  );
};

/** 新增/编辑 复盘计划总结 */
export const masterMdSummarySave = (
  data?: API.MasterMdSummarySaveBody,
  config?: any
) => {
  return http.Post<API.MasterMdSummarySaveResponse>(
    '/Udx/Master/IMasterMdSummaryService/SaveAsync',
    { ObjectData: data },
    config
  );
};
