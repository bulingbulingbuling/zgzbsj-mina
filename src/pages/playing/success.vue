<template>
  <div class="g-play-success">
    <template v-if="isSuccess">
      <img class="success-top" :src="`${imgPath}/ai_mina/playing/success-bg.png`" alt="">
      <button class="btn" open-type="contact">点击并回复“1”获取助教微信</button>
    </template>
    <template v-else>
      <div class="fail-wrapper-top">
        <img class="fail-top" :src="`${imgPath}/ai_mina/playing/notice.png`" alt="">
        <img class="logo" :src="`${imgPath}/ai_mina/playing/logo.png`" alt="">
        <p class="text">抓紧时间练琴吧～</p>
      </div>
    </template>
  </div>
</template>

<config>
{
  "navigationBarTitleText": "演奏分享"
}
</config>

<script>
import { track } from '@/utils/util'
export default {
  data () {
    return {
      isSuccess: this.$mp.query.success,
      store: this.$mp.app.globalData,
      imgPath: process.env.VUE_APP_IMG_PATH
    }
  },
  onShow() {
    if (this.isSuccess) {
      track('$pageview', {
        $title: '购买成功页',
        $url: 'pages/playing/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_suc_buy_view', {
        ai_tel: this.store.mobile
      });
    } else {
      track('$pageview', {
        $title: '已经购买页',
        $url: 'pages/playing/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_had_buy_view', {
        ai_tel: this.store.mobile
      });
    }
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
  }
}
</script>
