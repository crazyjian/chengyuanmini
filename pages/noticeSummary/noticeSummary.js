const app = getApp()
Page({
  data: {
    messages: []
  },
  onLoad:function() {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetmessagebyinfo',
      data:{
        receiveUser : app.globalData.employee.employeeName,
        messageType: '通知'
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        var messages = [];
        if (res.statusCode == 200 && res.data) {
          messages = res.data.messageList;
        }
        obj.setData({
          messages: messages
        })
      }, fail:function() {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })

    wx.request({
      url: app.globalData.backUrl + '/erp/miniupdatemessagereadtypebytypeanduser',
      data:{
        receiveUser : app.globalData.employee.employeeName,
        messageType: '通知'
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        if (res.statusCode == 200 && res.data) {
        }
      }, fail:function() {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
  }

})