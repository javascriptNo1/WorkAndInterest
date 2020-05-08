//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    overt: false,
    multiArray: [['娱乐', '生活', '职业', '综合'], ['']],
    multiIndex: [0, 0],
    testPaperovert: false,
    testPapermultiArray: [['娱乐', '生活', '职业', '综合'], config.setclasslay[0].minclass],
    testPapermultiIndex: [0, 0],
    _id:'',
    state: false,
  },
  onLoad: function (){
    let maxclass = JSON.parse(JSON.stringify(config.setmaxclass))
    this.setData({
      ['multiArray[0]']: maxclass,
      ['testPapermultiArray[0]']: maxclass
    })
    api.getinformation().then((data)=>{
      let defaults = data.data
      this.setData({
        multiIndex: defaults.defaultsubjectclassify,
        overt: defaults.defaultsubjectovet,
        testPapermultiIndex:defaults.defaulttestpaperclassify,
        testPaperovert: defaults.defaulttestpaperovet,
        _id: defaults._id,
        ['testPapermultiArray[1]']: config.setclasslay[defaults.defaulttestpaperclassify[0]].minclass,
        ['multiArray[1]']:config.setclasslay[defaults.defaultsubjectclassify[0]].minclass,
        state:true
      })
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column === 0) {
      data.multiIndex[1] = 0;
    }
    for (let i = 0; i < config.setmaxclass.length; i++) {
      if (data.multiIndex[0] === i) {
        data.multiArray[1] = config.setclasslay[i].minclass;
      }
    }
    this.setData(data);
  },
  bindMultiPickerColumnChange2: function (e) {
    var data = {
      testPapermultiArray: this.data.testPapermultiArray,
      testPapermultiIndex: this.data.testPapermultiIndex
    };
    data.testPapermultiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column === 0) {
      data.testPapermultiIndex[1] = 0;
    }
    for (let i = 0; i < config.setmaxclass.length; i++) {
      if (data.testPapermultiIndex[0] === i) {
        data.testPapermultiArray[1] = config.setclasslay[i].minclass;
      }
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
      },
      fail:function(){
        wx.showToast({
          title: '保存失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
 
})
