<template>
  <div class="container success-container">
    <template v-if="isSuccess">
      <img class="img-top" :src="`${imgPath}/ai_mina/result-success.png`" alt="">
      <div class="result-bottom">
        <img :src="`${imgPath}/ai_mina/result-bottom.png`" alt="">
        <button class="btn" open-type="contact">点击并回复“1”获取助教微信</button>
      </div>
    </template>
    <template v-else>
      <div class="fail-wrapper-top">
        <img class="fail-top" :src="`${imgPath}/ai_mina/result-fail.png`" alt="">
        <button class="btn" open-type="contact">点击并回复“1”获取助教微信</button>
      </div>
      <div class="fail-wrapper-bottom">
        <img class="fail-bottom" :src="`${imgPath}/ai_mina/result-fail-bg.png`" alt="">
        <img class="poster" :src="posterUrl" alt="">
        <div class="share-wrapper">
          <div class="share-item">
            <button open-type="share" @click="sendFriends">
              <img class="fail-top" :src="`${imgPath}/ai_mina/weixin.png`" alt="">
            </button>
            <p>分享给朋友</p>
          </div>
          <div class="share-item">
            <img class="fail-top" :src="`${imgPath}/ai_mina/download.png`" alt="" @click="savePoster">
            <p>分享到朋友圈</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { api } from '@/api'
import { track } from '@/utils/util'
export default {
  data () {
    return {
      isSuccess: this.$mp.query.success,
      store: this.$mp.app.globalData,
      posterUrl: '',
      isDownloading: false,
      imgPath: process.env.VUE_APP_IMG_PATH,
      shareScene: ''
    }
  },
  onShow() {
    if (this.isSuccess) {
      track('$pageview', {
        $title: '购买成功页',
        $url: 'pages/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_suc_buy_view', {
        ai_tel: this.store.mobile
      });
    } else {
      track('$pageview', {
        $title: '已经购买页',
        $url: 'pages/success',
        visit_time: new Date().toLocaleDateString()
      });
      track('ai_applet_had_buy_view', {
        ai_tel: this.store.mobile
      });
    }
    wx.hideShareMenu({
      menus: ['shareAppMessage']
    })
    this.getPoster()
  },
  onShareAppMessage(res) {
    let param = {};
    if (res.from === 'button') {
      // 来自页面内转发按钮
      param = {
        title: '小叶子智能陪练体验营',
        path: `/pages/index?scene=${this.shareScene}`,
        imageUrl: `${this.imgPath}/ai_mina/share-header.png`
      }
      return param;
    }
  },
  methods: {
    sendFriends() {
      track('ai_applet_had_buy_share_click', {
        ai_tel: this.store.mobile,
        share_type: '微信'
      });
    },
    async getPoster() {
      const data = await api.getPoster()
      this.posterUrl = data.poster
      this.shareScene = data.share_scene
    },
    savePoster() {
      if (this.isDownloading) return
      this.isDownloading = true
      wx.showLoading({
        mask: true
      });
      wx.downloadFile({
        url: this.posterUrl,
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              console.log('save success')
              track('ai_applet_had_buy_share_click', {
                ai_tel: this.store.mobile,
                share_type: '朋友圈'
              });
              wx.hideLoading({
                success: () => {
                  this.toast('海报已保存到本地，请到朋友圈分享此海报')
                }
              });
            },
            fail: (err) => {
              console.log(err, 'save fail')
              if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
                wx.showModal({
                  title: '获取授权失败',
                  content: '请打开“保存到相册”选项开关',
                  cancelText: '取消',
                  confirmText: '去设置',
                  confirmColor: '#8ecd7e',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (data) => {
                          if (data.authSetting['scope.writePhotosAlbum']) {
                            this.savePoster();
                          }
                        }
                      })
                    }
                  }
                })
              } else if (err.errMsg === 'saveImageToPhotosAlbum:fail system deny' || err.errMsg === 'saveImageToPhotosAlbum:fail:system denied') {
                wx.showModal({
                  title: '无法保存',
                  content: '请在手机的“设置-隐私-照片”选项中，允许微信访问照片。',
                  showCancel: false
                })
              } 
            },
            complete: () => {
              this.isDownloading = false
              wx.hideLoading();
            }
          })
        },
        fail: () => {
          console.log('download fail')
          wx.hideLoading();
          this.isDownloading = false
        }
      })
    }
  }
}
</script>
