const $util = require('../../utils/util')
const $api = require('../../api/index')
const app = getApp()
const IMAG_ORIGIN = 'https://szhy.szdutyfree.com.cn/applet/image/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    $util.setCustomTab(this, 1)
    this.queryData()
  },

  goDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const rowData = this.data.dataList[index]
    wx.navigateToMiniProgram({
      appId: rowData.AppId,
      path: rowData.Url,
      success(res) {
        console.log(res)
      }
    })
  },
  queryData() {
    $api.getMarketingData({
      RequestType: 2
    }).then(res => {
      const dataList = (res.data || []).sort((a, b) => a.Sort > b.Sort)
      this.setData({
        dataList
      })
    })
  },
})