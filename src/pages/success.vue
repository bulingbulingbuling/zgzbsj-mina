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
    this.sa.registerApp({
      $url: 'pages/success',
      $title: this.isSuccess ? '购买成功页' : '已经购买页'
    });
    if (this.isSuccess) {
      track('ai_applet_suc_buy_view', {
        ai_tel: this.store.mobile
      });
    } else {
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
        channelId: this.channelId,
        projectName: wx.getStorageSync('project_name') || 'ai转介绍小程序',
        distinctID: this.store.uuid
      }
      let paramsStr = JSON.stringify(params)
      paramsStr = encodeURIComponent(Base64.encode(paramsStr))
      this.viewUrl = `${process.env.VUE_APP_REFERRAL_URL}/market/success/${paramsStr}`
    }
  }
}
</script>
