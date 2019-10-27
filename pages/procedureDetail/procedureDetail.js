const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    bindSource: [],
    dateFrom: '开始日期',
    dateTo: '结束日期',
    g_index:0,
    groupNames:["请选择分组"]
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetbiggroupname',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var groupNames = obj.data.groupNames;
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.groupList.length; i++) {
            groupNames.push(res.data.groupList[i]);
          }
          if (app.globalData.employee.role == 'role2') {
            for (var i = 0; i < groupNames.length; i++) {
              if (groupNames[i] == app.globalData.employee.groupName) {
                obj.setData({
                  g_index: i
                })
              }
            }
          }
          obj.setData({
            groupNames: groupNames
          });
        }
      }
    });
  },
  getOrderName: function (e) {

    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderhint',
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
            for (var i = 0; i < res.data.orderNameList.length;i++) {
              newSource.push(res.data.orderNameList[i].orderName);
            }
            obj.setData({
              bindSource: newSource,
              orderName: orderName,
              zIndex:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
    }
  },
  itemtap: function (e) {
    this.setData({
      orderName: e.target.id,
      zIndex: -1
    })
  },
  search:function() {
    var obj = this;
    var orderName = obj.data.orderName;
    if (!orderName) {
      wx.showToast({
        title: '请输入订单号',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var groupName = obj.data.groupNames[obj.data.g_index];
    if (obj.data.g_index == 0) {
      groupName = "";
    }
    var from = obj.data.dateFrom;
    if (from == "开始日期") {
      from = "";
    }
    var to = obj.data.dateTo;
    if (to == "结束日期") {
      to = "";
    }
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetproductionprogressbyordertimegroup', 
      data: {
        orderName: orderName,
        groupName: groupName,
        from:from,
        to:to
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          obj.setData({
            records: res.data.productionProgressList
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
  },
  bindGroupNameChange: function (e) {
    this.setData({
      g_index: e.detail.value
    })
  },
  detail:function(e) {
    var procedureNumber = e.currentTarget.dataset.procedurenumber;
    var procedureName = e.currentTarget.dataset.procedurename;
    var groupName = this.data.groupNames[this.data.g_index];
    if (this.data.g_index == 0) {
      groupName = "";
    }
    var from = this.data.dateFrom;
    if (from == "开始日期") {
      from = "";
    }
    var to = this.data.dateTo;
    if (to == "结束日期") {
      to = "";
    }
    var orderName = this.data.orderName;
    wx.navigateTo({
      url: "../procedureBalanceDetail/procedureBalanceDetail?procedureNumber=" + procedureNumber + "&orderName=" + orderName + "&groupName=" + groupName + "&from=" + from + "&to=" + to + "&procedureName=" + procedureName
    })
  }
})