import Vue from 'vue';

export default {
  install() {
    Vue.prototype.loading = (loading = true) => {
      if (loading) {
        wx.showLoading({
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }, 15000);
      } else {
        wx.hideLoading();
      }
    };
  }
};
