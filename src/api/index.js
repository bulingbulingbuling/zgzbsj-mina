import apiFn from './api';
export const baseApi = apiFn('question', process.env.VUE_APP_BASE_URL);

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
    source
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
    open_id
  } = {}) {
    return await baseApi.post('/referral_miniapp/landing/create_bill', {
      pay_channel,
      uuid,
      pkg,
      open_id
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
  }
}
