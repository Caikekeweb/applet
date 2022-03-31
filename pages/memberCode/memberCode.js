const $util = require('../../utils/util')
const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: null,
    msgInfo: {},
    barcodeTxt: '',
    visible: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    $util.setCustomTab(this, 2)
    const isRegist = app.globalData.IsRegist
    if (isRegist) {
      this.getMemberQrCode()
      const timer = setInterval(() => {
        this.getMemberQrCode()
      }, 10000);
      this.setData({
        timer
      })
    } else {
      this.setData({
        visible: true,
      })
    }
  },
  goBack() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
  },
  /**
   * 获取二维码及一维码信息
  */
  getMemberQrCode: function () {
    $api.getMemberQrCode().then(res => {
      const data = res.data.Data[0]
      const barcodeTxt = data.barcode.slice(0, 4) + "*****" + data.barcode.slice(-4)
      this.setData({
        msgInfo: data,
        barcodeTxt,
      })
    })
  }
})