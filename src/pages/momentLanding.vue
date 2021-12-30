<template>
  <div class="content">
    <div class="landing1">
      <div class="swiper-wrapper" :class="{center}" v-if="recent_purchase.length > 0">
        <img class="voice" :src="`${imgPath}/ai_mina/newIndex2/voice.png`" alt="">
        <swiper class="list-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500">
          <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
            <div class="item-wrapper" v-html="item">
            </div>
          </swiper-item>
        </swiper>
      </div>
      <div class="indeximg">
        <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/banner-new.png`" alt="" />
      </div>
      <div class="form_img">
        <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/slogan.png`" alt="" />
      </div>
    </div>
    <div class="group">
      <div class="group_active">
        <div class="top">
          <img :src="`${imgPath}/mina/aiRefferralMina/profile/${num+1}.jpg`" alt="" />
          <span class="active_name">{{ profilename[num] }}</span>
          <span class="active_text">只差<i>1</i>人成团</span>
          <button class="active_btn1 ft-0" id="参团区1" v-if="configData.mobile" @click="handleGetting('立即抢')"></button>
          <button class="active_btn1 ft-0" id="参团区1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else></button>
        </div>
        <div class="bottom">
          <img :src="`${imgPath}/mina/aiRefferralMina/profile/${num+2}.jpg`" alt="" />
          <span class="active_name">{{ profilename[num + 1] }}</span>
          <span class="active_text">只差<i>1</i>人成团</span>
          <button class="active_btn1 ft-0" id="参团区2" v-if="configData.mobile" @click="handleGetting('立即抢')"></button>
          <button class="active_btn1 ft-0" id="参团区2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else></button>
        </div>
      </div>
    </div>
    <div class="video_img">
      <div class="title">
        <p class="tilte_icon">国际钢琴大师郎朗亲测推荐</p>
        <p>点击下方观看郎朗评测视频</p>
      </div>
      <div class="videoBox">
        <video
          id="video"
          :src="videoUrl"
          :poster="`${imgPath}/mina/aiRefferralMina/momentsLanding/langlang_review_video.png?202112`"
          @play="bindPlayVideo"
          @ended="bindendedVideo"
        ></video>
      </div>
      <button class="fixed-btn btn02 ft-0" id="视频下方" v-if="configData.mobile" @click="handleGetting('立即抢')" :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/btn9.9.png)`}"></button>
      <button class="fixed-btn btn02 ft-0" id="视频下方" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/btn9.9.png)`}">视频下方</button>
    </div>
    <div class="landing3 text">
      <div class="title">
        <p class="tilte_icon">小叶子智能陪练</p>
        <p>科学高效练琴</p>
      </div>
      <div class="content_box">
        <ul>
          <li style="margin: 0">
            <p>AI自动标出需重点练习片段</p>
            <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/play_piano_01.png`" alt="AI自动标出需重点练习片段" style="height: 227px"/>
          </li>
          <li>
            <p>弹奏有打分，弹得好不好一目了然</p>
            <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/play_piano_02.png`" alt="弹奏有打分，弹得好不好一目了然" style="height: 230px"/>
          </li>
          <li>
            <p>找不到音有提示，提升识谱能力</p>
            <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/play_piano_03.png`" alt="找不到音有提示，提升识谱能力" style="height: 227px"/>
          </li>
          <li>
            <p>360度演奏示范，指法手型有参考</p>
            <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/play_piano_04.png`" alt="360度演奏示范，指法手型有参考" style="height: 195px"/>
          </li>
        </ul>
      </div>
      <button class="fixed-btn btn02 ft-0" id="卖点下方" v-if="configData.mobile" @click="handleGetting('立即抢')" :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/btn9.9.png)`}"></button>
      <button class="fixed-btn btn02 ft-0" id="卖点下方" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/btn9.9.png)`}"></button>
    </div>
    <div class="landing4 text">
      <div class="title">
        <p class="tilte_icon">从小汤到十级</p>
        <p>曲谱全覆盖</p>
      </div>
      <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/operns.jpeg`" alt="曲谱全都有"/>
    </div>
    <div class="landing6 text">
      <div class="title">
        <p class="tilte_icon">使用说明</p>
      </div>
      <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/user.png`" alt="使用说明" />
    </div>
    <div class="landing8 text">
      <div class="title">
        <p class="tilte_icon">他们都信赖推荐</p>
        <p>创新工场、红杉资本、真格基金等<br />知名机构投资推荐</p>
      </div>
      <img :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/logos.png`" alt="" />
    </div>
    <div class="landing9 text">
      <div class="title">
        <p class="tilte_icon">关于小叶子</p>
      </div>
      <div class="content_box">
        <p
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小叶子（北京）科技有限公司成立于2013年。旗下The
          ONE智能钢琴已连续七年销量位居天猫11.11同品类前列；智能钢琴教室，在全球已有5000余家。小叶子首创的智能陪练模式，通过AI纠错科学高效练琴。目前，小叶子的用户已遍布全球131个国家。</p
        >
      </div>
      <a class='rule-link' href='/pages/rules'>*智能陪练购买协议</a>
    </div>
    <div class="foot">
      <img class="person" :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/person.png`" alt="" />
      <button class="foot_btn2" id="底部" v-if="configData.mobile" @click="handleGetting('立即抢')" :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/foot_btn2.png)`}"></button>
      <button class="foot_btn2" id="底部" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/foot_btn2.png)`}">底部</button>
    </div>
    <!-- 挽留弹窗 -->
    <div class="detain-popup" v-show="showStay">
      <div class="popup-zone" :style="{backgroundImage: `url(${imgPath}/mina/aiRefferralMina/momentsLanding/detain_popup_bg.png)`}">
        <img
          class="popup-header-img"
          :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/detain_popup_header.png`"
          alt="挽留弹窗头部"
        />
        <p class="popup-main-title">您确定要放弃吗</p>
        <p class="popup-sub-title">和郎朗一起练琴提高</p>
        <img
          class="popup-body-img"
          :src="`${imgPath}/mina/aiRefferralMina/momentsLanding/detain_popup_img.png`"
          alt="挽回弹窗图1"
        />
        <div class="popup-btns">
          <div
            @click="closeStay('残忍拒绝')"
            class="leave-btn"
            id="确认订单页残忍拒绝"
            >残忍拒绝</div
          >
          <div
            @click="handleContinue('继续提高')"
            class="stay-btn"
            id="确认订单页继续提高"
            >继续提高</div
          >
        </div>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <alert :isShow="showAlert" @close="closeAlert" from="moment" :isLogin="isLogin" :form="form" @login="register">
    </alert>
  </div>
</template>
<config>
{
  "navigationBarTitleText": "小叶子智能陪练",
  "restartStrategy": "homePageAndLatestPage"
}
</config>
<script>
import Alert from '@/components/alert'
import { api } from '@/api'
import { track, getWxCode } from '@/utils/util'

export default {
  data () {
    return {
      source: '', // 记录小程序的入口
      imgPath: process.env.VUE_APP_IMG_PATH,
      channelId: this.$mp.query.channel_id,
      configData: {},
      store: this.$mp.app.globalData,
      recent_purchase: [], // 滚动列表
      videoUrl: 'https://static.xiaoyezi.com/videos/aipl/langngAIG.mp4',
      wxCode: '',
      videoSensorOption: {
        content: '视频播放',
        $element_selector: '#video_sensors'
      },
      profilename: [
        's*n',
        '张*桐',
        '薇*薇',
        'S*y',
        '金*子',
        '宁*远',
        '影*',
        '丹*李',
        '阳*媚',
        'R*花',
        '肖*燕',
        '琪*',
        'C*甜',
        '澄*天',
        '洋*',
        '千*梦',
        'C*o',
        '安*宝',
        '布*子',
        'D*o'
      ],
      num: 0, // 随机数
      query: {},
      showAlert: false, // 登录弹窗
      showStay: false, // 支付失败挽留弹窗
      hasRejectLogin: false, // 是否拒绝登录过
      hasBtnClicked: false, // 购买是否已经点了。
      rejectType: '',
      isLogin: false,
      windowHeight: 0,
      scrollHeight: 0, // 文档总高度
      scrollTop: 0, // 文档卷去的高度
      curSlideRate: '',
      center: '',
      timer: '',
      btnStyle: {
        fontSize: '0rpx'
      }
    }
  },
  components: {
    Alert
  },
  onShow(options) {
    const that = this
    wx.getSystemInfo({
      success (res) {
        that.windowHeight = res.windowHeight
      }
    })
    wx.hideHomeButton()
    if (this.channelId) {
      wx.setStorageSync('channel_id', this.channelId)
    }
    this.num = this.headRandom()
    this.channelId = wx.getStorageSync('channel_id')
    if (this.store.country_code) {
      this.form = {
        country_code: this.store.country_code,
        mobile: this.store.form.mobile,
        sms_code: this.store.form.sms_code
      }
      this.handleShowAlert()
    }
    this.sa.registerApp(this.$mp.query);
    this.sa.registerApp({
      project_name: '4.9元0603小程序'
    });
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
    const query = wx.createSelectorQuery()
    query.select('.content').boundingClientRect()
    query.exec(function(res) {
      that.scrollHeight = res[0].height
    })
  },
  onHide() {
    this.form = {}
    this.store.country_code = ''
    this.showAlert = false
  },
  onPageScroll(res) {
    if (res.scrollTop > this.windowHeight) {
      this.center = 'center'
    } else {
      this.center = ''
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.curSlideRate = (this.windowHeight + res.scrollTop) / this.scrollHeight
      console.log('curSlideRate', this.curSlideRate);
      if (res.scrollTop > this.scrollTop) {
        track('ai_shouyelanding_slide', {
          slide_max_rate: this.curSlideRate
        })
      }
      this.scrollTop = res.scrollTop
    }, 1000)
  },
  methods: {
    bindPlayVideo() {
      track('ai_shouyelanding_clk_view')
    },
    bindendedVideo() {
      track('ai_shouyelanding_overplay_view')
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
    // 获取首页数据
    async getBuyNames() {
      this.recent_purchase = await api.getBuyNames({
        type: 'moment'
      })
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData()
      this.store.mobile = this.configData.mobile
      this.store.uuid = this.configData.uuid
      // 0是注册用户即未付费，2是体验用户，3是年卡用户 根据sub_end_date(卡过期日期)判断是否过期
      if (this.configData.uuid) {
        track('ai_buy_soon_login_suc_view')
        this.sa.setProfile({
          ai_uuid: this.configData.uuid
        });
      }
      track('$pageview', {
        $title: '朋友圈投放',
        $url: 'pages/momentLanding',
        visit_time: new Date().toLocaleDateString()
      });
    },
    // 已授权 或者已绑定公众号点击立即参团
    async handleBtnClick(e) {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      this.hasBtnClicked = true
      track('ai_applet_empower_view')
      track('ai_shouyelanding_join_group_click', {
        slide_rate: this.curSlideRate
      })
      this.wxCode = await getWxCode()
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      console.log('detail', detail);
      if (detail.encryptedData) {
        track('ai_applet_shouquan_click')
        this.register({
          iv: detail.iv,
          encrypted_data: detail.encryptedData
        }, true)
      } else {
        track('ai_applet_quxiao_click')
        this.handleShowAlert()
      }
    },
    // 弹出登录弹窗
    handleShowAlert() {
      track('ai_buy_soon_login_view')
      this.showAlert = true
    },
    // 手机号注册
    async register(param, isAuth) {
      this.hasBtnClicked = false
      if (isAuth) {
        param.wx_code = this.wxCode
      }
      param.path = 'pages/momentLanding'
      let str = ''
      for (const key in this.$mp.query) {
        if (Object.hasOwnProperty.call(this.$mp.query, key)) {
          str += `&${key}=${this.$mp.query[key]}`
        }
      }
      param.param_arr = str.slice(1)
      try {
        const data = await api.momentRegister(param)
        track('ai_buy_soon_login_suc_view')
        this.sa.setProfile({
          ai_uuid: data.uuid
        });
        this.store.mobile = data.mobile
        const ssQuery = `referrer_amount=4.9&channel_id=${this.$mp.query.channel_id}`
        if (data.had_purchased === 1) {
          return this.go(`/pages/success?success=true&${ssQuery}`)
        } else if (data.had_purchased === 2) {
          return this.go(`/pages/success?${ssQuery}`)
        }
        if (data.uuid) {
          await this.createBill(data.uuid, data.openid)
        }
      } catch (e) {
        this.isLogin = false
      }
    },
    handleGetting(content) {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      track('ai_shouyelanding_join_group_click', {
        slide_rate: this.curSlideRate
      })
      const ssQuery = `referrer_amount=4.9&channel_id=${this.$mp.query.channel_id}`
      if (this.configData.had_purchased === 1 || (this.store.had_purchased === 1 && this.configData.mobile)) {
        this.go(`/pages/success?success=true&${ssQuery}`)
      } else if (this.configData.had_purchased === 2 || (this.store.had_purchased === 2 && this.configData.mobile)) {
        this.go(`/pages/success?${ssQuery}`)
      } else {
        this.showStay = false;
        this.createBill()
      }
    },
    async createBill(uuid, open_id) {
      uuid = uuid || this.configData.uuid
      open_id = open_id || this.configData.openid
      const ssQuery = `referrer_amount=4.9&channel_id=${this.$mp.query.channel_id}`
      try {
        let res = await api.createBill({
          uuid,
          open_id,
          pkg: 9
        })
        if (this.showCents) {
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
            // track('ai_applet_99pay_queren_click');
            this.store.had_purchased = 1;
            this.go(`/pages/success?success=true&${ssQuery}`)
          },
          fail: () => {
            this.form = {}
            this.store.country_code = ''
            this.showAlert = false
            this.getConfig()
            this.store.had_purchased = 0;
          },
          cancel: () => {
            // track('ai_applet_99pay_x_click', {
            //   ai_tel: this.store.mobile
            // });
            if (!this.hasRejectPay) {
              this.showStay = true
              this.rejectType = 'pay'
              track('ai_shouyelanding_detain_view');
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
    closeAlert() {
      this.hasBtnClicked = false
      this.showAlert = false
      if (!this.hasRejectLogin) {
        this.showStay = true
        this.rejectType = 'login'
        track('ai_shouyelanding_detain_view');
        this.hasRejectLogin = true
      }
    },
    closeStay() {
      this.showStay = false;
      if (this.rejectType === 'login') {
        // track('ai_applet_retain_giveup_click', {
        //   retain_from: '未登陆挽留'
        // });
      } else {
        // track('ai_applet_retain_giveup_click', {
        //   retain_from: '未支付挽留'
        // });
      }
    },
    handleContinue() {
      this.showStay = false
      if (this.rejectType === 'login') {
        // track('ai_applet_retain_gon_click', {
        //   retain_from: '未登陆挽留'
        // });
        this.handleShowAlert()
      } else {
        // track('ai_applet_retain_gon_click', {
        //   retain_from: '未支付挽留'
        // });
        // 发起支付
        this.handleGetting('继续抢')
      }
    },
    getRandom(type) {
      let length = type === 1 ? this.profiles.length - 1 : 18
      let num = Math.floor(Math.random() * length)
      return num
    },
    headRandom() {
      let randomNum = this.getRandom()
      let storeNum = wx.getStorageSync('num1')
      let newNum = Number(storeNum)
      if (newNum || newNum === 0) {
        if (randomNum === newNum) {
          randomNum = this.getRandom()
          this.headRandom()
        } else {
          wx.setStorageSync('num1', randomNum)
        }
      } else {
        wx.setStorageSync('num1', randomNum)
      }
      return randomNum
    }
  }
}
</script>
