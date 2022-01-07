
<script>
import { baseApi, api } from '@/api';
export default {
  async onLaunch (options) {
    // 初始化token
    const token = this.Storage.get('token');
    if (token) {
      baseApi.setHeader('token', token);
    }
    this.globalData.launchOptions = options
    // 如果需要使用 openid 作为匿名 ID，请单独获取 openid 之后调用 sensors.setOpenid() 方法
    let res = await api.getIndexData()
    if (res.openid) {
      console.log('second_id openid');
      this.sa.setOpenid(res.openid)
      this.sa.init();
    } else {
      // 如果获取 openid 失败，SDK 会以 UUID 作为匿名 ID 发数据
      this.sa.init();
    }
  },
  globalData () {
    return {
      launchOptions: {},
      country_code: '',
      form: {},
      mobile: '',
      had_purchased: false
    }
  }
}
</script>
