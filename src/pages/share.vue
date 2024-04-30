<template>
  <div class="shareWrap">
    <headerNavBar :hasHeight="timeLine" isTransparent="isTransparent" />
    <div class="container">
      <div class="index-container-content">
        <image class="downImg" :src="synthesisUrl || defaultUrl" />
      </div>
      <div class="actionWrap" v-if="!timeLine">
        <div class="indexBtn" @click="handleGuide">
          <div class="content">
            <img class="icon" src="@/static/imgs/share.png" alt="" />
            分享朋友圈
          </div>
          <img class="btnImg" :src="`${activeBtn === 'down' ? require('@/static/imgs/activeBtn.png') : require('@/static/imgs/defaultBtn.png')}`" alt="">
        </div>
        <button class="indexBtn" open-type="share" @click="handleShare">
          <div class="content">
            <img class="icon" src="@/static/imgs/friend.png" alt="" />
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
      defaultUrl: '',
      synthesisUrl: null,
      showGuide: false,
      timeLine: false
    }
  },
  async created() {
    if (this.store.synthesisUrl) {
      this.synthesisUrl = this.store.synthesisUrl
    } else {
      // 不是AI互动过来的 回到首页
      this.go(`/pages/index`)
    }
    wx.setNavigationBarTitle({
      title: '一键生成属于你的AI中华美学大片'
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow(options) {
    const launchOptions = wx.getLaunchOptionsSync()
    if (launchOptions.scene === 1154) {
      this.timeLine = true
      this.defaultUrl = 'https://cjewel.oss-cn-shanghai.aliyuncs.com/share_20240428_1.png'
    }
    wx.onNetworkStatusChange((res) => {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
    if (this.prize || this.tip) {
      Dialog.alert({
        message: this.prize || this.tip
      }).then(() => {
        if (this.prize) {
          this.prize = ''
          this.go(`/pages/prize`)
        } else {
          this.tip = ''
          this.go(`/pages/index`)
        }
      });
    }
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      path: `/pages/index`,
      imageUrl: this.shareUrl
    }
  },
  onShareTimeline() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      query: 'backHome=true',
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
        this.tip = '继续探索，赢取心动好礼'
      } else {
        this.prize = res.user_prize.content
        this.tip = ''
        if (isMoments) {
          Dialog.alert({
            message: this.prize
          }).then(() => {
            if (this.prize) {
              this.go(`/pages/prize`)
            } else {
              this.go(`/pages/index`)
            }
          });
        }
      }
    }
  }
}
</script>
