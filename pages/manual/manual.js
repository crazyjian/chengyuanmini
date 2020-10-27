const app = getApp()
Page({
  data: {
    listData: [],
    records:[],
    isCheckAll:false,
    selectRecords:[],
    bindSource: [],
    procedures: [{procedureInfo:'请选择工序', procedureNumber:'-1'}],
    employeeList:['请选择员工'],
    eIndex:0,
    index:0,
    orderName:'',
    inputHidden:false,
    versionNumber:'',
    zIndex1:-1,
    zIndex2: -1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"],
    layerCount:''
  },
  onLoad: function (option) {
    var obj = this;
    var employeeList = ['选择员工'];
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetemployeebygroup',
      data: {
        groupName: app.globalData.employee.groupName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res){
        if (res.statusCode == 200 && res.data){
          for (var i= 0; i < res.data.groupEmployeeList.length; i++){
            employeeList.push(res.data.groupEmployeeList[i].employeeNumber + "@" + res.data.groupEmployeeList[i].employeeName);
          }
          obj.setData({
            employeeList: employeeList,
            eIndex:0
          })
        }
      }
    })
  },
  radioChange(e) {
    var obj = this;
    const partNames = obj.data.partNames
    for (let i = 0, len = partNames.length; i < len; ++i) {
      partNames[i].checked = partNames[i].value === e.detail.value
    }
    this.setData({
      partNames
    })
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
    this.setData({
      versionNumber: e.currentTarget.dataset.version,
      orderName: e.currentTarget.dataset.order,
      zIndex1: -1,
      zIndex2: -1,
      procedures: [{procedureInfo:'请选择工序', procedureNumber:'-1'}],
      index:0,
      c_index:0,
      colorNames: ["全部"],
      s_index: 0,
      sizeNames: ["全部"]
    });
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetordercolornamesbyorder',
      data: {
        orderName: obj.data.orderName,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var colorNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i<res.data.colorNameList.length;i++) {
            colorNames.push(res.data.colorNameList[i]);
          }
        }
        obj.setData({
          colorNames: colorNames,
          c_index:0
        });
      }
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetordersizenamesbyorder',
      data: {
        orderName: obj.data.orderName
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var sizeNames = ["全部"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.sizeNameList.length; i++) {
            sizeNames.push(res.data.sizeNameList[i]);
          }
        }
        obj.setData({
          sizeNames: sizeNames,
          s_index: 0
        });
      }
    })
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
        if (res.statusCode == 200 && res.data) {
          var procedures = [];
          if (res.data.procedureInfoList.length == 0) {
            procedures.push({procedureInfo:'查无工序号', procedureNumber:'-2'});
          }else{
            procedures.push({procedureInfo:'请选择工序', procedureNumber:'-1'});
            for (let i=0; i<res.data.procedureInfoList.length;i++) {
              var info = res.data.procedureInfoList[i];
              var infoValue = info.scanPart + "@" + info.procedureNumber + "@" + info.procedureName;
              procedures.push({procedureInfo: infoValue, procedureNumber: info.procedureNumber});
            }
          }
          obj.setData({
            procedures: procedures,
            orderName: obj.data.orderName,
            index:0
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取工序失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  },
  setLayerCount:function(e) {
    this.setData({
      layerCount: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  change: function (e) {
    var obj = this;
    obj.setData({
      inputHidden: !this.data.inputHidden
    })
  },
  bindColorChange: function (e) {
    this.setData({
      c_index: e.detail.value
    })
  },
  bindSizeChange: function (e) {
    this.setData({
      s_index: e.detail.value
    })
  },
  employeePickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      eIndex: e.detail.value
    })
  },
  commitData:function(e) {
    var obj = this;
    if (this.data.orderName=="") {
      wx.showToast({
        title: '请输入款号',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    if (this.data.eIndex == 0) {
      wx.showToast({
        title: '请选择员工',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    if (this.data.index <= 0) {
      wx.showToast({
        title: '请选择工序',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    if (this.data.inputHidden == false && this.data.layerCount.replace(/(^\s*)|(\s*$)/g, "") == '') {
      wx.showToast({
        title: '请输入数量',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
    var orderName =  this.data.orderName;
    var versionNumber =  this.data.versionNumber;
    var procedureNumber = this.data.procedures[this.data.index].procedureNumber;
    var procedureName = this.data.procedures[this.data.index].procedureInfo.split("@")[2];
    var scanPart = this.data.procedures[this.data.index].procedureInfo.split("@")[0];
    var employeeNumber = this.data.employeeList[this.data.eIndex].split("@")[0];
    var employeeName = this.data.employeeList[this.data.eIndex].split("@")[1];
    var userName = app.globalData.employee.employeeName;
    var layerCount = obj.data.layerCount.replace(/(^\s*)|(\s*$)/g, "");
    if (this.data.inputHidden == false){
      if (this.data.c_index == 0) {
        wx.showToast({
          title: '请选择颜色',
          icon: 'none',
          duration: 1000
        });
        return false;
      }
      if (this.data.s_index == 0) {
        wx.showToast({
          title: '请选择尺码',
          icon: 'none',
          duration: 1000
        });
        return false;
      }
      wx.request({
        url: app.globalData.backUrl + '/erp/miniaddpieceworktotal',
        data: {
          orderName:orderName,
          clothesVersionNumber:versionNumber,
          procedureNumber:procedureNumber,
          scanPart:scanPart,
          employeeNumber:employeeNumber,
          employeeName:employeeName,
          procedureName:procedureName,
          colorName: obj.data.colorNames[obj.data.c_index],
          sizeName: obj.data.sizeNames[obj.data.s_index],
          layerCount: obj.data.layerCount.replace(/(^\s*)|(\s*$)/g, ""),
          groupName:app.globalData.employee.groupName,
          userName:userName
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data==0) {
            var msg = "计件成功,工序:" + procedureName + "  件数:" + layerCount;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 3000
            })
            obj.setData({
              orderName:'',
              procedures: ['请选择工序'],
              index: 0,
              o_index: 0,
              orderNames: ["请选择款号"],
              eIndex:0,
              orderName:'',
              versionNumber:'',
              c_index:0,
              colorNames: ["全部"],
              s_index: 0,
              sizeNames: ["全部"],
              layerCount:''
            })
          }else if (res.statusCode == 200 && res.data==1) {
            wx.showToast({
              title: "计件失败",
              icon: "none",
              duration: 1000,
            })
          } else if (res.statusCode == 200 && res.data==2) {
            wx.showToast({
              title: "未开裁,无法计件",
              icon: "none",
              duration: 1000,
            })
          } else if (res.statusCode == 200 && res.data==3) {
            wx.showToast({
              title: "本次入数导致爆数,请核对",
              icon: "none",
              duration: 1000,
            })
          } else if (res.statusCode == 200 && res.data==5) {
            wx.showToast({
              title: "本次入数导致爆数,请核对",
              icon: "none",
              duration: 1000,
            })
          } else if (res.statusCode == 200 && res.data==7) {
            wx.showToast({
              title: "本次入数导致爆数,请核对",
              icon: "none",
              duration: 1000,
            })
          } else {
            wx.showToast({
              title: "计件失败",
              icon: "none",
              duration: 1000,
            })
          }
        },fail: function (res) {
          wx.showToast({
            title: "服务连接失败",
            image: '../../static/img/error.png',
            duration: 1000,
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.backUrl + '/erp/miniaddpieceworkonce',
        data: {
          orderName:orderName,
          procedureNumber:procedureNumber,
          scanPart:scanPart,
          employeeNumber:employeeNumber,
          employeeName:employeeName,
          procedureName:procedureName,
          colorName: obj.data.colorNames[obj.data.c_index],
          sizeName: obj.data.sizeNames[obj.data.s_index],
          groupName:app.globalData.employee.groupName
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data.data==0) {
            var msg = "计件成功,工序:" + procedureName + "  件数:" + res.data.pieceCount;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 3000
            })
            obj.setData({
              orderName:'',
              procedures: ['请选择工序'],
              index: 0,
              o_index: 0,
              orderNames: ["请选择款号"],
              eIndex:0,
              orderName:'',
              versionNumber:'',
              c_index:0,
              colorNames: ["全部"],
              s_index: 0,
              sizeNames: ["全部"]
            })
          }else if (res.statusCode == 200 && res.data.data==1) {
            wx.showToast({
              title: "该工序已有计件记录,无法批量计件",
              icon: "none",
              duration: 1000,
            })
          } else if (res.statusCode == 200 && res.data.data==2) {
            wx.showToast({
              title: "未开裁,无法计件",
              icon: "none",
              duration: 1000,
            })
          } else {
            wx.showToast({
              title: "计件失败",
              icon: "none",
              duration: 1000,
            })
          }
        },fail: function (res) {
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