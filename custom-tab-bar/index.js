
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#f2cfa7",
    list: [{
      pagePath: "/pages/home/home",
      text: "首页",
      iconPath: "/image/tab_icon_home.png",
      selectedIconPath: "/image/tab_icon_home_selected.png"
    },
    {
      pagePath: "/pages/memberPurchase/memberPurchase",
      text: "深免购物圈",
      iconPath: "/image/tab_icon_vip.png",
      selectedIconPath: "/image/tab_icon_vip_selected.png"
    },
    {
      pagePath: "/pages/memberCode/memberCode",
      text: "会员码",
      iconPath: "/image/tab_icon_code.png",
      selectedIconPath: "/image/tab_icon_code.png"
    },
    {
      pagePath: "/pages/willBeFree/willBeFree",
      text: "发现深免",
      iconPath: "/image/tab_icon_found.png",
      selectedIconPath: "/image/tab_icon_found_selected.png"
    },
    {
      pagePath: "/pages/my/my",
      text: "我的",
      iconPath: "/image/tab_icon_info.png",
      selectedIconPath: "/image/tab_icon_info_selected.png"
    }]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})