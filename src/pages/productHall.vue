<template>
  <div class="productHall">
    <headerNavBar title="新品展示馆"/>
    <div class="list">
      <div class="item" v-for="item in productsList" :key="item.id">
        <image mode="widthFix" @click="handleChoose(item)" class="image" :src="item.pic_url" />
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
      parent_id: 0,
      productsList: []
    }
  },
  async created() {
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getProductList()
      }
    },
    handleChoose(item) {
      this.store.parent_id = item.id
      this.go('/pages/productDetail')
    },
    async getProductList() {
      const res = await api.getProductList({
        parent_id: this.parent_id
      })
      this.productsList = res.products
    }
  }
}
</script>
