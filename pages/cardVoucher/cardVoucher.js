const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        name: '未使用',
        status: '01'
      },
      {
        name: '已使用',
        status: '02'
      },
      {
        name: '已过期',
        status: '03'
      },
    ],
    curStatusName: '未使用',
    curStatus: '01',
    pageIndex: 1,
    datalist: [],
    usertypeDall: {
      '01': '现金券',
      '02': '面值券',
      '03': '礼品券',
      '04': '折扣券',
      '05': '满减券',
    },
    CustomBar: app.globalData.CustomBar,
    imgOrigin: app.globalData.imgOrigin,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCouponList(1)
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
    const thisData = this.data
    if (thisData.pageIndex < thisData.totalPage) {
      this.getCouponList(thisData.pageIndex + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  switchTab: function (e) {
    const index = e.target.dataset.index
    const data = this.data.tabList[index]
    this.setData({
      curStatus: data.status,
      curStatusName: data.name,
      datalist: []
    })
    this.getCouponList(1)
  },
  /**
   * 获取券列表
   */
  getCouponList: function (pageIndex) {
    this.setData({
      loading: true
    })
    $api.getCouponList({
      page_no: pageIndex,
      page_size: 10,
      status: this.data.curStatus
    }).then((res) => {
      const data = res.data.Data || {}
      const totalPage = Math.ceil((data.total_results || 0) / 10)
      let datalist = this.formatData(data.datalist)
      if (pageIndex > 1 && pageIndex <= totalPage) {
        datalist = this.data.datalist.concat(datalist)
      }
      this.setData({
        pageIndex: pageIndex,
        totalPage,
        datalist,
        loading: false
      })
    }).catch(() => {
      this.setData({
        loading: false
      })
    })
  },
  formatData: function (list) {
    const timeKey = ['exp_date', 'eff_date']
    return list.map(x => {
      // 格式化时间
      timeKey.forEach(key => {
        x[key] = this.formatTime(x[key])
      })
      // 格式化金额
      if (x.promotion_type_code === '02') {
        x.facevalue = Math.round(parseFloat(x.facevalue) * 100) / 10
      } else {
        x.facevalue = parseInt(x.facevalue)
      }
      // 适用门店文本
      x.accnt_market_txt = (x.accnt_market || []).join('、')
      // 是否展开
      x.isFold = false
      return x
    })
  },
  formatTime: function (str) {
    return (str || '').split(' ')[0].replace(/-/g, '.')
  },
  navigateTo: function (e) {
    const rowData = this.data.datalist[e.currentTarget.dataset.index]
    console.log(rowData)
    wx.navigateTo({
      url: '../../pages/couponDetail/couponDetail?coupon_no=' + rowData.coupon_no,
    })
  },
  toggleFold: function (e) {
    const index = e.currentTarget.dataset.index
    const list = this.data.datalist
    list[index].isFold = !list[index].isFold
    this.setData({
      datalist: list
    })
  },
})