/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 任务评论/回复 */
export const masterTaskReplySave = (
  data?: API.MasterTaskReplySaveBody,
  config?: any
) => {
  return http.Post<API.MasterTaskReplySaveResponse>(
    '/Udx/Master/IMasterTaskReplyService/SaveAsync',
    { ObjectData: data },
    config
  );
};

/** 查询任务各类型及总数量 */
export const masterTaskGetTaskStatusCountList = (data?: any, config?: any) => {
  return http.Post<API.MasterTaskGetTaskStatusCountListResponse>(
    '/Udx/Master/IMasterTaskService/GetTaskStatusCountListAsync',
    { ObjectData: data },
    config
  );
};

/** 获取计划任务详情 */
export const masterTaskGetTaskView = (
  data?: API.MasterTaskGetTaskViewBody,
  config?: any
) => {
  return http.Post<API.MasterTaskGetTaskViewResponse>(
    '/Udx/Master/IMasterTaskService/GetTaskViewAsync',
    { ObjectData: data },
    config
  );
};

/** 获取待办任务（分页） */
export const masterTaskQueryMyToDoTask = (
  data?: API.MasterTaskQueryMyToDoTaskBody,
  config?: any
) => {
  return http.Post<API.MasterTaskQueryMyToDoTaskResponse>(
    '/Udx/Master/IMasterTaskService/QueryMyToDoTaskAsync',
    { ObjectData: data },
    config
  );
};

/** 执行看板获取任务列表（计划分组）新 */
export const masterTaskQueryMyToDoTaskByApp = (
  data?: API.MasterTaskQueryMyToDoTaskByAppBody,
  config?: any
) => {
  return http.Post<API.MasterTaskQueryMyToDoTaskByAppResponse>(
    '/Udx/Master/IMasterTaskService/QueryMyToDoTaskByAppAsync',
    { ObjectData: data },
    config
  );
};

/** 仅更新任务状态 */
export const masterTaskSaveStatus = (
  data?: API.MasterTaskSaveStatusBody,
  config?: any
) => {
  return http.Post<API.MasterTaskSaveStatusResponse>(
    '/Udx/Master/IMasterTaskService/SaveStatusAsync',
    { ObjectData: data },
    config
  );
};
