const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    orderName:'',
    bedNumber:'',
    packageNumber:'',
    colorName:'',
    layerCount:'',
    isShow:false,
    producerName:'',
    pieceInfo:'计件成功',
    sizeName:'',
    records:[]
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl +'/erp/minigetonetailorbytailorqcodeid',
      data: {
        tailorQcodeID: option.qrCode,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.tailor) {
          //访问正常
          var orderName = res.data.tailor.orderName;
          var clothesVersionNumber = res.data.tailor.clothesVersionNumber;
          var bedNumber = res.data.tailor.bedNumber;
          var packageNumber = res.data.tailor.packageNumber;
          var partName = res.data.tailor.partName;
          var colorName = res.data.tailor.colorName;
          var sizeName = res.data.tailor.sizeName;
          var layerCount = res.data.tailor.layerCount;
          var employeeNumber = app.globalData.employeeNumber;
          var employeeName = app.globalData.employee.employeeName;
          var groupName = app.globalData.employee.groupName;
          var tailorQcodeID = option.qrCode;
          obj.setData({
            orderName: res.data.tailor.orderName,
            clothesVersionNumber: res.data.tailor.clothesVersionNumber,
            bedNumber: res.data.tailor.bedNumber,
            packageNumber: res.data.tailor.packageNumber,
            partName: res.data.tailor.partName,
            colorName: res.data.tailor.colorName,
            layerCount: res.data.tailor.layerCount,
            sizeName: res.data.tailor.sizeName
          });
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddpieceworkbatchupdate',
            data: {
              'orderName': orderName,
              'clothesVersionNumber':clothesVersionNumber,
              'groupName':groupName,
              'employeeName':employeeName,
              'employeeNumber':employeeNumber,
              'bedNumber': bedNumber,
              'partName': partName,
              'packageNumber':packageNumber,
              'colorName':colorName,
              'sizeName':sizeName,
              'layerCount':layerCount,
              'tailorQcodeID': tailorQcodeID
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data) {
                if (res.data.success){
                  var producerName = '';
                  for (var i = 0; i < res.data.dispatchProcedureList.length; i++) {
                    producerName += res.data.dispatchProcedureList[i].procedureNumber + '-' + res.data.dispatchProcedureList[i].procedureName + ' ';
                  }
                  obj.setData({
                    producerName: producerName,
                    isShow: true,
                    pieceInfo: res.data.success,
                    records: res.data.pieceWorkEmpList
                  });
                } else if (res.data.fail) {
                  var producerName = '';
                  for (var i = 0; i < res.data.dispatchProcedureList.length; i++) {
                    producerName += res.data.dispatchProcedureList[i].procedureNumber + '-' + res.data.dispatchProcedureList[i].procedureName + ' ';
                  }
                  obj.setData({
                    producerName: producerName,
                    isShow: true,
                    pieceInfo: res.data.fail,
                    records: res.data.pieceWorkEmpList
                  });
                } else if (res.data.error){
                  var producerName = '';
                  for (var i = 0; i < res.data.dispatchProcedureList.length; i++) {
                    producerName += res.data.dispatchProcedureList[i].procedureNumber + '-' + res.data.dispatchProcedureList[i].procedureName + ' ';
                  }
                  obj.setData({
                    isShow: true,
                    producerName: producerName,
                    pieceInfo: res.data.error,
                    records: res.data.pieceWorkEmpList
                  });
                }
                
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "提交失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
          
        } else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '扫件失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  },
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '../index/index'
  //   })
  // },
  scanCode: function (e) {
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var qrcode = res.result;
        wx.redirectTo({
          url: "../scanPiece/scanPiece?qrCode=" + qrcode
        })
      },
      fail(res) {
        wx.showToast({
          title: '失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  }
})