<template>
  <div class="container success-container">
    <img v-if="isSuccess" class="img-top" src="@/static/imgs/result-success.png" alt="">
    <img v-else class="img-top" src="@/static/imgs/result-fail.png" alt="">
    <div class="result-bottom">
      <img src="@/static/imgs/result-bottom.png" alt="">
      <button class="btn" open-type="contact">点击并回复“1”获取助教微信</button>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      isSuccess: this.$mp.query.success
    }
  }
}
</script>
