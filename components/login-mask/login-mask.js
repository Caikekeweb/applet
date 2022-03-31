// components/login-mask/login-mask.js
const $api = require('../../api/index.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      default: false
    },
    isCheckLogin: {
      type: Boolean,
      default: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  observers: {},
  /**
   * 组件的方法列表
   */
  methods: {
    cancel: function () {
      this.setData({
        visible: false
      })
      this.triggerEvent('cancel')
    },
    sure: function () {
      this.setData({
        visible: false
      })
      wx.navigateTo({
        url: '../../pages/perfectInformation/perfectInformation',
      })
    },
    getPhoneNumber(e) {
      this.setData({
        visible: false
      })
      $api.getWxPhoneNum({
        iv: e.detail.iv || '',
        encryptedData: e.detail.encryptedData || ''
      }).then((data) => {
        wx.navigateTo({
          url: `../../pages/phoneVerification/phoneVerification?purePhoneNumber=${data.purePhoneNumber || ''}&countryCode=${data.countryCode || '86'}`,
        })
      })
    },
  }
})
