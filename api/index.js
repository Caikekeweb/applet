// const origin = 'https://szhy.szdutyfree.com.cn'
const origin = 'https://open.uuhooo.net'
const AccessToken = '296e4a25-24b9-4172-8be4-3a96144393f6'
const AppID = 'wx75a573f6d553e786'
// 会员id, 仅仅方便接口传参使用
let cid = ''
let openidMsg =  wx.getStorageSync('openidMsg')
const getQueryUrl = (obj) => {
  return Object.keys(obj).reduce((pre, key) => {
    pre.push(`${key}=${obj[key]}`)
    return pre
  }, []).join('&')
}
const signIn = function() {
  return new Promise(resolve => {
    try {
      if (openidMsg) {
        resolve(openidMsg)
      } else {
        wx.login({
          success: (res) => {
            getOpenId({JsCode: res.code}).then((data) => {
              wx.setStorageSync('openidMsg', data)
              openidMsg = data
              resolve(data)
            }).catch(err => {
              console.log(err)
            })
          }
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  })
}
// 获取openid
const getOpenId = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetOpenID',
      method: "GET",
      data: {
        AccessToken,
        AppID,
        ...data
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {        
        //本地存储登录信息
        if (res.data.Success) {
          resolve(JSON.parse(res.data.Data))
        } else {
          wx.showToast({
            title: res.data.Message || 'adaf',
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: res => {
        console.log(res)
        reject(res)
      }
    })
  })
}
// 获取微信预存手机号
const getWxPhoneNum = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/WXBizDataCrypt',
      method: "GET",
      data: {
        AccessToken,
        AppID,
        SessionKey: openidMsg.session_key,
        ...data
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.Data) {
          resolve(res.data.Data)
        } else {
          resolve({})
        }
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

// 发送验证码
const sendPhoneCode = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/SendPhoneCode?AccessToken='+ AccessToken +'&PhoneNo=' + data.PhoneNo,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.Success) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 验证验证码
const verifyPhoneCode = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/VerifyPhoneCode?AccessToken='+ AccessToken +'&PhoneNo='+ data.PhoneNo +'&Code=' + data.Code + '&OpenId=' + openidMsg.openid,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        resolve(res.data)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  查询用户基本信息
const getUserMemberInfo = function() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetUserMemberInfo',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid
      },
      success: res => {
        const data = res.data.Data || {}
        cid = data.MemberInfo && data.MemberInfo.cid
        resolve(data)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  修改会员资料
const updateMemberInfo = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/UpdateMemberInfo',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        const data = JSON.parse(res.data.Data) || {}
        resolve(data)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  获取二维码
const getMemberQrCode = function() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetMemberQrCode',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  获取券列表
const getCouponList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetCouponList',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 查询活动分类
const getActivityCategoryList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetActivityCategoryList',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 活动清单
const getActivityList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetActivityList',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 活动详情
const getActivityDetail = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetActivityDetail',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 券详情
const getCouponInfo = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetCouponInfo',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  领/抢券接口
const postObtainCoupon = function(data) {
  let queryStr = Object.keys(data).reduce((pre, cur) => {
    pre.push(cur + '=' + data[cur])
    return pre
  }, []).join('&')
  if (queryStr) {
    queryStr = '&' + queryStr
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/ObtainCoupon?AccessToken='+ AccessToken +'&OpenId='+openidMsg.openid+'&cid='+cid +queryStr,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  获取券二维码
const getCouponQrCode = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetCouponQrCode',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  获取账户交易汇总
const getAccountConsume = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetAccountConsume',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  查询积分明细
const getIntegralList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetIntegralList',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  查询已用免税额度
const queryQuotaUsed = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/QueryQuotaUsed',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        OpenId: openidMsg.openid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
//  生成小程序码
const getWeixinAppQrCode = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetWeixinAppQrCode',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        appid: AppID,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 获取营销管理数据 

/**
 * 
 * @param {RequestType} int
 *  主题活动推荐设置 = 1
 *  深免购物圈设置 = 2
 *  发现深免设置 = 3
 *  门店活动 = 5
 *  业务板块 = 11
 *  热销榜单 = 12
 */ 
const getMarketingData = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/WechatAppApi/GetMarketingData',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 获取装修管理数据
/**
 * @param {RequestType} int
 * 个人中心 = 100
 * 门店管理 = 103
*/
const getDecorationData = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/WechatAppApi/GetDecorationData',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
const sendWxMessage = function(data) {
  const paramsStr = getQueryUrl({
    AccessToken,
    OpenId: openidMsg.openid,
    ...data
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/WechatAppApi/SendWxMessage?' + paramsStr,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 地址查询
const getAddress = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/GetAddress',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        appid: AppID,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 新增地址
const createAddress = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/CreateAddress',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        appid: AppID,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 编辑地址
const updateAddress = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + '/api/UpdateAddress',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        AccessToken,
        appid: AppID,
        OpenId: openidMsg.openid,
        cid,
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 删除地址
const deleteAddress = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: origin + `/api/DeleteAddress?AccessToken=${AccessToken}&OpenId=${openidMsg.openid}&cid=${cid}&add_no=${data.add_no}`,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}
// 上传图片
const uploadPhoto = function(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: origin + `/WechatAppApi/UploadPhoto`, //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      success: res => {
        resolve(res)
      },
      fail: res => {
        reject(res)
      }
    })
  })
}

module.exports = {
  signIn,
  getOpenId,
  getUserMemberInfo,
  getWxPhoneNum,
  sendPhoneCode,
  verifyPhoneCode,
  updateMemberInfo,
  getMemberQrCode,
  getCouponList,
  getActivityCategoryList,
  getActivityList,
  postObtainCoupon,
  getCouponInfo,
  getCouponQrCode,
  getAccountConsume,
  getIntegralList,
  getWeixinAppQrCode,
  queryQuotaUsed,
  getActivityDetail,
  getMarketingData,
  getDecorationData,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  sendWxMessage,
  uploadPhoto,
  origin
}