<template>
  <div class="container address-container">
    <div class="country-code" v-for="(item, index) in list" :key="index">
      <h3>{{kMap[index] || index}}</h3>
      <ul>
        <li v-for="(addr, idx) in item" :key="idx" @click="handleClick(addr.country_code)">{{addr.name}} +{{addr.country_code}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  data () {
    return {
      list: {},
      kMap: {
        hot: '热门'
      },
      store: this.$mp.app.globalData
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: '选择号码归属地'
    })
    this.store.country_code = '86'
    await this.getCode()
  },
  methods: {
    async getCode() {
      this.list = await api.getCountryCode()
    },
    handleClick(country_code) {
      this.store.country_code = country_code
      wx.navigateBack()
    }
  }
}
</script>
