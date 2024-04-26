<template>
  <div class="rulesWrap">
    <headerNavBar :hasHeight="false" isTransparent="isTransparent" title="活动说明" />
    <img class="bg" src="@/static/imgs/pageBg.png" alt="" />
    <div class="content">
      <div class="subTitle">
        <div class="text">活动规则</div>
        <img class="subTitleBg" src="@/static/imgs/ruleTitleBg.png" alt="">
      </div>
      <div class="rulesExplain">
        <p>活动背景。介绍活动的整体市场情况、竞争对手状况以及以往活动的情况，为读者提供活动的背景信息。</p>
        <br>
        <p>1、活动目的。明确说明举办此次活动的目的，包括希望达到的效果。活动主题。简洁明了地阐述活动的主题，并对其进行适当阐释，以吸引读者兴趣。活动内容。详细列出活动的具体时间、分为哪些部分以及每部分的详细内容，包括活动细节人员安排。对参与活动的人员（如工作人员、志愿者、表演者等）进行安排，并考虑第三方公司（如有）的参与和安排。物料准备。重视物资和道具的准备，合理的物料准备能提升活动现场的气氛。活动预算。详细列出活动的费用，包括活动事</p>
        <p>2、领奖规则。说明领奖的具体流程，包括领奖时间、条件和方式。注意事项和限制。提醒参与者注意的事项，如参与条件、时间限制等。争议解决办法。如果活动过程中出现争议，应明合同条款。如果活动涉及合作或服务购买，应详细说明合作双方的职责、权利和义务，以及合同生效条件和争议解决方式。</p>
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
export default {
  data () {
    return {
    }
  },
  methods: {
    backHome() {
      this.go('/pages/index')
    }
  }
}
</script>
