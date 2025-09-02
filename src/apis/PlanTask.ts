/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/utils/http';

import * as API from './types';

/** 发布计划任务 */
export const masterTaskSave = (data?: API.MasterTaskSaveBody, config?: any) => {
  return http.Post<API.MasterTaskSaveResponse>(
    '/Udx/Master/IMasterTaskService/SaveAsync',
    { ObjectData: data },
    config
  );
};
