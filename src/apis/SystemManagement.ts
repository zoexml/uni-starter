/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** sendMessage */
export const sendMessage = (data?: API.SendMessageBody, config?: any) => {
  return http.Post<API.SendMessageResponse>(
    '/sendMessage',
    { ObjectData: data },
    config
  );
};

/** 根据key获取ConfigOption信息 */
export const configCacheGetConfigOption = (
  data?: API.ConfigCacheGetConfigOptionBody,
  config?: any
) => {
  return http.Post<API.ConfigCacheGetConfigOptionResponse>(
    '/Udx/Admin/IConfigCacheService/GetConfigOptionAsync',
    { ObjectData: data },
    config
  );
};

/** 首页推荐 PlateConfig服务 */
export const plateConfigGet = (data?: API.PlateConfigGetBody, config?: any) => {
  return http.Post<API.PlateConfigGetResponse>(
    '/Udx/Admin/IPlateConfigService/GetAsync',
    { ObjectData: data },
    config
  );
};

/** 获取cos上传凭证 */
export const uploadTCosGetCredential = (data?: any, config?: any) => {
  return http.Post<API.UploadTCosGetCredentialResponse>(
    '/Udx/Admin/IUploadTCosService/GetCredential',
    { ObjectData: data },
    config
  );
};
