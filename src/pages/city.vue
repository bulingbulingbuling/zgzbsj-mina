<template>
  <div class="shop">
    <headerNavBar title="参与店铺"/>
    <div class="city">
      <div class="city-title">请选择所在地区</div>
      <div class="city-sub-title">选择城市</div>
      <div class="city-list">
        <div class="list-item" v-for="item in cityList" :key="item.id">
          <div class="item" :class="{ active: currentId === item.id }" @click="handleShop(item)">{{ item.city_name }}</div>
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
      province_id: '',
      cityList: [],
      currentId: ''
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: '参与店铺'
    })
  },
  onShow() {
    if (this.store.province_id) {
      wx.getNetworkType({
        success: (res) => {
          this.handleNetError(res)
        }
      })
    }
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getCityList()
      }
    },
    handleShop(item) {
      this.currentId = item.id
      this.store.city_id = item.id
      this.store.city_name = item.city_name
      this.go('/pages/shop')
    },
    async getCityList() {
      const res = await api.getCityList({
        province_id: this.store.province_id
      })
      this.cityList = res
    }
  }
}
</script>
