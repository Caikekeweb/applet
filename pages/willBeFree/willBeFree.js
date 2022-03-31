const $api = require('../../api/index')
const app = getApp()
const $util = require('../../utils/util')
const IMAG_ORIGIN = 'https://szhy.szdutyfree.com.cn/applet/image/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftList: [],
    rightList: [],
    curStatus: 0,
    pageIndex: 1,
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $util.setCustomTab(this, 3)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryData()
  },
  toDetail: function (e) {
    const url = e.currentTarget.dataset.url
    console.log(url)
    wx.navigateTo({
      url: '../../pages/willBeFree/webView?url=' + encodeURI(url),
    })
  },
  queryData() {
    $api.getMarketingData({
      RequestType: 3
    }).then(res => {
      const dataList = (res.data || []).sort((a, b) => a.Sort > b.Sort)
      const leftList = dataList.filter((x, i) => i % 2 === 0)
      const rightList = dataList.filter((x, i) => i % 2 === 1)
      this.setData({
        leftList,
        rightList
      })
    })
  },
})