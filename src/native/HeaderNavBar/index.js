const app = getApp()
Component({
  externalClasses: [],
  properties: {
    title: {
      type: String,
      value: ''
    },
    needBack: {
      type: Boolean,
      value: true
    },
    hasHeight: {
      type: Boolean,
      value: true
    },
    isTransparent: {
      type: String,
      value: ''
    }
  },
  data: {
    navHeight: '',
    store_name: 'biaoti',
    navObj: '',
    navTop: '',
    navObjWid: ''
  },
  pageLifetimes: {
    show() {}
  },
  lifetimes: {
    attached() {
      setTimeout(() => {
        const { navHeight, navObj, navTop, navObjWid } = app.globalData
        // 兼容单独链接打开
        if (!navHeight) {
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
              this.setData({
                navHeight,
                navObj: menuButtonObject.height,
                navTop,
                navObjWid
              })
            },
            fail(err) {
              console.log(err);
            }
          })
        }
        this.setData({
          navHeight,
          navObj,
          navTop,
          navObjWid
        })
        console.log('attached')
      })
    },
    detached() {
    }
  },
  methods: {
    handleBack() {
      wx.navigateBack()
    }
  }
})
