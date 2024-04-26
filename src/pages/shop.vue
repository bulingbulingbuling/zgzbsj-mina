<template>
  <div class="shop">
    <headerNavBar title="参与店铺"/>
    <div class="list">
      <div class="list-title">{{ this.store.city_name }}</div>
      <div class="shop-card" v-for="item in shopList" :key="item.id">
        <div class="card-title">{{ item.name }}</div>
        <div class="card-item">地址：{{ item.province }}{{ item.city }}{{ item.address }}</div>
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
      shopList: []
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: '参与店铺'
    })
  },
  onShow() {
    if (this.store.province_id && this.store.city_id) {
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
        this.getShopList()
      }
    },
    async getShopList() {
      const res = await api.getShopList({
        province_id: this.store.province_id,
        city_id: this.store.city_id,
        city_name: this.store.city_name
      })
      this.shopList = res.shops
    }
  }
}
</script>
