const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    orderName:'',
    versionNumber:'',
    orderNames: ["请选择款号"],
    o_index: 0,
    bedNumber:'',
    packageNumber:'',
    colorName:'',
    layerCount:'',
    isShow:false,
    producerName:'',
    procedures:["请选择工序"],
    p_index: 0,
    pieceInfo:'计件成功',
    pieceWorkJson:'',
    sizeName:'',
    records:[]
  },
  onLoad: function (option) {
    var obj = this;
    wx.getStorage({
      key: 'versionNumber',
      success(res) {
        obj.setData({
          versionNumber: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'orderNames',
      success(res) {
        obj.setData({
          orderNames: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'o_index',
      success(res) {
        obj.setData({
          o_index: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'procedures',
      success(res) {
        obj.setData({
          procedures: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'p_index',
      success(res) {
        obj.setData({
          p_index: res.data,
        })
      }
    });
    
  },
  getClothesVersionNumber: function (e) {
    var obj = this;
    var versionNumber = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (versionNumber != "") {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetversionhint',
        data: {
          versionNumber: versionNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          // console.log(res.data);
          if (res.statusCode == 200 && res.data) {
            for (var i = 0; i < res.data.versionList.length;i++) {
              newSource.push(res.data.versionList[i]);
            }
            obj.setData({
              bindSource: newSource,
              versionNumber: versionNumber,
              zIndex:1000
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

  itemtap: function (e) {
    var obj = this;
    this.setData({
      versionNumber: e.target.id,
      zIndex: -1
    })
    wx.setStorage({
      key: "versionNumber",
      data: e.target.id
    });
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetorderbyversion',
      data: {
        clothesVersionNumber: e.target.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var orderNames = ["请选择款号"];
        if (res.statusCode == 200 && res.data) {
          for (var i = 0; i < res.data.orderList.length; i++) {
            orderNames.push(res.data.orderList[i]);
          }
        }
        obj.setData({
          orderNames: orderNames,
          o_index: 0
        });
        wx.setStorage({
          key: "orderNames",
          data: orderNames
        });
        wx.setStorage({
          key: "o_index",
          data: 0
        });
      }
    })
  },

  bindOrderChange: function (e) {
    var obj = this;
    obj.setData({
      o_index: e.detail.value
    })
    wx.setStorage({
      key: "o_index",
      data: e.detail.value
    });
    if (e.detail.value == 0) {
      var procedures = ["请选择工序"];
      obj.setData({
        procedures: procedures,
        p_index: 0
      });
    } else {
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetdispatchbyorderemployeenumber',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index],
          employeeNumber: app.globalData.employee.employeeNumber
        },
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data) {
            console.log(res.data.dispatchList);
            var procedures = [];
            if (res.data.dispatchList.length == 0) {
              procedures.push('查无工序号');
            }else
              procedures.push('请选择您的工序号');
            for (let i=0; i<res.data.dispatchList.length;i++) {
              var info = res.data.dispatchList[i];
              procedures.push(info.procedureNumber + "-" + info.procedureName);
            }
            obj.setData({
              procedures: procedures,
              p_index:0
            });
            wx.setStorage({
              key: "procedures",
              data: procedures
            });
            wx.setStorage({
              key: "p_index",
              data: 0
            });
          }
        }
      })
    }
  },
  bindProcedureChange:function(e){
    this.setData({
      p_index: e.detail.value
    })
    wx.setStorage({
      key: "p_index",
      data: e.detail.value
    });
  },
  scanCode:function(){
    var obj = this;
    if(obj.data.o_index == 0 || obj.data.p_index == 0) {
      wx.showToast({
        title: '款号和工序不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var tailorQcodeID = res.result;
        wx.request({
          url: app.globalData.backUrl + '/erp/minigetonetailorbytailorqcodeid',
          data: {
            tailorQcodeID: tailorQcodeID
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            // console.log(res.data);
            if (res.statusCode == 200 && res.data.tailor) {
              var orderName = res.data.tailor.orderName;
              var clothesVersionNumber = res.data.tailor.clothesVersionNumber;
              var bedNumber = res.data.tailor.bedNumber;
              var packageNumber = res.data.tailor.packageNumber;
              var partName = res.data.tailor.partName;
              var colorName = res.data.tailor.colorName;
              var sizeName = res.data.tailor.sizeName;
              var layerCount = res.data.tailor.layerCount;
              var employeeNumber = app.globalData.employeeNumber;
              var employeeName = app.globalData.employee.employeeName;
              var groupName = app.globalData.employee.groupName;
              if (orderName != obj.data.orderNames[obj.data.o_index]){
                wx.showToast({
                  title: '选择款号和扫描款号不对应',
                  icon: 'none',
                  duration: 1000
                })
                return false;
              }
              obj.setData({
                bedNumber: res.data.tailor.bedNumber,
                packageNumber: res.data.tailor.packageNumber,
                partName: res.data.tailor.partName,
                colorName: res.data.tailor.colorName,
                layerCount: res.data.tailor.layerCount,
                sizeName: res.data.tailor.sizeName
              });
              wx.request({
                url: app.globalData.backUrl + '/erp/miniaddpieceworkmultitask',
                data: {
                  'orderName': orderName,
                  'clothesVersionNumber':clothesVersionNumber,
                  'groupName':groupName,
                  'employeeName':employeeName,
                  'employeeNumber':employeeNumber,
                  'bedNumber': bedNumber,
                  'partName': partName,
                  'packageNumber':packageNumber,
                  'colorName':colorName,
                  'sizeName':sizeName,
                  'layerCount':layerCount,
                  'packageNumber': obj.data.packageNumber,
                  'tailorQcodeID': tailorQcodeID,
                  'procedureInfo':obj.data.procedures[obj.data.p_index]
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (res) {
                  // console.log(res.data);
                  if (res.statusCode == 200 && res.data) {
                    if (res.data.success){
                      wx.showToast({
                        title: '计件成功',
                        icon: 'none',
                        duration: 1000
                      });
                      obj.setData({
                        records: res.data.pieceWorkEmpList
                      });
                    } else if (res.data.fail) {
                      wx.showToast({
                        title: '计件失败',
                        icon: 'none',
                        duration: 1000
                      });
                      obj.setData({
                        records: res.data.pieceWorkEmpList
                      });
                    } else if (res.data.error){
                      wx.showToast({
                        title: res.data.error,
                        icon: 'none',
                        duration: 1000
                      });
                      obj.setData({
                        records: res.data.pieceWorkEmpList
                      });
                    }
                    
                  }
                },
                fail: function (res) {
                  wx.showToast({
                    title: "提交失败",
                    image: '../../static/img/error.png',
                    duration: 1000,
                  })
                }
              });
            } else {
              wx.showToast({
                title: "二维码信息不存在",
                icon: 'none',
                duration: 1000,
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: "服务器发生异常",
              image: '../../static/img/error.png',
              duration: 1000,
            })
          }
        })
      }
    })
  }
})