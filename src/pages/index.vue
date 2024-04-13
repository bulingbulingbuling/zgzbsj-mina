<template>
  <div>
    <div class="container index-container">
      <!-- <div class="index-container-content">
        <img class="header" :src="bgUrl" alt="">
      </div> -->
    </div>
    <div>
      <div class="index-btn" @click="handleGoPage('aiHall')" v-if="configData.mobile">
        AI展馆
      </div>
      <button class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
        AI展馆
      </button>
    </div>
    <div class="index-btn" @click="handleGoPage('productHall')">
      新品展示馆
    </div>
    <div>
      <div class="index-btn" @click="handleGoPage('prize')" v-if="configData.mobile">
        我的奖品
      </div>
      <button class="action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick" v-else>
        我的奖品
      </button>
    </div>
    <div class="index-btn">
      活动说明
    </div>
    <div class="index-btn" @click="handleGoPage('shop')">
      参与店铺
    </div>
    <div class="index-btn" @click="handleRest()">
      清除授权
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
    async handleRest() {
      this.configData = await api.handleRest()
    },
    handleGetting() {
      if (this.isNetError) {
        this.toast('网络异常，请检查网络后重试')
        return
      }
      this.go(`/pages/aiHall`)
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
    },
    handleGoPage(page) {
      this.go(`/pages/${page}`)
    }
  },
  components: {
    Alert
  }
}
</script>
<style lang="scss" scoped>
.index-btn{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top:80rpx;
}
</style>
