// pages/home/home.js
const app = getApp()
const $api = require('../../api/index.js')
const IMAG_ORIGIN = app.globalData.imgOrigin
const cardGradeImg = {
  def: IMAG_ORIGIN +'card_vip.png?20211004',
  '01':  IMAG_ORIGIN + 'card_gold.png?20211004',
  '02':  IMAG_ORIGIN + 'card_platinum.png?20211004',
  '03':  IMAG_ORIGIN + 'card_diamond.png?20211004',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRegist : false,
    curGrade: cardGradeImg.def,
    interestsList: [
      {
        name: "多倍积分",
        icon:  IMAG_ORIGIN + "home_icon_integral.png"
      },
      {
        name: "生日积分",
        icon: IMAG_ORIGIN + "home_icon_birth.png"
      },
      {
        name: "积分抵现",
        icon: IMAG_ORIGIN + "home_icon_exchange.png"
      },
      {
        name: "生日礼遇",
        icon: IMAG_ORIGIN + "home_icon_gift.png"
      }
    ],
    funs: [
      {
        name: "热销榜单",
        path: '../../pages/topSellingList/topSellingList',
        icon: IMAG_ORIGIN + "home_icon_list.png"
      },
      {
        name: "门店活动",
        path: '../../pages/storeActivities/storeActivities',
        icon: IMAG_ORIGIN + "home_icon_store.png"
      },
      {
        name: "领取优惠",
        path: '../../pages/coupon/coupon',
        icon: IMAG_ORIGIN + "home_icon_coupon.png",
        needLogin: true,
        needMsg: false
      },
      {
        name: '离岛免税',
        path: '../../pages/outlyingIslands/outlyingIslands',
        icon: IMAG_ORIGIN + "info_icon_free.png",
        needLogin: true,
        needMsg: true
      },
    ],
    jife: 0,
    swiperActivityList: [],
    outActivityList: [],
    activeIndex: 0,
    homeBg: IMAG_ORIGIN + 'home_bg.png',
    visible: false,
    isCheckLogin: true,
    avatar: '',
    nickname: '',
  },
  onShow() {
    $api.signIn().then(() => {
      $api.getUserMemberInfo().then(res => {
        Object.keys(res).forEach(key => {
          app.globalData[key] = res[key]
        })
        const MemberInfo = res.MemberInfo || {}
        const accnt = MemberInfo.accnt || {}
        app.globalData.jife = accnt.jf || 0
        this.setData({
          isRegist: res.IsRegist,
          jife: accnt.jf || 0,
          avatar: res.Head,
          nickname: res.NickName,
          curGrade: cardGradeImg[MemberInfo.cust_type] || cardGradeImg.def
        })
      })
    })
    this.queryData()
  },
  funNavgate(e) {
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
    wx.navigateTo({
      url: rowData.path
    })
  },
  getPhoneNumber(e) {
    $api.getWxPhoneNum({
      iv: e.detail.iv || '',
      encryptedData: e.detail.encryptedData || ''
    }).then((data) => {
      wx.navigateTo({
        url: `../../pages/phoneVerification/phoneVerification?purePhoneNumber=${data.purePhoneNumber || ''}&countryCode=${data.countryCode || '86'}`,
      })
    })
  },
  goDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const rowData = this.data.swiperActivityList[index]
    wx.navigateToMiniProgram({
      appId: rowData.AppId,
      path: rowData.Url,
      success(res) {
        console.log(res)
      }
    })
  },
  goOutDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const rowData = this.data.outActivityList[index]
    wx.navigateToMiniProgram({
      appId: rowData.AppId,
      path: rowData.Url,
      success(res) {
        console.log(res)
      }
    })
  },
  goMinigrom: function () {
    const rowData = this.data.activeObj
    wx.navigateToMiniProgram({
      appId: rowData.appid,
      path: rowData.page,
      success(res) {
        console.log(res)
      }
    })
  },
  queryData() {
    $api.getMarketingData({
      RequestType: 1
    }).then(res => {
      const activityList = (res.data || []).sort((a, b) => a.Sort > b.Sort)
      const outActivityList = activityList.filter(x => x.DispayType === 2)
      const swiperActivityList = activityList.filter(x => x.DispayType === 1)
      this.setData({
        outActivityList,
        swiperActivityList
      })
    })
  },
})