//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isHide:true,
    location:""
  },
  //事件处理函数

  onLoad: function (option) {
  },
  mainTailorCreate: function () {
    wx.navigateTo({
      url: "../mainTailorCreate/mainTailorCreate"
    })
  },
  mainTailorSearch: function () {
    wx.navigateTo({
      url: "../mainTailorSearch/mainTailorSearch"
    })
  },
  otherTailorCreate: function () {
    wx.navigateTo({
      url: "../otherTailorCreate/otherTailorCreate"
    })
  },
  otherFixedCreate: function () {
    wx.navigateTo({
      url: "../otherFixedCreate/otherFixedCreate"
    })
  },
  otherTailorSearch:function() {
    wx.navigateTo({
      url: "../otherTailorSearch/otherTailorSearch"
    })
  }
})
