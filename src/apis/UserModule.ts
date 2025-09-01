/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 更新手机号 */
export const authChangePhone = (
  data?: API.AuthChangePhoneBody,
  config?: any
) => {
  return http.Post<API.AuthChangePhoneResponse>(
    '/Udx/Admin/IAuthService/ChangePhoneAsync',
    { ObjectData: data },
    config
  );
};

/** 更新密码 */
export const userChangePassword = (
  data?: API.UserChangePasswordBody,
  config?: any
) => {
  return http.Post<API.UserChangePasswordResponse>(
    '/Udx/Admin/IUserService/ChangePasswordAsync',
    { ObjectData: data },
    config
  );
};

/** 忘记密码，找回 */
export const userForgetPassword = (
  data?: API.UserForgetPasswordBody,
  config?: any
) => {
  return http.Post<API.UserForgetPasswordResponse>(
    '/Udx/Admin/IUserService/ForgetPasswordAsync',
    { ObjectData: data },
    config
  );
};

/** 获取个人信息 */
export const userGet = (data?: API.UserGetBody, config?: any) => {
  return http.Post<API.UserGetResponse>(
    '/Udx/Admin/IUserService/GetAsync',
    { ObjectData: data },
    config
  );
};

/** 修改个人信息 */
export const userSave = (data?: API.UserSaveBody, config?: any) => {
  return http.Post<API.UserSaveResponse>(
    '/Udx/Admin/IUserService/SaveAsync',
    { ObjectData: data },
    config
  );
};

/** 获取员工关联的分组，门店，部门 */
export const masterUserGetGroupAndShopAndDeptListByUserId = (
  data?: API.MasterUserGetGroupAndShopAndDeptListByUserIdBody,
  config?: any
) => {
  return http.Post<API.MasterUserGetGroupAndShopAndDeptListByUserIdResponse>(
    '/Udx/Master/IMasterUserService/GetGroupAndShopAndDeptListByUserIdAsync',
    { ObjectData: data },
    config
  );
};

/** 获取用户在组织下的职位 */
export const masterUserGetUserModel = (data?: any, config?: any) => {
  return http.Post<API.MasterUserGetUserModelResponse>(
    '/Udx/Master/IMasterUserService/GetUserModelAsync',
    { ObjectData: data },
    config
  );
};
