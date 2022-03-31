// pages/address/address.js
const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgOrigin: app.globalData.imgOrigin,
    dataList: []
  },
  onShow: function () {
    this.queryData()
  },
  queryData() {
    $api.getAddress({
      page_no: 1,
      page_size: 100
    }).then(res => {
      console.log(res)
      this.setData({
        dataList: res.data.Data.custaddr || []
      })
    })
  },
  radioChange(e) {
    const index = +e.detail.value
    const dataList = this.data.dataList
    const param = dataList[index]
    param.isdefault = 'Y'
    $api.updateAddress(param).finally(() => {
      this.queryData()
    })
  },
  toEdit(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './edit?editindex='+ index,
    })
  },
  toAdd() {
    wx.navigateTo({
      url: './edit',
    })
  }
})