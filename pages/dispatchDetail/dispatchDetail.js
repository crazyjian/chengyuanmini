const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    versionNumber:'',
    zIndex1:-1,
    zIndex2: -1,
    groupName:'',
    e_index: 0,
    employeeNames: ["全部"],
    isShow:true,
    groupNames:[],
    groupIndex:0,
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
    
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetallgroupnamelist',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          let groupNew = [];
          let tmpIndex = 0;
          for (let i=0;i<res.data.groupList.length;i++) {
            groupNew.push(res.data.groupList[i]);
            if (res.data.groupList[i] == app.globalData.employee.groupName){
              tmpIndex = i;
            }
          }
          obj.setData({
            groupNames: groupNew,
            groupIndex: tmpIndex
          });
        }
      }
    });
  },

  groupBindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var obj = this;
    obj.setData({
      groupIndex: e.detail.value
    });
  },

  getClothesVersionNumber: function (e) {
    this.setData({
      zIndex2: -1
    })
    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysubversion',
        data: {
          subVersion: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            obj.setData({
              bindSource: res.data.data,
              // versionNumber: versionNumber,
              zIndex1:1000
            });
          }
        }
      })
    }else {
      obj.setData({
        bindSource: newSource,
        versionNumber: versionNumber
      });
    }
  },
  getOrderName: function (e) {
    this.setData({
      zIndex1: -1
    })
    var obj = this;
    var orderName = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (orderName != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetorderandversionbysuborder',
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
            obj.setData({
              bindSource: res.data.data,
              // orderName: orderName,
              zIndex2: 1000
            });
          }
        }
      })
    } else {
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
          orderName: e.currentTarget.dataset.order,
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
          orderName: e.currentTarget.dataset.order,
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
      versionNumber: e.currentTarget.dataset.version,
      orderName: e.currentTarget.dataset.order,
      zIndex1: -1,
      zIndex2: -1
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
          employeeName: "全部",
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
          groupName: obj.data.groupNames[obj.data.groupIndex],
          employeeName: "全部"
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