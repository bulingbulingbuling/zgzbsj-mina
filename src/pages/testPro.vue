<template>
  <div>
    <div class="container">
      <div class="index-container-content">
        <swiper
          circular
          layout-type="transformer"
          class="swiperWrap"
          transformer-type="scaleAndFade"
          display-multiple-items="1.25"
          previous-margin="30px">
          <swiper-item v-for="item in templateList" :key="item.id">
            <image mode="aspectFit" class="template" :src="item.url" />
          </swiper-item>
        </swiper>
        <button id="bottom-btn" @click="handleBtnClick">
          <image mode="aspectFit" :src="btnUrl" alt="" />
        </button>
        <canvas id="mask" />
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'
import { uploadImage } from '@/utils/util'

export default {
  data () {
    return {
      store: this.$mp.app.globalData,
      isNetError: false,
      templateList: [],
      currentIndex: 0,
      currentFace: {},
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      indicatorDots: false,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      btnUrl: `https://oss-ai-peilian-app.xiaoyezi.com/dev/abtest/ai_referral_mina/default-btn1.png`
    }
  },
  onShow(options) {
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      if (res.networkType === 'none') {
        this.toast('当前网络异常，请检查网络后再试')
      }
    })
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    // 分享设置
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getTemplateList()
      }
    },
    onPosterChange (index) {
      console.log('onPosterChange to', index);
      this.currentIndex = index
      this.currentFace = this.templateList[index]
    },
    handleBtnClick() {

    },
    // 获取手机号
    async chooseImg() {
      const res = await uploadImage()
      // todo 上传阿里云 或者传给后端
      // try {
      //   // 调用chooseImage选择图片
      //   const res = await this.$mp.chooseImage({
      //     count: 1, // 默认9，设置图片的选择数量
      //   });
      //   // 获取文件的临时路径
      //   const tempFilePaths = res.tempFilePaths;
      //   // 调用uploadFile上传图片
      //   const uploadRes = await this.$mp.uploadFile({
      //     url: '你的上传接口地址', // 开发者服务器地址
      //     filePath: tempFilePaths[0], // 要上传文件资源的路径
      //     name: 'file', // 文件对应的key
      //     // 可以添加更多的formData
      //     formData: {
      //       'user': 'test'
      //     },
      //   });
      //   // 处理上传成功的结果
      //   console.log('upload success:', uploadRes);
      // } catch (error) {
      //   // 处理错误
      //   console.error('upload error:', error);
      // }
    },
    // 获取初始化数据
    async getTemplateList() {
      const res = await api.getTemplate()
      this.templateList = res.templates
    }
  }
}
</script>
<style>
.template {
  width: 100%;
  height: 100%;
}
.swiperWrap {
  height: 59vh;
  width: 100vw;
}
</style>
