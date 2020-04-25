const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    ratioTotal:0,
    numTotal:0,
    layerTotal:0,
    looseFabrics:[],
    matchRatios: [{ "sizeName": "","ratio":""}],
    sizeNames:["请选择"],
    s_index:[0],
    partNames:[]
  },
  onLoad: function (option) {
    var obj = this;
    wx.getStorage({
      key: 'matchRatios',
      success(res) {
        var ratioTotal = 0;
        for (var i = 0; i < res.data.length; i++) {
          var ratio = res.data[i].ratio;
          if (ratio == "") {
            ratio = 0;
          }
          ratioTotal = ratioTotal + parseInt(ratio);
        }
        var numTotal = option.layerTotal * ratioTotal;
        obj.setData({
          matchRatios: res.data,
          ratioTotal: ratioTotal,
          layerTotal: option.layerTotal,
          numTotal: numTotal
        })
      }
    });
    wx.getStorage({
      key: 's_index',
      success(res) {
        obj.setData({
          s_index: res.data,
        })
      }
    });
    var looseFabrics = JSON.parse(decodeURIComponent(option.looseFabrics));
    
    this.setData({
      layerTotal: option.layerTotal,
      looseFabrics: looseFabrics
    });
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetsizehint',
      data: {
        orderName: looseFabrics[0].orderName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          var sizeNames = ["请选择"];
          for (var i = 0; i < res.data.sizeNameList.length;i++) {
            sizeNames.push(res.data.sizeNameList[i]);
          }
          obj.setData({
            sizeNames: sizeNames
          })
        } else {
          wx.showToast({
            title: "获取尺码数据失败",
            icon: 'none',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取尺码数据失败",
          icon: 'none',
          duration: 1000,
        })
      }
    });
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetmainprintpartnamesbyorder',
      data: {
        orderName: looseFabrics[0].orderName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200) {
          if (res.data.printPartNameList) {
            var partNames = [];
            for (var i = 0; i < res.data.printPartNameList.length;i++) {
              partNames.push({
                selected: false,
                name: res.data.printPartNameList[i]
              });
            }
          }
          obj.setData({
            partNames: partNames
          })
        } else {
          wx.showToast({
            title: "获取部位数据失败",
            icon: 'none',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取部位数据失败",
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },
  add:function(e) {
    var matchRatios = this.data.matchRatios;
    matchRatios.push({ "sizeName": "", "ratio": "" });
    var s_index = this.data.s_index;
    s_index.push(0);
    this.setData({
      matchRatios: matchRatios,
      s_index: s_index
    }),
    wx.setStorage({
      key: "matchRatios",
      data: matchRatios
    });
    wx.setStorage({
      key: "s_index",
      data: s_index
    });
  },
  remove: function (e) {
    var index = e.currentTarget.dataset.index;
    var matchRatios = this.data.matchRatios;
    var s_index = this.data.s_index;
    matchRatios.splice(index,1);
    s_index.splice(index,1);
    var ratioTotal = 0;
    for (var i = 0; i < matchRatios.length; i++) {
      var ratio = matchRatios[i].ratio;
      if (ratio == "") {
        ratio = 0;
      }
      ratioTotal = ratioTotal + parseInt(ratio);
    }
    var numTotal = this.data.layerTotal * ratioTotal;
    this.setData({
      matchRatios: matchRatios,
      s_index: s_index,
      ratioTotal: ratioTotal,
      numTotal: numTotal
    }),
    wx.setStorage({
      key: "matchRatios",
      data: matchRatios
    });
    wx.setStorage({
      key: "s_index",
      data: s_index
    });
  },
  setRatio:function(e) {
    var ratio = e.detail.value;
    var index = e.currentTarget.dataset.index;
    var matchRatios = this.data.matchRatios;
    var ratioTotal = 0;
    matchRatios[index].ratio = ratio;
    for (var i = 0; i < matchRatios.length; i++) {
      var tmp = matchRatios[i].ratio;
      if (tmp == "") {
        tmp = 0;
      }
      ratioTotal = ratioTotal + parseInt(tmp);
    }
    var numTotal = this.data.layerTotal * ratioTotal;
    this.setData({
      matchRatios: matchRatios,
      ratioTotal: ratioTotal,
      numTotal: numTotal
    }),
    wx.setStorage({
      key: "matchRatios",
      data: matchRatios
    });
  },
  bindSizeChange:function(e) {
    var index = e.currentTarget.dataset.index;
    var s_index = this.data.s_index;
    s_index[index] = e.detail.value;
    var matchRatios = this.data.matchRatios;
    if(e.detail.value == 0) {
      matchRatios[index].sizeName = "";
    }else {
      matchRatios[index].sizeName = this.data.sizeNames[e.detail.value];
    }
    this.setData({
      s_index: s_index,
      matchRatios: matchRatios
    }),
    wx.setStorage({
      key: "matchRatios",
      data: matchRatios
    });
    wx.setStorage({
      key: "s_index",
      data: s_index
    });
  },
  checkboxChange:function(e) {
    let string = "partNames[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.partNames[e.target.dataset.index].selected
    })
    let detailValue = this.data.partNames.filter(it => it.selected).map(it => it.name)
    console.log('所有选中的值为：', detailValue)
  },
  generate:function() {
    var matchRatios = this.data.matchRatios;
    let partNames = this.data.partNames.filter(it => it.selected).map(it => it.name);
    var flag = false;
    for (var i = 0; i < matchRatios.length;i++) {
      if (matchRatios[i].sizeName == '' || matchRatios[i].ratio == '') {
        flag = true;
        break;
      }
    }
    if(flag) {
      wx.showToast({
        title: "请填写完唛架配比",
        icon: 'none',
        duration: 1000,
      })
    } else if (partNames.length == 0) {
      wx.showToast({
        title: "请选择部位",
        icon: 'none',
        duration: 1000,
      })
    }else {
      var params = {};
      params.orderName = this.data.looseFabrics[0].orderName;
      params.clothesVersionNumber = this.data.looseFabrics[0].clothesVersionNumber;
      params.partNameList = partNames;
      params.miniMatchRatioList = matchRatios;
      var miniTailorLayerInfoList = [];
      for (var i = 0; i < this.data.looseFabrics.length;i++) {
        var tmp = {};
        tmp.colorName = this.data.looseFabrics[i].colorName;
        tmp.jarName = this.data.looseFabrics[i].jarNumber;
        tmp.layerCount = this.data.looseFabrics[i].layerCount;
        tmp.batch = this.data.looseFabrics[i].batchOrder;
        tmp.weight = this.data.looseFabrics[i].weight;
        miniTailorLayerInfoList.push(tmp);
      }
      params.miniTailorLayerInfoList = miniTailorLayerInfoList;
      wx.request({
        url: app.globalData.backUrl + '/erp/minigeneratemaintailordata',
        data: {
          mainTailorJson: JSON.stringify(params)
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data.tailorList) {
            wx.navigateTo({
              url: "../mainTailorSave/mainTailorSave?tailorList=" + encodeURIComponent(JSON.stringify(res.data.tailorList))
            })
          } else {
            wx.showToast({
              title: "服务器发生异常",
              icon: 'none',
              duration: 1000,
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: "服务器发生异常",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      });
    }
  }
})