const getCardInfo = require('../../utils/idCardAnalysis')
const app = getApp()
const $api = require('../../api/index')
Page({
  data: {
    loading: false,
    isRegistered: false,
    cardType: 'idcard',
    cardCode: '',
    cmname: '',
    cmnickname: '',
    birthday: '',
    birthdayTxt: '',
    sexGroup: [{
        name: '先生',
        value: '男',
      },
      {
        name: '女士',
        value: '女',
      },
    ],
    sex: '',
    avatarUrl: app.globalData.defaultAvatarUrl,
    nickname: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.is_registered) {
      this.setData({
        isRegistered: true,
        nickname: options.phonenum
      })
    }
  },
  idCardInput: function (e) {
    const value = e.detail.value
    const cardInfo = getCardInfo(value)
    let data
    if (cardInfo.checked) {
      data = {
        cardCode: value,
        birthday: cardInfo.birthday,
        birthdayTxt: this.dateToTxt(cardInfo.birthday),
        sex: cardInfo.sex
      }
    } else {
      data = {
        cardCode: value,
        birthday: '',
        birthdayTxt: '',
        sex: ''
      }

      if (value.length === 18) {
        this.showToast({
          title: '请输入有效的证件号码',
          icon: 'fail',
          duration: 2000
        })
      }
    }
    this.setData(data)
  },
  submit: function () {
    if (!getCardInfo(this.data.cardCode).checked) {
      wx.showToast({
        title: '身份证号码有误',
        icon: 'fail',
        duration: 2000
      })
      return
    }
    this.setData({
      loading: true
    })
    const data = this.data
    $api.updateMemberInfo({
      Head: data.avatarUrl,
      NickName: data.nickname,
      cust_baseinfo: {
        cmname: data.cmname,
        cmnickname: data.cmnickname,
        cmbirthtype: "1",
        cmbirthday: data.birthday,
        cmidtype: "1",
        cmsex: this.data.sex === '男' ? 'M' : 'F',
        cmidno: data.cardCode
      }
    }).then(() => {
      $api.getUserMemberInfo().then(res => {
        Object.keys(res).forEach(key => {
          app.globalData[key] = res[key]
        })
        if (this.data.isRegistered) {
          wx.switchTab({
            url: '../../pages/home/home',
          })
        } else {
          wx.navigateTo({
            url: '../../pages/personalMsg/personalMsg',
          })
        }
      })
    }).catch(err => {
      console.log(err)
    })

    setTimeout(() => {
      this.setData({
        loading: false
      })

    }, 1000);
  },
  setInput: function (e) {
    const key = e.target.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  bindDateChange(e) {
    const value = e.detail.value;
    this.setData({
      birthday: value,
      birthdayTxt: this.dateToTxt(value)
    })
  },
  dateToTxt(dateStr) {
    const dateList = dateStr.split('-')
    return dateList[0] + '年' + dateList[1] + '月' + dateList[2] + '日'
  },
  choseSex(e) {
    if (this.data.cardType === 'idcard') return
    const value = e.currentTarget.dataset.value
    this.setData({
      sex: value
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
    $api.uploadPhoto(avatarUrl).then((res) => {
      // this.setData({
      //   avatarUrl: res.data
      // })
    }).catch((err) => {
      console.log(err)
    })
  }
})