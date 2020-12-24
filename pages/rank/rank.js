//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      currentData : 0,
      rankData : [],
      widHeight: '100%',
      noticeCount: 0,
      cutCount: 0,
      sewCount: 0,
      finishCount: 0,
      privateCount: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that  = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetmessagecountbytype',
      data:{
        receiveUser : app.globalData.employee.employeeName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        var noticeCount = 0;
        var cutCount = 0;
        var sewCount = 0;
        var finishCount = 0;
        var privateCount = 0;
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.messageList.length; i++) {
            if (res.data.messageList[i].messageType === '私信'){
              privateCount = res.data.messageList[i].messageCount;
            } else if (res.data.messageList[i].messageType === '通知'){
              noticeCount = res.data.messageList[i].messageCount;
            } else if (res.data.messageList[i].messageType === '裁床'){
              cutCount = res.data.messageList[i].messageCount;
            } else if (res.data.messageList[i].messageType === '车缝'){
              sewCount = res.data.messageList[i].messageCount;
            } else if (res.data.messageList[i].messageType === '后整'){
              finishCount = res.data.messageList[i].messageCount;
            }     
          }
        }
        that.setData({
          privateCount: privateCount,
          noticeCount: noticeCount,
          cutCount: cutCount,
          sewCount: sewCount,
          finishCount: finishCount
        })
      }, fail:function() {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
  },
  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
    if (e.detail.current === 0){
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetmessagecountbytype',
        data:{
          receiveUser : 'admin'
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res){
          var noticeCount = 0;
          var cutCount = 0;
          var sewCount = 0;
          var finishCount = 0;
          var privateCount = 0;
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.messageList.length; i++) {
              if (res.data.messageList[i].messageType === '私信'){
                privateCount = res.data.messageList[i].messageCount;
              } else if (res.data.messageList[i].messageType === '通知'){
                noticeCount = res.data.messageList[i].messageCount;
              } else if (res.data.messageList[i].messageType === '裁床'){
                cutCount = res.data.messageList[i].messageCount;
              } else if (res.data.messageList[i].messageType === '车缝'){
                sewCount = res.data.messageList[i].messageCount;
              } else if (res.data.messageList[i].messageType === '后整'){
                finishCount = res.data.messageList[i].messageCount;
              }     
            }
          }
          that.setData({
            privateCount: privateCount,
            noticeCount: noticeCount,
            cutCount: cutCount,
            sewCount: sewCount,
            finishCount: finishCount
          })
        }, fail:function() {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      })
    } else if (e.detail.current === 1){
      wx.request({
        url: app.globalData.backUrl + '/erp/miniGetRankWorkByGroup',
        data:{
          groupName : app.globalData.employee.groupName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res){
          var rankData = [];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.employee.length; i++) {
              var tmpData = {};
              tmpData.employeeNumber = res.data.employee[i];
              var pieceData = [];
              for (var j = 0; j<res.data.generalSalaryList.length;j++){
                if (res.data.generalSalaryList[j].employeeNumber === res.data.employee[i]){
                  var tmpPieceData = {};
                  tmpData.groupName = res.data.generalSalaryList[j].groupName;
                  tmpData.employeeName = res.data.generalSalaryList[j].employeeName;
                  tmpPieceData.orderName= res.data.generalSalaryList[j].orderName;
                  tmpPieceData.clothesVersionNumber= res.data.generalSalaryList[j].clothesVersionNumber;
                  tmpPieceData.procedureName= res.data.generalSalaryList[j].procedureName;
                  tmpPieceData.pieceCount= res.data.generalSalaryList[j].pieceCount;
                  pieceData.push(tmpPieceData);
                }
              }
              tmpData.pieceData = pieceData;
              rankData.push(tmpData);
            }
          }
          that.setData({
            rankData: rankData,
            widHeight: 202*rankData.length+'px'
          })
        }, fail:function() {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      })      
    }
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;
    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  showNoticeSummary:function(e){
    const that = this;
    that.setData({
      noticeCount: 0
    })
    wx.navigateTo({
      url: "../noticeSummary/noticeSummary"
    })
  },
  showPrivateSummary:function(e){
    const that = this;
    that.setData({
      privateCount: 0
    })
    wx.navigateTo({
      url: "../privateMessage/privateMessage"
    })
  },
  showCutSummary:function(e){
    const that = this;
    that.setData({
      cutCount: 0
    })
    wx.navigateTo({
      url: "../cutSummary/cutSummary"
    })
  }
})
