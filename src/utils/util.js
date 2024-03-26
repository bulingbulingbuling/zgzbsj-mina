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
