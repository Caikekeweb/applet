const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    residualTaxAllowance: "",
    taxDeductible: "",
    zhanghao: '',
    userName: '',
    idType: '身份证',
    idNo: '',
    timeStart: '',
    timeEnd: '',
    goodDetail: [
      {
        name: '化妆品',
        type: '05',
        count: 30,
        unit : '件',
        limitCount: 30
      },
      {
        name: '酒',
        type: '47',
        count: 1500,
        unit : 'ml',
        limitCount: 1500
      },
      {
        name: '手机',
        type: '45',
        count: 4,
        unit : '台',
        limitCount: 4
      }
    ],
    loading: false,
    isFinishInfo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isFinishInfo: app.globalData.IsFinishInfo
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
    const memberInfo = app.globalData.MemberInfo || {}
    const custmember = memberInfo.custmember || {}
    this.queryQuotaUsed(custmember.cmidno)
    const date = new Date()
    const curYear = date.getFullYear()
    const curMonth = date.getMonth() + 1
    const curDate = date.getDate()
    this.setData({
      zhanghao: memberInfo.mobile,
      userName: memberInfo.name,
      idNo: custmember.cmidno.slice(0, 6) + '*****' + custmember.cmidno.slice(-4),
      timeStart: curYear + '-01-01',
      timeEnd: curYear + '-' + curMonth + '-' + curDate
    })
  },
  queryQuotaUsed(idno) {
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    $api.queryQuotaUsed({
      idtype: '2',
      idno
    }).then(res => {
      const data = res.data.Data || {}
      wx.hideLoading()
      this.setData({
        head: data.Head,
        goodDetail: data.Detail || [],
        loading: false
      })
    })
  },
  toFinishMsg: function () {
    wx.navigateTo({
      url: '../../pages/perfectInformation/perfectInformation',
    })
  },
  toBack: function () {
    wx.navigateBack({
      delta: 1,
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