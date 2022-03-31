const $api = require('../../api/index.js')
const app = getApp()
const $util = require('../../utils/util')
const IMAG_ORIGIN = app.globalData.imgOrigin
const defFuns = [
  {
    name: "个人信息",
    id: 10,
    path: '../../pages/personalMsg/personalMsg',
    icon: IMAG_ORIGIN + "info_icon_data.png",
    needLogin: true,
    needMsg: true
  },
  {
    name: '离岛免税',
    id: 29,
    path: '../../pages/outlyingIslands/outlyingIslands',
    icon: IMAG_ORIGIN + "info_icon_free2.png",
    needLogin: true,
    needMsg: true
  },
  {
    name: '我的卡券',
    id: 30,
    path: '../../pages/cardVoucher/cardVoucher',
    icon: IMAG_ORIGIN + "info_icon_coupon.png",
    needLogin: true,
  },
  {
    name: '积分明细',
    id: 31,
    path: '../../pages/integralCenter/integralCenter',
    icon: IMAG_ORIGIN + "info_icon_integral.png",
    needLogin: true,
  },
  {
    name: '会员手册',
    id: 32,
    path: './webview',
    icon: IMAG_ORIGIN + "info_icon_handbook.png"
  },
  {
    name: '会员权益',
    id: 33,
    path: '../../pages/membershipInterests/membershipInterests',
    icon: IMAG_ORIGIN + "info_icon_right.png"
  },
  {
    name: '用卡须知',
    id: 34,
    path: './webview',
    icon: IMAG_ORIGIN + "info_icon_instructions.png"
  },
  {
    name: '适用门店',
    id: 35,
    path: '../../pages/applicableStores/applicableStores',
    icon: IMAG_ORIGIN + "info_icon_stores.png"
  },
  {
    name: '联系客服',
    id: 36,
    type: 'kefu',
    icon: IMAG_ORIGIN + "info_icon_service.png"
  },
  {
    name: '邀请码',
    id: 37,
    path: '../../pages/invitationCode/invitationCode',
    icon: IMAG_ORIGIN + "info_icon_invitation.png",
    needLogin: true
  },
  // {
  //   name: '设置',
  //   path: '../../pages/my/my',
  //   icon: IMAG_ORIGIN + "info_icon_set.png"
  // },
]
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
      upgradeCzz: 70000,
      url: IMAG_ORIGIN + 'info_platinum_card.png',
    }, {
      id: '03',
      gradeName: '钻石会员',
      needCzz: 70000,
      url: IMAG_ORIGIN + 'info_diamond_card.png'
    }],
    funs: [],
    accnt: {
      czz: 0 // 成长值
    },
    percentage: 0, // 当前成长值百分比
    customerVisible: false,
    customQrcode: IMAG_ORIGIN + 'customer_qrcode.jpg',
    customPhone: '',
    visible: false,
    isCheckLogin: true,
    avatar: "",
    nickname: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $util.setCustomTab(this, 4)
  },
  onShow: function () {
    if (!app.globalData.MemberInfo) {
      setTimeout(() => {
        this.onShow()
      }, 2000)
      return
    }
    this.queryData()
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
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  toggleCustomer: function () {
    this.setData({
      customerVisible: !this.data.customerVisible
    })
  },
  navigatePage: function (e) {
    const index = e.currentTarget.dataset.index
    const rowData = this.data.funs[index]
    const { IsRegist, IsFinishInfo } = app.globalData
    if (rowData.needLogin && !IsRegist) {
      this.setData({
        visible: true,
        isCheckLogin: true
      })
      return false
    }
    if (rowData.needMsg && !IsFinishInfo) {
      this.setData({
        visible: true,
        isCheckLogin: false
      })
      return false
    }
    if (rowData.type == 'kefu') {
      this.toggleCustomer()
      return
    }
    app.globalData.webviewUrl = rowData.url
    wx.navigateTo({
      url: rowData.path,
    })
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '4006188333'
    })
  },
  queryData() {
    $api.getDecorationData ({
      RequestType: 100
    }).then(res => {
      const data = (res.data || [])
      const funs = defFuns.map(item => {
          const findItem = data.find(x => x.Id === item.id) || {}
          if (findItem.Id === 36) {
            this.setData({
              customPhone: findItem.Phone,
              customQrcode: findItem.QrCodePath
            })
            app.globalData.customPhone = findItem.Phone
          }
          if (findItem.Id === 33) {
            app.globalData.jfData = findItem
          }
          return {
            ...item,
            url: findItem.Url,
            display: !!findItem.Disabled
          }
      })
      this.setData({
        funs
      })
    })
  },
})