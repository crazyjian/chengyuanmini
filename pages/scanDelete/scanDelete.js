const util = require('../../utils/formatTime.js')
const app = getApp()
Page({
  data: {
    info:'暂无历史计件信息',
    orderName:'',
    bedNumber:'',
    packageNumber:'',
    selectRecords:[],
    records: [],
    tailorQcodeID:'',
    isCheckAll:false
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
          obj.setData({
            orderName: res.data.tailor.orderName,
            bedNumber: res.data.tailor.bedNumber,
            packageNumber: res.data.tailor.packageNumber,
            tailorQcodeID: option.qrCode
          });
          wx.request({
            url: app.globalData.backUrl + '/erp/minigetpieceworkbyordernamebednumberpackage',
            data: {
              orderName: obj.data.orderName,
              bedNumber: obj.data.bedNumber,
              packageNumber: obj.data.packageNumber
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data) {
                if(res.data.pieceWorkList.length>0) {
                  for (var i = 0; i< res.data.pieceWorkList.length; i++){
                    res.data.pieceWorkList[i].updateTime = util.tsFormatTime(res.data.pieceWorkList[i].updateTime, 'Y/M/D h:m:s')
                  }
                  obj.setData({
                    records:res.data.pieceWorkList,
                    info:'历史计件信息'
                  })
                }
                
              }
            }
          })
          
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
          title: '扫件失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  },
  checkAll:function(e) {
    var selected = e.target.dataset.checks?false:true;
    this.setData({
      isCheckAll:selected
    })
    var selectRecords = [];
    if(selected) {
      for (let i = 0; i < this.data.records.length; i++) {
        this.data.records[i].isSelect = true;
        selectRecords.push(this.data.records[i].pieceWorkID);
      }
    }else {
      for (let i = 0; i < this.data.records.length; i++) {
        this.data.records[i].isSelect = false;
      }
    }
    this.setData({
      selectRecords: selectRecords,
      records:this.data.records
    })
  },
  check:function(e) {
    var index = e.target.dataset.index;
    var selectRecords = this.data.selectRecords;
    var selected = !this.data.records[index].isSelect;
    if(selected) {
      selectRecords.push(
        this.data.records[index].pieceWorkID
      );
    }else {
      let indexId = 0;
      for (let i = 0; i < this.data.selectRecords.length; i++) {
        if (this.data.selectRecords[i] == this.data.records[index]) {
          indexId = i;
          break;
        }
      }
      selectRecords.splice(indexId, 1);
    }
    this.data.records[index].isSelect = selected;
    this.setData({
      selectRecords: selectRecords,
      records: this.data.records
    })
  },
  batchDel:function(e) {
    var obj = this;
    console.log(this.data.records);
    if (this.data.selectRecords.length == 0) {
      wx.showToast({
        title: '请选择计件信息',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    } 
    wx.showModal({
      title: '提示',
      content: '确定要删除计件信息吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.backUrl + '/erp/minideletepieceworkbatch',
            data: {
              pieceWorkIDList: obj.data.selectRecords
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data.result==0) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1000
                })
                obj.setData({
                  isCheckAll: false,
                  selectRecords: [],
                  records:[]
                })
                wx.request({
                  url: app.globalData.backUrl + '/erp/minigetpieceworkbyordernamebednumberpackage',
                  data: {
                    orderName: obj.data.orderName,
                    bedNumber: obj.data.bedNumber,
                    packageNumber: obj.data.packageNumber
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (res) {
                    // console.log(res.data);
                    if (res.statusCode == 200 && res.data) {
                      if(res.data.pieceWorkList.length>0) {
                        for (var i = 0; i< res.data.pieceWorkList.length; i++){
                          res.data.pieceWorkList[i].updateTime = util.tsFormatTime(res.data.pieceWorkList[i].updateTime, 'Y/M/D h:m:s')
                        }
                        obj.setData({
                          records:res.data.pieceWorkList,
                          info:'历史计件信息'
                        })
                      }
                      
                    }
                  }
                })
              }else {
                wx.showToast({
                  title: "删除失败",
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
      }
      })
  }
})