const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[
      {
        signDate:'2020-11-01',
        in1:'07:59',
        out1: '12:00',
        in2: '14:01',
        out2: '16:59',
        in3: '',
        out3: ''
      },
      {
        signDate: '2020-11-02',
        in1: '08:01',
        out1: '12:01',
        in2: '13:31',
        out2: '17:00',
        in3: '19:00',
        out3: '22:00'
      }
      ],
    dateFrom:'',
    dateTo:'',
    time:'',
    year:'',
    month:'',
    recordRuleList: []
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
          console.log(res.data.recordRuleList)
          if (res.data.checkDetailList.length == 0 || res.data.checkDetailList == null){
            obj.setData({
              records: ["无记录"]
            })
          }else {
            obj.setData({
              records: res.data.checkDetailList,
              recordRuleList: res.data.recordRuleList
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
    var obj = this;
    var yearMonth = e.detail.value;
    var year = yearMonth.substring(0,4);
    var month = yearMonth.substring(5);
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetcheckdetailbyemp',
      data: {
        year: year,
        month: month,
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
              records: res.data.checkDetailList,
              recordRuleList: res.data.recordRuleList
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
    obj.setData({
      time: e.detail.value,
      year: year,
      month: month
    })
  }
})