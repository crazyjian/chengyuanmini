const app = getApp()
Page({
  data: {
    listData: [],
    records:[],
    isCheckAll:false,
    selectRecords:[],
    bindSource: [],
    procedures: [{procedureInfo:'请选择工序', procedureNumber:'-1'}],
    index:0,
    orderName:'',
    versionNumber:'',
    zIndex1:-1,
    zIndex2: -1,
    bindSource: [],
    partNames: [{value: '主身', name: '主身', checked: 'false'},{value: '成品', name: '成品', checked: 'false'}],
    isHide:true
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
  onLoad: function (option) {
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
      partNames: [{value: '主身', name: '主身', checked: 'false'},{value: '成品', name: '成品', checked: 'false'}],
      procedures: [{procedureInfo:'请选择工序', procedureNumber:'-1'}],
      index:0
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
        if (res.statusCode == 200 && res.data) {
          var procedures = [];
          if (res.data.procedureInfoList.length == 0) {
            procedures.push({procedureInfo:'查无工序号', procedureNumber:'-2'});
          }else{
            procedures.push({procedureInfo:'请选择工序', procedureNumber:'-1'});
            for (let i=0; i<res.data.procedureInfoList.length;i++) {
              var info = res.data.procedureInfoList[i];
              var infoValue = info.scanPart + "-" + info.procedureNumber + "-" + info.procedureName;
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
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetotherprintpartnamesbyorder',
      data: {
        orderName: obj.data.orderName,
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var partNames = obj.data.partNames
        if (res.statusCode == 200 && res.data) {
          for (var i=0; i<res.data.printPartNameList.length;i++) {
            var tmpPartName = {};
            tmpPartName.value = res.data.printPartNameList[i];
            tmpPartName.name = res.data.printPartNameList[i];
            tmpPartName.checked = false;
            partNames.push(tmpPartName);
          }
          obj.setData({
            partNames: partNames,
            isHide:false
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "获取部位失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    })
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  // getProcedures:function(e) {
  //   var obj = this;
  //   var orderName = this.data.orderName;
  //   wx.request({
  //     url: app.globalData.backUrl + '/erp/minigetprocedureinfobyorder',
  //     data: {
  //       orderName: orderName,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded' // 默认值
  //     },
  //     success: function (res) {
  //       // console.log(res.data);
  //       if (res.statusCode == 200 && res.data) {
  //         var procedures = [];
  //         if (res.data.procedureInfoList.length == 0) {
  //           procedures.push({procedureInfo:'查无工序号', procedureNumber:'-2'});
  //         }else{
  //           procedures.push({procedureInfo:'请选择工序', procedureNumber:'-1'});
  //           for (let i=0; i<res.data.procedureInfoList.length;i++) {
  //             var info = res.data.procedureInfoList[i];
  //             var infoValue = info.scanPart + "-" + info.procedureNumber + "-" + info.procedureName;
  //             procedures.push({procedureInfo: infoValue, procedureNumber: info.procedureNumber});
  //           }
  //         }
  //         obj.setData({
  //           procedures: procedures,
  //           index:0
  //         })
  //       }
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: "获取工序号失败",
  //         image: '../../static/img/error.png',
  //         duration: 1000,
  //       })
  //     }
  //   })
  // },
  // getPartNames:function(e) {
  //   var obj = this;
  //   var orderName = this.data.orderName;
  //   wx.request({
  //     url: app.globalData.backUrl + '/erp/minigetotherprintpartnamesbyorder',
  //     data: {
  //       orderName: orderName,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded' // 默认值
  //     },
  //     success: function (res) {
  //       var partNames = obj.data.partNames
  //       if (res.statusCode == 200 && res.data) {
  //         for (var i=0; i<res.data.printPartNameList.length;i++) {
  //           var tmpPartName = {};
  //           tmpPartName.value = res.data.printPartNameList[i];
  //           tmpPartName.name = res.data.printPartNameList[i];
  //           tmpPartName.checked = false;
  //           partNames.push(tmpPartName);
  //         }
  //         obj.setData({
  //           partNames: partNames,
  //           isHide:false
  //         })
  //       }
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: "获取工序号失败",
  //         image: '../../static/img/error.png',
  //         duration: 1000,
  //       })
  //     }
  //   })
  // },
  // getOrderName: function (e) {
  //   var obj = this;
  //   var orderName = e.detail.value//用户实时输入值
  //   var newSource = []//匹配的结果
  //   if (orderName != "") {
  //     wx.request({
  //       url: app.globalData.backUrl + '/erp/minigetorderhint',
  //       data: {
  //         subOrderName: orderName
  //       },
  //       method: 'GET',
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded' // 默认值
  //       },
  //       success: function (res) {
  //         if (res.statusCode == 200 && res.data) {
  //           for (var i = 0; i < res.data.orderNameList.length;i++) {
  //             newSource.push(res.data.orderNameList[i].orderName);
  //           }
  //           obj.setData({
  //             bindSource: newSource,
  //             orderName: orderName,
  //             zIndex: 1000
  //           });
  //           obj.getPartNames();
  //           obj.getProcedures();
  //         }
  //       }
  //     })
  //   }else {
  //     obj.setData({
  //       bindSource: newSource,
  //       orderName: orderName
  //     });
  //     obj.getProcedures();
  //     obj.getPartNames();
  //   }
  // },
  // itemtap: function (e) {
  //   this.setData({
  //     orderName: e.target.id,
  //     bindSource: [],
  //     zIndex: -1
  //   })
  //   this.getProcedures();
  //   this.getPartNames();
  // },
  changeProcedurePart:function(e) {
    var obj = this;
    if (this.data.orderName=="") {
      wx.showToast({
        title: '请输入款号',
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
    var orderName =  this.data.orderName;
    var procedureNumber = this.data.procedures[this.data.index].procedureNumber;
    var scanPart = '主身';
    var partNames = this.data.partNames;
    var isSelectPart = false;
    for (var i = 0; i < partNames.length; i++) {
      if (partNames[i].checked === true){
        isSelectPart = true;
        scanPart = partNames[i].value;
      }
    } 
    if (!isSelectPart){
      wx.showToast({
        title: '请选择部位',
        icon: 'none',
        duration: 1000
      });
      return false;
    }
  
    wx.request({
      url: app.globalData.backUrl + '/erp/minichangescanpartofprocedure',
      data: {
        orderName:orderName,
        procedureNumber:procedureNumber,
        scanPart:scanPart
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data);
        if (res.statusCode == 200 && res.data==0) {
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            duration: 1000
          })
          obj.setData({
            orderName:'',
            procedures: ['请选择工序'],
            index: 0,
            o_index: 0,
            isHide:true,
            orderNames: ["请选择款号"],
            orderName:'',
            versionNumber:'',
            partNames: [{value: '主身', name: '主身', checked: 'false'},{value: '成品', name: '成品', checked: 'false'}]
          })
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