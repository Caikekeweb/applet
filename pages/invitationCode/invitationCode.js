const app = getApp()
const $api = require('../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCode: '',
    appletCodePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inviteCode: app.globalData.InviteCode
    })
    this.getAppletCode()
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

  },
  copyText: function () {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },
  getAppletCode() {
    $api.getWeixinAppQrCode({
      page: 'pages/home/home',
      scene: this.data.inviteCode
    }).then(res => {
      this.setData({
        appletCodePath: res.data.Data
      })
    })
  },
  shareImg: function () {
    const tempPath = this.getTempImgPath()
    wx.showShareImageMenu({
      path: tempPath,
      complete: () => {
        this.clearTempFile()
      }
    })
  },
  getTempImgPath() {
    const base64 = this.data.appletCodePath;
    const imgPath = wx.env.USER_DATA_PATH + '/invitation_' + 'appletCode' + '.png';
    //如果图片字符串不含要清空的前缀,可以不执行下行代码.
    var imageData = base64.replace(/^data:image\/\w+;base64,/, "");
    var fs = wx.getFileSystemManager();
    fs.writeFileSync(imgPath, imageData, "base64");
    return imgPath
  },
  clearTempFile () {
    wx.getSavedFileList({
      success (res) {
        console.log('saveList', res)
        if (res.fileList.length > 0){
          wx.removeSavedFile({
            filePath: res.fileList[0].filePath,
            complete (res) {
              console.log(res)
            }
          })
        }
      }
     })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})