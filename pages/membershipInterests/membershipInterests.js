// pages/my/my.js
const app = getApp()
const $api = require('../../api/index.js')
const IMAG_ORIGIN = 'https://szhy.szdutyfree.com.cn/applet/image/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cust_type: '',
    cardCur: 0,
    swiperList: [{
      id: '01',
      gradeName: '黄金会员',
      percentage: 0,
      upgradeCzz: 20000,
      url: IMAG_ORIGIN + 'info_gold_card.png'
    }, {
      id: '02',
      gradeName: '铂金会员',
      class: 'vip-grade',
      percentage: 0,
      upgradeCzz: 50000,
      url: IMAG_ORIGIN + 'info_platinum_card.png'
    }, {
      id: '03',
      gradeName: '钻石会员',
      needCzz: 50000,
      url: IMAG_ORIGIN + 'info_diamond_card.png'
    }],
    accnt: {
      czz: 0 // 成长值
    },
    percentage: 0, // 当前成长值百分比
    curTab: 0,
    isLocked: false,
    jfData: {},
    interestsList: [
      {
        name: "多倍积分",
        icon:  IMAG_ORIGIN + "right_icon_integral.png",
        iconActive: IMAG_ORIGIN + "right_icon_integral_selected.png"
      },
      {
        name: "生日积分",
        icon: IMAG_ORIGIN + "right_icon_birth.png",
        iconActive: IMAG_ORIGIN + "right_icon_birth_selected.png"
      },
      {
        name: "积分抵现",
        icon: IMAG_ORIGIN + "right_icon_exchange.png",
        iconActive: IMAG_ORIGIN + "right_icon_exchange_selected.png"
      },
      {
        name: "生日礼遇",
        icon: IMAG_ORIGIN + "right_icon_gift.png",
        iconActive: IMAG_ORIGIN + "right_icon_gift_selected.png"
      }
    ],
    avatar: '',
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const tab = options.tab || 0
    this.queryData()
    this.setData({
      curTab: tab
    })
  },
  onShow: function () {
    const {cust_type, accnt} = app.globalData.MemberInfo
    const list = this.data.swiperList
    let cardCur
    let percentage = 0
    list.forEach((item, index) => {
      if (item.id === cust_type) {
        cardCur = index
        if (cust_type !== '03') {
          percentage = Math.round((accnt.czz / item.upgradeCzz) * 100)
        }
      }
    })
    this.setData({
      cust_type,
      accnt,
      cardCur,
      percentage,
      avatar: app.globalData.Head || app.globalData.defaultAvatarUrl,
      nickname: app.globalData.NickName || app.globalData.PhoneNo
    })
  },
  // cardSwiper
  cardSwiper(e) {
    const index = e.detail.current
    const item = this.data.swiperList[index]
    const isLocked = this.data.cust_type < item.id
    this.setData({
      cardCur: index,
      curTab: 0,
      isLocked
    })
  },
  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      curTab: index
    })
  },
  queryData() {
    $api.getDecorationData ({
      RequestType: 100
    }).then(res => {
      (res.data || []).forEach(item => {
        if (item.Id === 33) {
          this.setData({
            jfData: item
          })
        }
      })
    })
  },
})