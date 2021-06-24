
<script>
import { baseApi } from '@/api';
export default {
  async onLaunch (options) {
    // 初始化token
    const token = this.Storage.get('token');
    if (token) {
      baseApi.setHeader('token', token);
    }
    this.globalData.launchOptions = options
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
