const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    procedureNumber:'',
    procedureName:'',
    records:[],
    person:[]
  },
  onLoad: function (option) {
    var obj = this;
    this.setData({
      procedureNumber: option.procedureNumber,
      procedureName: decodeURIComponent(option.procedureName)
    })
    var url = "/erp/minigetproductionprogressdetailbyordertimegroup";
    if (option.procedureNumber == "0") {
      url = "/erp/minigetotherproductionprogressdetailbyordertime";
    }
    wx.request({
      url: app.globalData.backUrl + url,
      data: {
        orderName: decodeURIComponent(option.orderName),
        groupName: option.groupName,
        from: option.from,
        to: option.to,
        procedureNumber:option.procedureNumber,
        procedureName:decodeURIComponent(option.procedureName)
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          var records = [];
          for (var colorKey in res.data.color) {
            for(var sizeKey in res.data.color[colorKey]) {
              var tmp = {};
              tmp.color = colorKey;
              tmp.size = sizeKey;
              tmp.orderCount = res.data.color[colorKey][sizeKey].orderCount;
              tmp.cutCount = res.data.color[colorKey][sizeKey].cutCount;
              tmp.productionCount = res.data.color[colorKey][sizeKey].productionCount;
              tmp.leakCount = res.data.color[colorKey][sizeKey].leakCount;
              records.push(tmp);
            }
          }
          obj.setData({
            person: res.data.person,
            records: records
          });
        } else {
          obj.setData({
            person: []
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  }
})