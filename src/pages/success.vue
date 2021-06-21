<template>
  <web-view :src="viewUrl"></web-view>
</template>

<script>
import { track } from '@/utils/util'
import {
  Base64
} from 'js-base64'
export default {
  data () {
    return {
      isSuccess: this.$mp.query.success,
      referrerAmount: this.$mp.query.referrer_amount,
      channelId: this.$mp.query.channel_id,
      store: this.$mp.app.globalData,
      viewUrl: ''
    }
  },
  onShow() {
    if (this.isSuccess) {
      track('$pageview', {
        $title: '购买成功页',
        $url: 'pages/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_suc_buy_view', {
        ai_tel: this.store.mobile
      });
    } else {
      track('$pageview', {
        $title: '已经购买页',
        $url: 'pages/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_had_buy_view', {
        ai_tel: this.store.mobile
      });
    }
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
    this.Init()
  },
  methods: {
    async Init() {
      const params = {
        success: this.isSuccess,
        token: wx.getStorageSync('token'),
        referrerAmount: this.referrerAmount,
        channelId: this.channelId
      }
      console.log('referrer_amount', this.$mp.query.referrer_amount)
      let paramsStr = JSON.stringify(params)
      console.log(paramsStr)
      paramsStr = encodeURIComponent(Base64.encode(paramsStr))
      console.log(paramsStr)
      this.viewUrl = `${process.env.VUE_APP_REFERRAL_URL}/market/success/${paramsStr}`
    }
  }
}
</script>
