# ai_referral_mina

正式小程序 appid: wx1e510aa83c656664 原始id: gh_c87407fc78e1 名称： 中国珠宝

## 运行

测试环境：

```bash
npm run build:dev
```

线上环境：

```bash
npm run build:production
```

需求

```bash
  落地页 ai展馆 新品展示馆 我的奖品 活动说明 参与店铺 那些需要先授权
  AI互动
  新品展示
  分享获得奖品
  奖品列表 用户如获得品牌一、二等奖，需在活动期间填写收货地址及联系人，逾期不可填写。没有获奖显示去参
    '/referral_miniapp/user_prize/list' 获取用户奖励列表 get
    '/referral_miniapp/share_prize/make' 获得分享奖励 post
  产品展示
  参与店铺查询 '/referral_miniapp/shop/list' 获取参与店铺列表
  用户地址编辑 每个用户就一个地址可以编辑
    '/referral_miniapp/area/province' 省
    '/referral_miniapp/area/city' 市

  活动介绍
  分享 通知后端 接口未出

  问题
    引导关注微信公众号？      ：查一下
    AI 插件自己生成 还是后端  ：腾讯人脸融合 已完成
    分享海报                ：分享到微信 或小红书 小红书这个能不能实现
    图片                   : 存在cos上 图片格式 JPG JPEG PNG 20MB 大于128 小于2000像素 url地址不能有中文字符
    两图合并                ：腾讯阿里小程序
获取模版
  '/referral_miniapp/template/list'
  template列表
    template_id
    多脸换图 有 faces
换脸
  '/referral_miniapp/aiface/change'
  参数
    template_id
    类型 type
      每天三次 1
      分享获得 2
    单人：
      url oss生成的链接 oss目录 source_pic/
    多人：
      faces: [
        {
          "TemplateFaceID":"xxxx",
          "ImageURL": oss生成的链接
        },
        {
          "TemplateFaceID":"xxxx",
          "ImageURL": oss生成的链接
        },
      ]
  返回
    TemplateFaceID
    URL
换脸后的图片可以下载到本地 https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html

```
