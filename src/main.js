import App from './App'
import Vue from 'vue'
import VHtmlPlugin from '@megalo/vhtml-plugin'
import toast from './utils/toast';
import loading from './utils/loading';
import store from './utils/store';
import filters from './utils/filters'
import './assets/css/base.less';
import './assets/css/index.less';

Vue.use(toast);
Vue.use(loading);
Vue.use(store);

Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

// 页面跳转
Vue.prototype.go = url => {
  wx.navigateTo({
    url
  });
};

Vue.prototype.isEmpty = value => {
  return typeof value === 'undefined' || value === null
};

Vue.use(VHtmlPlugin)
const app = new Vue(App)

app.$mount()

export default {
  config: {
    // pages 的首个页面会被编译成首页
    pages: [
      'pages/index',
      'pages/address',
      'pages/success'
    ],
    usingComponents: {
      'timer-comp': './native/timer-comp/index'
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ededed',
      navigationBarTitleText: '小叶子智能陪练体验营',
      navigationBarTextStyle: 'black',
      backgroundColor: '#ededed'
    }
  }
}
