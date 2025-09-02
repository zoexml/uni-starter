/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/utils/http';

import * as API from './types';

/** 根据id查询笔记详情 */
export const masterReviewGetReviewView = (
  data?: API.MasterReviewGetReviewViewBody,
  config?: any
) => {
  return http.Post<API.MasterReviewGetReviewViewResponse>(
    '/Udx/Master/IMasterReviewService/GetReviewViewAsync',
    { ObjectData: data },
    config
  );
};

/** 获取复盘笔记列表 */
export const masterReviewQueryReview = (
  data?: API.MasterReviewQueryReviewBody,
  config?: any
) => {
  return http.Post<API.MasterReviewQueryReviewResponse>(
    '/Udx/Master/IMasterReviewService/QueryReviewAsync',
    { ObjectData: data },
    config
  );
};

/** 获取日历笔记 */
export const masterReviewReviewCalenderList = (
  data?: API.MasterReviewReviewCalenderListBody,
  config?: any
) => {
  return http.Post<API.MasterReviewReviewCalenderListResponse>(
    '/Udx/Master/IMasterReviewService/ReviewCalenderListAsync',
    { ObjectData: data },
    config
  );
};

/** 新增或编辑复盘笔记 */
export const masterReviewSave = (
  data?: API.MasterReviewSaveBody,
  config?: any
) => {
  return http.Post<API.MasterReviewSaveResponse>(
    '/Udx/Master/IMasterReviewService/SaveAsync',
    { ObjectData: data },
    config
  );
};

/** 笔记回复 */
export const masterReviewSaveReviewReply = (
  data?: API.MasterReviewSaveReviewReplyBody,
  config?: any
) => {
  return http.Post<API.MasterReviewSaveReviewReplyResponse>(
    '/Udx/Master/IMasterReviewService/SaveReviewReplyAsync',
    { ObjectData: data },
    config
  );
};
