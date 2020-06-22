const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    dateFrom:'',
    dateTo:''
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
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetcheckdetailbyemp',
      data: {
        from:obj.data.dateFrom,
        to: obj.data.dateTo,
        employeeNumber: app.globalData.employeeNumber
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          if (res.data.checkDetailList.length == 0 || res.data.checkDetailList == null){
            obj.setData({
              records: ["无记录"]
            })
          }else {
            obj.setData({
              records: res.data.checkDetailList
            });
          }
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
})