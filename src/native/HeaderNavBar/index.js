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
