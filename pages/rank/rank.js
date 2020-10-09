//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
      currentData : 0,
      rankData : [],
      widHeight: '100%'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
    if (e.detail.current === 1){
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
            console.log(res.data);
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
  }
})
