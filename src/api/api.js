const _ins = {};
const getCode = () => {
  return new Promise(resolve => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        }
      }
    })
  })
}
let lastParam;
const request = (url, params, method, header) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      mask: true
    });
    wx.request({
      url,
      data: params,
      method: method,
      header: header,
      success: async (res) => {
        wx.hideLoading();
        debugger
        if (res.data.code !== 0) {
          if (res.data.data.errors[0] && res.data.data.errors[0].err_no === 401) {
            const code = await getCode()
            const res = await request(url, { wx_code: code }, method, { token: '' })
            wx.setStorageSync('token', res.token);
            wx.setStorageSync('openid', res.open_id);
            // 设置下一次请求的header
            const baseApi = buildIns('base')
            baseApi.setHeader('token', res.token);
            const result = await request(url, lastParam, method, { token: res.token })
            resolve(result)
            return
          }
          let errMsg
          if (!res.data.data.errors[0]) {
            Object.keys(res.data.data.errors).forEach(errKey => {
              errMsg = res.data.data.errors[errKey][0].err_msg
            })
          }
          wx.showToast({
            title: errMsg || res.data.data.errors[0].err_msg + '',
            icon: 'none',
            duration: 2000
          });
          reject(new Error())
        } else {
          resolve(res.data.data);
        }
      },
      fail(res) {
        wx.hideLoading();
        reject(res)
      }
    });
  });
}
class Api {
  constructor(url) {
    this.url = url;
    this.header = {};
  }
  setHeader(key, value) {
    this.header[key] = value;
  }
  post(baseUrl, params) {
    const url = this.url + baseUrl;
    lastParam = params
    this.header['Content-Type'] = 'application/x-www-form-urlencoded'
    return request(url, params, 'post', this.header)
  }
  postOss(baseUrl, params) {
    const url = this.url + baseUrl;
    lastParam = params
    this.header['Accept'] = '*'
    return request(url, params, 'post', this.header)
  }
  get(baseUrl, params) {
    const url = this.url + baseUrl;
    lastParam = params
    return request(url, params, 'get', this.header)
  }
}

const buildIns = (name, url) => {
  let ins = null;
  if (_ins[name]) {
    ins = _ins[name];
  } else {
    ins = new Api(url);
    _ins[name] = ins;
  }
  return ins;
};

export default buildIns;
