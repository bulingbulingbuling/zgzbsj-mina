<template>
  <div class="content">
    <div class="landing1">
      <div class="indeximg">
        <img :src="`${imgPath}/referral_0624/banner-1.png`" alt="">
      </div>
    </div>
    <div class="video_img">
      <div class="title">
        <p class="tilte_icon">国际钢琴大师郎朗亲测推荐
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
        <p>点击下方观看郎朗评测视频</p>
      </div>
      <img :src="`${imgPath}/referral_0624/langlang_review_video.png`" alt="" @click="playVideo(1)" id="video_sensors">
    </div>
    <div class="video_box" id="video_box" ref='video_box' :class="videoState?'play':''">
      <div class="video-poster">
        <div class="video_close" id="video_close" @click="videoClose">
          <img :src="`${imgPath}/referral_0624/close.png`" alt="视频关闭按钮">
        </div>
        <video id="video" class="video" :src="videoUrl" controls />
      </div>
    </div>
    <div class="landing3 text">
      <div class="title">
        <p class="tilte_icon">小叶子智能陪练APP
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
        <p>让孩子科学高效练琴</p>
      </div>
      <div class="content_box">
        <ul>
          <li style="margin: 0">
            <p>AI自动标出需重点练习片段</p>
            <img :src="`${imgPath}/referral_0624/play_piano_01.png`" alt="AI自动标出需重点练习片段">
          </li>
          <li>
            <p>弹奏有打分，弹得好不好一目了然</p>
            <img :src="`${imgPath}/referral_0624/play_piano_02.png`" alt="弹奏有打分，弹得好不好一目了然">
          </li>
          <li>
            <p>找不到音有提示，提升孩子识谱能力</p>
            <img :src="`${imgPath}/referral_0624/play_piano_03.png`" alt="找不到音有提示，提升孩子识谱能力">
          </li>
          <li>
            <p>360度演奏示范，指法手型有参考</p>
            <img :src="`${imgPath}/referral_0624/play_piano_04.png`" alt="360度演奏示范，指法手型有参考">
          </li>
        </ul>
      </div>
    </div>
    <div class="landing4 text">
      <div class="title">
        <p class="tilte_icon">从小汤到十级
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
        <p>曲谱全覆盖</p>
      </div>
      <img :src="`${imgPath}/referral_0624/operns.png`" alt="曲谱全都有">
    </div>
    <div class="landing6 text">
      <div class="title">
        <p class="tilte_icon">使用说明
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
      </div>
      <img :src="`${imgPath}/referral_0624/user.png`" alt="使用说明">
    </div>
    <div class="g-sec sec-6">
      <div class="title">
        <p class="tilte_icon">媒体报道
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
      </div>
      <div class="media-content">
        <div class="item">
          <div class="img-con" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/news_guangming.png)`
          }">
            
          </div>
          <div class="media">
            小叶子音乐教育AI产品亮相国际人工智能与教育大会
          </div>
        </div>
        <div class="item">
          <div class="img-con" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/news_wangyi.png)`
          }">

          </div>
          <div class="media">
            科技改变生活AI高科技让孩子告别“错音”
          </div>
        </div>
        <div class="item">
          <div class="img-con" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/news_sina.png)`
          }">

          </div>
          <div class="media">
            颠覆传统行业钢琴陪练也可以用AI智能APP了
          </div>
        </div>
        <div class="item">
          <div class="img-con" style="padding-top: 12px" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/news_chinadaily.png)`
          }">
          </div>
          <div class="media">
            这款AI陪练软件能让孩子“不弹错”
          </div>
        </div>
      </div>
    </div>
    <div class="landing8 text">
      <div class="title">
        <p class="tilte_icon">他们都信赖推荐
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
        <p>创新工场、红杉资本、真格基金等<br>知名机构投资推荐</p>
      </div>
      <img :src="`${imgPath}/referral_0624/logos.png`" alt="">
    </div>
    <div class="landing9 text">
      <div class="title">
        <p class="tilte_icon">关于小叶子
          <span class="icon" :style="{
            backgroundImage: `url(${imgPath}/referral_0624/title_icon.png)`
          }"></span>
        </p>
      </div>
      <div class="content_box">
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小叶子音乐教育成立于2013年，是一家AI驱动的科技音乐教育公司，致力于通过优秀的产品让钢琴学习变得简单、高效。旗下TheONE智能钢琴已连续六年销量位居天猫11.11同品类前列；智能钢琴教室在全球已有5000余家。小叶子的智能陪练模式，通过AI纠错解放琴童和家长，用户遍布全国各地。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小叶子音乐教育由国际钢琴大师郎朗投资并代言，并获得李开复创新工场、红杉资本、真格基金等机构的投资。</p>
      </div>
    </div>
    <div class="foot" :style="{
      backgroundImage: `url(${imgPath}/referral_0624/bot-fix-bg.png)`
    }">
      <div class="fee">
        <span>0</span>元
      </div>
      <div class="fee-sub">
        新用户专享
        <p>5天体验营</p>
      </div>
      <button :disabled="disabled" v-if="mobile" :style="{
        backgroundImage: `url(${imgPath}/referral_0624/btn.png)`
      }" class="foot_btn2" @click="apply()">立即抢</button>

      <button :disabled="disabled" v-else  open-type="getPhoneNumber" @getphonenumber="getphonenumber"  :style="{
        backgroundImage: `url(${imgPath}/referral_0624/btn.png)`
      }" class="foot_btn2" @click="apply()">立即抢</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mobile: Number,
    disabled: Boolean
  },
  data() {
    return {
      imgPath: process.env.VUE_APP_IMG_PATH + '/ai_mina',
      maskshow: false,
      videoState: false,
      videoPlaying: false,
      startTime: 0,
      endTime: 0,
      videoUrl: 'https://static.xiaoyezi.com/videos/aipl/langngAIG.mp4'
    }
  },
  methods: {
    closemask() {
      this.maskshow = false
    },

    playVideo(index) {
      if (index === 1) {
        this.videoUrl = 'https://static.xiaoyezi.com/videos/aipl/langngAIG.mp4'
      } else {
        this.videoUrl = 'https://static.xiaoyezi.com/videos/aipl/lack.mp4'
      }
      this.videoContext = wx.createVideoContext('video')
      // this.videoContext.requestFullScreen()
      this.videoState = true
      this.videoContext.play()
      this.videoPlaying = true
    },
    videoPause() {
      this.videoContext.pause()
      this.videoPlaying = false
    },
    videoClose() {
      this.videoContext.pause()
      this.videoState = false
      this.videoPlaying = false
    },
    getphonenumber ({ detail }) {
      this.$emit('getphonenumber', {
        detail 
      })
    },
    apply(text, id) {
      console.log('apply', this.mobile)
      if (this.mobile) {
        this.$emit('handleGetting')
      } else {
        this.$emit('handleBtnClick')
      }
    }
  }
}
</script>

<style scoped lang="less">
@keyframes breath {
	0% {
    transform: scale(1)
    }
	50% {
    transform: scale(1.13)
  }
  100% {
    transform: scale(1)
  }
}
  .content{
    background: #dfffe8;
    padding-bottom: 120px;
    .video_img{
      text-align: center;
      img {
        width: 691px;
        height: 398px;
        margin: 0 auto;
        box-shadow: 0px 7px 33px 7px rgba(33, 170, 91, 0.23);
        border-radius: 28px;
      }
    }
    img{
      width: 100%;
      height: 100%
    }
    .text{
      text-align: center;
    }
    .video_box{
      display: none;
      z-index: 1;
      position: fixed;
      align-items: center;
      justify-content: center;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
    }
    .video-poster{
      width: 750px;
      position: relative;
    }
    .video{
      width: 750px;
      height: 600px;
    }
    .poster{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background-repeat: no-repeat;
      background-position: 50%;
    }
    .video_close{
      z-index: 2;
      position: absolute;
      right: 20px;
      top: 20px;
      width: 32px;
      height: 32px;
      background-color: #000;;
    }
    .video_close img{
      width: 100%;
      height:100%;
    }
    .play{
      display: flex;
    }
  }
  .foot{
    z-index: 998;
    width: 750px;
    height:122px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .fee {
      padding: 0 38px;
      font-size: 30px;
      text-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.1);
      color: #fff;
      span {
        font-size: 100px;
      }
    }
    .fee-sub {
      color: #fff;
      font-size: 26px;
      text-align: center;
      p {
        font-size: 24px;
        color: #333;
        font-style: italic;
        background-color: #fff;
        line-height: 40px;
        border-radius: 40px;
        padding: 0 28px;
        margin-top: 8px;
      }
    }
    .foot_btn2{
      background-size: contain;
      margin-left: 146px;
      width: 256px;
      height: 91px;
      font-size: 28px;
      color: #fff;
      line-height: 82px;
      animation: breath 1.2s linear .5s infinite;
    }
  }
  .title {
    position: relative;
    margin-top: 60px;
    width: 100%;
    text-align: center;
    padding-bottom: 38px;
    color: #3e3e3e;
  }
  .title>p:nth-child(1){
    font-weight: 500;
    font-size: 48px;
    text-align: center;
    width: inherit;
    margin: 0 auto;
    position: relative;
    width: auto;
    display: inline-block;
  }

  .title>p:nth-child(2){
    font-size: 33px;
    text-align: center;
  }
  .tilte_icon .icon{
    display: block;
    position: absolute;
    content: '';
    top: -27px;
    left: -108px;
    display: block;
    height: 80px;
    width: 102px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .landing3{
    .content_box{
      padding: 0 30px;
    }
    ul{
      background: #fff;
      padding: 50px 30px;
      border-radius: 20px;
      margin: 0 auto 0;
      box-shadow: 0px 7px 33px 7px rgba(33, 170, 91, 0.23);
      li{
        margin-top: 69px;
        p{
          text-align: center;
          font-size: 34px;
          font-weight: 500;
          margin-bottom: 23px;
        }
        &:nth-child(1) {
          img {
            width: 678px;
            height: 489px;
          }
        }
        &:nth-child(2) {
          img {
            width: 677px;
            height: 496px;
          }
        }
        &:nth-child(3) {
          img {
            width: 679px;
            height: 489px;
          }
        }
        &:nth-child(4) {
          img {
            width: 679px;
            height: 419px;
          }
        }
      }
    }
  }
  .landing4{
    padding-bottom: 40px;
    img {
      width: 750px;
      height: 705px;
    }
  }
  .landing1{
    position: relative;
    overflow: hidden;
    img  {
      width: 750px;
      height: 798px;
    }
  }
  .landing6{
    .title {
      margin-top: 48px;
      padding-bottom: 32px;
    }
    img {
      width: 735px;
      height: 991px;
    }
  }
  .landing8 {
    .title {
      margin-top: 56px;
      padding-bottom: 32px;
    }
    img {
      margin-top: 20px;
      padding: 0 28px;
      width: 693px;
      height: 704px;
    }
  }
  .landing9 {
    padding-bottom: 69px;
    .title {
      margin-top: 90px;
    }
    .content_box {
      margin: 0 auto;
      width: 693px;
      background-color: #fff;
      border-radius: 28px;
      border: solid 1px #40d469;
      padding: 50px 42px 49px 32px;
      p {
        font-size: 30px;
        line-height: 48px;
        letter-spacing: -1px;
        text-align: justify;
      }
    }
  }
  .sec-6{
    .media-content {
      margin: 0 auto;
      width: 693px;
      background-color: #fff;
      border-radius: 28px;
      border: solid 1px #40d469;
      padding: 60px 32px 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 295px;
        .img-con {
          width: 295px;
          height: 132px;
          background-color: #ffffff;
          border-radius: 10px;
          border: solid 1px #40d469;
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center center;
        }
        .media {
          font-size: 24px;
          color: #596766;
          padding: 20px 0 45px;
        }
        &:nth-child(1) {
          .img-con {
            background-size: auto 80%;
          }
        }
        &:nth-child(4) {
          .img-con {
            background-size: 90% auto;
          }
        }
      }
    }
  }
</style>
