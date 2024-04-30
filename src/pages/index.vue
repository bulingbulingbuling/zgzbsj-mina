<template>
  <div class="index">
    <headerNavBar :hasHeight="false" isTransparent="isTransparent" :needBack="false" />
    <div class="container index-container">
      <div class="index-container-content">
        <img class="bgImg" src="@/static/imgs/bg.png" alt="">
      </div>
    </div>
    <div class="btnGroup">
      <div>
        <div class="indexBtn" @click="handleGoPage('aiHall')" v-if="configData.mobile">
          <div class="content">AI 互动</div>
          <img class="btnImg" :src="`${activeBtn === 'aiHall' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
        <button class="indexBtn action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick('aiHall')" v-else>
          <div class="content">AI 互动</div>
          <img class="btnImg" src="@/static/imgs/defaultBtn.png" alt="">
        </button>
      </div>
      <div class="indexBtn" @click="handleGoPage('productHall')">
        <div class="content">新品展示馆</div>
        <img class="btnImg" :src="`${activeBtn === 'productHall' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
      </div>
      <div class="indexBtn" @click="handleGoPage('rules')">
        <div class="content">活动说明</div>
        <img class="btnImg" :src="`${activeBtn === 'rules' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
      </div>
      <div>
        <div class="indexBtn" @click="handleGoPage('prize')" v-if="configData.mobile">
          <div class="content">我的奖品</div>
          <img class="btnImg" :src="`${activeBtn === 'prize' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
        <button class="indexBtn action" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" :disabled="hasBtnClicked" @click="handleBtnClick('prize')" v-else>
          <div class="content">我的奖品</div>
          <img class="btnImg" src="@/static/imgs/defaultBtn.png" alt="">
        </button>
      </div>
      <div class="indexBtn" @click="handleGoPage('province')">
        <div class="content">参与店铺</div>
        <img class="btnImg" :src="`${activeBtn === 'province' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
      </div>
    </div>
    <!-- <div class="indexBtn" @click="handleRest()">
      清除授权
    </div> -->
  </div>
</template>
<config>
  {
    "navigationStyle": "custom"
  }
</config>

<script>
import { api } from '@/api'
import { getWxCode } from '@/utils/util'

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      configData: {},
      isLogin: false,
      hasBtnClicked: false, // 购买是否已经点了。
      imgPath: process.env.VUE_APP_IMG_PATH,
      isNetError: false,
      activeBtn: '',
      wxCode: ''
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
  onShareTimeline() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      imageUrl: process.env.VUE_APP_SHARE_URL
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 获取来源
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
    async handleBtnClick(type) {
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
      }
    },
    // 获取首页数据
    async getConfig() {
      this.configData = await api.getIndexData()
      this.store.mobile = this.configData.mobile
    },
    async handleRest() {
      this.configData = await api.handleRest()
    },
    // 手机号注册
    async register(param, isAuth) {
      this.hasBtnClicked = false
      if (isAuth) {
        param.wx_code = this.wxCode
      }
      try {
        const data = await api.register(param)
        this.store.mobile = data.mobile
        this.getConfig()
      } catch (e) {
        this.isLogin = false
      }
    },
    handleGoPage(page) {
      this.activeBtn = page
      setTimeout(() => {
        this.activeBtn = ''
      }, 1000)
      this.go(`/pages/${page}`)
    }
  }
}
</script>
