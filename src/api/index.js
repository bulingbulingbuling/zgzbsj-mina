import apiFn from './api';
export const baseApi = apiFn('op', process.env.VUE_APP_OP_URL);

export const api = {
  // 获取首页数据
  async getIndexData({
    scene,
    source
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
  // 国际区号列表
  async getCountryCode() {
    return await baseApi.get('/referral_miniapp/landing/country_code');
  },
  // 购买下单
  async createBill({
    pay_channel = 23,
    uuid,
    pkg = 2,
    open_id,
    scene,
    source
  } = {}) {
    return await baseApi.post('/referral_miniapp/landing/create_bill', {
      pay_channel,
      uuid,
      pkg,
      open_id,
      scene,
      source
    });
  },
  // 订单状态
  async getBillStatus({
    bill_id
  } = {}) {
    return await baseApi.get('/referral_miniapp/landing/bill_status', {
      bill_id
    });
  },
  // 发送验证码
  async sendCode({
    mobile,
    country_code
  } = {}) {
    return await baseApi.get('/referral_miniapp/landing/send_sms_code', {
      mobile,
      country_code
    });
  },
  // 获取成功页海报
  async getPoster() {
    return await baseApi.get('/referral_miniapp/landing/buy_poster');
  },
  // 获取演奏分享数据
  async getPlayingData({
    scene
  } = {}) {
    return await baseApi.get('/referral_miniapp/landing/play_review', {
      scene
    });
  },
  async getBuyNames({
    scene,
    source
  } = {}) {
    return await baseApi.get('/referral_miniapp/landing/buy_name', {
      scene,
      source
    });
  }
}
