<template>
  <div>
    <div class="container index-container">
      <div class="index-container-content">
        <img class="header" :src="bgUrl" alt="">
      </div>
      <div class="index-container-bottom" :style="btnStyle">
        <div class="action" @click="chooseImg()">
          <img :src="btnUrl" alt="">
          AI互动
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import { uploadImage } from '@/utils/util'

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      configData: {},
      bgUrl: '',
      imgPath: process.env.VUE_APP_IMG_PATH,
      isNetError: false,
      btnUrl: `${process.env.VUE_APP_IMG_PATH}/abtest/ai_referral_mina/default-btn1.png`,
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
        // this.getConfig()
      }
    },
    // 获取手机号
    async chooseImg() {
      const res = await uploadImage()
      // todo 上传阿里云 或者传给后端
    },
    // 获取初始化数据
    async getConfig() {
      this.configData = await api.getIndexData({
        scene: this.scene,
        source: this.source
      })
      this.channelId = this.configData.scene_data.c
      this.isSys = 2
      // 0元对应pkg = 6  0.01元对应pkg = 3  4.9元对应pkg = 9
      this.bgUrl = `${this.imgPath}/ai_mina/newIndex2/default99V1.png?456`
      // String 类型试验（第二个参数 ""，表示未命中试验时，会返回此默认值，请根据业务需要更改此处的值）
      if (this.configData.pkg === 3) {
        this.btnUrl = `${this.imgPath}/abtest/ai_referral_mina/cents/btn.png`
      }
      this.shareScene = this.configData.share_scene
      this.store.mobile = this.configData.mobile
      this.uuid = this.configData.uuid
      this.store.uuid = this.uuid
    }
  }
}
</script>
