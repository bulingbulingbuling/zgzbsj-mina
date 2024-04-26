<template>
  <div class="shareWrap">
    <headerNavBar :hasHeight="false" isTransparent="isTransparent" />
    <div class="container">
      <div class="index-container-content">
        <image mode="widthFix" class="downImg" :src="synthesisUrl" />
      </div>
      <div class="actionWrap">
        <div class="indexBtn" @click="handleGuide">
          <div class="content">
            <img class="icon" src="@/static/imgs/friend.png" alt="" />
            分享朋友圈
          </div>
          <img class="btnImg" :src="`${activeBtn === 'down' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
        <button class="indexBtn" open-type="share" @click="handleShare">
          <div class="content">
            <img class="icon" src="@/static/imgs/share.png" alt="" />
            分享好友
          </div>
          <img class="btnImg" :src="`${activeBtn === 'share' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </button>
      </div>
      <van-dialog id="van-dialog" />
      <div class="showGuide" v-if="showGuide" @click="handleClose">
        <div class="wrap">
          <img class="arrow" src="@/static/imgs/arrow.png" alt="" />
          <div class="tip">点击分享</div>
          <img class="hand" src="@/static/imgs/hand.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<config>
  {
    "navigationStyle": "custom"
  }
</config>

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
      shareUrl: process.env.VUE_APP_SHARE_URL,
      synthesisUrl: null,
      showGuide: false
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
    if (this.prize) {
      Dialog.alert({
        message: this.prize
      }).then(() => {
        this.prize = ''
        this.go(`/pages/prize`)
      });
    }
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.shareUrl
    }
  },
  onShareTimeline() {
    return {
      title: '分享标题',
      path: `/pages/index`,
      imageUrl: this.shareUrl
    }
  },
  methods: {
    handleGuide() {
      this.showGuide = true
    },
    handleClose(e) {
      this.showGuide = false
      this.handleShare(true)
    },
    async handleShare(isMoments) {
      const res = await api.shareImage()
      if (Array.isArray(res.user_prize) && !res.user_prize.length) {
        this.prize = ''
      } else {
        this.prize = res.user_prize.content
        if (isMoments) {
          Dialog.alert({
            message: this.prize
          }).then(() => {
            this.go(`/pages/prize`)
          });
        }
      }
    }
  }
}
</script>
