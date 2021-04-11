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
    sizeName: '',
    isHideWin:true,
    noProcedureInfo:false,
    chooseProcedures:[],
    procedures: []
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
            sizeName: res.data.tailor.sizeName,
            qrCode:tailorQcodeID
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
                      records: res.data.pieceWorkEmpList,
                      windowHeight: wx.getSystemInfoSync().windowHeight - 100,
                      isHideWin: false
                    });
                    wx.request({
                      url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorder',
                      data: {
                        orderName: obj.data.orderName,
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      success: function (res) {
                        // console.log(res.data);
                        if (res.statusCode == 200 && res.data) {
                          var procedures = [];
                          for (let i=0; i<res.data.procedureInfoList.length;i++) {
                            var info = res.data.procedureInfoList[i];
                            procedures.push({
                              isSelect: false, // 每条记录默认没有选中
                              value:info.scanPart + "-" + info.procedureNumber + "-" + info.procedureName});
                          }
                          var noProcedureInfo = false;
                          if(procedures.length==0) {
                            noProcedureInfo = true;
                          }
                          obj.setData({
                            procedures: procedures,
                            chooseProcedures:[],
                            noProcedureInfo:noProcedureInfo
                          })
                        }
                      },
                      fail: function (res) {
                        wx.showToast({
                          title: "获取工序号失败",
                          image: '../../static/img/error.png',
                          duration: 1000,
                        })
                      }
                    })
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
  cancel2: function (e) {
    this.setData({
      isHideWin: true,
      procedures: [],
      chooseProcedures:[]
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
  },
  checkProcedure: function (e) {
    var index = e.target.dataset.index;
    var chooseProcedures = this.data.chooseProcedures;
    var selected = !this.data.procedures[index].isSelect;
    if (selected) {
      chooseProcedures.push(this.data.procedures[index].value);
    } else {
      let indexId = 0;
      for (let i = 0; i < this.data.chooseProcedures.length; i++) {
        if (this.data.chooseProcedures[i] == this.data.procedures[index].value) {
          indexId = i;
          break;
        }
      }
      chooseProcedures.splice(indexId, 1);
    }
    this.data.procedures[index].isSelect = selected;
    this.setData({
      chooseProcedures: chooseProcedures,
      procedures: this.data.procedures,
      procedureLabelName: chooseProcedures
    })
  },
  addDispatch:function(e) {
    var obj = this;
    if (this.data.chooseProcedures.length ==0) {
      wx.showToast({
        title: '请选择工序',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var dispatchJson = {};
    dispatchJson.orderName = obj.data.orderName;
    dispatchJson.emp = [{
      "employeeNumber":app.globalData.employee.employeeNumber,
      "employeeName":app.globalData.employee.employeeName,
    }];
    dispatchJson.groupName = app.globalData.employee.groupName
    dispatchJson.procedureInfo = this.data.chooseProcedures;
    wx.request({
      url: app.globalData.backUrl + '/erp/miniadddispatchbatchnew',
      data: {
        dispatchJson: JSON.stringify(dispatchJson)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data==0) {
          wx.showToast({
            title: "提交成功",
            icon: 'success',
            duration: 1000
          })
          obj.setData({
            isShow:false
          })
          wx.request({
            url: app.globalData.backUrl + '/erp/miniaddpieceworkbatchupdate',
            data: {
              'orderName': obj.data.orderName,
              'clothesVersionNumber':obj.data.clothesVersionNumber,
              'groupName':app.globalData.employee.groupName,
              'employeeName':app.globalData.employee.employeeName,
              'employeeNumber':app.globalData.employeeNumber,
              'bedNumber': obj.data.bedNumber,
              'partName': obj.data.partName,
              'packageNumber':obj.data.packageNumber,
              'colorName':obj.data.colorName,
              'sizeName':obj.data.sizeName,
              'layerCount':obj.data.layerCount,
              'tailorQcodeID': obj.data.qrCode
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data) {
                obj.setData({
                  chooseProcedures:[],
                  procedures: [],
                  isHideWin: true
                })
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
                    records: res.data.pieceWorkEmpList,
                    windowHeight: wx.getSystemInfoSync().windowHeight - 100,
                    isHideWin: false
                  });
                  wx.request({
                    url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorder',
                    data: {
                      orderName: obj.data.orderName,
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: function (res) {
                      // console.log(res.data);
                      if (res.statusCode == 200 && res.data) {
                        var procedures = [];
                        for (let i=0; i<res.data.procedureInfoList.length;i++) {
                          var info = res.data.procedureInfoList[i];
                          procedures.push({
                            isSelect: false, // 每条记录默认没有选中
                            value:info.scanPart + "-" + info.procedureNumber + "-" + info.procedureName});
                        }
                        var noProcedureInfo = false;
                          if(procedures.length==0) {
                            noProcedureInfo = true;
                          }
                        obj.setData({
                          procedures: procedures,
                          chooseProcedures:[],
                          noProcedureInfo:noProcedureInfo
                        })
                      }
                    },
                    fail: function (res) {
                      wx.showToast({
                        title: "获取工序号失败",
                        image: '../../static/img/error.png',
                        duration: 1000,
                      })
                    }
                  })
                } else if (res.data.fixed){
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
                duration: 1500,
              })
            }
          });
        }else {
          wx.showToast({
            title: "提交失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
  }
})