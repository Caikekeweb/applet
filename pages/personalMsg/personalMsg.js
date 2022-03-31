// pages/personalMsg/personalMsg.js
const app = getApp()
const $api = require('../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const memberInfo = app.globalData.MemberInfo || {}
    const custmember = memberInfo.custmember || {}
    const cmsex = custmember.cmsex || ''
    const isFinishInfo = app.globalData.IsFinishInfo
    let data = {}
    if (isFinishInfo) {
      data = {
        cmname: memberInfo.custmember.cmname,
        mobile: app.globalData.MemberInfo.mobile,
        cmsex: cmsex ? (cmsex === 'M' ? '男' : '女') : '未知',
        cmbirthday: memberInfo.custmember.cmbirthday.split(' ')[0],
        avatar: app.globalData.Head || app.globalData.defaultAvatarUrl,
        nickname: app.globalData.NickName || app.globalData.PhoneNo
      }
    }
    this.setData({
      ...data
    })
  },
  toCredential: function () {
    wx.navigateTo({
      url: '../../pages/credentialManagement/credentialManagement',
    })
  },
  toAddress: function () {
    wx.navigateTo({
      url: '../../pages/address/address',
    })
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    console.log(e)
    wx.getFileSystemManager().readFile({
      filePath: avatarUrl,
      encoding: 'base64',
      success: (res) => {
        const url = 'data: image/png;base64,' + res.data
        this.setData({
          avatarUrl: url
        })
      }
    })
    // $api.uploadPhoto(avatarUrl).then((res) => {
    //   this.setData({
    //     avatarUrl: res.data
    //   })
    //   this.postData({
    //     Head: res.data
    //   })
    // }).catch((err) => {
    //   console.log(err)
    // })
  },
  setNickname(e) {
    this.setData({
      nickname: e.detail.value
    })
    this.postData({
      NickName: e.detail.value
    })
  },
  postData(data) {
    $api.updateMemberInfo({
      cust_baseinfo: {},
      ...data
    }).then(() => {
      $api.getUserMemberInfo().then(res => {
        Object.keys(res).forEach(key => {
          app.globalData[key] = res[key]
        })
      })
    }).catch(err => {
      console.log(err)
    })
  },
})