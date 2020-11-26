
<script>
import { baseApi } from '@/api';
export default {
  async onLaunch (options) {
    // 初始化token
    const token = this.Storage.get('token');
    if (token) {
      baseApi.setHeader('token', token);
    }
  },
  globalData () {
    return {
      country_code: '',
      form: {},
      mobile: '',
      had_purchased: false
    }
  }
}
</script>
