//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    overt: false,
    multiArray: [['娱乐', '生活', '职业', '综合'], config.classlay[0].minclass],
    multiIndex: [0, 0],
    testPaperovert: false,
    testPapermultiArray: [['娱乐', '生活', '职业', '综合'], config.classlay[0].minclass],
    testPapermultiIndex: [0, 0],
    _id:''
  },
  onLoad: function (){
    api.getinformation().then((data)=>{
      let defaults = data.data
      this.setData({
        multiIndex: defaults.defaultsubjectclassify[0] === 3 ? [3] : defaults.defaultsubjectclassify,
        overt: defaults.defaultsubjectovet,
        testPapermultiIndex: defaults.defaulttestpaperclassify[0] === 3 ? [3] : defaults.defaulttestpaperclassify,
        testPaperovert: defaults.defaulttestpaperovet,
        _id: defaults._id,
        ['testPapermultiArray[1]']: defaults.defaulttestpaperclassify[0] === 3 ? [] : config.classlay[defaults.defaulttestpaperclassify[0]].minclass,
        ['multiArray[1]']: defaults.defaultsubjectclassify[0] === 3 ? [] : config.classlay[defaults.defaultsubjectclassify[0]].minclass
      })
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = config.classlay[0].minclass;
            break;
          case 1:
            data.multiArray[1] = config.classlay[1].minclass;
            break;
          case 2:
            data.multiArray[1] = config.classlay[2].minclass;;
            break;
          case 3:
            data.multiArray[1] = [];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerColumnChange2: function (e) {
    var data = {
      testPapermultiArray: this.data.testPapermultiArray,
      testPapermultiIndex: this.data.testPapermultiIndex
    };
    data.testPapermultiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.testPapermultiIndex[0]) {
          case 0:
            data.testPapermultiArray[1] = config.classlay[0].minclass;
            break;
          case 1:
            data.testPapermultiArray[1] = config.classlay[1].minclass;
            break;
          case 2:
            data.testPapermultiArray[1] = config.classlay[2].minclass;
            break;
          case 3:
            data.testPapermultiArray[1] = [];
            break;
        }
        data.testPapermultiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  switch1Change: function (e){
    this.setData({
      overt: e.detail.value
    })
  },
  switch1Change2: function (e) {
    this.setData({
      testPaperovert: e.detail.value
    })
  },
  onsubmission: function(){
    wx.showLoading({
      title: '保存中',
    })
    wx.request({
      url: config.server + 'xcx/setinformation.php',
      method: 'GET',
      data: {
        id: this.data._id,
        defaultsubjectovet: this.data.overt,
        defaulttestpaperovet: this.data.testPaperovert,
        defaultsubjectclassify: this.data.multiIndex,
        defaulttestpaperclassify: this.data.testPapermultiIndex,
      },
      success: (data) => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
       setTimeout(()=>{
         wx.navigateBack({
           delta: 1
         })
       },1000)
      }
    })
  }
 
})
