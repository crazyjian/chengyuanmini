const app = getApp()
Page({
  data: {
    records:[], 
    orderName:'',
    versionNumber:'',
    zIndex1:-1,
    zIndex2: -1,
    groupName:'全部',
    dateFrom:'',
    dateTo:'',
    groupNames:["全部"],
    groupIndex:0,
    pieceCountTotal:0,
    bindSource: [],
    getListLoading:false,
    tableColumns: [{
      title: "组名",
      key: "groupName",
      }, {
          title: "单号",
          key: "clothesVersionNumber",
          width: "300rpx"
      }, {
          title: "款号",
          key: "orderName",
          width: "400rpx"
      }, {
          title: "工序名",
          key: "procedureName",
      }, {
          title: "工序号",
          key: "procedureNumber",
      }, {
          title: "数量",
          key: "pieceCount"
      }]
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
    
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetallgroupnamelist',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          let groupNew = ["全部"];
          for (let i=0;i<res.data.groupList.length;i++) {
            groupNew.push(res.data.groupList[i]);
          }
          obj.setData({
            groupNames: groupNew,
          });
        }
      }
    });
  },

  groupBindPickerChange: function (e) {
    var obj = this;
    var groupName = obj.data.groupNames[e.detail.value];
    obj.setData({
      groupIndex: e.detail.value,
      groupName:groupName
    });
  },

  getClothesVersionNumber: function (e) {
    this.setData({
      zIndex2: -1
    })
    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysubversion',
        data: {
          subVersion: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            obj.setData({
              bindSource: res.data.data,
              // versionNumber: versionNumber,
              zIndex1:1000
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
  getOrderName: function (e) {
    this.setData({
      zIndex1: -1
    })
    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysuborder',
        data: {
          subOrderName: orderName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            obj.setData({
              bindSource: res.data.data,
              // orderName: orderName,
              zIndex2: 1000
            });
          }
        }
      })
    } else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
    }
  },
  itemtap: function (e) {
    var obj = this;
    this.setData({
      versionNumber: e.currentTarget.dataset.version,
      orderName: e.currentTarget.dataset.order,
      zIndex1: -1,
      zIndex2: -1,
    })
  },
  search:function() {
    var obj = this;
    var param = {};
    param.from = obj.data.dateFrom;
    param.to = obj.data.dateTo;
    if (obj.data.orderName != '' && obj.data.orderName != null){
      param.orderName = obj.data.orderName;
    }
    if (obj.data.groupName != '' && obj.data.groupName != null && obj.data.groupName != '全部'){
      param.groupName = obj.data.groupName;
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minisearchgrouppieceworksummary',
      data: param,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          let recordsNew = [];
          let pieceTotal = 0;
          for(var i = 0; i < res.data.generalSalaryList.length; i ++){
            pieceTotal += res.data.generalSalaryList[i].pieceCount;
            recordsNew.push({
              groupName: res.data.generalSalaryList[i].groupName,
              orderName: res.data.generalSalaryList[i].orderName,
              clothesVersionNumber: res.data.generalSalaryList[i].clothesVersionNumber,
              procedureNumber: res.data.generalSalaryList[i].procedureNumber,
              procedureName: res.data.generalSalaryList[i].procedureName,
              pieceCount: res.data.generalSalaryList[i].pieceCount,
              pieceId: i
            })
          }
        
          obj.setData({
            records: recordsNew,
            pieceCountTotal:pieceTotal
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
  getGroupName:function(e) {
    var groupName = e.detail.value;
    this.setData({
      groupName: groupName
    })
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
  }

})