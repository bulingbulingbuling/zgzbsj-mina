<template>
  <div class="alert" v-if="isShow">
    <div class="mask"></div>
    <div class="alert-contact" v-if="type === 'contact'">
      <img class="alert-contact-close" src="@/static/imgs/contact-close.png" alt="" @click="close">
      <img class="img-bg" src="@/static/imgs/contact-help.png">
      <div class="call" @click="handleCall">现在拨打</div>
    </div>
    <div class="alert-form" v-else>
      <img class="alert-form-close" src="@/static/imgs/phone-close.png" alt="" @click="close">
      <h3 class="alert-form-title">想使用其他手机号?</h3>
      <div class="alert-form-item">
        <div class="num ft-32" @click="handleRedirect">+{{country_code}} <img class="arrow" src="@/static/imgs/arrow.png" alt=""></div>
        <input class="phone ft-32" type="number" v-model="mobile" placeholder="请输入手机号号码">
      </div>
      <div class="alert-form-item">
        <div class="code-title ft-32">验证码</div>
        <input class="code ft-32" type="number" v-model="sms_code" placeholder="请输入验证码">
        <div class="code-btn ft-30" :class="{disabled: code < 60 && code > 0}" @click="sendCode">{{smstext || code + 's'}}</div>
      </div>
      <p class="alert-form-error ft-24">{{errorText}}</p>
      <button class="alert-form-btn" @click="login" :disabled="isLogin">使用此手机号并购买</button>
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
    }
  },
  watch: {
    form(newVal) {
      if (newVal) {
        this.mobile = newVal.mobile
        this.sms_code = newVal.sms_code
        this.country_code = newVal.country_code || '86'
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
      isSending: false
    }
  },
  methods: {
    handleRedirect() {
      this.store.form = {
        mobile: this.mobile,
        sms_code: this.sms_code
      }
      wx.redirectTo({
        url: '/pages/address'
      });
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
          country_code: this.country_code
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
    background: rgba(0, 0, 0, 0.5);
  }
  .alert-contact {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 485px;
    height: 533px;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    text-align: center;
    &-close {
      position: absolute;
      bottom: -89px;
      left: 50%;
      transform: translateX(-50%);
      width: 56px;
      height: 56px;
    }
    .img-bg {
      width: 100%;
      height: 100%;
    }
    .call {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 48px;
      width: 382px;
      height: 69px;
      line-height: 69px;
      background-image: linear-gradient(0deg, #fc5045 0%, #ff7859 100%), linear-gradient(#fc5045, #fc5045);
      box-shadow: 2px 4px 16px 0px rgba(149, 52, 46, 0.4);
      border-radius: 34px;
      text-align: center;
      letter-spacing: 3px;
      color: #ffffff;
      font-size: 28px;
    }
  }
  .alert-form {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 607px;
    background-color: #ffffff;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 48px 40px 43px;
    &-close {
      position: absolute;
      right: -29px;
      top: -29px;
      width: 58px;
      height: 58px;
    }
    &-title {
      letter-spacing: 1px;
      color: #444444;
      font-size: 36px;
      margin-bottom: 40px;
    }
    &-item {
      display: flex;
      align-items: center;
      height: 92px;
      border-bottom: solid 3px #ddd;
      ::-webkit-input-placeholder { 
        color: #ccc;
        font-size: 32px; 
      } 
      .num {
        letter-spacing: 1px;
        color: #444444;
        border-right: 3px solid #ccc;
        .arrow {
          width: 16px;
          height: 9px;
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
      }
      .code-title {
        letter-spacing: 1px;
        color: #444444;
        width: 100px;
      }
      .code {
        box-sizing: border-box;
        width: 238px;
        text-align: left;
        padding-left: 26px;
        color: #444;
        padding-right: 10px;
        height: 100%;
      }
      .code-btn {
        flex: 1;
        padding-left: 18px;
        border-left: 3px solid #ccc;
        text-align: center;
        color: #07ae00;
      }
      .disabled {
        color: #999999;
      }
    }
    &-error {
      height: 46px;
      color: #ff0909;
      padding-top: 2px;
      text-align: left;
    }
    &-btn {
      width: 496px;
      height: 89px;
      line-height: 89px;
      background-color: #07ae00;
      border-radius: 8px;
      color: #ffffff;
      font-size: 36px;
    }
  }
}
</style>
