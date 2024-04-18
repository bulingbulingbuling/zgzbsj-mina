<template>
  <div class="shareWrap">
    <div class="container">
      <div class="index-container-content">
        <image mode="widthFix" class="downImg" :src="synthesisUrl" />
      </div>
      <div class="actionWrap">
        <button @click="handleGuide">
          <!-- <image mode="aspectFit" :src="btnUrl" alt="" /> -->
          <h4>分享朋友圈</h4>
        </button>
        <button open-type="share" @click="handleShare">
          <h4>分享好友</h4>
        </button>
      </div>
      <van-dialog id="van-dialog" />
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import Dialog from '@/utils/dialog';

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      isNetError: false,
      prize: '',
      tip: '',
      synthesisUrl: null
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: '分享'
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow(options) {
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
    if (this.store.synthesisUrl) {
      this.synthesisUrl = this.store.synthesisUrl
    }
    if (this.prize || this.tip) {
      Dialog.alert({
        message: this.prize || this.tip
      }).then(() => {
        if (this.prize) {
          this.go(`/pages/prize`)
        } else {
          this.go(`/pages/aiHall`)
        }
      });
    }
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.store.synthesisUrl
    }
  },
  onShareTimeline() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.store.synthesisUrl
    }
  },
  methods: {
    handleGuide() {

    },
    async handleShare() {
      const res = await api.shareImage()
      if (Array.isArray(res.user_prize) && !res.user_prize.length) {
        this.tip = '再分享一次，就有机会获得AI换脸的机会哦。'
        this.prize = ''
      } else {
        this.prize = res.user_prize.content
        this.tip = ''
      }
    }
  }
}
</script>
