const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const setCustomTab = function(that,index) {
  if (typeof that.getTabBar === 'function' &&
  that.getTabBar()) {
    that.getTabBar().setData({
      selected: index
    })
  }
}

const checkPhone = function(num) {
  return /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/.test(num)
}

module.exports = {
  formatTime,
  setCustomTab,
  checkPhone
}
