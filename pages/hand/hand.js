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
    pieceWorkJson:'',
    isHide: true,
    qrCode: '',
    sizeName: ''
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
        if (res.statusCode == 200 && res.data) {
          //访问正常
          var pieceWorkJson = {};
          pieceWorkJson.orderName = res.data.tailor.orderName;
          pieceWorkJson.clothesVersionNumber = res.data.tailor.clothesVersionNumber;
          pieceWorkJson.bedNumber = res.data.tailor.bedNumber;
          pieceWorkJson.packageNumber = res.data.tailor.packageNumber;
          pieceWorkJson.partName = res.data.tailor.partName;
          pieceWorkJson.colorName = res.data.tailor.colorName;
          pieceWorkJson.sizeName = res.data.tailor.sizeName;
          pieceWorkJson.layerCount = res.data.tailor.layerCount;
          pieceWorkJson.employeeNumber = app.globalData.employeeNumber;
          pieceWorkJson.employeeName = app.globalData.employee.employeeName;
          pieceWorkJson.groupName = app.globalData.employee.groupName;
          pieceWorkJson.tailorQcodeID = option.qrCode;
          obj.setData({
            orderName: res.data.tailor.orderName,
            clothesVersionNumber: res.data.tailor.clothesVersionNumber,
            bedNumber: res.data.tailor.bedNumber,
            packageNumber: res.data.tailor.packageNumber,
            partName: res.data.tailor.partName,
            colorName: res.data.tailor.colorName,
            layerCount: res.data.tailor.layerCount,
            sizeName: res.data.tailor.sizeName,
            pieceWorkJson: JSON.stringify(pieceWorkJson)
          });
          
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorderemp',
            data: {
              orderName: obj.data.orderName,
              employeeNumber: app.globalData.employeeNumber,
              partName:obj.data.partName
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.data.procedureInfoEmpList.length == 0) {
                obj.setData({
                  isShow: true,
                  pieceInfo: '无工序信息，请联系生产主管'
                })
              }else {
                var producerName = '';
                for (var i = 0; i < res.data.procedureInfoEmpList.length; i++) {
                  producerName += res.data.procedureInfoEmpList[i].procedureNumber + '-' + res.data.procedureInfoEmpList[i].procedureName + ' ';
                }
                obj.setData({
                  producerName: producerName
                });
                wx.request({
                  url: app.globalData.backUrl + '/erp/minicheckpieceworknewram',
                  data: {
                    pieceWorkJson: obj.data.pieceWorkJson
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (res) {
                    // console.log(res.data);
                    if (res.data == 0) {
                      wx.request({
                        url: app.globalData.backUrl + '/erp/miniaddpieceworkbatchnewram',
                        data: {
                          pieceWorkJson: obj.data.pieceWorkJson,
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
                              isShow: true,
                              pieceInfo: '计件成功'
                            })
                          } else if (res.data == 3) {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '扫描部位不正确'
                            })
                          } else {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件失败'
                            })
                          }
                        }, fail: function (e) {
                          obj.setData({
                            isShow: true,
                            pieceInfo: '计件失败'
                          })
                        }
                      });
                    } else if (res.data == 1) {
                      wx.showToast({
                        title: "重复计件",
                        image: '../../static/img/error.png',
                        duration: 1000,
                      })
                    }else if (res.data == 3) {
                      wx.showToast({
                        title: "计件工序为特殊工序，该颜色或尺码不需要计件",
                        icon: 'none',
                        duration: 1000,
                      })
                    } else {
                      wx.request({
                        url: app.globalData.backUrl + '/erp/miniaddpieceworkbatchnewram',
                        data: {
                          pieceWorkJson: obj.data.pieceWorkJson,
                          pieceType: 1
                        },
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: function (res) {
                          // console.log(res.data);
                          if (res.statusCode == 200 && res.data == 0) {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '部分计件成功'
                            })
                          } else if (res.data == 3) {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '扫描部位不正确'
                            })
                          }else {
                            obj.setData({
                              isShow: true,
                              pieceInfo: '计件失败'
                            })
                          }
                        }, fail: function (e) {
                          obj.setData({
                            isShow: true,
                            pieceInfo: '计件失败'
                          })
                        }
                      });
                      wx.showToast({
                        title: "本扎您分配的工序部分已计件,请确认或联系主管",
                        icon: 'none',
                        duration: 2000,
                      })
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
            }
          });

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
                title: "获取员工信息失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        }else {
          wx.showToast({
            title: '二维码信息不存在',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取信息失败',
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
  hand: function (e) {
    this.setData({
      isHide: false
    })
  },
  cancel: function (e) {
    this.setData({
      isHide: true,
      qrCode: ''
    })
  },
  setQrCodeValue: function (e) {
    this.setData({
      qrCode: e.detail.value
    })
  },
  confirm: function (e) {
    var qrCode = this.data.qrCode
    if (!qrCode) {
      wx.showToast({
        title: '请输入二维码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    this.setData({
      isHide: true,
      qrCode: ''
    })
    wx.redirectTo({
      url: "../hand/hand?qrCode=" + qrCode
    })
  }
})