const app = getApp()
Page({
  data: {
    records:[],
    isCheckAll:false,
    selectRecords:[],
    groupNames:[],
    groupIndex:0,
    orderName:'',
    versionNumber:'',
    zIndex1:-1,
    zIndex2: -1,
    bindSource: []//绑定到页面的数据，根据用户输入动态变化
  },
  onReady: function () {
    //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象  
    this.rightPicker = this.selectComponent('#rightPicker')
  },
  onLoad: function (option) {
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetemployeebygroup',
      data: {
        groupName: app.globalData.employee.groupName,
        employeeNumber: app.globalData.employee.employeeNumber
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          // console.log(res.data.groupEmployeeList)
          let recordsNew = [];
          for (let i=0;i<res.data.groupEmployeeList.length;i++) {
            recordsNew.push({
              isSelect: false, // 每条记录默认没有选中
              employeeName: res.data.groupEmployeeList[i].employeeName,
              employeeNumber: res.data.groupEmployeeList[i].employeeNumber
            });
          }
          obj.setData({
            records: recordsNew
          });
        }
      }
    });

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
  checkAll:function(e) {
    var selected = e.target.dataset.checks?false:true;
    this.setData({
      isCheckAll:selected
    })
    var selectRecords = [];
    if(selected) {
      for (let i = 0; i < this.data.records.length; i++) {
        this.data.records[i].isSelect = true;
        selectRecords.push({
          employeeName: this.data.records[i].employeeName,
          employeeNumber: this.data.records[i].employeeNumber
        })
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
      selectRecords.push({ 
        employeeName: this.data.records[index].employeeName,
        employeeNumber: this.data.records[index].employeeNumber
      });
    }else {
      let indexId = 0;
      for (let i = 0; i < this.data.selectRecords.length; i++) {
        if (this.data.selectRecords[i].employeeNumber == this.data.records[index].employeeNumber) {
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
  groupBindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var obj = this;
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetemployeebygroup',
      data: {
        groupName: obj.data.groupNames[e.detail.value]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data) {
          // console.log(res.data.groupEmployeeList)
          let recordsNew = [];
          for (let i=0;i<res.data.groupEmployeeList.length;i++) {
            recordsNew.push({
              isSelect: false, // 每条记录默认没有选中
              employeeName: res.data.groupEmployeeList[i].employeeName,
              employeeNumber: res.data.groupEmployeeList[i].employeeNumber
            });
          }
          obj.setData({
            records: recordsNew,
            groupIndex: e.detail.value
          });
        }
      }
    });
  },
  // bindPickerChange: function (e) {
  //   // console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },
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
    this.setData({
      versionNumber: e.currentTarget.dataset.version,
      orderName: e.currentTarget.dataset.order,
      zIndex1: -1,
      zIndex2: -1
    });
  },
  initDispatchBtn:function(e) {
    var obj = this;
    if (this.data.orderName=="") {
      wx.showToast({
        title: '请输入订单号',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    }
    if (this.data.selectRecords.length == 0) {
      wx.showToast({
        title: '请选择员工',
        image: '../../static/img/error.png',
        duration: 1000
      });
      return false;
    } 
    var initDispatchJson = {};
    initDispatchJson.orderName = obj.data.orderName;
    initDispatchJson.emp = obj.data.selectRecords;
    wx.request({
      url: app.globalData.backUrl + '/erp/miniinitdispatch',
      data: {
        initDispatchJson: JSON.stringify(initDispatchJson)
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data.result==0) {
          wx.showToast({
            title: "重置成功",
            icon: 'success',
            duration: 1000
          })
          var selectRecords = [];
          for (let i = 0; i < obj.data.records.length; i++) {
            obj.data.records[i].isSelect = false;
          }
          obj.setData({
            isCheckAll: false,
            selectRecords: selectRecords,
            records: obj.data.records
          })
        }else {
          wx.showToast({
            title: "重置失败",
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