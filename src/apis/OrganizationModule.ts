/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 设置默认组织 */
export const authChangeOrg = (data?: API.AuthChangeOrgBody, config?: any) => {
  return http.Post<API.AuthChangeOrgResponse>(
    '/Udx/Admin/IAuthService/ChangeOrgAsync',
    { ObjectData: data },
    config
  );
};

/** 获取组织列表 */
export const orgGetMyOrgList = (data?: any, config?: any) => {
  return http.Post<API.OrgGetMyOrgListResponse>(
    '/Udx/Admin/IOrgService/GetMyOrgListAsync',
    { ObjectData: data },
    config
  );
};
