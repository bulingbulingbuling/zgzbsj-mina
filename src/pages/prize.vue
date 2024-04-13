<template>
  <div class="price">
    <div class="price-list">
      <div class="list-left">
        <div class="left-title">AI换脸次数两次</div>
        <div class="left-time">2014.5.30到期</div>
      </div>
      <div class="list-right">
        <div class="right-btn">立即使用</div>
      </div>
    </div>

    <div class="price-list">
      <div class="list-left">
        <div class="left-title">AI换脸次数两次</div>
        <div class="left-time">2014.5.30到期</div>
      </div>
      <div class="list-right">
        <div class="right-btn" @click="handleUsePrice">立即使用</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    handleUsePrice() {
      wx.navigateTo({
        url: '/pages/shop'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.price {
  padding: 20rpx;
  .price-list{
    border: 2px solid red;
    border-radius:20px;
    background: orange;
    margin:40rpx;
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .list-left{
      flex: 3;
      .left-title{
        margin-bottom: 20rpx;
        font-size: 40rpx;
        font-weight: bolder;
      }
    }
    .list-right{
      flex: 1;
      .right-btn{
        background: green;
        border-radius:20px;
        padding:10rpx;
        text-align:center;

      }
    }
  }
}
</style>
