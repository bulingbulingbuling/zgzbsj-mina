<template>
  <div class="alert" v-if="isShow">
    <div class="mask"></div>
    <div class="alert-form">
      <div class='alert-form-tip' v-if="from === 'index'">
        <img :src="`${isFree ? require('@/static/imgs/newIndex2/login-top.png') : (pkg === 3 ? require('@/static/imgs/newIndex2/login-top-001.png') : require('@/static/imgs/newIndex2/login-top-99.png'))}`" alt="">
      </div>
      <div class="alert-form-wrapper" :class="{top: from !== 'index'}" >
        <div class="alert-form-wrapper-item">
          <div class="num item-left ft-32" @click="handleRedirect">+{{country_code}} <img class="arrow" src="@/static/imgs/newIndex2/triangle.png" alt=""></div>
          <input class="phone ft-30" type="number" placeholder="手机号仅用于上课" @input="handleMobileInput">
        </div>
        <div class="alert-form-wrapper-item">
          <input class="code ft-30" type="number" placeholder="请输入验证码" @input="handleCodeInput">
          <div class="code-btn ft-30" :class="{disabled: code < 60 && code > 0}" @click="sendCode">{{smstext || code + 's'}}</div>
        </div>
        <p class="alert-form-wrapper-error ft-30">{{errorText}}</p>
        <button class="alert-form-wrapper-btn" @click="login" :disabled="isLogin">
          <img src="@/static/imgs/newIndex2/login-btn.png" alt="">
        </button>
        <p class="desc"><img src="@/static/imgs/newIndex2/icon-safe.png" alt=""><span>小叶子保护您的隐私</span></p>
      </div>
      <img class="alert-form-close" :class="{bottom: from !== 'index'}" :src="`${from === 'index' ? require('@/static/imgs/newIndex2/close.png') : require('@/static/imgs/moments/close.png')}`" alt="" @click="close">
    </div>
  </div>
</template>
<script>
import { api } from '@/api'

export default {
  props: {
    isShow: {
      type: Boolean
    },
    type: {
      type: String,
      default: 'contact'
    },
    isLogin: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    },
    isFree: {
      type: Boolean,
      default: false
    },
    pkg: {
      type: Number,
      default: 2
    },
    from: {
      type: String,
      default: 'index'
    },
    scene: {
      type: String,
      default: ''
    },
    channelId: {
      type: String,
      default: ''
    }
  },
  watch: {
    form(newVal) {
      if (newVal) {
        this.mobile = newVal.mobile
        this.sms_code = newVal.sms_code
        this.country_code = newVal.country_code || '86'
      }
      if (Object.keys(newVal).length === 0) {
        this.errorText = ''
      }
    }
  },
  data() {
    return {
      mobile: '',
      sms_code: '',
      code: '',
      smstext: '发送验证码',
      errorText: '',
      store: this.$mp.app.globalData,
      country_code: '86',
      isSending: false,
      timer: '',
      imgPath: process.env.VUE_APP_IMG_PATH
    }
  },
  methods: {
    handleMobileInput(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.mobile = e.detail.value
        if (/\d{11}/.test(this.mobile)) {
          this.sendCode()
        }
      }, 200)
    },
    handleCodeInput(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.sms_code = e.detail.value
      }, 200)
    },
    handleRedirect() {
      this.store.form = {
        mobile: this.mobile,
        sms_code: this.sms_code
      }
      this.go('/pages/address')
    },
    close() {
      this.mobile = ''
      this.sms_code = ''
      this.code = ''
      this.errorText = ''
      this.$emit('close');
    },
    handleCall() {
      wx.makePhoneCall({
        phoneNumber: '4000292609'
      })
    },
    async sendCode() {
      if (this.isSending || this.code > 0) return
      if (!this.mobile) {
        this.errorText = '*请输入正确的手机号'
        return
      }
      this.isSending = true
      this.loading()
      try {
        await api.sendCode({
          mobile: this.mobile,
          country_code: this.country_code,
          scene: this.scene,
          channel_id: this.channelId
        })
        this.setCountTime()
      } catch (e) {
      } finally {
        this.isSending = false
        this.loading(false);
      }
    },
    // 倒计时
    setCountTime() {
      let sum = 60
      this.code = sum
      let time = setInterval(() => {
        this.smstext = ''
        this.code--
        if (this.code <= 0) {
          clearInterval(time);
          this.smstext = '发送验证码'
        }
      }, 1000)
    },
    login() {
      if (!this.mobile || !(/^\d{6,20}$/.test(this.mobile))) {
        this.errorText = '*请输入正确的手机号'
        return
      }
      if (!this.sms_code || !(/^\d{4,6}$/.test(this.sms_code))) {
        this.errorText = '*请输入正确的验证码'
        return
      }
      this.errorText = ''
      this.$emit('login', {
        mobile: this.mobile,
        sms_code: this.sms_code,
        country_code: this.country_code
      });
    }
  }
};
</script>
<style lang="less" scoped>
.alert {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }
  .alert-form {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    width: 662px;
    height: 682px;
    text-align: center;
    &-close {
      position: absolute;
      top: 54px;
      right: 29px;
      width: 30px;
      height: 30px;
    }
    .bottom {
      top: 157px;
      margin-left: -15px;
      right: 25px;
      width: 35px;
      height: 35px;
    }
    &-tip {
      width: 100%;
      height: 172px;
      ._img {
        width: 100%;
        height: 100%;
      }
    }
    &-wrapper {
      position: absolute;
      left: 0;
      top: 132px;
      background: #fff;
      width: 100%;
      height: 550px;
      border-radius: 30px;
      padding: 71px 20px 0;
      &-item {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100px;
        margin-bottom: 26px;
        background-color: #f7f7f7;
        border-radius: 100px;
        ::-webkit-input-placeholder {
          color:  #c5c5c5;
          font-size: 30px;
        }
        .item-left {
          width: 159px;
          padding-left: 41px;
        }
        .num {
          color: #333;
          font-weight: 500;
          .arrow {
            width: 19px;
            height: 14px;
            vertical-align: middle;
            margin-right: 10px;
          }
        }
        .phone {
          padding-left: 26px;
          color: #444;
          text-align: left;
          height: 100%;
          flex: 1;
          letter-spacing: 0;
        }
        .code {
          box-sizing: border-box;
          width: 422px;
          text-align: left;
          padding-left: 41px;
          color: #444;
          padding-right: 10px;
          height: 100%;
          letter-spacing: 0;
        }
        .code-btn {
          flex: 1;
          text-align: center;
          color: #444;
        }
        .disabled {
          color: #999999;
        }
      }
      &-error {
        padding-left: 41px;
        color: #ff0909;
        padding-top: 2px;
        text-align: left;
        width: 469px;
        position: relative;
        top: -30px;
        height: 24px;
        font-size: 24px;
      }
      &-btn {
        width: 622px;
        height: 110px;
        margin-bottom: 23px;
        ._img {
          width: 100%;
          height: 100%;
        }
      }
      .desc {
        font-size: 26px;
        color: #c5c5c5;
        ._img {
          width: 23px;
          height: 27px;
          vertical-align: middle;
        }
        ._span {
          vertical-align: middle;
          margin-left: 8px;
        }
      }
    }
    .top {
      top: 132px;
      padding-top: 90px;
      height: 565px;
    }
  }
}
</style>
