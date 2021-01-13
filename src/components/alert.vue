<template>
  <div class="alert" v-if="isShow">
    <div class="mask"></div>
    <div class="alert-contact" v-if="type === 'contact'">
      <img class="alert-contact-close" :src="`${imgPath}/ai_mina/contact-close.png`" alt="" @click="close">
      <img class="img-bg" :src="`${imgPath}/ai_mina/contact-help.png`">
      <div class="call" @click="handleCall">现在拨打</div>
    </div>
    <div class="alert-form" v-else>
      <div class='alert-form-tip' >
        <div class="linkebg">
          <p class='_p'> 小叶子温馨提示</p>
          <h3 class="_title">注册后才能参与训练营哦！</h3>
        </div>
        <img class="_logo" src="@/static/imgs/tip-logo.png" alt="">
      </div>
      <div class="alert-form-item">
        <div class="num item-left ft-28" @click="handleRedirect">+{{country_code}} <img class="arrow" :src="`${imgPath}/ai_mina/arrow.png`" alt=""></div>
        <input class="phone ft-24" type="number" placeholder="请输入手机号号码" @input="handleMobileInput">
      </div>
      <div class="alert-form-item">
        <div class="code-title ft-28 item-left">验证码</div>
        <input class="code ft-24" type="number" placeholder="请输入验证码" @input="handleCodeInput">
        <div class="code-btn ft-24" :class="{disabled: code < 60 && code > 0}" @click="sendCode">{{smstext || code + 's'}}</div>
      </div>
      <p class="alert-form-error ft-24">{{errorText}}</p>
      <button class="alert-form-btn" @click="login" :disabled="isLogin">立即注册</button>
      <p class="_decr">* 训练营期间打卡5天还可得<span class="_strong">19.8</span>元学费返现</p>
      <img class="alert-form-close" src="@/static/imgs/close.png" alt="" @click="close">
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
      smstext: '获取验证码',
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
    background: rgba(0, 0, 0, 0.5);
  }
  .alert-contact {
    position: fixed;
    left: 50%;
    top: 46%;
    width: 630px;
    height: 635px;
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
    width: 630px;
    height: 635px;
    border-radius: 20px;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 0px 40px 43px;
    background-color: #fff;
    .linkebg {
      width: 630px;
      height: 174px;
      position: relative;
      overflow: hidden;
      padding-top: 45px;
      padding-left: 50px;
      margin-left: -40px;
      margin-right: -40px;
      &::before{
        content: "";
        display: block;
        position: absolute;
        top: -535px;
        left: -240px;
        width: 1071px;
        height: 1071px;
        background: rgba(64,213,106,.15);
        border-radius: 50%;
        transform: scale(1, 0.322);
      }
    }
    &-close {
      position: absolute;
      right: 50%;
      width: 68px;
      height: 68px;
      transform: translate(50%, 90px);
    }
    &-tip {
      color: #333333;
      text-align: left;
      position: relative;
      margin-bottom: 63px;
      ._p {
        font-size: 28px;
        line-height: 41px;
      }
      ._title {
        font-size: 32px;
      }
      ._logo {
        position: absolute;
        width: 212px;
        height: 226px;
        top: -63px;
        right: -51px;
      }
    }
    &-title {
      letter-spacing: 1px;
      color: #444444;
      font-size: 36px;
      margin-bottom: 40px;
    }
    &-item {
      display: flex;
      width: 469px;
      align-items: center;
      height: 52px;
      border-bottom: solid 3px #ddd;
      margin: 0 auto;
      margin-bottom: 42px;
      ::-webkit-input-placeholder {
        color: #ccc;
        font-size: 32px;
      }
      .item-left {
        width: 105px;
        text-align: left;
        border-right: 3px solid #ccc;
      }
      .num {
        letter-spacing: 1px;
        color: #444444;
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
        letter-spacing: 0;
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
        letter-spacing: 0;
      }
      .code-btn {
        flex: 1;
        text-align: center;
        color: #07ae00;
      }
      .disabled {
        color: #999999;
      }
    }
    &-error {
      // height: 46px;
      color: #ff0909;
      padding-top: 2px;
      text-align: left;
      margin: 0 auto;
      width: 469px;
      position: relative;
      top: -30px;

    }
    &-btn {
      width: 527px;
      height: 83px;
      font-size: 36px;
      line-height: 83px;
      color: #ffffff;
      background-color: #40d56a;
      border-radius: 41px;
    }
    ._decr {
      font-size: 26px;
      letter-spacing: -1px;
      color: #808080;
      margin-top: 30px;
      ._strong {
        font-size: 42px;
        font-weight: bold;
        letter-spacing: -4px;
        color: #ff6a00;
      }
    }
  }
}
</style>
