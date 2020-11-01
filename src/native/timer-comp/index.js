Component({
  externalClasses: [],
  properties: {
		isBottom: {
			type: Boolean,
			value: true,
		}
	},
	data: {
		totalTime: 10 * 60 * 60,
		timer: '',
		minute: '09',
		second: '59',
		millisecond: '59'
	},
	pageLifetimes: {
		show() {}
	},
	lifetimes: {
    attached() {
			this.countDown()
		},
    detached() {
			clearTimeout(this.data.timer)
			this.setData({
				timer: null
			})
		}
  },
	methods: {
		countDown() {
      clearTimeout(this.data.timer)
      this.data.timer = setTimeout(() => {
				--this.data.totalTime
        let m = Math.floor(this.data.totalTime / 60 / 60)
        let s = Math.floor(this.data.totalTime / 60 % 60)
        let ms = Math.floor(this.data.totalTime % 60)
        m = m > 9 ? m : '0' + m
        s = s > 9 ? s : '0' + s
        ms = ms > 9 ? ms : '0' + ms
				this.setData({
					minute: m,
					second: s,
					millisecond: ms
				})
        if (this.data.totalTime >= 1) {
          this.countDown()
        }
      }, 1000 / 60)
    },
	}
})