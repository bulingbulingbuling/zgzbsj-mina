<template>
  <div>
    <div class="container index-container">
      <div class="index-container-content">
        <img class="header" :src="bgUrl" alt="">
      </div>
      <div class="index-container-bottom" :style="btnStyle">
        <div class="action" v-if="configData.mobile" @click="handleGetting()">
          <img :src="btnUrl" alt="">
        </div>
        <button id="bottom-btn" class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
          <img :src="btnUrl" alt="">
        </button>
      </div>
    </div>
    <alert :isShow="showAlert" :isFree="false" :pkg="configData.pkg" @close="closeAlert" :type="alertType" :isLogin="isLogin" :form="form" :scene="scene" @login="register">
    </alert>
  </div>
</template>

<script>
import { api } from '@/api'
import Alert from '@/components/alert'
import { getWxCode } from '@/utils/util'

export default {
  data () {
    return {
      showAlert: false, // 是否显示弹窗
      store: this.$mp.app.globalData,
      configData: {},
      isLogin: false,
      scene: '', // 通过小程序码进来
      source: '', // 记录小程序的入口
      hasBtnClicked: false, // 购买是否已经点了。
      form: {},
      platform: '',
      bgUrl: '',
      imgPath: process.env.VUE_APP_IMG_PATH,
      shareScene: '', // 分享给他人的scen
      isNetError: false,
      wxCode: '',
      query: {},
      btnUrl: `${process.env.VUE_APP_IMG_PATH}/abtest/ai_referral_mina/default-btn1.png`,
      btnStyle: {
        height: '192rpx',
        bottom: '100rpx'
      },
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
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getConfig()
      }
    },
    handleShowAlert() {
      this.showAlert = true
    },
    closeAlert() {
      this.hasBtnClicked = false
      this.showAlert = false
    },
    async handleBtnClick(e) {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      this.hasBtnClicked = true
      this.wxCode = await getWxCode()
    },
    // 获取手机号
    getPhoneNumber({ detail }) {
      if (detail.encryptedData) {
        console.log('授权成功', detail)
        this.register({
          iv: detail.iv,
          encrypted_data: detail.encryptedData
        }, true)
      } else {
        this.handleShowAlert()
      }
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData()
      this.bgUrl = `${this.imgPath}/ai_mina/newIndex2/default99V1.png`
      this.store.mobile = this.configData.mobile
    },
    handleGetting() {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      this.go(`/pages/testPro`)
    },
    // 手机号注册
    async register(param, isAuth) {
      this.hasBtnClicked = false
      param.scene = this.scene
      param.source = this.source
      if (isAuth) {
        param.wx_code = this.wxCode
      }
      try {
        const data = await api.register(param)
        this.store.mobile = data.mobile
        this.shareScene = data.share_scene
        this.getConfig()
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
