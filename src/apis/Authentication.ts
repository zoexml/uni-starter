/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 获取用户openId */
export const authGetOpenId = (data?: API.AuthGetOpenIdBody, config?: any) => {
  return http.Post<API.AuthGetOpenIdResponse>(
    '/Udx/Admin/IAuthService/GetOpenIdAsync',
    { ObjectData: data },
    config
  );
};

/** 用户名登录 */
export const authLogin = (data?: API.AuthLoginBody, config?: any) => {
  return http.Post<API.AuthLoginResponse>(
    '/Udx/Admin/IAuthService/LoginAsync',
    { ObjectData: data },
    config
  );
};

/** 注销账号 */
export const authLogout = (data?: any, config?: any) => {
  return http.Post<API.AuthLogoutResponse>(
    '/Udx/Admin/IAuthService/LogoutAsync',
    { ObjectData: data },
    config
  );
};

/** 刷新token */
export const authRefreshToken = (data?: any, config?: any) => {
  return http.Post<API.AuthRefreshTokenResponse>(
    '/Udx/Admin/IAuthService/RefreshTokenAsync',
    { ObjectData: data },
    config
  );
};

/** 获取用户的权限 */
export const ruleGetUserPermission = (
  data?: API.RuleGetUserPermissionBody,
  config?: any
) => {
  return http.Post<API.RuleGetUserPermissionResponse>(
    '/Udx/Admin/IRuleService/GetUserPermission',
    { ObjectData: data },
    config
  );
};

/** 获取验证码 */
export const smsSendVerifyCode = (
  data?: API.SmsSendVerifyCodeBody,
  config?: any
) => {
  return http.Post<API.SmsSendVerifyCodeResponse>(
    '/Udx/Admin/ISmsService/SendVerifyCode',
    { ObjectData: data },
    config
  );
};

/** 更新用户设备cid */
export const userVerifyApp = (data?: API.UserVerifyAppBody, config?: any) => {
  return http.Post<API.UserVerifyAppResponse>(
    '/Udx/Admin/IUserService/VerifyAppAsync',
    { ObjectData: data },
    config
  );
};
