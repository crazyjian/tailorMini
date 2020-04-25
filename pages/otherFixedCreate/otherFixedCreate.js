const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    looseFabric:{},
    looseFabrics:[],
    layerCount:'',
    weightTotal:0,
    layerTotal:0,
    isHide: true,
    qrCode: ''
  },
  onLoad: function (option) {
    var obj = this;
    wx.getStorage({
      key: 'flooseFabrics',
      success(res) {
        obj.setData({
          looseFabrics: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'fweightTotal',
      success(res) {
        obj.setData({
          weightTotal: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'flayerTotal',
      success(res) {
        obj.setData({
          layerTotal: res.data,
        })
      }
    });
  },
  hand: function () {
    this.setData({
      isHide: false
    })
  },
  cancel: function (e) {
    this.setData({
      isHide: true,
      qrCode: ''
    })
  },
  setQrCodeValue: function (e) {
    this.setData({
      qrCode: e.detail.value
    })
  },
  handConfirm: function () {
    var qrCode = this.data.qrCode
    if (!qrCode) {
      wx.showToast({
        title: '请输入二维码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    var obj = this;
    obj.setData({
      looseFabric: {},
      layerCount: ""
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetloosefabricbyid',
      data: {
        'qCodeID': qrCode
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200) {
          if (res.data.looseFabric) {
            var currentDate = new Date();
            var looseTime = new Date(res.data.looseFabric.looseTime);
            var diff = currentDate.getTime() - looseTime.getTime();
            if (Math.floor(diff / 1000 / 60 / 60) <= res.data.looseFabric.looseHour) {
              wx.showToast({
                title: "该松布时间未到，暂时不能扫描",
                icon: 'none',
                duration: 1000,
              })
              return;
            }

            if (obj.data.looseFabrics.length > 0 && obj.data.looseFabrics[0].orderName != res.data.looseFabric.orderName) {
              wx.showToast({
                title: "请扫描相同订单信息",
                icon: 'none',
                duration: 1000,
              })
            } else {
              var flag = true;
              if (obj.data.looseFabrics.length > 0) {
                for (var i = 0; i < obj.data.looseFabrics.length; i++) {
                  if (obj.data.looseFabrics[i].looseFabricID == res.data.looseFabric.looseFabricID) {
                    flag = false;
                    break;
                  }
                }
              }
              if (flag) {
                obj.setData({
                  looseFabric: res.data.looseFabric,
                  isHide: true,
                  qrCode: ''
                })
              } else {
                wx.showToast({
                  title: "该二维码已扫描",
                  icon: 'none',
                  duration: 1000,
                })
              }
            }
          } else {
            wx.showToast({
              title: "获取不到信息",
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
  scanFabric:function() {
    var obj = this;
    obj.setData({
      looseFabric: {},
      layerCount: ""
    })
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.request({
          url: app.globalData.backUrl + '/erp/minigetloosefabricbyid',
          data: {
            'qCodeID': res.result
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            // console.log(res.data);
            if (res.statusCode == 200) {
              if (res.data.looseFabric) {
                var currentDate = new Date();
                var looseTime = new Date(res.data.looseFabric.looseTime);
                var diff = currentDate.getTime() - looseTime.getTime();
                if (Math.floor(diff / 1000 / 60 / 60) <= res.data.looseFabric.looseHour)                 {
                  wx.showToast({
                    title: "该松布时间未到，暂时不能扫描",
                    icon: 'none',
                    duration: 1000,
                  })
                  return;
                }

                if (obj.data.looseFabrics.length > 0 && obj.data.looseFabrics[0].orderName != res.data.looseFabric.orderName) {
                  wx.showToast({
                    title: "请扫描相同订单信息",
                    icon: 'none',
                    duration: 1000,
                  })
                } else {
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
                    obj.setData({
                      looseFabric: res.data.looseFabric,
                    })
                  }else {
                    wx.showToast({
                      title: "该二维码已扫描",
                      icon: 'none',
                      duration: 1000,
                    })
                  }
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
          cutStoreQcode: "",
          placeholder:"扫描有误",
          isShow: true,
          scanPic: '../../static/img/scan_error.png'
        })
      }
    })
  },
  getClothesVersionNumber: function (e) {
    var clothesVersionNumber = e.detail.value;
    this.setData({
      'looseFabric.clothesVersionNumber': clothesVersionNumber
    })
  },
  getOrderName: function (e) {
    var orderName = e.detail.value;
    this.setData({
      'looseFabric.orderName': orderName
    })
  },
  getColorName: function (e) {
    var colorName = e.detail.value;
    this.setData({
      'looseFabric.colorName': colorName
    })
  },
  getFabricColor: function (e) {
    var fabricColor = e.detail.value;
    this.setData({
      'looseFabric.fabricColor': fabricColor
    })
  },
  getWeight: function (e) {
    var weight = e.detail.value;
    this.setData({
      'looseFabric.weight': weight
    })
  },
  getLayerCount: function (e) {
    var layerCount = e.detail.value;
    this.setData({
      'layerCount': layerCount
    })
  },
  comfirm:function() {
    var looseFabrics = this.data.looseFabrics;
    var looseFabric = this.data.looseFabric;
    if (JSON.stringify(looseFabric) == '{}'){
      wx.showToast({
        title: "请扫描面料",
        image: '../../static/img/error.png',
        duration: 1000,
      })
    } else if (this.data.layerCount == "" || this.data.layerCount == "0"){
      wx.showToast({
        title: "请输入层数",
        image: '../../static/img/error.png',
        duration: 1000,
      })
    }else {
      looseFabric.layerCount = this.data.layerCount;
      looseFabrics.push(looseFabric);
      var weightTotal = 0;
      var layerTotal = 0;

      for(var i=0;i<looseFabrics.length;i++) {
        weightTotal = weightTotal + looseFabrics[i].weight;
        layerTotal = layerTotal + parseInt(looseFabrics[i].layerCount);
      }
      this.setData({
        looseFabrics: looseFabrics,
        weightTotal: weightTotal,
        layerTotal: layerTotal,
        looseFabric:{},
        layerCount:""
      })
      wx.setStorage({
        key: "flooseFabrics",
        data: looseFabrics
      });
      wx.setStorage({
        key: "flayerTotal",
        data: layerTotal
      });
      wx.setStorage({
        key: "fweightTotal",
        data: weightTotal
      });
    }
  },
  delete:function(e) {
    var looseFabricID = e.currentTarget.dataset.loosefabricid;
    var looseFabrics = this.data.looseFabrics;
    var weightTotal = this.data.weightTotal;
    var layerTotal = this.data.layerTotal;
    for (var i = 0; i < looseFabrics.length; i++) {
      if (looseFabrics[i].looseFabricID == looseFabricID) {
        weightTotal = weightTotal - looseFabrics[i].weight;
        layerTotal = layerTotal - looseFabrics[i].layerCount;
        looseFabrics.splice(i,1);
        break;
      }
    }
    this.setData({
      looseFabrics: looseFabrics,
      weightTotal: weightTotal,
      layerTotal: layerTotal
    })
    wx.setStorage({
      key: "flooseFabrics",
      data: looseFabrics
    });
    wx.setStorage({
      key: "flayerTotal",
      data: layerTotal
    });
    wx.setStorage({
      key: "fweightTotal",
      data: weightTotal
    });
  },
  next:function() {
    if(this.data.looseFabrics.length > 0) {
      wx.navigateTo({
        url: "../otherFixedRatio/otherFixedRatio?layerTotal=" + this.data.layerTotal + "&looseFabrics=" + encodeURIComponent(JSON.stringify(this.data.looseFabrics))
      })
    }else {
      wx.showToast({
        title: "请先扫描面料",
        image: '../../static/img/error.png',
        duration: 1000,
      })
    }
  }
})