import Vue from 'vue';

export default {
  install() {
    Vue.prototype.Storage = {
      get(key) {
        return wx.getStorageSync(key);
      },
      set(key, value) {
        wx.setStorageSync(key, value);
      },
      clear() {
        wx.clearStorage();
      }
    };
  }
};
