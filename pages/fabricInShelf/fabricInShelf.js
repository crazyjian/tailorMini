const app = getApp()
Page({
  data: {
    shelfName:'',
    looseFabric:{},
    looseFabrics:[],
    placeholder:'请扫描松布架二维码',
    isShow:false,
    isShowTailor:false,
    scanPic:'../../static/img/success.png'
  },
  onLoad: function (option) {
    
  },
  scanShelf:function() {
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if(res.result.indexOf("号")==-1) {
          obj.setData({
            shelfName: "",
            placeholder: "松布架二维码不正确",
            isShow: true,
            scanPic: '../../static/img/scan_error.png'
          })
        }else {
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
  //扫描面料流程
  scanFabric:function() {
    var obj = this;
    var looseFabrics = this.data.looseFabrics;
    obj.setData({
      looseFabric: {}
    })
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var qCodeID = res.result;
        wx.request({
          url: app.globalData.backUrl + '/erp/minigetloosefabricbyid',
          data: {
            'qCodeID': qCodeID
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            // console.log(res.data);
            if (res.statusCode == 200) {
              if (res.data.looseFabric) {
                var flag = true;
                if (obj.data.looseFabrics.length > 0) {
                  for (var i = 0; i < obj.data.looseFabrics.length; i++) {
                    if (obj.data.looseFabrics[i].looseFabricID == res.data.looseFabric.looseFabricID) {
                      flag = false;
                      break;
                    }
                  } 
                }
                if(flag) {
                  var tmpLooseFabric = res.data.looseFabric;
                  var flag2 = true;
                  wx.request({
                    url: app.globalData.backUrl + "/erp/minigetfabrichandoverbyqcode",
                    data: {
                      'qCodeID': qCodeID
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      if (res.statusCode == 200) {
                        //访问正常
                        if (res.data == 0) {
                          flag2 = false;
                          wx.showToast({
                            title: "该面料已对接",
                            icon: 'none',
                            duration: 1000,
                          })
                        }
                        if (flag2){
                          looseFabrics.push(tmpLooseFabric);
                          obj.setData({
                            looseFabric: tmpLooseFabric,
                            looseFabrics: looseFabrics
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
                }else {
                  wx.showToast({
                    title: "该二维码已扫描",
                    icon: 'none',
                    duration: 1000,
                  })
                }
              }else {
                wx.showToast({
                  title: "没有获取到信息",
                  image: '../../static/img/error.png',
                  duration: 1000,
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

  inShelf: function (e) {
    var obj = this;
    var shelfName = this.data.shelfName;
    var looseFabrics = this.data.looseFabrics;
    if (looseFabrics.length == 0){
      wx.showToast({
        title: "请扫描面料",
        image: '../../static/img/error.png',
        duration: 1000,
      })
    } else if (shelfName == ''){
      wx.showToast({
        title: "请扫描松布架",
        image: '../../static/img/error.png',
        duration: 1000,
      })
    } else {
      wx.request({
        url: app.globalData.backUrl + '/erp/miniaddfabrichandoverbatch',
        method: 'POST',
        data: {
          'looseFabricJson': JSON.stringify(looseFabrics),
          'shelfName':shelfName
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200) {
            if (res.data == 0) {
              wx.showToast({
                title: "上架成功",
                icon: 'success',
                duration: 1000
              })
              obj.setData({
                looseFabrics: [],
                looseFabric: {},
                shelfName: '',
                isShow:false,
                isShowTailor:false,
              })
            }else {
              wx.showToast({
                title: "入库失败",
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