Component({
  externalClasses: [],
  properties: {
  },
  data: {
    currentIndex: 0,
    currentFace: {},
    list: [
      'https://img1.baidu.com/it/u=682342695,202492647&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
      'https://img2.baidu.com/it/u=2434201168,269190915&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
      'https://img1.baidu.com/it/u=1927287361,1667152263&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
      'https://img0.baidu.com/it/u=788044902,85816046&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
    ]
  },
  pageLifetimes: {
    show() {
      console.log('show')
    }
  },
  lifetimes: {
    attached() {
      console.log('attached')
    },
    detached() {
      console.log('detached')
    }
  },
  methods: {
  }
})
