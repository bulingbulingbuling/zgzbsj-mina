<template>
  <div class="container success-container">
    <img v-if="isSuccess" class="img-top" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/result-success.png" alt="">
    <img v-else class="img-top" src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/result-fail.png" alt="">
    <div class="result-bottom">
      <img src="https://ai-peilian-app.oss-cn-beijing.aliyuncs.com/prod/ai_mina/result-bottom.png" alt="">
      <button class="btn" open-type="contact">点击并回复“1”获取助教微信</button>
    </div>
  </div>
</template>

<script>
import { track } from '@/utils/util'
export default {
  data () {
    return {
      isSuccess: this.$mp.query.success,
      store: this.$mp.app.globalData
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
  }
}
</script>
