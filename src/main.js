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
import './assets/css/AI.less';
// import { Button } from 'vant';

Vue.use(toast);
Vue.use(loading);
Vue.use(store);
// Vue.use(Button);

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
      'pages/index', // 首页
      'pages/aiHall', // ai展馆
      'pages/aiShare', // 生成结果
      'pages/productHall', // 新品展馆
      'pages/explain', // 活动说明
      'pages/prize', // 我的奖品
      'pages/shop', // 参与店铺
      'pages/rules' // 规则webview
    ],
    usingComponents: {
      'timer-comp': './native/timer-comp/index',
      'ec-canvas': './native/ec-canvas/ec-canvas'
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ededed',
      navigationBarTitleText: '中国珠宝官方合作平台',
      navigationBarTextStyle: 'black',
      backgroundColor: '#ededed'
    }
  }
};
