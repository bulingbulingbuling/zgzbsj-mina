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
        <canvas v-show="testing" type="2d" id="myCanvas" class="canvas " @tap="handleClick"></canvas>
        <div class="loadingMask" v-show="loading">
          <div class="wrap">
            <h3 class="title">生成中...</h3>
            <p>预计还有12秒</p>
          </div>
        </div>
      </div>
      <button id="bottom-btn" @click="handleBtnClick('album')">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>上传照片</h4>
      </button>
      <button id="bottom-btn" @click="handleBtnClick('camera')">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>拍摄</h4>
      </button>
      <button id="bottom-btn" @click="handleQuitClick">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>取消试用</h4>
      </button>
      <button id="bottom-btn" @click="handleDownClick">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>下载</h4>
      </button>
      <button id="bottom-btn" @click="handleQuitClick">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>分享</h4>
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
      testing: false,
      sourceType: [],
      TemplateFaceID: '',
      type: 1, // type 1 是每日免费的换脸次数。2 是奖励换脸次数 每天3次免费，2次奖励。
      loading: false,
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
    handleBtnClick(sourceType) {
      var query = wx.createSelectorQuery();
      this.currentFace = this.templateList[this.currentIndex]
      this.sourceType = [sourceType]
      const { faces, height: templateHeight, width: templateWidth } = this.currentFace
      if (faces.length) {
        this.testing = true
        setTimeout(() => {
          query.select('#myCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')
              const dpr = wx.getWindowInfo().pixelRatio
              // Canvas 2D（新接口）需要显式设置画布宽高，默认：300*150，最大：1365*1365
              const width = res[0].width
              const height = res[0].height
              canvas.width = width * dpr
              canvas.height = height * dpr
              ctx.scale(dpr, dpr)
              ctx.fillStyle = 'rgba(0, 0, 0, .5)'
              ctx.fillRect(0, 0, width, height)
              faces.forEach(element => {
                const { X, Y, Height, Width } = element.FaceRect
                const WScale = width / templateWidth
                const HScale = height / templateHeight
                element.range = {
                  XRange: [X * WScale, X * WScale + Width * WScale],
                  YRange: [Y * HScale, Y * HScale + Height * HScale]
                }
                ctx.clearRect(X * WScale, Y * HScale, Width * WScale, Height * HScale)
              });
            })
        }, 80)
      } else {
        this.loading = true
        this.chooseImg()
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
            this.loading = true
            this.TemplateFaceID = element.TemplateFaceID
            this.chooseImg()
          } else {
            this.handleQuitClick()
          }
        });
      }
    },
    // 选择相册
    async chooseImg() {
      await uploadImage(this.sourceType).then(ImageURL => {
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
        } else {
          this.currentFace.ImageURL = ImageURL
          this.changeFace()
        }
      }).catch(err => {
        if (err.errMsg.indexOf('cancel') > -1) {
          this.toast('取消选择')
        }
        this.loading = false
        this.testing = false
      })
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
      } else {
        const { ImageURL } = this.currentFace
        param.url = ImageURL
      }
      try {
        const res = await api.aiFaceChange(param)
        if (res.code === 0) {
          this.testing = false
          return
        }
        const { template_id, url, faces: resFaces } = res
        const TemplateFaceIArr = resFaces.map(item => item.TemplateFaceID)
        this.templateList = this.templateList.map(item => {
          if (item.template_id === template_id) {
            item.url = url
            if (item.faces) {
              item.faces.forEach((element) => {
                if (TemplateFaceIArr.includes(element.TemplateFaceID)) {
                  element.ImageURL = resFaces.filter(item => item.TemplateFaceID === element.TemplateFaceID)[0].ImageURL
                }
              })
            }
          }
          return item
        })
        this.loading = false
        this.handleQuitClick()
      } catch (e) {
        this.loading = false
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
