<template>
  <div class="container index-container">
    <div class="index-container-content">
      <img class="header" :src="bgUrl" alt="">
      <img class="desc" src="@/static/imgs/newIndex2/desc.png" alt="">
      <div class="swiper-wrapper" v-if="recent_purchase.length > 0">
        <img class="voice" src="@/static/imgs/newIndex2/voice.png" alt="">
        <swiper class="list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500">
          <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
            <div class="item-wrapper" v-html="item">
            </div>
          </swiper-item>
        </swiper>
      </div>
      <a class='rule-link' href='/pages/rules'>*智能陪练购买协议</a>
    </div>
    <div class="index-container-bottom">
      <div class="action" v-if="configData.mobile" @click="handleGetting('立即抢')">
        <img class="header" src="@/static/imgs/newIndex2/btn-get.png" alt="">
      </div>
      <button id="bottom-btn" class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
        <img src="@/static/imgs/newIndex2/btn-get.png" alt="">
      </button>
    </div>
    <div class='stay' v-show="showStay">
      <div class="stay-content">
        <img class="stay-content-retain" src="@/static/imgs/newIndex2/retain.png" alt="">
        <div class="stay-content-btngroup">
          <button class="btn close" @click="closeStay('拒绝')">
            <img src="@/static/imgs/newIndex2/btn-reject.png" alt="">
          </button>
          <button class="btn pay"  @click="handleContinue">
            <img src="@/static/imgs/newIndex2/btn-continue.png" alt="">
          </button>
        </div>
      </div>
    </div>
    <alert :isShow="showAlert" :isFree="showCents" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" @login="register">
    </alert>
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
      showStay: false, // 支付失败挽留弹窗
      store: this.$mp.app.globalData,
      configData: {},
      referrer_info: {},
      recent_purchase: [], // 滚动列表
      isLogin: false,
      scene: '', // 通过小程序码进来
      source: '', // 记录小程序的入口
      hasBtnClicked: false, // 购买是否已经点了。
      form: {},
      platform: '',
      bgUrl: '',
      imgPath: process.env.VUE_APP_IMG_PATH,
      shareScene: '', // 分享给他人的scen
      hasRejectLogin: false, // 是否拒绝登录过
      hasRejectPay: false, // 是否拒绝支付过
      rejectType: '',
      showCents: ''
    }
  },
  onLoad(options) {
    console.log(options, 'options')
    if (options.scene) {
      this.scene = options.scene
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
      this.handleShowAlert()
    }
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
    // 获取来源
    const { scene } = wx.getLaunchOptionsSync()
    this.share_type = scene
  },
  onHide() {
    this.form = {}
    this.store.country_code = ''
    this.showAlert = false
    this.hasBtnClicked = false
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      path: `/pages/index?scene=${this.shareScene}`
    }
  },
  methods: {
    catchTouchMove() {
      return false
    },
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getConfig()
        this.getBuyNames()
      }
    },
    handleShowAlert() {
      this.showAlert = true
    },
    closeAlert() {
      this.hasBtnClicked = false
      this.showAlert = false
      if (!this.hasRejectLogin) {
        this.showStay = true
        this.rejectType = 'login'
        track('ai_applet_retain_view', {
          ai_tel: '',
          retain_from: '未登陆挽留'
        });
        this.hasRejectLogin = true
      } 
    },
    closeStay() {
      this.showStay = false;
      track('ai_applet_retain_giveup_click');
    },
    handleContinue() {
      if (this.rejectType === 'login') {
        track('ai_applet_retain_giveup_click', {
          retain_from: '未登陆挽留'
        });
        this.handleShowAlert()
      } else {
        track('ai_applet_retain_giveup_click', {
          retain_from: '未支付挽留'
        });
        this.rejectType = 'pay'
        // 发起支付
        this.handleGetting('继续抢')
      }
    },
    handleBtnClick(e) {
      this.hasBtnClicked = true
      let content = '立即抢'
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
        this.handleShowAlert()
      }
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData({
        scene: this.scene,
        source: this.source
      })
      console.log('this.configData', this.configData);
      this.showCents = this.configData.pkg === 6
      this.bgUrl = this.showCents ? require('@/static/imgs/newIndex2/bg0.png') : require('@/static/imgs/newIndex2/bg99.png')
      this.referrer_info = this.configData.referrer_info
      this.shareScene = this.configData.share_scene
      this.store.mobile = this.configData.mobile
      if (this.referrer_info.uuid) {
        this.sa.registerApp({
          referrer_uuid: this.referrer_info.uuid
        });
      }
      if (this.configData.staff) {
        this.sa.registerApp({
          staff_uuid: this.configData.staff.uuid
        });
      }
      if (this.configData.scene_data.c) {
        this.sa.registerApp({
          channel_id: this.configData.scene_data.c
        });
      }
      if (this.configData.scene_data.a) {
        this.sa.registerApp({
          activity_id: this.configData.scene_data.a
        });
      }
      if (this.configData.scene_data.p) {
        this.sa.registerApp({
          poster_id: this.configData.scene_data.p
        });
      }
      if (this.configData.scene_data.user_current_status_zh) {
        this.sa.registerApp({
          user_code_status: this.configData.scene_data.user_current_status_zh
        });
      }
      this.sa.registerApp({
        share_type: this.share_type
      });
      // 0是注册用户即未付费，2是体验用户，3是年卡用户 根据sub_end_date(卡过期日期)判断是否过期
      let user_status_num = this.configData.subscribe_status
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let day = date.getDate().toString().padStart(2, '0')
      let dateString = `${year}${month}${day}`
      if (this.configData.subscribe_status === 2 && dateString / 1 > this.configData.sub_end_date / 1) {
        user_status_num = '21'
      }
      if (this.configData.subscribe_status === 3 && dateString / 1 > this.configData.sub_end_date / 1) {
        user_status_num = '31'
      }
      this.sa.registerApp({
        referrer_amount: this.configData.pkg === 6 ? 0 : 9.9
      });
      this.sa.setProfile({
        ai_phoneNumber: this.configData.mobile,
        ai_open_id: this.configData.openid,
        ai_uuid: this.configData.uuid,
        ai_applet_user_status: user_status_num ? this.user_status_map[user_status_num] : '',
        ai_applet_usersignin_status: this.configData.mobile ? '已登录' : '未登录'
      });
      track('$pageview', {
        $title: '首页',
        $url: 'pages/index',
        visit_time: new Date().toLocaleDateString()
      });
    },
    // 获取首页数据
    async getBuyNames() {
      this.recent_purchase = await api.getBuyNames()
    },
    handleGetting(content) {
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      if (this.configData.had_purchased || (this.store.had_purchased && this.configData.mobile)) {
        this.go('/pages/success')
      } else {
        this.showStay = false;
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
          open_id,
          pkg: this.configData.pkg,
          scene: this.scene,
          source: this.source
        })
        if (this.showCents) {
          this.store.had_purchased = true;
          this.go('/pages/success?success=true')
          return
        }
        let { timeStamp, nonceStr, package: p, signType, paySign } = res.data.credential.wx_lite
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: p,
          signType,
          paySign,
          success: () => {
            track('ai_applet_99pay_queren_click');
            this.store.had_purchased = true;
            this.go('/pages/success?success=true')
          },
          fail: () => {
            this.form = {}
            this.store.country_code = ''
            this.showAlert = false
            this.getConfig()
            this.store.had_purchased = false;
          },
          cancel: () => {
            console.log('stay')
            track('ai_applet_99pay_x_click', {
              ai_tel: this.store.mobile
            });
            if (!this.hasRejectPay) {
              this.showStay = true
              this.rejectType = 'pay'
              track('ai_applet_retain_view', {
                ai_tel: this.store.mobile,
                retain_from: '未支付挽留'
              });
              this.hasRejectPay = true
            }
          }
        })
      } catch (e) {
      } finally {
        this.isLogin = false;
        this.showStay = false;
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
        this.shareScene = data.share_scene
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
