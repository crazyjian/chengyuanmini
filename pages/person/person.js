const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    employeeName: '',
    employeeNumber: '',
    role:'',
    hasUserInfo:false,
    factoryName:''
  },
  onLoad: function (option) {
    this.setData({
      employeeName: app.globalData.employee.employeeName,
      employeeNumber: app.globalData.employee.employeeNumber,
      factoryName:app.globalData.factoryName,
      role: app.globalData.employee.position
    })
  },
  loginOut:function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.redirectTo({
            url: "../login/login"
          })
        }
      }
    })
  },
  updatePassWord:function() {
    wx.navigateTo({
      url: "../password/password"
    })
  },
  showEmployeeInfo: function () {
    wx.navigateTo({
      url: "../employee/employee"
    })
  },
  getCheckDetail:function(){
    wx.navigateTo({
      url: "../checkDetail/checkDetail"
    })
  }
})