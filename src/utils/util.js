import { api } from '@/api'
import md5 from 'md5'

export function shuffle(array) {
  let m = array.length
  let t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export function getImgInfo(url) {
  return new Promise(resolve => {
    wx.getImageInfo({
      src: url,
      success (res) {
        resolve({
          width: res.width + 'px'
        })
      }
    })
  })
}

// 防抖与节流
export const throttle = (fn, delay, isDebounce) => {
  var timer;
  var lastCall = 0;
  return (...args) => {
    if (isDebounce) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    } else {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      fn(...args);
    }
  };
};

export const getWxCode = () => {
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
export const uploadImage = (sourceType) => {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType,
      camera: 'back',
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 获取阿里云签名信息
        api.getOssConfig('source_pic').then((signatureRes) => {
          let key = tempFilePath.split('/')[tempFilePath.split('/').length - 1]
          const formData = {
            key: signatureRes.dir + key,
            policy: signatureRes.policy, // 包含失效时间和文件上传大小限制等信息
            OSSAccessKeyId: signatureRes.accessid, // AccessKey ID用于标识用户（后台接口提供）
            signature: signatureRes.signature, // AccessKey ID用于标识用户（后台接口提供）
            success_action_status: 200
          }
          const url = 'https://' + signatureRes.host
          wx.uploadFile({
            url: url, // 填写存储空间的访问域名，例如https://test.oss-cn-hangzhou.aliyuncs.com, 
            filePath: tempFilePath, // 待上传的本地资源路径（wx.chooseMedia获取到的临时路径）
            name: 'file', // 必须填file。
            formData: formData,
            success: (res) => {
              if (res.statusCode === 200) {
                resolve(signatureRes.dir + key)
              } else {
                return wx.showModal({
                  title: '提示',
                  content: '上传失败 请联系管理员',
                  showCancel: false
                })
              }
            }
          });
        })
      },
      fail(err) {
        reject(err)
        console.log(err);
      },
      finally(res) {
        resolve(res)
        console.log(res);
      }
    })
  })
}
