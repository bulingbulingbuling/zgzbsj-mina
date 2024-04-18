<template>
  <div class="aiHall">
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
      <button v-if="hasChange && !isAuthSavePhoto" @click="handleDown">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>下载</h4>
      </button>
      <!-- <button v-if="hasChange" open-type="share" @click="handleShare">
        <h4>分享</h4>
      </button> -->
      <button v-if="hasChange" @click="handleShare">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>分享</h4>
      </button>
      <button id="bottom-btn" @click="handleResetTimes">
        <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
        <h4>重置次数</h4>
      </button>
      <div class="alert" v-if="shareModal">
        <div class="mask"></div>
        <div class="alert-content">
          <button open-type="share">
            微信
          </button>
          <button id="bottom-btn" @click="handleQuitClick">
            <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
            <h4>朋友圈</h4>
          </button>
        </div>
      </div>
      <van-dialog v-model="showDownModal" title="标题" show-cancel-button>
        <img :src="synthesisUrl" class="downImg" />
      </van-dialog>
      <van-dialog
        use-slot
        title="下载预览"
        :show="showDownModal"
        show-cancel-button
        confirm-button-text="下载"
        confirm-button-open-type="getUserInfo"
        @close="handleClose"
        @getuserinfo="handleDownClick"
      >
        <div class="downImgWrap">
          <image mode="aspectFit" class="downImg" :src="synthesisUrl" />
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import { uploadImage } from '@/utils/util'
import { btoa } from '@/utils/base64'

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
      hasChange: false,
      shareModal: false,
      prize: '',
      synthesisUrl: null,
      showDownModal: false,
      downBaseURL: 'https://cjewel.oss-cn-shanghai.aliyuncs.com/download.png',
      shareBaseURL: 'https://cjewel.oss-cn-shanghai.aliyuncs.com/share.png',
      btnUrl: `https://oss-ai-peilian-app.xiaoyezi.com/dev/abtest/ai_referral_mina/default-btn1.png`
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: 'AI换脸'
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
  },
  onShow(options) {
    // 监听网络状态变化
    console.log('onShow')
    wx.onNetworkStatusChange((res) => {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.templateList[this.currentIndex].url
    }
  },
  onShareTimeline() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.templateList[this.currentIndex].url
    }
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
    swiperChange(event) {
      this.currentIndex = event.detail.current
      this.hasChange = this.templateList[event.detail.current].hasChange || false
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
        this.testing = false
        this.loading = true
        this.chooseImg()
      }
    },
    handleClick(event) {
      if (!this.testing) return
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
          }
        });
      }
    },
    formatDownUrl(url, isShare) {
      const originUrl = url.split('?')[0]
      const path = originUrl.split('com/')[1]
      const baseQuery = isShare ? '?x-oss-process=image/resize,m_fixed,w_200,h_278' : '?x-oss-process=image/resize,m_fixed,w_316,h_438'
      const pathAndQuery = `${path}${baseQuery}`
      const imageParamStr = btoa(decodeURIComponent(encodeURIComponent(pathAndQuery)))
      const synthesisUrlQuery = isShare ? `?x-oss-process=image/watermark,image_${imageParamStr},g_sw,y_116,x_92` : `?x-oss-process=image/watermark,image_${imageParamStr},g_south,y_116`
      this.synthesisUrl = `${isShare ? this.shareBaseURL : this.downBaseURL}${synthesisUrlQuery}`
    },
    handleDown() {
      const { url } = this.templateList[this.currentIndex]
      this.formatDownUrl(url)
      this.showDownModal = true
    },
    handleClose() {
      this.showDownModal = false
    },
    handleDownClick() {
      const that = this
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                that.savePhoto(that.synthesisUrl)
              }
            })
          } else {
            that.savePhoto(that.synthesisUrl)
          }
        }
      })
    },
    savePhoto(url) {
      const that = this
      wx.downloadFile({
        url,
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              that.toast('保存成功')
            },
            fail: function (err) {
              console.log(err);
              if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
                that.toast('用户拒绝授权，如需保存请手动设置打开授权')
              }
            }
          })
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    // 选择相册
    async chooseImg() {
      await uploadImage(this.sourceType).then(ImageURL => {
        const { faces } = this.currentFace
        if (faces.length) {
          faces.forEach(element => {
            if (element.TemplateFaceID === this.TemplateFaceID) {
              element.ImageURL = ImageURL
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
      const { template_id: currentFaceTemplateId } = this.currentFace
      param.template_id = currentFaceTemplateId
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
      await api.aiFaceChange(param).then(res => {
        const { template_id, url, faces: resFaces } = res
        const TemplateFaceIArr = resFaces.map(item => item.TemplateFaceID)
        this.templateList = this.templateList.map(item => {
          if (item.template_id === template_id) {
            item.url = url
            item.hasChange = true
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
        this.hasChange = true
        this.loading = false
        this.handleQuitClick()
      }).catch(err => {
        this.toast(err.errors.err_msg)
        this.testing = false
        this.loading = false
      })
    },
    // 获取初始化数据
    async getTemplateList() {
      const res = await api.getTemplate()
      this.templateList = res.templates
      // todo 上线钱删掉
      // this.hasChange = true
      // this.templateList[0].url = 'https://cjewel.oss-cn-shanghai.aliyuncs.com/aiface/11/1713438455.jpg?Expires=1713467257&OSSAccessKeyId=LTAI5tE1yB78c8ttb2AqaXEo&Signature=gceLfPBNQlxV6%2FuarMfKdmOxoGw%3D'
    },
    async handleResetTimes() {
      api.resetTimes()
    },
    async handleShare() {
      const { url } = this.templateList[this.currentIndex]
      this.formatDownUrl(url, true)
      this.store.synthesisUrl = this.synthesisUrl
      this.go('/pages/share')
    }
  }
}
</script>
