/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 获取通知数量 */
export const noticeGetMyNoticeCount = (data?: any, config?: any) => {
  return http.Post<API.NoticeGetMyNoticeCountResponse>(
    '/Udx/Admin/INoticeService/GetMyNoticeCountAsync',
    { ObjectData: data },
    config
  );
};

/** 获取我的通知 */
export const noticeGetMyNoticeList = (
  data?: API.NoticeGetMyNoticeListBody,
  config?: any
) => {
  return http.Post<API.NoticeGetMyNoticeListResponse>(
    '/Udx/Admin/INoticeService/GetMyNoticeListAsync',
    { ObjectData: data },
    config
  );
};

/** 设置为已读 */
export const noticeSetNoticeRead = (
  data?: API.NoticeSetNoticeReadBody,
  config?: any
) => {
  return http.Post<API.NoticeSetNoticeReadResponse>(
    '/Udx/Admin/INoticeService/SetNoticeReadAsync',
    { ObjectData: data },
    config
  );
};
