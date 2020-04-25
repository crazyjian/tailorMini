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
  },
  fabricInShelf:function() {
    wx.navigateTo({
      url: "../fabricInShelf/fabricInShelf"
    })
  },
  fabricOutShelf:function() {
    wx.navigateTo({
      url: "../fabricOutShelf/fabricOutShelf"
    })
  },
  fabricReturnShelf:function() {
    wx.navigateTo({
      url: "../fabricReturnShelf/fabricReturnShelf"
    })
  },
  fabricSearch:function() {
    wx.navigateTo({
      url: "../fabricSearch/fabricSearch"
    })
  },
  scanOutShelf:function(){
    var obj = this;
    if (app.globalData.employee.role == 'role6') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          wx.redirectTo({
            url: "../fabricOutShelf/fabricOutShelf?qCodeID=" + res.result
          })
        }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  scanReturnShelf:function(){
    var obj = this;
    if (app.globalData.employee.role == 'role5') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          wx.redirectTo({
            url: "../fabricReturnShelf/fabricReturnShelf?qCodeID=" + res.result
          })
        }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  }
})
