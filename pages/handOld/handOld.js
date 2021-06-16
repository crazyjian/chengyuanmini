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
          var secondFactory = app.globalData.secondFactory;
          var tailorQcodeID = option.qrCode;
          var scanFactory = res.data.tailor.scanFactory;
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
          if (scanFactory != null && scanFactory != '' && secondFactory != scanFactory){
            wx.showToast({
              title: '扫描工厂不对应',
              icon: 'none',
              duration: 1500
            })
          } else {
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
                    var resultInfo = res.data.success;
                    if (resultInfo.indexOf('成功') > 0 && resultInfo.indexOf('爆数') < 0 &&  resultInfo.indexOf('部位不对应') < 0 &&  resultInfo.indexOf('重复计件') < 0 &&  resultInfo.indexOf('计件失败') < 0 &&  resultInfo.indexOf('不用计件') < 0){
                      const innerAudioContext = wx.createInnerAudioContext()
                      innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                      innerAudioContext.loop =false  // 是否循环播放，默认为 false
                      wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                        obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                        success: function(e) {
                          console.log(e)
                          console.log('play success')
                        },
                        fail: function(e) {
                          console.log(e)
                          console.log('play fail')
                        }
                      })
                      innerAudioContext.src = 'static/voice/success.mp3';  // 音频资源的地址
                      innerAudioContext.play();
                      wx.showToast({
                        title: "计件成功",
                        icon: 'success',
                        duration: 1500
                      })
                    } else if (resultInfo.indexOf('成功') < 0){
                      const innerAudioContext = wx.createInnerAudioContext()
                      innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                      innerAudioContext.loop =false  // 是否循环播放，默认为 false
                      wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                        obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                        success: function(e) {
                          console.log(e)
                          console.log('play success')
                        },
                        fail: function(e) {
                          console.log(e)
                          console.log('play fail')
                        }
                      })
                      innerAudioContext.src = 'static/voice/fail.mp3';  // 音频资源的地址
                      innerAudioContext.play();
                      wx.showToast({
                        title: '计件失败',
                        image: '../../static/img/error.png',
                        duration: 1500
                      })
                    } else if (resultInfo.indexOf('成功') > 0 && (resultInfo.indexOf('爆数') > 0 ||  resultInfo.indexOf('部位不对应') > 0 ||  resultInfo.indexOf('重复计件') > 0 ||  resultInfo.indexOf('计件失败') > 0 ||  resultInfo.indexOf('不用计件') > 0)) {
                      console.log("部分成功");
                      const innerAudioContext = wx.createInnerAudioContext()
                      innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                      innerAudioContext.loop =false  // 是否循环播放，默认为 false
                      wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                        obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                        success: function(e) {
                          console.log(e)
                          console.log('play success')
                        },
                        fail: function(e) {
                          console.log(e)
                          console.log('play fail')
                        }
                      })
                      innerAudioContext.src = 'static/voice/half.mp3';  // 音频资源的地址
                      innerAudioContext.play();
                      wx.showToast({
                        title: '部分成功',
                        icon: 'none',
                        image: '../../static/img/warn.png',
                        duration: 1500
                      })
                    }
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
                    const innerAudioContext = wx.createInnerAudioContext()
                    innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                    innerAudioContext.loop =false  // 是否循环播放，默认为 false
                    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                      obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                      success: function(e) {
                        console.log(e)
                        console.log('play success')
                      },
                      fail: function(e) {
                        console.log(e)
                        console.log('play fail')
                      }
                    })
                    innerAudioContext.src = 'static/voice/fail.mp3';  // 音频资源的地址
                    innerAudioContext.play();
                    wx.showToast({
                      title: '计件失败',
                      icon: 'none',
                      image: '../../static/img/error.png',
                      duration: 1500
                    })
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
                    const innerAudioContext = wx.createInnerAudioContext()
                    innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                    innerAudioContext.loop =false  // 是否循环播放，默认为 false
                    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                      obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                      success: function(e) {
                        console.log(e)
                        console.log('play success')
                      },
                      fail: function(e) {
                        console.log(e)
                        console.log('play fail')
                      }
                    })
                    innerAudioContext.src = 'static/voice/fail.mp3';  // 音频资源的地址
                    innerAudioContext.play();
                    wx.showToast({
                      title: '计件失败',
                      icon: 'none',
                      image: '../../static/img/error.png',
                      duration: 1500
                    })
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
                  }else if (res.data.procedureEmpty){
                    const innerAudioContext = wx.createInnerAudioContext()
                    innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                    innerAudioContext.loop =false  // 是否循环播放，默认为 false
                    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                      obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                      success: function(e) {
                        console.log(e)
                        console.log('play success')
                      },
                      fail: function(e) {
                        console.log(e)
                        console.log('play fail')
                      }
                    })
                    innerAudioContext.src = 'static/voice/undispatch.mp3';  // 音频资源的地址
                    innerAudioContext.play();
                    wx.showToast({
                      title: '无派工信息',
                      icon: 'none',
                      image: '../../static/img/error.png',
                      duration: 1500
                    })
                    var producerName = '';
                    obj.setData({
                      isShow: true,
                      producerName: producerName,
                      pieceInfo: res.data.procedureEmpty,
                      records: res.data.pieceWorkEmpList
                    });
                  }else if (res.data.fixed){
                    const innerAudioContext = wx.createInnerAudioContext()
                    innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
                    innerAudioContext.loop =false  // 是否循环播放，默认为 false
                    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
                      obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
                      success: function(e) {
                        console.log(e)
                        console.log('play success')
                      },
                      fail: function(e) {
                        console.log(e)
                        console.log('play fail')
                      }
                    })
                    innerAudioContext.src = 'static/voice/fail.mp3';  // 音频资源的地址
                    innerAudioContext.play();
                    wx.showToast({
                      title: '款号已锁定,无法计件',
                      icon: 'none',
                      image: '../../static/img/error.png',
                      duration: 1500
                    })
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
          }
          
        } else {
          const innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.autoplay = true  // 是否自动开始播放，默认为 false
          innerAudioContext.loop =false  // 是否循环播放，默认为 false
          wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
            obeyMuteSwitch: false,   // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
            success: function(e) {
              console.log(e)
              console.log('play success')
            },
            fail: function(e) {
              console.log(e)
              console.log('play fail')
            }
          })
          innerAudioContext.src = 'static/voice/nocode.mp3';  // 音频资源的地址
          innerAudioContext.play();
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