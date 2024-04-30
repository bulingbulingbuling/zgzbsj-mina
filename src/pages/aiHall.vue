<template>
  <div class="aiHall">
    <headerNavBar title="AI 互动"/>
    <div class="container">
      <h4 class="title">一键体验中华美学大片 试戴国潮珠宝新品</h4>
      <div class="index-container-content">
        <swiper
          circular
          layout-type="tinder"
          class="swiperWrap"
          :current="currentIndex"
          @change="swiperChange"
          id="swiper">
          <swiper-item v-for="item in templateList" :key="item.id" class="swiperItem">
            <image mode="aspectFit" class="template" :src="item.url" />
          </swiper-item>
        </swiper>
        <div class="swiperActions">
          <div class="prev" @click="handlePage('prev')" v-if="currentIndex > 0">
            <img mode="aspectFit" class="icon" src="@/static/imgs/prev.png" />
          </div>
          <div class="next" @click="handlePage('next')" v-if="currentIndex < templateList.length - 1">
            <img mode="aspectFit" class="icon" src="@/static/imgs/next.png" />
          </div>
        </div>
        <canvas v-show="testing" type="2d" id="myCanvas" class="canvas " @tap="handleClick"></canvas>
        <div class="loadingMask" v-show="loading">
          <div class="wrap">
            <img class="icon" src="@/static/imgs/loadingIcon.png" alt="" />
            <h3 class="title">生成中...</h3>
            <p>预计还有12秒</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="bottom-btn" @click="handleBtnClick('album')">
          <img class="albumIcon" src="@/static/imgs/album.png" alt="" />
          <h4>上传照片</h4>
        </button>
        <button class="bottom-btn" @click="handleBtnClick('camera')">
          <img class="cameraIcon" src="@/static/imgs/camera.png" alt="" />
          <h4>拍摄</h4>
        </button>
      </div>
      <div class="actions" v-if="hasChange">
        <div class="indexBtn" @click="handleDown('down')">
          <div class="content">
            <img class="icon" src="@/static/imgs/downIcon.png" alt="" />
            下载照片
          </div>
          <img class="btnImg" :src="`${activeBtn === 'down' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
        <div class="indexBtn" @click="handleShare('share')">
          <div class="content">
            <img class="icon" src="@/static/imgs/shareIcon.png" alt="" />
            分享有奖
          </div>
          <img class="btnImg" :src="`${activeBtn === 'share' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
      </div>
      <h4 class="remainTimes">今日剩余生成次数: {{ remainTimes }} 次</h4>
      <!-- <button id="bottom-btn" @click="handleResetTimes">
        <h4>重置次数</h4>
      </button> -->
      <div v-if="showTip" class="tipLine">选择人物进行脸部融合</div>
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

<config>
  {
    "navigationStyle": "custom"
  }
</config>

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
      prize: '',
      synthesisUrl: null,
      showDownModal: false,
      shareBaseQuery: '?x-oss-process=image/resize,m_fixed,w_553,h_735',
      downBaseQuery: '?x-oss-process=image/resize,m_fixed,w_786,h_1048',
      sharePositionQuery: 'g_south,y_288',
      downPositionQuery: 'g_center,voffset_-890',
      downBaseURL: 'https://cjewel.oss-cn-shanghai.aliyuncs.com/',
      shareBaseURL: 'https://cjewel.oss-cn-shanghai.aliyuncs.com/share_20240428.png',
      activeBtn: '',
      showTip: false,
      remainTimes: ''
    }
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      path: `/pages/index`,
      imageUrl: process.env.VUE_APP_SHARE_URL
    }
  },
  async created() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
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
    wx.setNavigationBarTitle({
      title: '一键生成属于你的AI中华美学大片'
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
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
    handlePage(mode) {
      if (mode === 'prev') {
        this.currentIndex = this.currentIndex === 0 ? 0 : this.currentIndex - 1
      } else {
        this.currentIndex = this.currentIndex === this.templateList.length - 1 ? this.templateList.length - 1 : this.currentIndex + 1
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
    drawRoundRect(ctx, x, y, width, height, radius, strokeColor, fillColor, lineWidth) {
      strokeColor = strokeColor || '#333';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
      ctx.lineTo(width - radius + x, y);
      ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
      ctx.lineTo(width + x, height + y - radius);
      ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2);
      ctx.lineTo(radius + x, height + y);
      ctx.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI);
      ctx.lineTo(x, y + radius);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.closePath();
    },
    handleBtnClick(sourceType) {
      if (!this.remainTimes) {
        return this.toast('今日已无剩余生成次数')
      }
      var query = wx.createSelectorQuery();
      this.currentFace = this.templateList[this.currentIndex]
      this.sourceType = [sourceType]
      const { faces, height: templateHeight, width: templateWidth } = this.currentFace
      if (faces.length) {
        this.testing = true
        this.showTip = true
        setTimeout(() => {
          this.showTip = false
        }, 1500)
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
              ctx.fillStyle = 'transparent'
              ctx.fillRect(0, 0, width, height)
              faces.forEach(element => {
                const { X, Y, Height, Width } = element.FaceRect
                const WScale = width / templateWidth
                const HScale = height / templateHeight
                element.range = {
                  XRange: [X * WScale, X * WScale + Width * WScale],
                  YRange: [Y * HScale, Y * HScale + Height * HScale]
                }
                this.drawRoundRect(ctx, X * WScale, Y * HScale, Width * WScale, Height * HScale, 10, 'rgba(143, 121, 84, 1)', 'rgba(255, 251, 244, 0.3)', 1)
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
      x = x - 20
      y = y - 160
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
      const baseQuery = isShare ? this.shareBaseQuery : this.downBaseQuery
      const pathAndQuery = `${path}${baseQuery}`
      const imageParamStr = btoa(decodeURIComponent(encodeURIComponent(pathAndQuery)))
      const synthesisUrlQuery = isShare ? `?x-oss-process=image/watermark,image_${imageParamStr},${this.sharePositionQuery}` : `${path}?x-oss-process=image/watermark,image_ZG93bmxvYWRfYnV0dG9tXzEucG5n,${this.downPositionQuery}`
      this.synthesisUrl = `${isShare ? this.shareBaseURL : this.downBaseURL}${synthesisUrlQuery}`
    },
    handleDown(activeBtn) {
      this.activeBtn = activeBtn
      setTimeout(() => {
        this.activeBtn = ''
      }, 1000)
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
        console.log(err)
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
        this.getRemainTimes()
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
      this.getRemainTimes()
    },
    async getRemainTimes() {
      const res = await api.getRemainTimes()
      this.remainTimes = res.time
    },
    async handleResetTimes() {
      api.resetTimes()
    },
    async handleShare(activeBtn) {
      this.activeBtn = activeBtn
      setTimeout(() => {
        this.activeBtn = ''
      }, 1000)
      const { url } = this.templateList[this.currentIndex]
      this.formatDownUrl(url, true)
      this.store.synthesisUrl = this.synthesisUrl
      this.go('/pages/share')
    }
  }
}
</script>
