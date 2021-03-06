// pages/login/login.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backImg: app.globalData.backImg,
    // placeholder:'请扫描工厂二维码',
    placeholder:'请输入工厂编码',
    isShow:false,
    urlCode:'',
    employeeNumber:'',
    passWord:'',
    isDisabled:false,
    secondFactory:''
  },
  onLoad: function (option) {
    var that = this;
    wx.hideTabBar();
    wx.getStorage({
      key: 'urlCode',
      success(res) {
        that.setData({
          urlCode: res.data
        })
      }
    });
    wx.getStorage({
      key: 'employeeNumber',
      success(res) {
        that.setData({
          employeeNumber: res.data
        })
      }
    });
    wx.getStorage({
      key: 'passWord',
      success(res) {
        that.setData({
          passWord: res.data
        })
      }
    });
    wx.getStorage({
      key: 'secondFactory',
      success(res) {
        that.setData({
          secondFactory: res.data
        })
      }
    });
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: '/pages/login/login',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  formSubmit: function (e) {
    var obj = this;
    var qrCode = e.detail.value.qrCode; // 获取当前表单元素输入框内容
    if (!qrCode) {
      wx.showToast({
        title: '请输入编码',
        image: '../../static/img/error.png',
        duration: 1000
      }) 
      return false;
    } else if (qrCode == '1') {
      app.globalData.backUrl = "https://xiangsheng.jingyiclothing.com";
      app.globalData.factoryName = "中山翔胜制衣";
    } else if (qrCode == '3') {
      app.globalData.backUrl = "https://dy.jingyiclothing.com";
      app.globalData.factoryName = "中山德悦服饰";
    } else if (qrCode == '6') {
      app.globalData.backUrl = "https://swj.jingyiclothing.com";
      app.globalData.factoryName = "中山绅维纪服饰";
    } else {
      app.globalData.backUrl = "http://192.168.2.127:8080";
      app.globalData.factoryName = "";
    }
    var employeeNumber = e.detail.value.employeeNumber; // 获取当前表单元素输入框内容
    if (!employeeNumber) {
      wx.showToast({
        title: '请输入工号',
        image:'../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    var passWord = e.detail.value.passWord; // 获取当前表单元素输入框内容
    if (!passWord) {
      wx.showToast({
        title: '请输入密码',
        image: '../../static/img/error.png',
        duration: 1000
      })
      return false;
    }
    obj.setData({  
      isDisabled: true
    })
    wx.request({
      url: app.globalData.backUrl + "/erp/miniemployeelogin",
      data: {
        employeeNumber: e.detail.value.employeeNumber,
        passWord: e.detail.value.passWord
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        obj.setData({  
          isDisabled: false
        })
        // console.log(res.data);
        if (res.statusCode == 200) {
          //访问正常
          if (!res.data.flag) {
            wx.showToast({
              title: "工号或密码错误",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          } else {
            app.globalData.employee = res.data.employee;
            var secondFactory = res.data.employee.factoryName;
            app.globalData.employeeNumber = employeeNumber;
            app.globalData.secondFactory = secondFactory;
            wx.setStorage({
              key: "urlCode",
              data: qrCode
            });
            wx.setStorage({
              key: "employeeNumber",
              data: employeeNumber
            });
            wx.setStorage({
              key: "secondFactory",
              data: secondFactory
            });
            wx.setStorage({
              key: "passWord",
              data: passWord
            });
            wx.showToast({
              title: "登录成功",
              icon: 'success',
              duration: 500,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({ 
                    url: "../index/index"
                    })
                }, 500)
              }
            })
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
        obj.setData({  
          isDisabled: false
        })
      }
    })
  },
  scanCode:function(e){
    var obj = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        // console.log(res);
        var result = res.result;
        var qrCode = "";
        // if(result == "1") {
        //   app.globalData.backUrl = "https://xiangsheng.jingyiclothing.com";
        //   app.globalData.factoryName = "中山翔胜制衣";
        //   qrCode = "https://xiangsheng.jingyiclothing.com";
        // }
        var arr = result.split(',');
        var factoryName = arr[0].toString();
        var ip = arr[1].toString();
        obj.setData({
          placeholder: '扫描成功！',
          isShow:true,
          qrCode: ip
        });
        app.globalData.backUrl = ip;
        app.globalData.factoryName = factoryName;
      },
      fail(res){
        wx.showToast({
          title: '失败',
          image: '../../static/img/error.png',
          duration: 1000
        })
      }
    })
  }
})