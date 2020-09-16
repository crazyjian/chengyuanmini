const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    orderName:'',
    clothesVersionNumber:'',
    bedNumber:'',
    packageNumber:'',
    colorName:'',
    sizeName:'',
    partName:'',
    layerCount:'',
    isShow:false,
    wrongQuantity:'',
    index:0,
    wrong: [],
    btnText:'提交',
    btnFunction:'addinspection',
    inpsectionJson:{},
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
        // console.log(res.data);
        if (res.statusCode == 200 && res.data.tailor) {
          var array = res.data.split('-');
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
          var inpsectionJson = {};
          inpsectionJson.orderName = orderName;
          inpsectionJson.bedNumber = bedNumber;
          inpsectionJson.packageNumber = packageNumber;
          inpsectionJson.layerCount = layerCount;
          inpsectionJson.sizeName = sizeName;
          inpsectionJson.colorName = colorName;
          inpsectionJson.partName = partName;
          inpsectionJson.tailorQcodeID = tailorQcodeID;
          inpsectionJson.employeeNumber = employeeNumber;
          obj.setData({
            inpsectionJson: inpsectionJson
          })
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetwrongbyordername',
            data: {
              orderName: orderName
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200) {
                var wrong = [];
                wrong.push({ "wrongCode": 0, "wrongDescription": "请选择问题"});
                for (var i = 0; i < res.data.wrongByOrderName.length;i++) {
                  wrong.push({ 'wrongCode': res.data.wrongByOrderName[i].wrongCode, 'wrongDescription': res.data.wrongByOrderName[i].wrongCode+'-'+ res.data.wrongByOrderName[i].wrongDescription});
                }
                //访问正常
                obj.setData({
                  wrong: wrong
                });


              }
            },
            fail: function (res) {
              // console.log(res)
            }
          })

          wx.request({
            url: app.globalData.backUrl + '/erp/minigetpieceworkempinfo',
            data: {
              'orderName': obj.data.orderName,
              'bedNumber': obj.data.bedNumber,
              'packageNumber': obj.data.packageNumber,
              'tailorQcodeID': option.qrCode
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data) {
                obj.setData({
                  records: res.data.pieceWorkEmpList,
                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "获取工序信息失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        }else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '扫描失败',
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
          url: "../inspection/inspection?qrCode=" + qrcode
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
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.inpsectionJson.wrongCode = this.data.wrong[e.detail.value].wrongCode;
    this.setData({
      index: e.detail.value,
      inpsectionJson: this.data.inpsectionJson
    })
  },
  getWrongQuantity:function(e) {
    this.data.inpsectionJson.wrongQuantity = e.detail.value;
    this.setData({
      wrongQuantity:e.detail.value,
      inpsectionJson: this.data.inpsectionJson
    })
  },
  addinspection:function() {
    var obj = this;
    if(obj.data.index == 0) {
      wx.showToast({
        title: '请选择问题',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (obj.data.wrongQuantity == '') {
      wx.showToast({
        title: '请输入数量',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var pieceWorkJson = {};
    pieceWorkJson.orderName = obj.data.orderName;
    pieceWorkJson.bedNumber = obj.data.bedNumber;
    pieceWorkJson.packageNumber = obj.data.packageNumber;
    pieceWorkJson.employeeNumber = app.globalData.employeeNumber;
    wx.request({
      url: app.globalData.backUrl + '/erp/minicheckpieceworknew',
      data: {
        pieceWorkJson: JSON.stringify(pieceWorkJson)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.data == 0) {
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddinspection',
            data: {
              inspectionJson: JSON.stringify(obj.data.inpsectionJson),
              pieceType: 0
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data == 0) {
                obj.setData({
                  btnText: '继续扫描',
                  btnFunction: 'scanCode',
                  orderName: '',
                  bedNumber: '',
                  packageNumber: '',
                  colorName: '',
                  layerCount: '',
                  wrongQuantity: '',
                  index: 0,
                  wrong: []
                });
                wx.showToast({
                  title: "提交成功",
                  icon: 'success',
                  duration: 1000
                })
              } else if (res.data == 3) {
                wx.showToast({
                  title: "扫描部位不正确",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              } else {
                wx.showToast({
                  title: "提交失败",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
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
        } else if (res.data == 1) {
          wx.showToast({
            title: "重复计件",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        } else {
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddinspection',
            data: {
              inspectionJson: JSON.stringify(obj.data.inpsectionJson),
              pieceType: 1
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              console.log(res.data);
              if (res.statusCode == 200 && res.data == 0) {
                obj.setData({
                  btnText: '继续扫描',
                  btnFunction: 'scanCode',
                  orderName: '',
                  bedNumber: '',
                  packageNumber: '',
                  colorName: '',
                  layerCount: '',
                  wrongQuantity: '',
                  index: 0,
                  wrong: []
                });
                wx.showToast({
                  title: "提交成功,部分已计件",
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.data == 3) {
                wx.showToast({
                  title: "扫描部位不正确",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              } else {
                wx.showToast({
                  title: "提交失败",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
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
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "服务器错误",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
    
  }
})