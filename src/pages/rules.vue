<template>
  <div>
    <web-view :src="ruleUrl"></web-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleUrl: `${process.env.VUE_APP_REFERRAL_URL}/market/protocol`
    }
  }
}
</script>