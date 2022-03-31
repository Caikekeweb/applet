const app = getApp()
const cmidtype = {
  1: {
    name: '身份证',
    key: 'cmidno'
  },
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cmname: '',
    cmnickname: '',
    cmidno: '',
    cmidtypeTxt: ''
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
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.getInfo(data)
    })
  },
  /**
   * 根据类别显示对应证件信息
  */
  getInfo: function(options) {
    const type = options.type
    const memberInfo = app.globalData.MemberInfo
    if (memberInfo) {
      const numTxt = memberInfo.custmember[cmidtype[type].key]
      this.setData({
        cmname: memberInfo.custmember.cmname,
        cmnickname: memberInfo.custmember.cmnickname,
        cmidno: numTxt.slice(0, 6) + "*****" + numTxt.slice(-4),
        cmidtypeTxt: cmidtype[type].name
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})