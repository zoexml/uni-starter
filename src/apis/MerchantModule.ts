/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 获取分组下的部门 */
export const masterGroupGetDeptListByGroupId = (
  data?: API.MasterGroupGetDeptListByGroupIdBody,
  config?: any
) => {
  return http.Post<API.MasterGroupGetDeptListByGroupIdResponse>(
    '/Udx/Master/IMasterGroupService/GetDeptListByGroupIdAsync',
    { ObjectData: data },
    config
  );
};

/** 根据shopId 获取门店信息 */
export const masterShopGetShopView = (
  data?: API.MasterShopGetShopViewBody,
  config?: any
) => {
  return http.Post<API.MasterShopGetShopViewResponse>(
    '/Udx/Master/IMasterShopService/GetShopViewAsync',
    { ObjectData: data },
    config
  );
};

/** 获取公司内所有员工 */
export const masterShopShopUserListByCompany = (data?: any, config?: any) => {
  return http.Post<API.MasterShopShopUserListByCompanyResponse>(
    '/Udx/Master/IMasterShopService/ShopUserListByCompanyAsync',
    { ObjectData: data },
    config
  );
};

/** 获取员工所关联的分组 */
export const masterUserGetGroupListByUserId = (
  data?: API.MasterUserGetGroupListByUserIdBody,
  config?: any
) => {
  return http.Post<API.MasterUserGetGroupListByUserIdResponse>(
    '/Udx/Master/IMasterUserService/GetGroupListByUserIdAsync',
    { ObjectData: data },
    config
  );
};

/** 获取用户所拥有的门店 */
export const masterUserQueryShopList = (data?: any, config?: any) => {
  return http.Post<API.MasterUserQueryShopListResponse>(
    '/Udx/Master/IMasterUserService/QueryShopListAsync',
    { ObjectData: data },
    config
  );
};
