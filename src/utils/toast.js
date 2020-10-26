import Vue from 'vue';

export default {
  install() {
    Vue.prototype.toast = mes => {
      wx.showToast({
        title: mes,
        mask: true,
        icon: 'none',
        duration: 2000
      });
    };
  }
};
