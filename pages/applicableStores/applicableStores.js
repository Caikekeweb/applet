const app = getApp()
const $api = require('../../api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    iconPhone: app.globalData.imgOrigin + 'phone.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryData()
  },
  queryData() {
    $api.getDecorationData ({
      RequestType: 103
    }).then(res => {
      const dataList = (res.data || []).sort((a, b) => a.Sort > b.Sort)
      this.setData({
        dataList
      })
    })
  },
  callPhone: function (e) {
    const index = e.currentTarget.dataset.index
    wx.makePhoneCall({
      phoneNumber: this.data.dataList[index].Contact
    })
  }
})