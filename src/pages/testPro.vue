<template>
  <div>
    <div class="container">
      <div class="index-container-content">
        <swiper
          circular
          layout-type="stackLeft"
          class="swiperWrap"
          :current="currentIndex"
          @change="swiperChange"
          id="swiper">
          <swiper-item v-for="item in templateList" :key="item.id" class="swiperItem">
            <image mode="aspectFit" class="template" :src="item.url" />
          </swiper-item>
        </swiper>
        <canvas v-show="testing" type="2d" id="myCanvas" class="canvas" @tap="handleClick"></canvas>
      </div>
      <button id="bottom-btn" @click="handleBtnClick">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>试用</h4>
      </button>
      <button id="bottom-btn" @click="handleQuitClick">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>取消试用</h4>
      </button>
      <button id="bottom-btn" @click="handleResetTimes">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>重置次数</h4>
      </button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import { uploadImage } from '@/utils/util'

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      isNetError: false,
      templateList: [],
      currentIndex: 0,
      currentFace: {},
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      indicatorDots: false,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      testing: false,
      TemplateFaceID: '',
      type: 2, // type 1 是每日免费的换脸次数。2 是奖励换脸次数 每天3次免费，2次奖励。
      btnUrl: `https://oss-ai-peilian-app.xiaoyezi.com/dev/abtest/ai_referral_mina/default-btn1.png`
    }
  },
  onShow(options) {
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    // 分享设置
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getTemplateList()
      }
    },
    onPosterChange (index) {
      console.log('onPosterChange to', index);
      this.currentIndex = index
      this.currentFace = this.templateList[index]
    },
    swiperChange(event) {
      this.currentIndex = event.detail.current
    },
    handleQuitClick() {
      this.testing = false
      this.currentFace = {}
    },
    handleBtnClick() {
      var query = wx.createSelectorQuery();
      this.testing = true
      this.currentFace = this.templateList[this.currentIndex]
      const { faces } = this.currentFace
      if (faces.length) {
        query.select('#myCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getWindowInfo().pixelRatio
            const width = res[0].width
            const height = res[0].height
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)
            ctx.fillStyle = 'rgba(0, 0, 0, .5)'
            ctx.fillRect(0, 0, width, height)
            faces.forEach(element => {
              const { X, Y, Height, Width } = element.FaceRect
              const WScale = width / 1485
              const HScale = height / 1980
              element.range = {
                XRange: [X * WScale, X * WScale + Width * WScale],
                YRange: [Y * HScale, Y * HScale + Height * HScale]
              }
              ctx.clearRect(X * WScale, Y * HScale, Width * WScale, Height * HScale)
            });
          })
      }
    },
    handleClick(event) {
      let { x, y } = event.detail
      x = x - 27.5
      y = y - 20
      const { faces } = this.currentFace
      if (faces.length) {
        faces.forEach(element => {
          if (x > element.range.XRange[0] && x < element.range.XRange[1] && y > element.range.YRange[0] && y < element.range.YRange[1]) {
            this.TemplateFaceID = element.TemplateFaceID
            this.chooseImg()
          }
        });
      }
    },
    // 获取手机号
    async chooseImg() {
      const ImageURL = await uploadImage()
      if (ImageURL) {
        const { faces } = this.currentFace
        const facesDate = []
        if (faces.length) {
          faces.forEach(element => {
            if (element.TemplateFaceID === this.TemplateFaceID) {
              element.ImageURL = ImageURL
              facesDate.push({ ...element })
            }
          });
          this.changeFace()
        }
      }
    },
    async changeFace() {
      let param = {}
      const { template_id } = this.currentFace
      param.template_id = template_id
      param.type = this.type
      const { faces } = this.currentFace
      if (faces.length) {
        param.faces = []
        faces.forEach(element => {
          if (element.ImageURL) {
            const { TemplateFaceID, ImageURL } = element
            param.faces.push({
              TemplateFaceID,
              ImageURL
            })
          }
        });
      }
      try {
        const res = await api.aiFaceChange(param)
        const { template_id, url } = res
        this.templateList = this.templateList.map(item => {
          if (item.template_id === template_id) {
            item.url = url
          }
          return item
        })
        this.handleQuitClick()
      } catch (e) {
        this.isLogin = false
      }
    },
    // 获取初始化数据
    async getTemplateList() {
      const res = await api.getTemplate()
      this.templateList = res.templates
    },
    async handleResetTimes() {
      api.resetTimes()
    }
  }
}
</script>
<style>
.container {
  padding-top: 30px;
}
.index-container-content {
  position: relative;
  height: 854rpx;
  width: 640rpx;
  margin: 0 auto;
}
.swiperWrap {
  height: 854rpx;
  width: 640rpx;
  margin: 0 auto;
}
.template {
  height: 854rpx;
  width: 640rpx;
}
.canvas {
  position: absolute;
  left: 0;
  top: 0;
  height: 854rpx;
  width: 640rpx;
}
</style>
