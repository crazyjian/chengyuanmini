//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    backImg: app.globalData.backImg,
    isHide:true,
    qrCode:''
  },
  //事件处理函数
  onShow: function () {
    this.setData({
      factoryName:app.globalData.factoryName
    })
  },
  onLoad: function (option) {
    this.setData({
      factoryName:app.globalData.factoryName
    })
    wx.showTabBar();
  },
  scanCode: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role3') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          if("中山翔胜制衣" === app.globalData.factoryName) {
            wx.redirectTo({
              url: "../scanPieceOld/scanPieceOld?qrCode=" + res.result
            })
          }else {
            wx.redirectTo({
              url: "../scanPiece/scanPiece?qrCode=" + res.result
            })
          }
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  dispatch: function (e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2'|| app.globalData.employee.role == 'role6') {
      wx.navigateTo({
        url: "../dispatch/dispatch"
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  initDispatch: function (e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2'|| app.globalData.employee.role == 'role6') {
      wx.navigateTo({
        url: "../initDispatch/initDispatch"
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  scanDelete: function (e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role2'|| app.globalData.employee.role == 'role6') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.navigateTo({
            url: "../scanDelete/scanDelete?qrCode=" + res.result
          })
        }
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  inspection: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role3') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.redirectTo({
            url: "../inspection/inspection?qrCode=" + res.result
          })
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  sampleinspection: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role4') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          // console.log(res);
          wx.redirectTo({
            url: "../sampleinspection/sampleinspection?qrCode=" + res.result
          })
        },
        // fail(res) {
        //   wx.showToast({
        //     title: '失败',
        //     image: '../../static/img/error.png',
        //     duration: 1000
        //   })
        // }
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  hand:function(e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role3') {
      this.setData({
        isHide:false
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  multiTask:function(e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role1' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role3') {
      wx.navigateTo({
        url: "../multiTask/multiTask"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  cancel:function(e) {
    this.setData({
      isHide: true,
      qrCode:''
    })
  },
  setQrCodeValue:function(e) {
    this.setData({
      qrCode: e.detail.value
    })
  },
  confirm:function(e) {
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
    if("中山翔胜制衣" === app.globalData.factoryName) {
      wx.redirectTo({
        url: "../handOld/handOld?qrCode=" + qrCode
      })
    }else {
      wx.redirectTo({
        url: "../hand/hand?qrCode=" + qrCode
      })
    }
  },
  part: function (e) {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role7') {
      wx.navigateTo({
        url: "../part/part"
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  manual: function(e){
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role6' || app.globalData.employee.role == 'role2' || app.globalData.employee.role == 'role7') {
      wx.navigateTo({
        url: "../manual/manual"
      })
    }else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  }
})
