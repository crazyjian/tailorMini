const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    versionNumber:'',
    zIndex:-1,
    bindSource: [],
    orderNames: ["请选择订单"],
    o_index: 0,
    beds: ["请选择床号"],
    b_index: 0,
  },
  onLoad: function (option) {
  },
  getClothesVersionNumber: function (e) {

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
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.versionList.length;i++) {
              newSource.push(res.data.versionList[i]);
            }
            obj.setData({
              bindSource: newSource,
              versionNumber: versionNumber,
              zIndex:1000,
              orderNames: ["请选择订单"],
              o_index: 0,
              beds: ["请选择床号"],
              b_index: 0,
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        versionNumber: versionNumber,
        orderNames: ["请选择订单"],
        o_index: 0,
        beds: ["请选择床号"],
        b_index: 0,
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
        var orderNames = ["请选择订单"];
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
    var orderName = this.data.orderNames[e.detail.value];
    if(e.detail.value!=0) {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetmainbednumbersbyordername',
        data: {
          orderName: orderName,
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var beds = ["请选择床号"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.bedNumList.length;i++) {
              beds.push(res.data.bedNumList[i]);
            }
          } 
          obj.setData({
            beds: beds,
            b_index: 0
          });
        }
      })
    }else {
      obj.setData({
        beds: ["请选择床号"],
        b_index: 0
      })
    }
  },
  bindBedChange: function (e) {
    var obj = this;
    obj.setData({
      b_index: e.detail.value
    })
  },
  search:function() {
    var obj = this;
    var orderName = obj.data.orderNames[obj.data.o_index];
    if (orderName == "请选择订单") {
      wx.showToast({
        title: "请选择订单",
        image: '../../static/img/error.png',
        duration: 1000,
      })
      return;
    }
    var bedNumber = obj.data.beds[obj.data.b_index];
    if (bedNumber == "请选择床号") {
      wx.showToast({
        title: "请选择床号",
        image: '../../static/img/error.png',
        duration: 1000,
      })
      return;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minigettailordatabyordernamebednumber',
      data: {
        orderName: orderName,
        bedNumber: bedNumber
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.tailorList) {
          var tailorList = res.data.tailorList;
          for (var i = 0; i < tailorList.length; i++) {
            tailorList[i].tailorQcodeID = obj.prefixZero(tailorList[i].tailorQcodeID,9);
          }
          obj.setData({
            records: tailorList
          });
        }else {
          obj.setData({
            records: []
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
  prefixZero: function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },

})