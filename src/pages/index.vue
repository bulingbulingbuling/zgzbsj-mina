<template>
  <div>
    <indexSys
      v-if="isSys === 1"
      :mobile="configData.mobile"
      :disabled="hasBtnClicked"
      @handleBtnClick="handleBtnClick"
      @handleGetting="handleGetting"
      @getphonenumber="getPhoneNumber" />
    <div class="container index-container" v-else-if="isSys === 2" :style="bgStyle">
      <div class="index-container-content">
        <img class="header" :src="bgUrl" alt="">
        <div class="swiper-wrapper" v-if="recent_purchase.length > 0">
          <img class="voice" :src="`${imgPath}/ai_mina/newIndex2/voice.png`" alt="">
          <swiper class="list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500">
            <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
              <div class="item-wrapper" v-html="item">
              </div>
            </swiper-item>
          </swiper>
        </div>
        <a class='rule-link' href='/pages/rules'>*智能陪练购买协议</a>
      </div>
      <div class="index-container-bottom" :style="btnStyle">
        <div class="action" v-if="configData.mobile" @click="handleGetting('立即抢')">
          <img class="header" :src="btnUrl" alt="">
        </div>
        <button id="bottom-btn" class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
          <img :src="btnUrl" alt="">
        </button>
      </div>
    </div>
    <div class='stay' v-show="showStay">
      <div class="stay-content">
        <img class="stay-content-retain" :src="`${imgPath}/ai_mina/newIndex2/retain.png`" alt="">
        <div class="stay-content-btngroup">
          <button class="btn close" @click="closeStay('拒绝')">
            <img :src="`${imgPath}/ai_mina/newIndex2/btn-reject.png`" alt="">
          </button>
          <button class="btn pay"  @click="handleContinue">
            <img :src="`${imgPath}/ai_mina/newIndex2/btn-continue.png`" alt="">
          </button>
        </div>
      </div>
    </div>
    <alert :isShow="showAlert" :isFree="showCents" :pkg="configData.pkg" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" :scene="scene" @login="register">
    </alert>
    <div class="changePkg" v-show="showChangePkg">
      <div class="mask"></div>
      <div class="wrap">
        <div class='wrap-p'>
          <p>非常抱歉，该产品已售罄</p>
          <p>可按产品原价继续购买使用</p>
        </div>
        <button class="wrap-btn" @click="createBill()" :disabled="payIng">¥99 继续购买</button>
      </div>
      <img class="wrap-close" src="@/static/imgs/c-close.png" alt="" @click="close()">
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import Alert from '@/components/alert'
import indexSys from '@/components/indexSys'
import { track, getWxCode } from '@/utils/util'

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
      bgStyle: {
        background: '#fff'
      },
      imgPath: process.env.VUE_APP_IMG_PATH,
      shareScene: '', // 分享给他人的scen
      hasRejectLogin: false, // 是否拒绝登录过
      hasRejectPay: false, // 是否拒绝支付过
      rejectType: '',
      showCents: '',
      user_status_map: {
        0: '未付费',
        2: '体验期',
        21: '体验期过期',
        3: '年卡',
        31: '年卡过期'
      },
      isNetError: false,
      wxCode: '',
      isSys: 0, // 1 上音社  2 标准
      channle_sys: process.env.VUE_APP_REFERRAL_MINA_SYS_CHANNEL_ID.split(','),
      query: {},
      btnUrl: `${process.env.VUE_APP_IMG_PATH}/abtest/ai_referral_mina/default-btn1.png`,
      btnStyle: {
        bottom: '120rpx',
        height: '142rpx'
      },
      channelId: this.$mp.query.channel_id,
      showChangePkg: false,
      payIng: false,
      uuid: '',
      repeatPkg: ''
    }
  },
  onLoad(options) {
    if (options.scene) {
      this.scene = options.scene
    } else if (options.source) {
      this.source = options.source
    }
  },
  onShow(options) {
    if (this.channelId) {
      wx.setStorageSync('channel_id', this.channelId)
    }
    this.channelId = wx.getStorageSync('channel_id')
    if (this.channle_sys.includes(this.channelId)) {
      this.isSys = 1
      this.scene = `0&${this.channelId}`
    }
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
      title: '5天智能陪练体验营，打卡返19.8元现金红包',
      path: `/pages/index?scene=${this.shareScene}`,
      imageUrl: `${this.imgPath}/ai_mina/newIndex2/share-header.png`
    }
  },
  methods: {
    catchTouchMove() {
      return false
    },
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
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
      if (this.rejectType === 'login') {
        track('ai_applet_retain_giveup_click', {
          retain_from: '未登陆挽留'
        });
      } else {
        track('ai_applet_retain_giveup_click', {
          retain_from: '未支付挽留'
        });
      }
    },
    handleContinue() {
      this.showStay = false
      if (this.rejectType === 'login') {
        track('ai_applet_retain_gon_click', {
          retain_from: '未登陆挽留'
        });
        this.handleShowAlert()
      } else {
        track('ai_applet_retain_gon_click', {
          retain_from: '未支付挽留'
        });
        // 发起支付
        this.handleGetting('继续抢')
      }
    },
    async handleBtnClick(e) {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      this.hasBtnClicked = true
      let content = '立即抢'
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_shouquan_view');
      this.wxCode = await getWxCode()
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      if (detail.encryptedData) {
        this.register({
          iv: detail.iv,
          encrypted_data: detail.encryptedData
        }, true)
      } else {
        track('ai_applet_quxiao_click');
        this.handleShowAlert()
      }
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData({
        scene: this.scene,
        source: this.source
      })
      this.channelId = this.configData.scene_data.c
      if (!this.isSys) {
        if (this.channle_sys.includes('' + this.channelId)) {
          this.isSys = 1
        } else {
          this.isSys = 2
        }
      }
      // 0 元对应pkg = 6  0.01 元对应pkg = 3  4.9 元对应pkg = 9
      this.showCents = this.configData.pkg === 6
      this.bgUrl = this.showCents ? `${this.imgPath}/abtest/ai_referral_mina/default0.png?v=1` : (this.configData.pkg === 3 ? `${this.imgPath}/abtest/ai_referral_mina/cents/header.png` : `${this.imgPath}/ai_mina/newIndex2/default99V1.png?123`)
      // String 类型试验（第二个参数 ""，表示未命中试验时，会返回此默认值，请根据业务需要更改此处的值）
      if (this.configData.pkg === 3) {
        this.btnUrl = `${this.imgPath}/abtest/ai_referral_mina/cents/btn.png`
        let that = this
        this.abtest.fastFetchABTest({
          param_name: 'vipmusic_mina_url',
          default_value: '',
          value_type: 'String',
          callback: function(result) {
            // TODO 请根据 result 进行自己的试验，当前试验对照组返回值为：https://oss-ai-peilian-app.xiaoyezi.com/dev/ai_mina/newIndex2/bg99.png，试验组依次返回：https://oss-ai-peilian-app.xiaoyezi.com/pre/img//AB_test/e9e06710a5ed586b04d0e80b99b1a148.png
            if (result) {
              console.log('vipmusic_mina_url', result);
              that.bgUrl = result
            }
          }
        });
        this.abtest.fastFetchABTest({
          param_name: 'ai_referral_mina_btn',
          default_value: {},
          value_type: 'Object',
          callback: function(result) {
            // TODO 请根据 result 进行自己的试验，当前试验对照组返回值为：{"url":"https://oss-ai-peilian-app.xiaoyezi.com/dev/img//AB_test/9a6fae216cef8d99e366a4c0e3d8cfe3.png", "bottom":"30px", "height":"142px"}，试验组依次返回：{"url":"https://oss-ai-peilian-app.xiaoyezi.com/dev/img//AB_test/9a6fae216cef8d99e366a4c0e3d8cfe3.png", "bottom":"30px", "height":"142px"}
            if (Object.keys(result).length > 0) {
              console.log('ai_referral_mina_btn', result);
              that.btnUrl = result.url;
              that.btnStyle.height = result.height;
              that.btnStyle.bottom = result.bottom;
            }
          }
        });
        this.abtest.fastFetchABTest({
          param_name: 'ai_referral_mina_bg',
          default_value: '',
          value_type: 'String',
          callback: function(result) {
            // TODO 请根据 result 进行自己的试验，当前试验对照组返回值为：ff935e，试验组依次返回：e9c95a
            if (result) {
              console.log('ai_referral_mina_bg', result);
              that.bgStyle.background = result;
            }
          }
        });
      }
      this.referrer_info = this.configData.referrer_info
      this.shareScene = this.configData.share_scene
      this.store.mobile = this.configData.mobile
      this.uuid = this.configData.uuid
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
        referrer_amount: this.configData.pkg === 6 ? 0 : (this.configData.pkg === 3 ? 0.01 : 4.9)
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
      this.recent_purchase = await api.getBuyNames({
        scene: this.scene,
        source: this.source
      })
    },
    handleGetting(content) {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      const ssQuery = `referrer_amount=${this.configData.pkg === 6 ? 0 : (this.configData.pkg === 3 ? 0.01 : 4.9)}&channel_id=${this.configData.scene_data.c}`
      if (this.configData.had_purchased === 1 || (this.store.had_purchased === 1 && this.configData.mobile)) {
        this.go(`/pages/success?success=true&${ssQuery}`)
      } else if (this.configData.had_purchased === 2 || (this.store.had_purchased === 2 && this.configData.mobile)) {
        this.go(`/pages/success?${ssQuery}`)
      } else {
        this.showStay = false;
        // this.createBill()
        this.TestBill()
      }
    },
    async TestBill(uuid, open_id) {
      try {
        let res = await api.testBill({
          uuid: this.uuid,
          pkg: this.configData.pkg
        })
        if (res.is_repeat) {
          this.showChangePkg = true
          this.showAlert = false
          this.repeatPkg = res.new_pkg
        } else {
          this.createBill(this.uuid, open_id)
        }
      } catch (e) {
      } finally {
        this.isLogin = false;
        this.showStay = false;
      }
    },
    async createBill(uuid, open_id) {
      this.payIng = true;
      track('ai_applet_weixin_pay', {
        ai_tel: this.store.mobile
      });
      uuid = uuid || this.configData.uuid || this.uuid
      open_id = open_id || this.configData.openid
      const ssQuery = `referrer_amount=${this.configData.pkg === 6 ? 0 : (this.configData.pkg === 3 ? 0.01 : 4.9)}&channel_id=${this.configData.scene_data.c}`
      try {
        let res = await api.createBill({
          uuid,
          open_id,
          pkg: this.showChangePkg ? this.repeatPkg : this.configData.pkg,
          scene: this.scene,
          source: this.source,
          distinct_id: this.sa.getAnonymousID()
        })
        if (this.showCents && !this.showChangePkg) {
          this.store.had_purchased = 1;
          this.go(`/pages/success?success=true&${ssQuery}`)
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
            this.store.had_purchased = 1;
            this.go(`/pages/success?success=true&${ssQuery}`)
          },
          fail: () => {
            this.form = {}
            this.store.country_code = ''
            this.showAlert = false
            this.getConfig()
            this.store.had_purchased = 0;
            this.payIng = false;
          },
          cancel: () => {
            track('ai_applet_99pay_x_click', {
              ai_tel: this.store.mobile
            });
            this.payIng = false;
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
        this.payIng = false;
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
      if (isAuth) {
        param.wx_code = this.wxCode
      }
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
        const ssQuery = `referrer_amount=${this.configData.pkg === 6 ? 0 : (this.configData.pkg === 3 ? 0.01 : 4.9)}&channel_id=${this.configData.scene_data.c}`
        if (data.had_purchased === 1) {
          return this.go(`/pages/success?success=true&${ssQuery}`)
        } else if (data.had_purchased === 2) {
          return this.go(`/pages/success?${ssQuery}`)
        }
        if (data.uuid) {
          this.getConfig()
          this.uuid = data.uuid
          console.log(this.uuid);
          this.TestBill(data.uuid, data.openid)
        }
      } catch (e) {
        this.isLogin = false
      }
    },
    close() {
      this.showChangePkg = false
      console.error('pkg', this.configData.pkg);
      this.repeatPkg = this.configData.pkg
      this.store.had_purchased = 0;
    }
  },
  components: {
    Alert,
    indexSys
  }
}
</script>
