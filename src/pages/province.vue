<template>
  <div class="shop">
    <headerNavBar title="参与店铺"/>
    <div class="city">
      <div class="city-title">请选择所在地区</div>
      <div class="city-sub-title">选择省份/地区</div>
      <div class="city-list">
        <div class="list-item" v-for="item in provinceList" :key="item.id">
          <div class="item" :class="{ active: currentId === item.id }" @click="handleChoose(item)">{{ item.province_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<config>
  {
    "navigationStyle": "custom"
  }
</config>

<script>

import { api } from '@/api'

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      provinceList: [],
      currentId: ''
    }
  },
  async created() {
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      path: `/pages/index`,
      imageUrl: process.env.VUE_APP_SHARE_URL
    }
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getPrizeList()
      }
    },
    handleChoose(item) {
      this.currentId = item.id
      this.store.province_id = item.id
      this.go('/pages/city')
    },
    async getPrizeList() {
      const res = await api.getProvinceList()
      this.provinceList = res
    }
  }
}
</script>
