
<script>
import { baseApi, api } from '@/api';
export default {
  async onLaunch (options) {
    // 初始化token
    const token = this.Storage.get('token');
    if (token) {
      baseApi.setHeader('token', token);
    }
    this.globalData.launchOptions = options
    // 如果需要使用 openid 作为匿名 ID，请单独获取 openid 之后调用 sensors.setOpenid() 方法
    let res = await api.getIndexData()
    if (res.openid) {
      console.log('second_id openid');
    } else {
      // 如果获取 openid 失败，SDK 会以 UUID 作为匿名 ID 发数据
    }
    // 获取胶囊的详细信息
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        // 导航高度
        let statusBarHeight = res.statusBarHeight;
        // 胶囊距离顶部高度
        let navTop = menuButtonObject.top;
        // 胶囊按钮与右侧的距离 = windowWidth - right + 胶囊宽度(包括右边距离)
        let navObjWid = res.windowWidth - menuButtonObject.right + menuButtonObject.width;
        // 导航栏整体高度
        let navHeight = statusBarHeight + menuButtonObject.height + (navTop - statusBarHeight) * 2;
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.navObj = menuButtonObject.height; // 胶囊高度
        this.globalData.navObjWid = navObjWid;
        // 设置title的距离（这个只是文字顶部到了位置，还要将title向上移动自己50%高度）
        this.globalData.headerHeight = navTop + menuButtonObject.height / 2;
        this.globalData.statusBarHeight = statusBarHeight;
      },
      fail(err) {
        console.log(err);
      }
    })
    wx.loadFontFace({
      global: true,
      scopes: ['webview', 'native'],
      family: 'FZLanTingHei-R-GBK',
      source: 'url("https://cjewel.oss-cn-shanghai.aliyuncs.com/%E5%85%B0%E4%BA%AD%E9%BB%91%20GBK.TTF")',
      success: console.log
    })
  },
  globalData () {
    return {
      launchOptions: {},
      mobile: '',
      province_id: '',
      parent_id: '',
      city_id: '',
      synthesisUrl: '',
      navHeight: '',
      navTop: '',
      navObj: null,
      navObjWid: '',
      headerHeight: '',
      statusBarHeight: ''
    }
  }
}
</script>
