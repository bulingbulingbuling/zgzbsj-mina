<template>
  <div class="container index-container">
    <div class="index-container-wrapper">
      <div class="content">
        <div class="con" v-if="packageOpened">
          <img class="new-bg-img" src="@/static/imgs/newIndex/opened-new-bg.jpeg" alt="" >
          <img class="price-img" src="@/static/imgs/newIndex/0.01.png" alt="" v-if="configData.pkg === 3" >
          <img class="price-img" src="@/static/imgs/newIndex/9.9.png" alt="" v-else >
        </div>
        <div class="con" v-else>
          <img class="new-bg-img" src="@/static/imgs/newIndex/new-bg.jpeg" alt="" >
          <img class="open-img" src="@/static/imgs/newIndex/open.png" alt="">
          <div class="open-box" v-if="configData.mobile" @click="handleGetting('拆礼包')" id="mid-btn"></div>
          <button class="open-box" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else id="mid-btn" :disabled="hasBtnClicked" @click="handleBtnClick">
            <div class="open-box" ></div>
          </button>
        </div>
        <div class='btn'>
          <img class="btn-img" src="@/static/imgs/newIndex/button.png" alt="" v-if="configData.mobile" @click="handleGetting('礼包')">
          <button class="btn-img" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else :disabled="hasBtnClicked" @click="handleBtnClick">
            <img src="@/static/imgs/newIndex/button.png" alt="">
          </button>
        </div>
        <div class="common-sec rules-sec">
          <a class='rule-link' href='/pages/rules'>*智能陪练购买协议</a>
        </div>
      </div>
      <!-- 支付失败弹窗 -->
      <div class='stay' v-show="showStay">
        <div class="mask"></div>
        <div class="stay-content">
          <img class="_logo" src="@/static/imgs/sad-logo.png" alt="">
          <div class='stay-content-title' >
              <h3 class="_title">您确定要放弃吗？</h3>
              <p class='_p'> 让孩子跟小叶子一起练琴，每天提高吧～</p>
          </div>
          <div class='stay-content-body'>
            <img src="@/static/imgs/stay.png" alt="" class='_img'>
            <p class='_test'><span>5天</span>不限次数体验</p>
            <p class='_exp'>练1遍，顶10遍</p>
          </div>
          <div class="stay-content-btngroup">
            <button class="_close" @click="closeStay('拒绝')">残忍拒绝</button>
            <button class="_pay"  @click="handleGetting('继续', true)">继续支付</button>
          </div>
        </div>
      </div>
      <alert :isShow="showAlert" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" @login="register">
      </alert>
      <!-- 客服提示图标 -->
      <img class="contact" :src="`${imgPath}/ai_mina/contact.png`" alt="" @click="handleShowAlert('contact')">
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
      showStay: false, // 支付失败挽留弹窗
      store: this.$mp.app.globalData,
      showBottom: false,
      alertType: 'phone',
      remainNum: Math.floor(Math.random() * (30 - 20) + 20),
      configData: {},
      referrer_info: {},
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
      platform: '',
      btnUrl: '',
      share_type: '',
      user_status: '',
      usersignin_status: '',
      imgPath: process.env.VUE_APP_IMG_PATH,
      shareScene: '', // 分享给他人的scen
      packageOpened: false, // 礼包已打开
      user_status_map: {
        0: '未付费',
        2: '体验期',
        21: '体验期过期',
        3: '年卡',
        31: '年卡过期'
      }
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

      // 改用从接口获取埋点数据
      // let scene = decodeURIComponent(options.scene)
      // const match = scene.match(/c=(\d+)/)
      // if (match) {
      //   this.sa.registerApp({
      //     channel_id: match[1]
      //   });
      // } else {
      //   const params = scene.split('&')
      //   if (params.length > 0) {
      //     this.sa.registerApp({
      //       channel_id: params[1],
      //       activity_id: params[2]
      //     });
      //   }
      // }
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
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.handleNetError(res)
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.platform = res.platform
      }
    })
    // 获取来源
    const { scene } = wx.getLaunchOptionsSync()
    this.share_type = scene
  },
  onPageScroll(e) {
    this.showBottom = e.scrollTop > this.btnDistance
    this.top = e.scrollTop
  },
  onReady() {
    this.getMidBtnInfo()
  },
  onHide() {
    this.form = {}
    this.store.country_code = ''
    this.showAlert = false
    this.showTimer = false
    this.remainNum = 1
    this.hasBtnClicked = false
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      path: `/pages/index?scene=${this.shareScene}`
    }
  },
  methods: {
    // /点击全屏进入或离开全屏状态触发的事件
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
      // 添加节点的布局位置的查询请求
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
    closeAlert() {
      this.hasBtnClicked = false
      this.showAlert = false
    },
    closeStay(content) {
      this.showStay = false;
      this.packageOpened = false
      track('ai_applet_retain_click', {
        ai_tel: this.store.mobile,
        click_item: content
      });
    },
    handleBtnClick(e) {
      this.hasBtnClicked = true
      let content
      if (e.target.id === 'mid-btn') {
        content = '拆礼包'
      } else {
        content = '礼包'
      }
      track('$ai_applet_shouquan_view');
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
      console.log('this.configData', this.configData);
      this.btnUrl = this.configData.pkg === 3 ? require('@/static/imgs/btn-1cents.png') : require('@/static/imgs/btn.png')
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
        referrer_amount: this.configData.pkg === 3 ? 0.01 : 9.9
      });
      this.sa.setProfile({
        ai_phoneNumber: this.configData.mobile,
        ai_open_id: this.configData.openid,
        ai_uuid: this.configData.uuid,
        ai_applet_user_status: this.user_status_map[user_status_num],
        ai_applet_usersignin_status: this.configData.mobile ? '已登录' : '未登录'
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
    handleGetting(content, isContinue) {
      track('$WebClick', {
        $title: '首页',
        $url: 'pages/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      this.packageOpened = true
      if (this.configData.had_purchased || (this.store.had_purchased && this.configData.mobile)) {
        this.go('/pages/success')
      } else {
        this.showStay = false;
        if (isContinue) {
          track('ai_applet_retain_click', {
            ai_tel: this.store.mobile,
            click_item: content
          })
        }
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
        let { timeStamp, nonceStr, package: p, signType, paySign } = res.data.credential.wx_lite
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: p,
          signType,
          paySign,
          success: () => {
            this.store.had_purchased = true;
            this.go('/pages/success?success=true')
            // this.getStatus(res.bill.id)
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
            track('ai_applet_retain_view', {
              ai_tel: this.store.mobile
            });
            this.showStay = true;
          }
        })
      } catch (e) {
      } finally {
        this.isLogin = false;
        this.showStay = false;
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
        this.shareScene = data.share_scene
        this.packageOpened = true
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
