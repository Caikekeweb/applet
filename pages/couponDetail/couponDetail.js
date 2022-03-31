const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgInfo: {},
    isHideCode: true,
    codeInfo: {},
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponInfo(options.coupon_no)
    this.getCouponQrCode(options.coupon_no)
    const timer = setInterval(() => {
      this.getCouponQrCode(options.coupon_no)
    }, 10000);
    this.setData({
      timer
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getCouponInfo: function (coupon_no) {
    const memberInfo = app.globalData.MemberInfo
    $api.getCouponInfo({
      ctype: memberInfo.cust_type,
      coupon_no,
    }).then(res => {
      const info = res.data.Data || {}
      info.eff_date = this.formatTime(info.eff_date)
      info.exp_date = this.formatTime(info.exp_date)
      info.codeHideTxt = (info.qrcode || '').slice(0, 4) + '*****'+ "查看数字"
      info.accnt_market_txt = (info.accnt_market || []).join('、')
      this.setData({
        msgInfo: info
      })
    })
  },
  formatTime: function (str) {
    return (str || '').split(' ')[0].replace(/-/g, '.')
  },
  toggleCodeStaus: function () {
    this.setData({
      isHideCode: !this.data.isHideCode
    })
  },
  getCouponQrCode: function (coupon_no) {
    $api.getCouponQrCode({
      coupon_no
    }).then(res => {
      console.log(res)
      this.setData({
        codeInfo: res.data.Data
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})