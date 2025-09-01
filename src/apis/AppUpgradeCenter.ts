/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 获取最新版本资源包 */
export const packageGetPublished = (data?: any, config?: any) => {
  return http.Post<API.PackageGetPublishedResponse>(
    '/Udx/Admin/IPackageService/GetPublishedAsync',
    { ObjectData: data },
    config
  );
};

/** 分页查询App升级列表 */
export const packagePageQuery = (data?: any, config?: any) => {
  return http.Post<API.PackagePageQueryResponse>(
    '/Udx/Admin/IPackageService/PageQueryAsync',
    { ObjectData: data },
    config
  );
};

/** 新增或修改App版本信息 */
export const packageSave = (data?: API.PackageSaveBody, config?: any) => {
  return http.Post<API.PackageSaveResponse>(
    '/Udx/Admin/IPackageService/SaveAsync',
    { ObjectData: data },
    config
  );
};
