import apiFn from './api';
import qs from 'qs'

export const baseApi = apiFn('base', process.env.VUE_APP_BASE_URL);
export const ossApi = apiFn('oss', process.env.VUE_APP_OSS_URL);

export const api = {
  // 获取首页数据
  async getIndexData({
    scene = '',
    source = ''
  } = {}) {
    return await baseApi.get('/referral_miniapp/landing/index', {
      scene,
      source
    });
  },
  // 注册和登录
  /*
    iv,
    encrypted_data,
    mobile,
    country_code,
    sms_code,
    referrer,
    scene,
    source,
    wx_code
  */
  async register(param) {
    return await baseApi.post('/referral_miniapp/landing/register', param);
  },
  // 转介绍 获取oss配置
  async getOssConfig(type = 'referral', upload_prefix) {
    return await ossApi.get(`/api/oss/signature`, {
      upload_prefix,
      type
    })
  },
  async uploadToOss({
    url,
    formData
  }) {
    return await ossApi.postOss(url, {
      data: formData
    });
  },
  // 获取模版列表
  async getTemplate() {
    return await baseApi.get('/referral_miniapp/template/list');
  },
  async aiFaceChange(param) {
    return await baseApi.post('/referral_miniapp/aiface/change', qs.stringify(param));
  },
  async resetTimes() {
    return await baseApi.post('/referral_miniapp/aitime/del');
  },
  async handleRest() {
    return await baseApi.post('/referral_miniapp/user/del');
  },
  async shareImage() {
    return await baseApi.post('/referral_miniapp/share_prize/make');
  }
}
