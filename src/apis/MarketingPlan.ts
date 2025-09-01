/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 预计审批流程 */
export const masterApproveExpectApproveList = (
  data?: API.MasterApproveExpectApproveListBody,
  config?: any
) => {
  return http.Post<API.MasterApproveExpectApproveListResponse>(
    '/Udx/Master/IMasterApproveService/ExpectApproveListAsync',
    { ObjectData: data },
    config
  );
};

/** 获取审批信息 */
export const masterApproveGetApproveModel = (
  data?: API.MasterApproveGetApproveModelBody,
  config?: any
) => {
  return http.Post<API.MasterApproveGetApproveModelResponse>(
    '/Udx/Master/IMasterApproveService/GetApproveModelAsync',
    { ObjectData: data },
    config
  );
};

/** 保存审批（通过，驳回，退回上一级） */
export const masterApproveSave = (
  data?: API.MasterApproveSaveBody,
  config?: any
) => {
  return http.Post<API.MasterApproveSaveResponse>(
    '/Udx/Master/IMasterApproveService/SaveAsync',
    { ObjectData: data },
    config
  );
};

/** 获取计划面板周数据 */
export const masterMdGetCalenderByWeekMd = (
  data?: API.MasterMdGetCalenderByWeekMdBody,
  config?: any
) => {
  return http.Post<API.MasterMdGetCalenderByWeekMdResponse>(
    '/Udx/Master/IMasterMdService/GetCalenderByWeekMdAsync',
    { ObjectData: data },
    config
  );
};

/** 获取月度计划相关的部门计划 */
export const masterMdGetMdListCalender = (
  data?: API.MasterMdGetMdListCalenderBody,
  config?: any
) => {
  return http.Post<API.MasterMdGetMdListCalenderResponse>(
    '/Udx/Master/IMasterMdService/GetMdListCalenderAsync',
    { ObjectData: data },
    config
  );
};

/** 根据id获取重点商品详情 */
export const masterMdGetMdSkuView = (
  data?: API.MasterMdGetMdSkuViewBody,
  config?: any
) => {
  return http.Post<API.MasterMdGetMdSkuViewResponse>(
    '/Udx/Master/IMasterMdService/GetMdSkuViewAsync',
    { ObjectData: data },
    config
  );
};

/** 查询计划详情（计划单号，店组，部门，计划周次，计划周期，本周主题，本周海报） */
export const masterMdGetMdView = (
  data?: API.MasterMdGetMdViewBody,
  config?: any
) => {
  return http.Post<API.MasterMdGetMdViewResponse>(
    '/Udx/Master/IMasterMdService/GetMdViewAsync',
    { ObjectData: data },
    config
  );
};

/** 获取全部行事历（后台根据门店id获取） */
export const masterShopCalendarGetShopCalendarList = (
  data?: API.MasterShopCalendarGetShopCalendarListBody,
  config?: any
) => {
  return http.Post<API.MasterShopCalendarGetShopCalendarListResponse>(
    '/Udx/Master/IMasterShopCalendarService/GetShopCalendarListAsync',
    { ObjectData: data },
    config
  );
};

/** 获取计划相关联的任务 */
export const masterTaskQueryTask = (
  data?: API.MasterTaskQueryTaskBody,
  config?: any
) => {
  return http.Post<API.MasterTaskQueryTaskResponse>(
    '/Udx/Master/IMasterTaskService/QueryTaskAsync',
    { ObjectData: data },
    config
  );
};
