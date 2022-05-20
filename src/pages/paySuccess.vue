<template>
  <web-view :src="viewUrl"></web-view>
</template>

<script>
import {
  Base64
} from 'js-base64'
export default {
  data () {
    return {
      viewUrl: ''
    }
  },
  onShow() {
    wx.hideHomeButton()
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
    this.Init()
  },
  methods: {
    async Init() {
      const params = {
        uuid: this.$mp.query.uuid,
        projectName: this.$mp.query.projectName
      }
      let paramsStr = JSON.stringify(params)
      paramsStr = encodeURIComponent(Base64.encode(paramsStr))
      this.viewUrl = `${process.env.VUE_APP_REFERRAL_URL}/market/paySuccess/${paramsStr}`
    }
  }
}
</script>
