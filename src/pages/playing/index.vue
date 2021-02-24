<template>
  <div class="container g-play">
    <swiper class="g-play-swiper" :circular="true" :vertical="true" :autoplay="true" :interval="1500" v-if="recent_purchase.length > 0">
      <swiper-item v-for="(item, key) in recent_purchase" :key="key" catchtouchmove="catchTouchMove">
        <div class="item-wrapper" v-html="item">
        </div>
      </swiper-item>
    </swiper>
    <div class="g-play-header" :style="{height: headerHeight}">
      <img class="bg" src="@/static/imgs/playing/bg-top.png" alt="">
      <img class="avatar" :src="report.thumb" alt="">
      <div class="box" id="box">
        <img class="desc-bg-top" src="@/static/imgs/playing/desc-bg-top.png" alt="">
        <img class="desc-bg-bottom" src="@/static/imgs/playing/desc-bg-bottom.png" alt="">
        <div class="con-wrapper">
          <p class="nickname">{{report.name}}</p>
        </div>
        <div class="text-wrapper">
          <div class="score"><span>{{report.score_final}}</span>分</div>
          <p class="desc">我家宝贝弹奏的<span>《{{report.lesson_name}}》</span><br><i v-show="report.score_rank > 0">超过<span>{{report.score_rank}}%</span>的用户</i></p>
        </div>
        <div class="audio-wrapper">
          <div class="wrapper">
            <div class="audio-bg" @click="toggleAudioPlay">
              <img id="animatedBg" class="animated-bg" :style="{animationPlayState: playState}" src="@/static/imgs/playing/audio-bg.png" alt="">
              <img class="btn-pause" src="@/static/imgs/playing/pause.png" alt="" v-if="isPlay">
              <img class="btn-play" src="@/static/imgs/playing/play.png" alt="" v-else>
            </div>
            <div class="radar-box" v-if="showCharts">
              <ec-canvas id="mychart-dom-graph" canvas-id="mychart-graph" :ec="ec"></ec-canvas>
            </div>
          </div>
        </div>
        <div class="report-wrapper">
          <button class="report" @click="goReport">查看宝贝测评报告</button>
        </div>
      </div>
    </div>
    <div class="g-play-guides">
      <img class="guide" src="@/static/imgs/playing/guide.png" alt="">
      <img class="intro" src="@/static/imgs/playing/intro.png" alt="">
    </div>
    <div class="g-play-rule">
      <a class='rule-link' href='/pages/rules'>*智能陪练购买协议</a>
    </div>
    <div class="g-play-bottom">
      <div class="img-wrapper">
        <div class="action" v-if="configData.mobile" @click="handleGetting('页底立即体验')">
          <img class="header" src="@/static/imgs/playing/btn-bottom.png" alt="">
          <p class="text" v-if="remainNum">仅剩{{remainNum}}个名额</p>
        </div>
        <button id="bottom-btn" class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
          <img src="@/static/imgs/playing/btn-bottom.png" alt="">
          <p class="text" v-if="remainNum">仅剩{{remainNum}}个名额</p>
        </button>
      </div>
    </div>
    <div class="stay" v-if="showStay">
      <div class="mask"></div>
      <div class="stay-playing">
        <img class="alert-top" src="@/static/imgs/playing/alert-top.png" alt="">
        <h3 class="title">您确定要放弃优惠吗？</h3>
        <p class="desc">80元优惠券已到账，不用就没啦！</p>
        <div class="coupon">
          <img class="coupon-cover" src="@/static/imgs/playing/coupon.png" alt="">
          <p class="coupon-text"><span class="num">80</span><span>元优惠券</span></p>
        </div>
        <div class="stay-playing-btngroup">
          <button class="btn" @click="closeStay('拒绝')">残忍拒绝</button>
          <button class="btn"  @click="handleGetting('继续', true)">去报名</button>
        </div>
      </div>
    </div>
    <alert :isShow="showAlert" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" @login="register">
    </alert>
  </div>
</template>

<config>
{
  "navigationBarTitleText": "演奏分享"
}
</config>

<script>
import { api } from '@/api'
import Alert from '@/components/alert'
import { track } from '@/utils/util'

// 分别代表 fontSize , nameGap, radius 大小
const radarConfig = [12, 5, 30]
let radarData

function initChart(canvas, width, height, dpr, echarts) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    radar: [
      {
        name: {
          textStyle: {
            color: '#4a4a4a'
          },
          fontSize: radarConfig[0]
        },
        nameGap: radarConfig[1],
        indicator: [
          { text: '音准', max: 100 },
          { text: '速度', max: 100 },
          { text: '平稳度', max: 100 },
          { text: '完整度', max: 100 },
          { text: '节奏', max: 100 }
        ],
        splitArea: {
          show: true,
          areaStyle: {
            color: '#fff'
            // 图表背景网格的颜色
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: '#e200ff'
            // 图表背景网格线的颜色
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            color: '#e200ff'
            // 图表背景网格线的颜色
          }
        },
        center: ['50%', '50%'],
        radius: radarConfig[2],
        splitNumber: 4
      }
    ],
    series: [
      {
        type: 'radar',
        symbol: 'none',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#ff004d', // 图表中各个图区域的边框线颜色
              opacity: 0
            },
            areaStyle: {
              type: 'default',
              opacity: 0.3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#ff004d' // 0% 处的颜色
                },
                {
                  offset: 1, color: '#a000ff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        },
        data: [
          {
            // value: [100, 30, 49,70, 96],
            value: radarData
          }
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

export default {
  data () {
    return {
      showAlert: false, // 是否显示弹窗
      showStay: false, // 支付失败挽留弹窗
      store: this.$mp.app.globalData,
      alertType: 'phone',
      remainNum: '',
      configData: {},
      report: {}, // 报告数据
      referrer_info: {},
      recent_purchase: [], // 滚动列表
      isLogin: false,
      scene: '', // 通过小程序码进来
      hasBtnClicked: false, // 购买是否已经点了。
      form: {},
      imgPath: process.env.VUE_APP_IMG_PATH,
      audioIns: null,
      ec: {
        onInit: initChart
      },
      isPlay: false,
      playState: '',
      showCharts: false,
      headerHeight: ''
    }
  },
  onLoad(options) {
    console.log(options, 'options')
    if (options.scene) {
      this.scene = options.scene
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
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
    // 禁止分享
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
    // 隐藏左上角进入首页按钮
    wx.hideHomeButton()
  },
  onHide() {
    this.form = {}
    this.store.country_code = ''
    this.showAlert = false
    this.hasBtnClicked = false
    this.closeAudio()
  },
  onReady() {
    this.getBoxInfo()
  },
  methods: {
    getBoxInfo() {
      // 添加节点的布局位置的查询请求 加定时是因为高度有时候计算的不准确
      setTimeout(() => {
        wx.createSelectorQuery().select('#box').boundingClientRect((rect) => {
          this.headerHeight = rect.height + 'px'
        }).exec()
      }, 1000)
    },
    createAudio() {
      if (!this.audioIns) {
        this.audioIns = wx.createInnerAudioContext()
        this.audioIns.src = this.report.audio_url
        this.audioIns.autoplay = true

        this.audioIns.onPlay(() => {
          this.playState = 'running'
          this.isPlay = true
        })
        this.audioIns.onPause(() => {
          this.playState = 'paused'
          this.isPlay = false
        })
        this.audioIns.onEnded(() => {
          this.isPlay = false
          this.playState = 'paused'
        })
        this.audioIns.onError(() => {
          console.log('audio error')
        })
      }
    },
    closeAudio() {
      if (this.audioIns) {
        this.audioIns.pause()
        this.isPlay = false
      }
    },
    toggleAudioPlay() {
      if (this.isPlay) {
        this.audioIns.pause()
      } else {
        this.audioIns.play()
      }
    },
    goReport() {
      this.closeAudio()
      this.go(`/pages/playing/report?recordId=${this.report.record_id}&lessonId=${this.report.lesson_id}&replayToken=${this.report.replay_token}`)
    },
    catchTouchMove() {
      return false
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
      track('ai_applet_retain_click', {
        ai_tel: this.store.mobile,
        click_item: content
      });
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
        $title: '演奏分享页',
        $url: 'pages/playing/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      this.closeAudio()
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
      this.configData = await api.getPlayingData({
        scene: this.scene
      })
      console.log('this.configData', this.configData);
      this.report = this.configData.report
      this.referrer_info = this.configData.referrer_info
      this.recent_purchase = this.configData.recent_purchase
      this.store.mobile = this.configData.mobile
      this.remainNum = this.configData.remaining
      radarData = [this.report.score_pitch, this.report.score_speed_average, this.report.score_speed, this.report.score_complete, this.report.score_rhythm]
      this.showCharts = true
      this.createAudio()
      if (this.referrer_info.uuid) {
        this.sa.registerApp({
          referrer_uuid: this.referrer_info.uuid
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
      this.sa.registerApp({
        referrer_amount: 9.9
      });
      this.sa.setProfile({
        ai_phoneNumber: this.configData.mobile,
        ai_open_id: this.configData.openid,
        ai_uuid: this.configData.uuid
      });
      track('$pageview', {
        $title: '演奏分享页',
        $url: 'pages/playing/index',
        visit_time: new Date().toLocaleDateString()
      });
    },
    handleGetting(content, isContinue) {
      this.closeAudio()
      track('$WebClick', {
        $title: '演奏分享页',
        $url: 'pages/playing/index',
        content,
        visit_time: new Date().toLocaleDateString()
      });
      if (this.configData.had_purchased || (this.store.had_purchased && this.configData.mobile)) {
        this.go('/pages/playing/success')
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
            this.go('/pages/playing/success?success=true')
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
          return this.go('/pages/playing/success')
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
