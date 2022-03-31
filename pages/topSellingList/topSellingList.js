const app = getApp()
const $api = require('../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablist: [],
    TabCur: 0,
    scrollLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTab()
  },
  getTab() {
    $api.getMarketingData({
      RequestType: 11
    }).then(res => {
      const tablist = (res.data || []).reduce((pre,cur) => {
        pre.push({
          name: cur.BusinessName,
          id: cur.BusinessId,
          appid: cur.AppId,
          sort: cur.Sort,
          goods: []
        })
        return pre
      }, []).sort((a, b) => a.sort > b.sort)
      this.queryData(tablist)
    })
  },
  queryData(tablist) {
    $api.getMarketingData({
      RequestType: 12
    }).then(res => {
      const data = (res.data || []).map((cur) => {
        return {
          id: cur.BusinessId,
          title: cur.Title,
          subTitle: cur.SubTitle || '',
          page: cur.Url,
          imgurl: cur.ImagePath,
          sort: cur.Sort
        }
      })
      tablist.forEach(item => {
        item.goods = data.filter(x => x.id === item.id).sort((a, b) => a.sort > b.sort)
      })
      this.setData({
        tablist
      })
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  purchaseGoods(e) {
    const index = e.currentTarget.dataset.index
    const rowData = this.data.tablist[this.data.TabCur]
    wx.navigateToMiniProgram({
      appId: rowData.appid,
      path: rowData.goods[index].page,
      success(res) {
        console.log(res)
      }
    })
  }
})