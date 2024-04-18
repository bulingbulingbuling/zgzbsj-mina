<template>
  <div class="shop">
    <div class="city" v-if="true">
      <div class="city-title">请选择所在地区</div>
      <div class="city-sub-title">选择省份/地区</div>
      <div class="city-list">
        <div class="list-item">
          <div class="left">A</div>
          <div class="right">
            <div class="item">安徽省1</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>
            <div class="item">安徽省2</div>

          </div>
        </div>
        <div class="list-item">
          <div class="left">B</div>
          <div class="right">
            <div class="item">北京市</div>
            <div class="item">广东省</div>
          </div>
        </div>

      </div>
    </div>
    <div class="list" v-if="false">
      <div class="list-title"> 泉州市</div>
      <div class="shop-card">
        <div class="card-title">中国珠宝泉州分公司</div>
        <div class="card-item">电话：0323-4873726</div>
        <div class="card-item">地址：泉州市 南京路 新街口街</div>
        <div class="card-item">营业时间：09:00-18:00</div>
      </div>
      <div class="shop-card">
        <div class="card-title">中国珠宝泉州分公司</div>
        <div class="card-item">电话：0323-4873726</div>
        <div class="card-item">地址：泉州市 南京路 新街口街</div>
        <div class="card-item">营业时间：09:00-18:00</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>
