//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isHide:true,
    location:""
  },
  //事件处理函数

  onLoad: function (option) {
  },
  mainTailorCreate: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../mainTailorCreate/mainTailorCreate"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
    
  },
  mainTailorSearch: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../mainTailorSearch/mainTailorSearch"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  otherTailorCreate: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../otherTailorCreate/otherTailorCreate"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  otherFixedCreate: function () {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../otherFixedCreate/otherFixedCreate"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  otherTailorSearch:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../otherTailorSearch/otherTailorSearch"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  fabricInShelf:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../fabricInShelf/fabricInShelf"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  fabricOutShelf:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../fabricOutShelf/fabricOutShelf"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  fabricReturnShelf:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../fabricReturnShelf/fabricReturnShelf"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  fabricSearch:function() {
    if (app.globalData.employee.role == 'root' || app.globalData.employee.role == 'role8') {
      wx.navigateTo({
        url: "../fabricSearch/fabricSearch"
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  scanOutShelf:function(){
    var obj = this;
    if (app.globalData.employee.role == 'role6') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          wx.redirectTo({
            url: "../fabricOutShelf/fabricOutShelf?qCodeID=" + res.result
          })
        }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  },
  scanReturnShelf:function(){
    var obj = this;
    if (app.globalData.employee.role == 'role5') {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          wx.redirectTo({
            url: "../fabricReturnShelf/fabricReturnShelf?qCodeID=" + res.result
          })
        }
      })
    } else {
      wx.showToast({
        title: '对不起，您没有该操作权限',
        icon: 'none',
        duration: 1000
      })
    }
  }
})
