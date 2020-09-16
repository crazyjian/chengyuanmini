const util = require('../../utils/util.js')

const app = getApp()
Page({
  data: {
    records:[],
    orderName:'',
    versionNumber:'',
    zIndex:-1,
    bindSource: [],
    c_index:0,
    colorNames: ["全部"],
    s_index: 0,
    sizeNames: ["全部"],
    typeOptions: ["按款号-工序汇总", "按款号-工序-日期汇总", "按款号-工序-日期-颜色-尺码汇总"],
    dateFrom:'',
    dateTo:'',
    clothesVersionNumber:'',
    pieceCountTotal:0,
    salaryTotal:0,
    salaryTotal2:0,
    salaryTotalSum:0,
    orderNames: ["请选择款号"],
    o_index: 0,
    t_index: 1,
    oneHide: true,
    twoHide: true,
    threeHide: true,
    windowHeight: 0,
    isDisabled:false
  },
  onLoad: function (option) {
    var obj = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      dateFrom: Y + '-' + M + '-' + D,
      dateTo: Y + '-' + M + '-' + D
    })
  },
  getClothesVersionNumber:function (e) {
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
      }
    })
  },
  bindOrderChange: function (e) {
    var obj = this;
    obj.setData({
      o_index: e.detail.value
    })
    if (e.detail.value == 0) {
      var colorNames = ["全部"];
      var sizeNames = ["全部"];
      obj.setData({
        colorNames: colorNames,
        sizeNames: sizeNames,
        c_index: 0,
        s_index: 0
      });
    }else{
      wx.request({
        url: app.globalData.backUrl + '/erp/minigetordercolornamesbyorder',
        data: {
          orderName: obj.data.orderNames[obj.data.o_index],
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
          orderName: obj.data.orderNames[obj.data.o_index]
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
      this.setData({
        orderName: obj.data.orderNames[obj.data.o_index],
        zIndex: -1
      })
    }
  },
  search:function() {
    var obj = this;
    obj.setData({  
      isDisabled: true
    })
    wx.request({
      url: app.globalData.backUrl + '/erp/minigetdetailproductionbyinfo',
      data: {
        orderName: obj.data.orderNames[obj.data.o_index],
        employeeNumber: app.globalData.employeeNumber,
        from:obj.data.dateFrom,
        to: obj.data.dateTo,
        colorName: obj.data.colorNames[obj.data.c_index],
        sizeName: obj.data.sizeNames[obj.data.s_index],
        operateType: obj.data.typeOptions[obj.data.t_index]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        obj.setData({  
          isDisabled: false
        })
        if (res.statusCode == 200 && res.data) {
          var pieceCountTotal=0;
          var salaryTotal=0;
          var salaryTotal2=0;
          for (var i = 0; i<res.data.miniDetailQueryList.length;i++) {
            var miniPrice = 0;
            var miniPriceTwo = 0;
            if (res.data.orderProcedureList){
              for (var j = 0; j<res.data.orderProcedureList.length;j++){
                if (res.data.miniDetailQueryList[i].orderName == res.data.orderProcedureList[j].orderName && res.data.miniDetailQueryList[i].procedureNumber == res.data.orderProcedureList[j].procedureNumber){
                  miniPrice = res.data.orderProcedureList[j].piecePrice;
                  if (res.data.orderProcedureList[j].procedureSection == "车缝"){
                    miniPriceTwo = res.data.orderProcedureList[j].piecePriceTwo + (res.data.orderProcedureList[j].piecePrice + res.data.orderProcedureList[j].piecePriceTwo)*res.data.orderProcedureList[j].subsidy;
                  }
                }
              }
            }
            res.data.miniDetailQueryList[i].price = miniPrice;
            res.data.miniDetailQueryList[i].priceTwo = miniPriceTwo;
            res.data.miniDetailQueryList[i].salary = res.data.miniDetailQueryList[i].pieceCount * miniPrice;
            res.data.miniDetailQueryList[i].salaryTwo = res.data.miniDetailQueryList[i].pieceCount * miniPriceTwo;
            pieceCountTotal += res.data.miniDetailQueryList[i].pieceCount;
            salaryTotal += res.data.miniDetailQueryList[i].salary;
            salaryTotal2 += res.data.miniDetailQueryList[i].salaryTwo;
          }
          if (obj.data.t_index == 0){
            obj.setData({
              records: res.data.miniDetailQueryList,
              pieceCountTotal: pieceCountTotal,
              salaryTotal: salaryTotal,
              salaryTotal2: salaryTotal2,
              salaryTotalSum: salaryTotal+salaryTotal2,
              oneHide: false,
              twoHide: true,
              threeHide: true
            });
          } else if (obj.data.t_index == 1){
            obj.setData({
              records: res.data.miniDetailQueryList,
              pieceCountTotal: pieceCountTotal,
              salaryTotal: salaryTotal,
              salaryTotal2: salaryTotal2,
              salaryTotalSum: salaryTotal+salaryTotal2,
              oneHide: true,
              twoHide: false,
              threeHide: true
            });
          } else {
            obj.setData({
              records: res.data.miniDetailQueryList,
              pieceCountTotal: pieceCountTotal,
              salaryTotal: salaryTotal,
              salaryTotal2: salaryTotal2,
              salaryTotalSum: salaryTotal+salaryTotal2,
              oneHide: true,
              twoHide: true,
              threeHide: false
            });
          }
          obj.setData({
            records: res.data.miniDetailQueryList,
            pieceCountTotal: pieceCountTotal,
            salaryTotal: salaryTotal,
            salaryTotal2: salaryTotal2,
            salaryTotalSum: salaryTotal+salaryTotal2,
            isDisabled: false
          });
        }else {
          obj.setData({
            records: [],
            isDisabled: false
          });
        }
      },
      fail:function() {
        obj.setData({  
          isDisabled: false
        })
        wx.showToast({
          title: "服务连接失败",
          image: '../../static/img/error.png',
          duration: 1000,
        })
      }
    });
  },
  bindFromChange: function (e) {
    this.setData({
      dateFrom: e.detail.value
    })
  },
  bindToChange: function (e) {
    this.setData({
      dateTo: e.detail.value
    })
  },
  bindOptionChange: function (e) {
    this.setData({
      t_index: e.detail.value
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
  }

})