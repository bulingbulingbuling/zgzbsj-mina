<template>
  <div class="productDetail">
    <headerNavBar title="新品展示馆"/>
    <swiper
      layout-type="stackLeft"
      class="swiperWrap"
      :current="currentIndex"
      @change="swiperChange"
      id="swiper">
      <swiper-item v-for="item in imgList" :key="item.id" class="swiperItem">
        <image mode="aspectFit" class="template" :src="item.pic_url" />
      </swiper-item>
    </swiper>
    <div class="seriesName" v-if="imgList.length">{{ imgList[currentIndex].name }}</div>
    <div class="actions">
      <div class="prev" @click="handlePage('prev')" v-if="currentIndex > 0">
        <img mode="aspectFit" class="icon" src="@/static/imgs/prev.png" />
      </div>
      <div class="next" @click="handlePage('next')" v-if="currentIndex < imgList.length - 1">
        <img mode="aspectFit" class="icon" src="@/static/imgs/next.png" />
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
      imgList: [],
      currentIndex: 0
    }
  },
  onShow() {
    if (this.store.parent_id) {
      wx.getNetworkType({
        success: (res) => {
          this.handleNetError(res)
        }
      })
    }
  },
  methods: {
    handlePage(mode) {
      if (mode === 'prev') {
        this.currentIndex = this.currentIndex === 0 ? 0 : this.currentIndex - 1
      } else {
        this.currentIndex = this.currentIndex === this.imgList.length - 1 ? this.imgList.length - 1 : this.currentIndex + 1
      }
    },
    swiperChange(event) {
      this.currentIndex = event.detail.current
    },
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getProductList()
      }
    },
    async getProductList() {
      const res = await api.getProductList({
        parent_id: this.store.parent_id
      })
      this.imgList = res.products
    }
  }
}
</script>
