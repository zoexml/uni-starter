/* eslint-disable */
// @ts-ignore

/**
 * 该文件为插件自动生成，请勿随意修改。如需修改请通过配置 openapi-ts-request.config 进行定制化。
 */

import { http } from '@/http';

import * as API from './types';

/** 获取天气数据 参考https://open-meteo.com/en/docs/cma-api/ */
export const weatherGetOpenMeteo = (
  data?: API.WeatherGetOpenMeteoBody,
  config?: any
) => {
  return http.Post<API.WeatherGetOpenMeteoResponse>(
    '/Udx/Weather/IWeatherService/GetOpenMeteo',
    { ObjectData: data },
    config
  );
};
