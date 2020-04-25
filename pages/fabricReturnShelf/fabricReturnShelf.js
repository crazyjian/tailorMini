const util = require('../../utils/formatTime.js')
const app = getApp()
Page({
  data: {
    shelfName:'',
    outInfo:'退架成功',
    isShow:false,
    placeholder:'请扫描松布架',
    isShow:false,
    looseFabrics:[]
  },
  onLoad: function (option) {
    var obj = this;
    console.log(option.qCodeID);
    if(option.qCodeID.indexOf("号")==-1) {
      wx.showToast({
        title: '松布架不存在',
        icon: 'none',
        duration: 1000
      })
      obj.setData({
        shelfName: '',
        placeholder:"扫描有误",
        isShow: true,
        scanPic: '../../static/img/scan_error.png',
        looseFabrics:{}
      })
    }
    obj.setData({
      shelfName: option.qCodeID,
      isShow: true,
      scanPic: '../../static/img/success.png',
      looseFabrics:{}
    })
    wx.request({
      url: app.globalData.backUrl +'/erp/minigetfabrichandoverbyshelf',
      data: {
        'shelfName': option.qCodeID,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i< res.data.fabricHandOverList.length; i++){
            res.data.fabricHandOverList[i].loadingTime = util.tsFormatTime(res.data.fabricHandOverList[i].loadingTime, 'Y/M/D h:m:s')
          }
          obj.setData({
            looseFabrics: res.data.fabricHandOverList,
          })
        } else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '退架失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  },
  scanShelf:function() {
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if(res.result.indexOf("号")==-1) {
          wx.showToast({
            title: '松布架不存在',
            icon: 'none',
            duration: 1000
          })
          obj.setData({
            shelfName: "",
            placeholder: "扫描有误",
            isShow: true,
            scanPic: '../../static/img/scan_error.png'
          })
        }else {
          wx.request({
            url: app.globalData.backUrl +'/erp/minigetfabrichandoverbyshelf',
            data: {
              'shelfName': res.result,
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              if (res.statusCode == 200 && res.data) {
                for (var i = 0; i< res.data.fabricHandOverList.length; i++){
                  res.data.fabricHandOverList[i].loadingTime = util.tsFormatTime(res.data.fabricHandOverList[i].loadingTime, 'Y/M/D h:m:s')
                }
                obj.setData({
                  looseFabrics: res.data.fabricHandOverList,
                })
              } else {
                wx.showToast({
                  title: '扫描有误',
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '下架失败',
                image: '../../static/img/error.png',
                duration: 1000
              })
            }
          })
          obj.setData({
            shelfName: res.result,
            isShow:true,
            scanPic: '../../static/img/success.png'
          })
        }
      },
      fail(res) {
        obj.setData({
          shelfName: "",
          placeholder:"扫描有误",
          isShow: true,
          scanPic: '../../static/img/scan_error.png'
        })
      }
    })
  },
  returnShelf: function (e) {
    var obj = this;
    var looseFabrics = this.data.looseFabrics;
    if (looseFabrics.length == 0){
      wx.showToast({
        title: "货架无面料",
        icon: 'none',
        duration: 1000,
      })
    } else {
      wx.request({
        url: app.globalData.backUrl + '/erp/minideletefabrichandoverbyshelf',
        method: 'POST',
        data: {
          'shelfName': this.data.shelfName
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data == 0) {
              wx.showToast({
                title: "退架成功",
                icon: 'success',
                duration: 1000
              })
              obj.setData({
                looseFabrics: [],
                shelfName: '',
                isShow:false,
                placeholder:'请扫描松布架'
              })
            }else {
              wx.showToast({
                title: "退架失败",
                image: '../../static/img/error.png',
                duration: 1000
              })
            }
          }
        },
        fail: function (res) {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      })
    }
  }
})