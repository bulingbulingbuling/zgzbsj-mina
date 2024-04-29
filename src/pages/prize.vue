<template>
  <div class="prize">
    <headerNavBar :hasHeight="false" isTransparent="isTransparent" title="我的奖品" />
    <img class="bg" src="@/static/imgs/pageBg.png" alt="" />
    <div class="title">
      <img class="endTime" src="@/static/imgs/endTimeBg.png" alt="" />
      领奖有效期： {{ endTime }}
    </div>
    <div class="content">
      <div class="likeTab">
        <img class="tabBg" src="@/static/imgs/tabBg.png" alt="" />
        <div class="indexBtn" @click="handleTab('prize')">
          <div class="text" :class="{active: activeBtn === 'prize'}">奖品明细</div>
          <img v-if="activeBtn === 'prize'" class="tabImg" src="@/static/imgs/activeTab.png" alt="">
        </div>
        <div class="indexBtn" @click="handleTab('explain')">
          <div class="text" :class="{active: activeBtn === 'explain'}">奖品说明</div>
          <img v-if="activeBtn === 'explain'" class="tabImg" src="@/static/imgs/activeTab.png" alt="">
        </div>
      </div>
      <div v-if="activeBtn === 'prize' && prizeList !== null">
        <div class="prize-list" v-if="prizeList.length">
          <div class="prize-item" v-for="item in prizeList" :key="item.id">
            <div class="itemTitle">{{ item.prize_content }}</div>
            <div class="bottomLine">
              <div class="left-time" v-if="Number(item.is_used) !== -1">{{ item.expire_time ? `${item.expire_time}到期` : '永久有效' }}</div>
              <div class="left-time" v-else>已过期</div>
              <div class="list-right" @click="handleUse(item)" v-if="item.is_used && Number(item.is_used) !== -1">
                <div class="right-btn" v-if="Number(item.prize_type) === 4">立即使用</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <div>“繁花有礼，璀璨入画”</div>
          <p>参与「AI互动」活动，并转发、分享生成的专属中华美学大片，即有机会获得品牌心动好礼！</p>
        </div>
      </div>
      <div class="prizeExplain" v-if="activeBtn === 'explain'">
        <p>一等奖：2名，中国珠宝「足金转运珠手串」1条</p>
        <p>二等奖：50名，中国珠宝「中华美学绢扇」1把</p>
        <p>三等奖：520名，「AI互动」当日生成图片次数+1次</p>
        <div>
          <p>【品牌奖品赢取及领取规则】</p>
        </div>
        <p>用户通过参与「AI互动」，并转发、分享AI生成的海报，将有机会赢取品牌心动好礼。</p>
        <p>用户获得的奖品，请移步至小程序「我的奖品」中查看。</p>
        <p>用户获得品牌一、二等奖，需在活动期间内，移步至“中国珠宝”微信公众号，关注公众号，后台留言“AI互动X等奖+获奖手机号码+奖品收货地址及联系人信息”（例：AI互动一等奖 + 13XXXXXXXXX + XX省XX市XX区XX街道XXX号，张三 13XXXXXXXXX）。逾期未按规则留言则视为放弃奖品。</p>
        <p>用户获得品牌三等奖「AI互动」当日生成图片次数+1次，请在当日内使用。该次数每日刷新，未使用的次数次日不做累计叠加。</p>
      </div>
    </div>
    <div class="foot" @click="backHome()">
      <img class="backBtn" src="@/static/imgs/pageback.png" alt="" />
      返 回
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
      prizeList: null,
      activeBtn: 'prize',
      endTime: '2024年05月31日'
    }
  },
  async created() {
    wx.getNetworkType({
      success: (res) => {
        this.handleNetError(res)
      }
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },
  // 设置自定义转发的内容
  onShareAppMessage() {
    return {
      title: '一键生成属于你的AI中华美学大片',
      path: `/pages/index`,
      imageUrl: process.env.VUE_APP_SHARE_URL
    }
  },
  methods: {
    handleNetError(res) {
      if (res.networkType === 'none') {
        this.isNetError = true
        this.toast('当前网络异常，请检查网络后再试')
      } else {
        this.getPrizeList()
      }
    },
    handleUseprize() {
      wx.navigateTo({
        url: '/pages/shop'
      })
    },
    handleTab(type) {
      this.activeBtn = type
    },
    handleUse(item) {
      switch (Number(item.prize_type)) {
        case 4:
          this.go('/pages/aiHall')
          break
        default:
      }
    },
    backHome() {
      this.go('/pages/index')
    },
    async getPrizeList() {
      const res = await api.getPrizeList()
      this.prizeList = res.user_prize
    }
  }
}
</script>
