<template>
  <div class="container">
    <web-view :src="reportUrl"></web-view>
  </div>
</template>

<config>
{
  "navigationBarTitleText": "演奏分享"
}
</config>

<script>
export default {
  data () {
    return {
      reportUrl: ''
    }
  },
  onLoad(options) {
    console.log(options, 'options')
    if (options.replayToken) {
      this.reportUrl = `${process.env.VUE_APP_MUSICSCORE_URL}/#/reportNew?lessonId=${options.lessonId}&recordId=${options.recordId}&pageType=weixin&appToken=${options.replayToken}`
    }
  }
}
</script>
