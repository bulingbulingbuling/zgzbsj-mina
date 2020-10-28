<template>
  <scroll-view class="container index-container" :scroll-y="!showVideo" @scroll="handleScroll">
    <div class="index-container-wrapper">
      <div class="header-wrapper">
        <img class="header" src="@/static/imgs/header.png" alt="">
        <div class="avatar-wrapper">
          <img class="avatar" :src="referrer_info.headimgurl" alt="">
          <p>{{referrer_info.nickname}}</p>
        </div>
        <p class="desc" v-html="referrer_info.text"></p>
      </div>
      <div class="content">
        <div class="con">
          <div class="title">当前班次仅剩<span>{{remainNum}}</span>个名额，预购从速！</div>
          <swiper class="list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500" v-if="recent_purchase.length > 0">
            <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
              <div class="item-wrapper" v-html="item">
              </div>
            </swiper-item>
          </swiper>
          <swiper v-show="showBottom" class="list-swiper fixed-list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500" v-if="recent_purchase.length > 0">
            <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
              <div class="item-wrapper" v-html="item">
              </div>
            </swiper-item>
          </swiper>
          <div class="time-sec" v-if="timer"><span class="text">限时特惠</span><div class="time-wrapper"><span>{{minute}}</span>:<span>{{second}}</span>:<span>{{millisecond}}</span></div></div>
          <img class="btn-img" src="@/static/imgs/btn.png" alt="" v-if="configData.mobile" @click="handleGetting" id="mid-btn">
          <button class="btn-img" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else id="mid-btn" :disabled="hasBtnClicked">
            <img src="@/static/imgs/btn.png" alt="">
          </button>
        </div>
        <div class="common-sec video-wrapper">
          <h3>小叶子智能陪练</h3>
          <swiper class="video-swiper" :circular="true" :indicator-dots="true" indicator-color="#bfbfbf" indicator-active-color="#ff867e" :autoplay="!showVideo" :interval="3000">
            <swiper-item v-for="(item, key) in 3" :key="key">
              <div class="item-wrapper">
                <img :src="require(`@/static/imgs/video${item}.png`)" alt="">
                <img v-show="key === 0" class="btn-play" src="@/static/imgs/btn-play.png" alt="" @click="playVideo">
              </div>
            </swiper-item>
          </swiper>
        </div>
        <div class="common-sec swiper-sec">
          <h3>看看大家怎么说</h3>
          <swiper class="video-swiper" :circular="true" :indicator-dots="true" previous-margin="120rpx" indicator-color="#bfbfbf" indicator-active-color="#ff867e" :autoplay="true" :interval="3000">
            <swiper-item v-for="(item, key) in 6" :key="key">
              <div class="item-wrapper">
                <img :src="require(`@/static/imgs/s${item}.png`)" alt="">
              </div>
            </swiper-item>
          </swiper>
        </div>
        <div class="common-sec qustion-sec">
          <h3>您最关注的问题</h3>
          <img src="@/static/imgs/question.png" alt="">
        </div>
        <div class="common-sec intro-sec">
          <h3>关于小叶子</h3>
          <img src="@/static/imgs/intro.png" alt="">
        </div>
      </div>
      <div class="bottom" v-show="showBottom">
        <p class="time" v-if="timer">剩余时间:{{minute}}:{{second}}:{{millisecond}}</p>
        <div class="img-wrapper">
          <div class="action" v-if="configData.mobile" @click="handleGetting">
            <img class="header" src="@/static/imgs/btn.png" alt="">
            <p class="text">仅剩{{remainNum}}个名额</p>
          </div>
          <button class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else>
            <img src="@/static/imgs/btn.png" alt="">
            <p class="text">仅剩{{remainNum}}个名额</p>
          </button>
        </div>
      </div>
      <div class="video-box" v-show="showVideo">
        <div class="video-box-wrapper">
          <video id="myVideo" class="myVideo" :src="videoUrl" controls></video>
          <img class="close" src="@/static/imgs/contact-close.png" alt="" @click="pauseVideo">
          <cover-image class="close" src="@/static/imgs/contact-close.png" @click="pauseVideo"/>
        </div>
      </div>
      <alert :isShow="showAlert" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" @login="register">
      </alert>
      <img class="contact" src="@/static/imgs/contact.png" alt="" @click="handleShowAlert('contact')">
    </div>
  </scroll-view>
</template>

<script>
import { api } from '@/api'
import Alert from '@/components/alert'

export default {
  data () {
    return {
      showAlert: false, // 是否显示弹窗
      store: this.$mp.app.globalData,
      videoUrl: 'https://static.xiaoyezi.com/videos/aipl/langngAIG.mp4',
      showVideo: false,
      minute: '9',
      second: '59',
      millisecond: '59',
      totalTime: 10 * 60 * 60,
      timer: '',
      windowHeight: '',
      showBottom: false,
      lastCall: 0,
      alertType: 'phone',
      remainNum: Math.floor(Math.random() * (30 - 20) + 20),
      configData: {},
      referrer_info: {
        ticket: '',
        nickname: '小叶子',
        text: '自从有了小叶子，孩子终于会主动练琴了，也帮你领取了社群限时福利，快来体验吧！',
        headimgurl: 'https://oss-ai-peilian-app.xiaoyezi.com/prod/thumb/87beab4d8f802088056038464e54cf49.jpeg'
      },
      recent_purchase: [], // 滚动列表
      isLogin: false,
      scene: '', // 通过小程序码进来
      source: '', // 记录小程序的入口
      btnDistance: '', // 购买按钮距离顶部的距离
      hasBtnClicked: false, // 购买是否已经点了。
      form: {}
    }
  },
  onLoad(options) {
    console.log(options, 'options')
    if (options.scene) {
      this.scene = options.scene
    } else if (options.source) {
      this.source = options.source
    }
    this.getMidBtnInfo()
  },
  onShow(options) {
    if (this.store.country_code) {
      this.form = {
        country_code: this.store.country_code,
        mobile: this.store.form.mobile,
        sms_code: this.store.form.sms_code
      }
      this.handleShowAlert('phone')
    }
    wx.onNetworkStatusChange((res) => {
      this.handleNetError(res)
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.windowHeight = res.windowHeight
    //   }
    // })
    this.videoContext && this.videoContext.seek(0)
  },
  onHide() {
    if (this.videoContext) {
      this.videoContext.pause()
    }
    this.form = {}
    this.store.country_code = ''
    this.showVideo = false
    this.showAlert = false
    clearInterval(this.timer)
    this.timer = null
  },
  onShareAppMessage() {
  },
  methods: {
    handleScroll(e) {
      this.showBottom = e.detail.scrollTop > this.btnDistance
    },
    catchTouchMove() {
      return false
    },
    getMidBtnInfo() {
      wx.createSelectorQuery().select('#mid-btn').boundingClientRect((rect) => {
        this.btnDistance = rect.height + rect.top
      }).exec()
    },
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getConfig()
      }
    },
    handleShowAlert(type) {
      this.alertType = type
      this.showAlert = true
    },
    countDown() {
      if (this.totalTime >= 1) {
        --this.totalTime
        let m = Math.floor(this.totalTime / 60 / 60)
        let s = Math.floor(this.totalTime / 60 % 60)
        let ms = Math.floor(this.totalTime % 60)
        this.minute = m > 9 ? m : '0' + m
        this.second = s > 9 ? s : '0' + s
        this.millisecond = ms > 9 ? ms : '0' + ms
      } else {
        clearInterval(this.timer)
      }
    },
    playVideo() {
      this.showVideo = true
      if (!this.videoContext) {
        this.videoContext = wx.createVideoContext('myVideo')
      }
      this.videoContext.play()
    },
    pauseVideo() {
      this.videoContext.pause()
      this.showVideo = false
    },
    closeAlert() {
      this.showAlert = false
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      if (this.hasBtnClicked) return
      this.hasBtnClicked = true
      if (detail.encryptedData) {
        this.hasBtnClicked = false
        this.register({
          iv: detail.iv,
          encrypted_data: detail.encryptedData
        })
      } else {
        this.hasBtnClicked = false
        this.handleShowAlert('phone')
      }
    },
    // 获取首页数据
    async getConfig() {
      this.loading()
      this.configData = await api.getIndexData({
        scene: this.scene,
        source: this.source
      })
      this.referrer_info = this.configData.referrer_info
      this.recent_purchase = this.configData.recent_purchase
      if (this.configData.first_flag) {
        this.remainNum = Math.floor(Math.random() * (30 - 20) + 20)
        this.timer = setInterval(this.countDown, parseFloat(1000 / 60))
      } else {
        this.remainNum = 1
      }
      this.loading(false);
    },
    handleGetting() {
      if (this.configData.had_purchased) {
        this.go('/pages/success')
      } else {
        this.createBill()
      }
    },
    async createBill(uuid, open_id) {
      uuid = uuid || this.configData.uuid
      open_id = open_id || this.configData.openid
      this.loading()
      try {
         let res = await api.createBill({
          uuid,
          open_id
        })
        let { timeStamp, nonceStr, package: p, signType, paySign } = res.params.credential.wx_lite
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: p,
          signType,
          paySign,
          success: () => {
            this.getStatus(res.bill.id)
          },
          fail: () => {
          }
        })
      } catch (e) {
      } finally {
        this.isLogin = false
        this.loading(false);
      }
    },
    async getStatus(bill_id) {
      this.loading()
      let res = await api.getBillStatus({
        bill_id
      })
      if (res.bill_status === '1') {
        this.go('/pages/success?success=true')
      }
      this.loading(false);
    },
    // 手机号注册
    async register(param) {
      param.referrer = this.referrer_info.ticket
      param.scene = this.scene,
      param.source = this.source
      this.isLogin = true
      this.loading()
      try {
        const data = await api.register(param)
        if (data.had_purchased) {
          return this.go('/pages/success')
        }
        if (data.uuid) {
          await this.createBill(data.uuid, data.openid)
        }
      } catch (e) {
      } finally {
        this.isLogin = false
        this.loading(false)
      }
    }
  },
  components: {
    Alert
  }
}
</script>
