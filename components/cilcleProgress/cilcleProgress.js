// components/cilcleProgress/cilcleProgress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent: Number,
    isReceive: Boolean,
    disabled: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    rightRotate: 0,
    leftRotate: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  observers: {
    percent: function (val) {
      const deg = (270 * val) / 100
      this.setData({
        rightRotate: Math.min(deg, 180),
        leftRotate: deg > 180 ? deg-180 : 0
      })
    }
  }
})
