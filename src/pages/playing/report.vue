<template>
  <div class="container">
    <web-view :src="reportUrl"></web-view>
  </div>
</template>

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
      this.reportUrl = `https://musicscore-app-pre.xiaoyezi.com/#/reportNew?lessonId=${options.lessonId}&recordId=${options.recordId}&pageType=weixin&appToken=${options.replayToken}`
    }
  }
}
</script>
