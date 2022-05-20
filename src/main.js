import sa from 'sa-sdk-miniprogram';
import abtest from '@/utils/abtest.esm.min.js'
import App from './App';
import Vue from 'vue';
import VHtmlPlugin from '@megalo/vhtml-plugin';
import toast from './utils/toast';
import loading from './utils/loading';
import store from './utils/store';
import filters from './utils/filters';
import './assets/css/base.less';
import './assets/css/index.less';
import './assets/css/momentLanding.less';

Vue.use(toast);
Vue.use(loading);
Vue.use(store);

const server_url = process.env.VUE_APP_SENSOR_URL;

const url = process.env.VUE_APP_ABTEST_URL;

sa.setPara({
  server_url,
  name: 'sensors',
  autoTrack: {
    appLaunch: true,
    appShow: true,
    appHide: true,
    pageShow: true,
    pageShare: true,
    mpClick: true
  },
  show_log: true
});
sa.registerApp({
  project_name: 'ai转介绍小程序'
});
sa.usePlugin(abtest, {
  url
})

Vue.prototype.abtest = abtest;

Vue.prototype.sa = sa;

Object.keys(filters).forEach((item) => {
  Vue.filter(item, filters[item]);
});

// 页面跳转
Vue.prototype.go = (url) => {
  wx.navigateTo({
    url
  });
};

Vue.prototype.isEmpty = (value) => {
  return typeof value === 'undefined' || value === null;
};

Vue.use(VHtmlPlugin);
const app = new Vue(App);

app.$mount();

export default {
  config: {
    // pages 的首个页面会被编译成首页
    pages: [
      'pages/index',
      'pages/address',
      'pages/success',
      'pages/rules',
      'pages/momentLanding',
      'pages/playing/index',
      'pages/playing/success',
      'pages/playing/report',
      'pages/paySuccess'
    ],
    usingComponents: {
      'timer-comp': './native/timer-comp/index',
      'ec-canvas': './native/ec-canvas/ec-canvas'
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ededed',
      navigationBarTitleText: '小叶子智能陪练体验营',
      navigationBarTextStyle: 'black',
      backgroundColor: '#ededed'
    }
  }
};
