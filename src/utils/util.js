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
export const uploadImage = () => {
  return new Promise(resolve => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles.tempFilePath)
        console.log(res.tempFiles.size)
        resolve(res)
      }
    })
  })
}
/**
 * dataURL 转成 blob
 * @param dataURL
 * @return blob
 */
export function dataURL2blob(dataURL) {
  let binaryString = atob(dataURL.split(',')[1]);
  let arrayBuffer = new ArrayBuffer(binaryString.length);
  let intArray = new Uint8Array(arrayBuffer);
  let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
  for (let i = 0, j = binaryString.length; i < j; i++) {
    intArray[i] = binaryString.charCodeAt(i);
  }
  let data = [intArray];
  let result;
  try {
    result = new Blob(data, { type: mime });
  } catch (error) {
    window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder;
    if (error.name === 'TypeError' && window.BlobBuilder) {
      // eslint-disable-next-line
      var builder = new BlobBuilder();
      builder.append(arrayBuffer);
      // eslint-disable-next-line
      result = builder.getBlob(type);
    } else {
      throw new Error('没救了');
    }
  }
  return result;
}
/**
 * 创建新的URL 对象表示指定的 File 对象或 Blob 对象。
 * @param {string} dataURL  base64
 */
export function dataURL2ObjUrl(dataURL) {
  window.URL = window.URL || window.webkitURL
  if (window.URL && URL.createObjectURL) {
    // dataURL2blob 此方法需额外定义
    var blob = dataURL2blob(dataURL)
    return URL.createObjectURL(blob)
  }
  return dataURL
}
export function submitToOss({ ofile, type = 'referral_activity' }) {
  return api.getOssConfig(type).then((res) => {
    let token = localStorage.getItem('token') || ''
    const name = md5(`${ofile}${Date.now()}${token}`);
    const type = ofile.type.substring(ofile.type.indexOf('/') + 1)
    const folder = `/${name}.${type}`;
    const url = window.location.protocol + '//' + res.host
    const formData = new FormData()
    formData.append('policy', res.policy);
    formData.append('OSSAccessKeyId', res.accessid);
    formData.append('callback', res.callback);
    formData.append('signature', res.signature);
    formData.append('success_action_status', 200);
    formData.append('key', res.dir + folder);
    formData.append('name', name.substring(0, 8));
    formData.append('file', ofile);
    const uploadData = {
      url,
      formData
    }
    return api.uploadToOss(uploadData).then((oss_result) => {
      if (oss_result.status === 'Ok') {
        return res.dir + folder
      }
    })
  }).catch((e) => {
    console.error(e)
  })
}
