// pages/address/edit.js
const $api = require('../../api/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    contact: '',
    mobile: '',
    region: [],
    steet:  '',
    loading: false,
    isdefault: false,
    add_no: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const index = options.editindex
    if (index) {
      this.queryData(index)
    }
    this.setData({
      isEdit: index ? true : false
    })
  },
  queryData(index) {
    $api.getAddress({
      page_no: 1,
      page_size: 100
    }).then(res => {
      const datalist = res.data.Data.custaddr
      const item = datalist[index]
      this.setData({
        contact: item.contact,
        mobile: item.mobile,
        steet: item.steet,
        region: [item.province, item.city, item.district],
        isdefault: item.isdefault === 'Y',
        add_no: item.add_no
      })
    })
  },
  setAddress() {
    const { isEdit, contact, mobile, region, steet, loading, isdefault } = this.data
    if (loading) return
    if (!contact) {
      wx.showToast({
        title: '请填写收件人',
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请填写手机号',
      })
      return
    }
    if (!region.length) {
      wx.showToast({
        title: '请填选择地区',
      })
      return
    }
    if (!steet) {
      wx.showToast({
        title: '请填写详细地址',
      })
      return
    }
    this.setData({
      loading: true
    })
    const params = {
      contact,
      mobile,
      province: region[0],
      city: region[1],
      district: region[2],
      steet,
      address: region[0] + region[1] + region[2] + steet,
      region: '中国',
      isdefault: isdefault ? 'Y' : 'N'
    }
    if (isEdit) {
      $api.updateAddress({
        ...params,
        add_no: this.data.add_no
      }).then(res => {
        wx.navigateBack()
      }).finally(() => {
        this.setData({
          loading: false
        })
      })
    } else {
      $api.createAddress(params).then(res => {
        wx.navigateBack()
      }).finally(() => {
        this.setData({
          loading: false
        })
      })
    }
  },
  deleteAddress() {
    const { add_no } = this.data
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      cancelColor: '#999999',
      confirmColor: '#BD2820',
      success (res) {
        if (res.confirm) {
          $api.deleteAddress({
            add_no
          }).then(() => {
            wx.navigateBack()
          })
        }
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  switchChange(e) {
    console.log(e)
    this.setData({
      isdefault: e.detail.value
    })
  }
})