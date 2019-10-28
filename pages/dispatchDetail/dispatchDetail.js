const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    zIndex:-1,
    groupName:'',
    e_index: 0,
    employeeNames: ["全部"],
    isShow:true,
    bindSource: []
  },
  onLoad: function (option) {
    var obj = this;
    if (app.globalData.employee.role == 'root') {
      obj.setData({
        isShow: false
      })
    }else {
      obj.setData({
        isShow: true,
        groupName: app.globalData.employee.groupName
      })
    }
  },
  getOrderName: function (e) {

    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderhint',
        data: {
          subOrderName: orderName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.orderNameList.length;i++) {
              newSource.push(res.data.orderNameList[i].orderName);
            }
            obj.setData({
              bindSource: newSource,
              orderName: orderName,
              zIndex:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        orderName: orderName
      });
    }
  },
  itemtap: function (e) {
    var obj = this;
    if (app.globalData.employee.role == 'root'){
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchemployeenames',
        data: {
          orderName: e.target.id,
          groupName: "全部"
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var employeeNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.employeeNameList.length; i++) {
              employeeNames.push(res.data.employeeNameList[i]);
            }
          }
          obj.setData({
            employeeNames: employeeNames,
            e_index: 0
          });
        }
      })
    }else{
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchemployeenames',
        data: {
          orderName: e.target.id,
          groupName: app.globalData.employee.groupName
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          var employeeNames = ["全部"];
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.employeeNameList.length; i++) {
              employeeNames.push(res.data.employeeNameList[i]);
            }
          }
          obj.setData({
            employeeNames: employeeNames,
            e_index: 0
          });
        }
      })
    }
    this.setData({
      orderName: e.target.id,
      zIndex: -1
    })
  },
  search:function() {
    var obj = this;
    if (app.globalData.employee.role == 'root') {
      obj.setData({
        isShow: false
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchbyordergroupemp',
        data: {
          orderName: obj.data.orderName,
          groupName: "全部",
          employeeName: obj.data.employeeNames[obj.data.e_index],
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data && res.data.dispatchList) {
            let recordsNew = [];
            for (let i = 0; i < res.data.dispatchList.length; i++) {
              recordsNew.push({
                employee: res.data.dispatchList[i].employeeNumber + '-' + res.data.dispatchList[i].employeeName,
                procedureName: res.data.dispatchList[i].procedureName,
                dispatchID: res.data.dispatchList[i].dispatchID
              });
            }
            obj.setData({
              records: recordsNew
            });
          }
        },
        fail:function() {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      });
    } else{
      obj.setData({
        isShow: true
      })
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchbyordergroupemp',
        data: {
          orderName: obj.data.orderName,
          groupName:obj.data.groupName,
          employeeName: obj.data.employeeNames[obj.data.e_index]
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data) {
            let recordsNew = [];
            for (let i = 0; i < res.data.dispatchList.length; i++) {
              recordsNew.push({
                employee: res.data.dispatchList[i].employeeNumber + '-' + res.data.dispatchList[i].employeeName,
                procedureName: res.data.dispatchList[i].procedureName,
                dispatchID: res.data.dispatchList[i].dispatchID
              });
            }
            obj.setData({
              records: recordsNew
            });
          }
        },
        fail: function () {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      });
    }
  },
  getGroupName:function(e) {
    var groupName = e.detail.value;
    this.setData({
      groupName: groupName
    })
  },
  bindEmpChange: function (e) {
    this.setData({
      e_index: e.detail.value
    })
  },
  delDisPatch: function (e) {
    var obj = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var dispatchID = e.target.dataset.value;
          wx.request({
            url: app.globalData.backUrl + '/erp/minideletedispatch',
            data: {
              dispatchID: dispatchID
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log(res.data);
              if (res.statusCode == 200 && res.data == 0) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    obj.search();
                  }
                })
              } else {
                wx.showToast({
                  title: "删除失败",
                  image: '../../static/img/error.png',
                  duration: 1000,
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: "删除失败",
                image: '../../static/img/error.png',
                duration: 1000,
              })
            }
          });
        }
      }
    })
  }

})