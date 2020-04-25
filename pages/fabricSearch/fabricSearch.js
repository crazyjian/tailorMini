const util = require('../../utils/formatTime.js')

const app = getApp()
Page({
  data: {
    looseFabrics:[],
    orderName:'',
    versionNumber:'',
    zIndex:-1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    f_index: 0,
    fabricColors: ["全部"],
    dateFrom:'',
    dateTo:'',
    clothesVersionNumber:'',
    totalBatch:0,
    inShelfBatch:0,
    outShelfBatch:0,
    orderNames: ["请选择款号"],
    o_index: 0
  },
  onLoad: function (option) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      dateFrom: Y + '-' + M + '-' + D,
      dateTo: Y + '-' + M + '-' + D
    })
  },
  getClothesVersionNumber:function (e) {
    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetversionhint',
        data: {
          versionNumber: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.versionList.length;i++) {
              newSource.push(res.data.versionList[i]);
            }
            obj.setData({
              bindSource: newSource,
              versionNumber: versionNumber,
              zIndex:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        versionNumber: versionNumber
      });
    }
  },
  itemtap: function (e) {
    var obj = this;
    this.setData({
      versionNumber: e.target.id,
      zIndex: -1
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetorderbyversion',
      data: {
        clothesVersionNumber: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var orderNames = ["请选择款号"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.orderList.length; i++) {
            orderNames.push(res.data.orderList[i]);
          }
        }
        obj.setData({
          orderNames: orderNames,
          o_index: 0
        });
      }
    })
  },
  bindOrderChange: function (e) {
    var obj = this;
    obj.setData({
      o_index: e.detail.value
    })
    if (e.detail.value == 0) {
      var colorNames = ["全部"];
      var fabricColors = ["全部"];
      obj.setData({
        colorNames: colorNames,
        fabricColors: fabricColors,
        c_index: 0,
        f_index: 0
      });
    }else{
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetfabrichandovercolorhint',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index],
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var colorNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i<res.data.colorNameList.length;i++) {
              colorNames.push(res.data.colorNameList[i]);
            }
          }
          obj.setData({
            colorNames: colorNames,
            c_index:0
          });
        }
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetfabrichandoverfabriccolorhint',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index]
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var fabricColors = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.fabricColorList.length; i++) {
              fabricColors.push(res.data.fabricColorList[i]);
            }
          }
          obj.setData({
            fabricColors: fabricColors,
            f_index: 0
          });
        }
      })
      this.setData({
        orderName: obj.data.orderNames[obj.data.o_index],
        zIndex: -1
      })
    }
  },
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetfabrichandoverbyinfo',
      data: {
        orderName: obj.data.orderNames[obj.data.o_index],
        from:obj.data.dateFrom,
        to: obj.data.dateTo,
        colorName: obj.data.colorNames[obj.data.c_index],
        fabricColor: obj.data.fabricColors[obj.data.f_index]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          var totalBatch=0;
          var inShelfBatch=0;
          var outShelfBatch=0;
          for (var i = 0; i<res.data.fabricHandOverList.length;i++) {
            totalBatch += 1;
            if (res.data.fabricHandOverList[i].loadingTime != null){
              res.data.fabricHandOverList[i].loadingTime = util.tsFormatTime(res.data.fabricHandOverList[i].loadingTime, 'Y/M/D h:m:s');
              inShelfBatch += 1;
            }else{
              res.data.fabricHandOverList[i].loadingTime = '未上架';
            }
            if (res.data.fabricHandOverList[i].unLoadTime != null){
              res.data.fabricHandOverList[i].unLoadTime = util.tsFormatTime(res.data.fabricHandOverList[i].unLoadTime, 'Y/M/D h:m:s');
              outShelfBatch += 1;
            }else{
              res.data.fabricHandOverList[i].unLoadTime = '未下架';
            }
          }
          obj.setData({
            looseFabrics: res.data.fabricHandOverList,
            totalBatch: totalBatch,
            inShelfBatch: inShelfBatch,
            outShelfBatch: outShelfBatch
          });
        }else {
          obj.setData({
            looseFabrics: []
          });
        }
      },
      fail:function() {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  },
  bindFromChange: function (e) {
    this.setData({
      dateFrom: e.detail.value
    })
  },
  bindToChange: function (e) {
    this.setData({
      dateTo: e.detail.value
    })
  },
  bindColorChange: function (e) {
    this.setData({
      c_index: e.detail.value
    })
  },
  bindFabricColorChange: function (e) {
    this.setData({
      f_index: e.detail.value
    })
  },

})