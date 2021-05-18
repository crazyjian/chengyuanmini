const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    procedureNumber:'',
    procedureName:'',
    records:[],
    person:[],
    getListLoading:false,
    tableColumns: [
      {
          title: "颜色",
          key: "color",
      }, {
          title: "尺码",
          key: "size"
      }, {
          title: "已做",
          key: "productionCount"
      }, {
          title: "订单量",
          key: "orderCount",
      }, {
          title: "好片数",
          key: "cutCount",
      }, {
          title: "差异",
          key: "leakCount"
      }],
      personColumns: [
        {
            title: "组名",
            key: "groupName",
        }, {
            title: "工号",
            key: "employeeNumber"
        }, {
            title: "姓名",
            key: "employeeName"
        }, {
            title: "数量",
            key: "productionCount",
        }]
  },
  onLoad: function (option) {
    var obj = this;
    this.setData({
      procedureNumber: option.procedureNumber,
      procedureName: option.procedureName
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