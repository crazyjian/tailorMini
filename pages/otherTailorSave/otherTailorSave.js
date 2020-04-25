const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    tailorList:[],
    initCount:'',
    updateCount:'',
    isHide:true,
    index:'',
  },
  onLoad: function (option) {
    var obj = this;
    var tailorList = JSON.parse(decodeURIComponent(option.tailorList));
    for (var i = 0; i < tailorList.length;i++) {
      tailorList[i].tailorQcodeID = this.prefixZero(tailorList[i].tailorQcodeID, 9);
    }
    obj.setData({
      tailorList: tailorList
    })
  },
  delete:function(e) {
    var index = e.target.dataset.index;
    var obj = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var tailorList = obj.data.tailorList;
          tailorList.splice(index,1);
          obj.setData({
            tailorList: tailorList
          })
        }
      }
    })
  },
  update:function(e) {
    var index = e.target.dataset.index;
    this.setData({
      isHide:false,
      initCount: this.data.tailorList[index].layerCount,
      index:index
    })
  },
  setUpdateCount:function(e){
    var updateCount = e.detail.value;
    this.setData({
      updateCount: updateCount
    })
  },
  cancel: function () {
    this.setData({
      isHide: true,
      initCount:'',
      updateCount:'',
      index:''
    })
  },
  confirm:function(e) {
    if (this.data.updateCount == "") {
      wx.showToast({
        title: "请填写修改值",
        image: '../../static/img/error.png',
        duration: 1000,
      })
      return;
    }
    let string = "tailorList[" + this.data.index + "].layerCount"
    this.setData({
      [string]: this.data.updateCount
    })
    this.cancel();
  },
  prefixZero:function(num, n) {
    return(Array(n).join(0) + num).slice(-n);
  },
  save:function() {
    var tailorList = JSON.stringify(this.data.tailorList);
    var groupName = app.globalData.employee.groupName;
    wx.request({
      url: app.globalData.backUrl + '/erp/minisaveothertailordata',
      data: {
        tailorList: tailorList,
        groupName: groupName
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200) {
          if (res.data == 0) {
            wx.showToast({
              title: "保存成功",
              icon: 'success',
              duration: 500,
              success: function () {
                wx.setStorage({
                  key: "olooseFabrics",
                  data: []
                });
                wx.setStorage({
                  key: "olayerTotal",
                  data: 0
                });
                wx.setStorage({
                  key: "oweightTotal",
                  data: 0
                });
                wx.setStorage({
                  key: "omatchRatios",
                  data: [{ "sizeName": "", "ratio": "" }]
                });
                wx.setStorage({
                  key: "os_index",
                  data: [0]
                });
                setTimeout(function () {
                  wx.switchTab({
                    url: "../index/index"
                  })
                }, 1000)
              }
            })
          }else {
            wx.showToast({
              title: "保存失败",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          }
        } else {
          wx.showToast({
            title: "服务器发生异常",
            image: '../../static/img/error.png',
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
})