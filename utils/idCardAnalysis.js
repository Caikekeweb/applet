var checkCode = function (val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  var code = val.substring(17);
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
}
var checkDate = function (val) {
  var birth = val.substring(6, 14);
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(birth)) {
    var year = birth.substring(0, 4);
    var month = birth.substring(4, 6);
    var date = birth.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return year + '-' + month + '-' + date;
    }
  }
  return '';
}
var checkProv = function (val) {
  var pre = val.substring(0, 2)
  var pattern = /^[1-9][0-9]/;
  var provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(pre) && provs[pre]) return provs[pre];
  return ''
}
var checkID = function (val) {
  if (checkCode(val)) {
    if (checkDate(val)) {
      if (checkProv(val)) {
        return true;
      }
    }
  }
  return false;
}

const getSex = function (val) {
  let str = ''
  if (val.length !== 18) return str
  console.log(val.substr(16, 1))
  if (parseInt(val.substr(16, 1)) % 2 === 1) {
    str = '男'
  } else {
    str = '女'
  }
  return str
}

const getAge = function (val) {
  let myDate = new Date();
  let month = myDate.getMonth() + 1;
  let day = myDate.getDate();
  let age = myDate.getFullYear() - val.substring(6, 10) - 1;
  if (val.substring(10, 12) < month || val.substring(10, 12) == month && val.substring(12, 14) <= day) {
    age++;
  }
  return age
}

const getCardInfo = function (code) {
  if (code && code.length === 18) return {
    checked: checkID(code),
    province: checkProv(code),
    birthday: checkDate(code),
    sex: getSex(code),
    age: getAge(code)
  }
  return { checked: false }
}

module.exports = getCardInfo