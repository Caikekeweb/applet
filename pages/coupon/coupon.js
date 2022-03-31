const $api = require('../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    totalPage: 0,
    datalist: [],
    CustomBar: app.globalData.CustomBar,
    usertypeDall: {
      '01': '现金券',
      '02': '面值券',
      '03': '礼品券',
      '04': '折扣券',
      '05': '满减券'
    },
    imgOrigin: app.globalData.imgOrigin,
    loading: false,
    timer: null // 定时器
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
    this.getCoupon(1)
  },
  // 获取券列表
  getCoupon: function (page_no) {
    const memberInfo = app.globalData.MemberInfo || {}
    this.setData({
      loading: true
    })
    $api.getActivityList({
      ctype: memberInfo.cust_type,
      event_type_code: '3',
      category_code: '',
      status: "N,Y,O",
      page_no,
      page_size: 10
    }).then(res => {
      const data = res.data.Data || {}
      const totalPage = Math.ceil((data.total_results || 0) / 10)
      let datalist = this.formatData(data.datalist)
      if (page_no > 1 && page_no <= totalPage) {
        datalist = this.data.datalist.concat(datalist)
      }
      this.activityCountDown(datalist)
      this.setData({
        pageIndex: page_no,
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
    const timeKey = ['validity_sdate', 'validity_edate']
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
      // 格式化倒计时
      x.countdown = parseInt(x.countdown)
      // 是否已领取
      x.isGet = ['01', '03'].some(y => y === x.status)
      // 是否已抢光
      x.isRobbedAll = ['04', '05'].some(y => y === x.status)
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
  // 活动倒计时
  activityCountDown: function (list) {
    const hasNoBegin = list.some(x => x.countdown > 0)
    function prefixInteger (num, length) {
      return (Array(length).join('0') + num).slice(-length);
     }
    if (hasNoBegin) {
      const timer = setInterval(() => {
        list.forEach((item) => {
          if (item.countdown > 0) {
            item.countdown--
            const hour = Math.floor(item.countdown / 3600) + ""
            item.hour = hour.length < 2 ? '0' + hour : hour
            item.minute = prefixInteger(Math.floor((item.countdown % 3600) / 60), 2)
            item.second = prefixInteger(item.countdown % 60, 2)
            if (item.countdown === 0) {
              item.status = 'Y'
            }
          }
        })
        this.setData({
          datalist: list
        })
      }, 1000);
      this.setData({
        timer
      })
    } else {
      clearInterval(this.data.timer)
    }
  },
  sunscribe(e) {
    const that = this
    const tempId = 'nue1r5ThdaPqp83WJ6r3AxHe8TM_WOD17bFo7aGucmU'
    wx.requestSubscribeMessage({
      tmplIds: [tempId],
      complete (res) {
        const isAgree = res[tempId] === 'accept'
        that.submitCoupon(e, isAgree)
      }
    })
  },
  // 抢券
  submitCoupon: function (e, isAgree) {
    const memberInfo = app.globalData.MemberInfo
    const rowData = this.data.datalist[e.target.dataset.index]
    wx.showLoading({
      title: '领取中',
    })
    $api.postObtainCoupon({
      ctype: memberInfo.cust_type,
      event_id: rowData.event_id
    }).then((res) => {
      if (res.data.Success) {
        this.getCoupon(1)
        wx.hideLoading()
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        })
        if (isAgree) {
          $api.sendWxMessage({
            CouponName: rowData.coupon_name,
            ExpireTime: rowData.event_exp_datetime,
            TipMessage: ''
          })
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.data.Message,
          icon: 'error'
        })
      }
    })
  },
  toggleFold: function (e) {
    const index = e.currentTarget.dataset.index
    const list = this.data.datalist
    const memberInfo = app.globalData.MemberInfo || {}
    list[index].isFold = !list[index].isFold
    this.setData({
      datalist: list
    })
    if (list[index].accnt_market_txt.length === 0) {
      $api.getActivityDetail({
        ctype: memberInfo.cust_type,
        event_id: list[index].event_id
      }).then(res => {
        const data = res.data.Data || {}
        list[index].accnt_market_txt = (data.accnt_market || []).join('、')
        this.setData({
          datalist: list
        })
      })
    }
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
      this.getCoupon(thisData.pageIndex + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})