const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    tablist: [{
        tabName: '全部',
        tabCode: '0',
        noDataTitle: '积分'
      },
      {
        tabName: '收入',
        tabCode: '1',
        noDataTitle: '收入'
      },
      {
        tabName: '支出',
        tabCode: '2',
        noDataTitle: '支出'
      },
      // {
      //   tabName: '预过期',
      //   tabCode: '3',
      //   noDataTitle: '预过期'
      // },
    ],
    datalist: [],
    pageIndex: 1,
    pageTotal: 1,
    jife: 0,
    imgOrigin: app.globalData.imgOrigin,
    loading: false,
    avatar: '',
    nickname: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccountConsume(1)
    this.setData({
      jife: app.globalData.jife,
      avatar: app.globalData.Head || app.globalData.defaultAvatarUrl,
      nickname: app.globalData.NickName || app.globalData.PhoneNo
    })
  },
  getAccountConsume: function (pageIndex) {
    this.setData({
      loading: true
    })
    $api.getIntegralList({
      page_no: pageIndex,
      page_size: 10,
      type: this.data.tabIndex
    }).then((res) => {
      const data = res.data.Data || {}
      let datalist = data.cust_accnt_logs || data.cust_accnts || []
      if (pageIndex > 1) {
        datalist = this.data.datalist.concat(datalist)
      }
      this.setData({
        datalist,
        pageIndex,
        pageTotal: Math.ceil(data.total_results / 10),
        loading: false
      })
    }).catch(() => {
      this.setData({
        loading: false
      })
    })
  },

  switchTab: function (e) {
    const index = e.target.dataset.index
    this.setData({
      tabIndex: index,
      datalist: [],
    })
    this.getAccountConsume(1)
  },
  scrolltolower: function () {
    const index = this.data.pageIndex
    if (index < this.data.pageTotal) {
      this.getAccountConsume(index + 1)
    }
  },
  toRulePage() {
    wx.navigateTo({
      url: '../../pages/my/webview',
    })
  }
})