<template>
  <div class="container index-container">
    <div class="index-container-wrapper">
      <div class="header-wrapper">
        <img class="header" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/header.png" alt="">
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
          <swiper v-show="showBottom" class="list-swiper fixed-list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500">
            <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
              <div class="item-wrapper" v-html="item">
              </div>
            </swiper-item>
          </swiper>
          <timer-comp :isBottom="showBottom" v-if="showTimer"/>
          <img class="btn-img" src="@/static/imgs/btn.png" alt="" v-if="configData.mobile" @click="handleGetting('页中立即体验')" id="mid-btn">
          <button class="btn-img" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else id="mid-btn" :disabled="hasBtnClicked" @click="handleBtnClick">
            <img src="@/static/imgs/btn.png" alt="">
          </button>
        </div>
        <div class="common-sec girl-wrapper">
          <h3>孩子练琴那些坎儿</h3>
          <img src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/girl.png" alt="">
          <div class="video-sec">
            <img class="btn-play" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/btn-play.png" alt="" @click="playGirlVideo">
            <video id="girlVideo" class="girlVideo" :src="girlUrl" controls v-if="showGirlVideo" @play="pauseVideo('lang')" @fullscreenchange="handleFullscreenChange"></video>
          </div>
        </div>
        <div class="common-sec feature-wrapper">
          <h3>智能陪练三大核心</h3>
          <img class="header" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/feature.png" alt="">
        </div>
        <div class="common-sec lang-wrapper">
          <h3>郎朗亲测太准了</h3>
          <div class="video-sec">
            <img src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/lang.png" alt="">
            <img class="btn-play" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/btn-play.png" alt="" @click="playLangVideo">
            <video id="langVideo" class="myVideo" :src="langUrl" controls v-if="showLangVideo" @play="pauseVideo('girl')" @fullscreenchange="handleFullscreenChange"></video>
          </div>
        </div>
        <div class="common-sec swiper-sec">
          <h3>看看大家怎么说</h3>
          <swiper class="video-swiper" :circular="true" :indicator-dots="true" previous-margin="120rpx" indicator-color="#bfbfbf" indicator-active-color="#ff867e" :autoplay="true" :interval="3000">
            <swiper-item v-for="item in 6" :key="item">
              <div class="item-wrapper">
                <img :src="`https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/s${item}.png`" alt="">
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
        <div class="img-wrapper">
          <div class="action" v-if="configData.mobile" @click="handleGetting('页底立即体验')">
            <img class="header" src="@/static/imgs/btn.png" alt="">
            <p class="text">仅剩{{remainNum}}个名额</p>
          </div>
          <button id="bottom-btn" class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
            <img src="@/static/imgs/btn.png" alt="">
            <p class="text">仅剩{{remainNum}}个名额</p>
          </button>
        </div>
      </div>
      <alert :isShow="showAlert" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" @login="register">
      </alert>
      <img class="contact" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/contact.png" alt="" @click="handleShowAlert('contact')">
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import Alert from '@/components/alert'
import { track } from '@/utils/util'

export default {
  data () {
    return {
      showAlert: false, // 是否显示弹窗
      store: this.$mp.app.globalData,
      langUrl: 'https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/langngAIG.mp4',
      girlUrl: 'https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/compare.mp4',
      showBottom: false,
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
      form: {},
      showTimer: false,
      showLangVideo: false,
      showGirlVideo: false,
      top: '',
      platform: ''
    }
  },
  onLoad(options) {
    console.log(options, 'options')
    if (options.scene) {
      this.scene = options.scene
      // 第一版二维码参数格式
      // options.scene = '%26r%3DzkR2HDs%3D%26c%3D1220' 
      // 第二版二维码参数格式 
      // options.scene = 'UUX2WKF3Q%3D%3D%3D%261351%2611084'
      let scene = decodeURIComponent(options.scene)
      const match = scene.match(/c=(\d+)/)
      if (match) {
        this.sa.registerApp({
          channel_id: match[1]
        });
      } else {
        const params = scene.split('&')
        if (params.length > 0) {
          this.sa.registerApp({
            channel_id: params[1],
            activity_id: params[2]
          });
        }
      }
    } else if (options.source) {
      this.source = options.source
    }
  },
  onShow(options) {
    console.log(this.scene, this.store.country_code, 'onshow')
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
    wx.getSystemInfo({
      success: (res) => {
        this.platform = res.platform
      }
    })
  },
  onPageScroll(e) {
    this.showBottom = e.scrollTop > this.btnDistance
    this.top = e.scrollTop
  },
  onReady() {
    this.getMidBtnInfo()
  },
  onHide() {
    this.pauseVideo('girl')
    this.pauseVideo('lang')
    this.form = {}
    this.store.country_code = ''
    this.showAlert = false
    this.showTimer = false
    this.remainNum = 1
    this.hasBtnClicked = false
  },
  onShareAppMessage() {
    return {
      path: `/pages/index?scene=${this.scene}`
    }
  },
  methods: {
    handleFullscreenChange(e) {
      if (!e.detail.fullScreen && this.platform !== 'ios') {
        wx.pageScrollTo({
          scrollTop: Math.ceil(this.top)
        })
      }
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
    playLangVideo() {
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content: '郎朗视频播放',
        visit_time: new Date().toLocaleDateString()
      });
      this.pauseVideo('girl')
      this.showLangVideo = true
      if (!this.langVideoCtx) {
        this.langVideoCtx = wx.createVideoContext('langVideo')
      }
      this.langVideoCtx.play()
    },
    playGirlVideo() {
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content: '其他视频播放',
        visit_time: new Date().toLocaleDateString()
      });
      this.pauseVideo('lang')
      this.showGirlVideo = true
      if (!this.girlVideoCtx) {
        this.girlVideoCtx = wx.createVideoContext('girlVideo')
      }
      this.girlVideoCtx.play()
    },
    pauseVideo(type) {
      if (this.girlVideoCtx && type === 'girl') {
        this.girlVideoCtx.pause()
      }
      if (this.langVideoCtx && type === 'lang') {
        this.langVideoCtx.pause()
      }
    },
    closeAlert() {
      this.hasBtnClicked = false
      this.showAlert = false
    },
    handleBtnClick(e) {
      this.hasBtnClicked = true
      let content
      if (e.target.id === 'mid-btn') {
        content = '页中立即体验'
      } else {
        content = '页底立即体验'
      }
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      if (detail.encryptedData) {
        this.register({
          iv: detail.iv,
          encrypted_data: detail.encryptedData
        }, true)
      } else {
        track('$ai_applet_quxiao_click');
        this.handleShowAlert('phone')
      }
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData({
        scene: this.scene,
        source: this.source
      })
      this.referrer_info = this.configData.referrer_info
      this.recent_purchase = this.configData.recent_purchase
      this.store.mobile = this.configData.mobile
      if (this.referrer_info.uuid) {
        this.sa.registerApp({
          referrer_uuid: this.referrer_info.uuid,
        });
      }
      if (this.configData.staff) {
        this.sa.registerApp({
          staff_uuid: this.configData.staff.uuid,
        });
      }
      this.sa.setProfile({
        ai_phoneNumber: this.configData.mobile,
        ai_open_id: this.configData.openid,
        ai_uuid: this.configData.uuid
      });
      track('$pageview', {
        $title: '首页',
        $url: 'pages/index',
        visit_time: new Date().toLocaleDateString()
      });
      if (this.configData.first_flag) {
        this.remainNum = Math.floor(Math.random() * (30 - 20) + 20)
        this.showTimer = true
      } else {
        this.remainNum = 1
      }
    },
    handleGetting(content) {
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      if (this.configData.had_purchased || this.store.had_purchased) {
        this.go('/pages/success')
      } else {
        this.createBill()
      }
    },
    async createBill(uuid, open_id) {
      track('ai_applet_weixin_pay', {
        ai_tel: this.store.mobile
      });
      uuid = uuid || this.configData.uuid
      open_id = open_id || this.configData.openid
      try {
        let res = await api.createBill({
          uuid,
          open_id
        })
        let { timeStamp, nonceStr, package: p, signType, paySign } = res.data.credential.wx_lite
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: p,
          signType,
          paySign,
          success: () => {
            this.store.had_purchased = true
            this.go('/pages/success?success=true')
            // this.getStatus(res.bill.id)
          },
          fail: () => {
            this.form = {}
            this.store.country_code = ''
            this.showAlert = false
            this.getConfig()
          }
        })
      } catch (e) {
      } finally {
        this.isLogin = false
      }
    },
    async getStatus(bill_id) {
      let res = await api.getBillStatus({
        bill_id
      })
      if (res.bill_status === '1') {
        this.go('/pages/success?success=true')
      }
    },
    // 手机号注册
    async register(param, isAuth) {
      this.hasBtnClicked = false
      param.referrer = this.referrer_info.ticket
      param.scene = this.scene
      param.source = this.source
      // this.isLogin = true
      try {
        const data = await api.register(param)
        this.sa.setProfile({
          ai_phoneNumber: data.mobile,
          ai_open_id: data.openid,
          ai_uuid: data.uuid
        });
        if (isAuth) {
          track('ai_applet_shouquan_click', {
            ai_tel: data.mobile
          });
        } else {
          track('ai_applet_phone_fill', {
            ai_tel: data.mobile
          });
        }
        this.store.mobile = data.mobile
        if (data.had_purchased) {
          return this.go('/pages/success')
        }
        if (data.uuid) {
          await this.createBill(data.uuid, data.openid)
        }
      } catch (e) {
        this.isLogin = false
      }
    }
  },
  components: {
    Alert
  }
}
</script>
