const $api = require('../../api/index')
const app = getApp()
const IMAG_ORIGIN = app.globalData.imgOrigin
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    CustomBar: app.globalData.CustomBar,
  },
  goPage (e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '../../pages/willBeFree/webView?url=' + encodeURI(url),
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryData()
  },
  queryData() {
    $api.getMarketingData({
      RequestType: 5
    }).then(res => {
      const dataList = (res.data || []).sort((a, b) => a.Sort > b.Sort)
      this.setData({
        dataList
      })
    })
  },
})