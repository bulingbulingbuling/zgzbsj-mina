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
        <image @click="handleGoMini(item)" mode="aspectFit" class="template" :src="item.pic_url" />
      </swiper-item>
    </swiper>
    <div class="seriesName" v-if="imgList.length">{{ imgList[currentIndex].name }}</div>
    <div class="seriesName">点击图片查看产品详情</div>
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
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      path: `/pages/index`,
      imageUrl: process.env.VUE_APP_SHARE_URL
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
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
    handleGoMini(item) {
      const { path_url } = item
      wx.navigateToMiniProgram({
        appId: 'wx107321d97d36af11',
        path: path_url,
        success(res) {
          console.log('成功', res)
        }
      })
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
