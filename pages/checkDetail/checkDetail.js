const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    dateFrom:'',
    dateTo:'',
    time:'',
    year:'',
    month:''
  },
  onLoad: function (option) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    this.setData({
      time: Y + '-' + M,
      year:Y,
      month:M
    })
    this.search();
  },
  search:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetcheckdetailbyemp',
      data: {
        year:obj.data.year,
        month: obj.data.month,
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
  selectDataTime: function(e) {
    console.log('点击确定选择的时间是:',e.detail.value)
    var yearMonth = e.detail.value;
    var year = yearMonth.substring(0,4);
    var month = yearMonth.substring(5);
    this.setData({
      time: e.detail.value
    })
  }
})