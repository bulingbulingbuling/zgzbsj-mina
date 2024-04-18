<template>
  <div class="prize">
    <div class="prize-list" v-for="item in prizeList" :key="item.id">
      <div class="list-left">
        <div class="left-title">{{ item.prize_content.replace('恭喜您获得', '') }}</div>
        <div class="left-time">{{ item.expire_time || '永久有效' }}到期</div>
      </div>
      <div class="list-right" @click="handleUse(item)">
        <div class="right-btn" v-if="Number(item.prize_type) === 4">立即使用</div>
        <div class="right-btn" v-else>立即领取</div>
      </div>
    </div>
  </div>
</template>

<script>

import { api } from '@/api'

export default {
  data () {
    return {
      prizeList: []
    }
  },
  async created() {
    wx.setNavigationBarTitle({
      title: '我的奖品'
    })
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
        this.getPrizeList()
      }
    },
    handleUseprize() {
      wx.navigateTo({
        url: '/pages/shop'
      })
    },
    handleUse(item) {
      switch (Number(item.prize_type)) {
        case 4:
          this.go('/pages/aiHall')
          break
        default:
      }
    },
    async getPrizeList() {
      const res = await api.getPrizeList()
      // type= 4 是AI次数。其他的有可能没有过期时间。expire_time = 0 ;
      this.prize = res.user_prize
    }
  }
}
</script>
