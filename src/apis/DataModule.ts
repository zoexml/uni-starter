/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/utils/http';

import * as API from './types';

/** 获取报表list */
export const reportMenuPageQuery = (
  data?: API.ReportMenuPageQueryBody,
  config?: any
) => {
  return http.Post<API.ReportMenuPageQueryResponse>(
    '/Udx/Admin/IReportMenuService/PageQueryAsync',
    { ObjectData: data },
    config
  );
};

/** 获取报表数据 */
export const reportGetReportData = (
  data?: API.ReportGetReportDataBody,
  config?: any
) => {
  return http.Post<API.ReportGetReportDataResponse>(
    '/Udx/Data/IReportService/GetReportData',
    { ObjectData: data },
    config
  );
};

/** 获取报表定义 */
export const reportGetReportView = (
  data?: API.ReportGetReportViewBody,
  config?: any
) => {
  return http.Post<API.ReportGetReportViewResponse>(
    '/Udx/Data/IReportService/GetReportView',
    { ObjectData: data },
    config
  );
};

/** 获取公司所有部门 */
export const masterDeptGetDeptListByCompany = (data?: any, config?: any) => {
  return http.Post<API.MasterDeptGetDeptListByCompanyResponse>(
    '/Udx/Master/IMasterDeptService/GetDeptListByCompanyAsync',
    { ObjectData: data },
    config
  );
};

/** 获取公司所有的分组 */
export const masterGroupGroupListByCompany = (data?: any, config?: any) => {
  return http.Post<API.MasterGroupGroupListByCompanyResponse>(
    '/Udx/Master/IMasterGroupService/GroupListByCompanyAsync',
    { ObjectData: data },
    config
  );
};

/** 获取门店列表 */
export const masterShopGetShopList = (data?: any, config?: any) => {
  return http.Post<API.MasterShopGetShopListResponse>(
    '/Udx/Master/IMasterShopService/GetShopListAsync',
    { ObjectData: data },
    config
  );
};
