//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    index:0,
    speedofprogress:0,
    fraction:0,
    success:true,
    items: [],
    staet:'',
    datastate:false
  },
  onLoad: function (parameter){
    wx.setNavigationBarTitle({ title: parameter.class })
    api.getsubject(parameter.class).then((data) => {
      let tolicarr = []
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].options.length;j++){
          if (data.data[i].options[j] !==0 ){
            data.data[i].options[j].state = false
            data.data[i].options[j].value = j+1
          }
        }
      }
      if (!data.data.length){
        this.setData({
          datastate: true
        })
      }
      this.setData({
        items: data.data,
        staet: true,
      })
    })
  },
  onback: function () {
    wx.switchTab({
      url: '../classification/classification',
      success: function () {

      }
    })
  },
  radioChange: function (e) {
    let index=this.data.index;
    let items=this.data.items;
    for (let i = 0; i < items[index].options.length; i++){
      if (items[index].options[i].state) {
        items[index].options[i].state = false;
      }
    }
    for (let i = 0; i < items[index].options.length; i++) {
      if (items[index].options[i].value === Number.parseInt(e.detail.value)) {
        items[index].options[i].state = true;
      }
    }
    setTimeout(()=>{
      if (index+1 >= this.data.items.length){
        this.setData({
          success:false
        });
        this.setData({
          speedofprogress: (index + 1) / this.data.items.length * 100
        });
      }
      else{
        this.setData({
          items: items,
          index: index + 1,
          speedofprogress: (index + 1) / this.data.items.length * 100
        });
      }
    }, 200)
  },
  onradioclick: function(e){
    let selest = this.data.items[this.data.index].options
    for (let i = 0; i < selest.length;i++){
      if (selest[i].state){
        this.setData({
          index: this.data.index + 1,
        });
        return
      }
    }
    wx.showModal({
      title: '',
      showCancel: false,
      content: '请选择一个选项',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  onbutclick: function(){
    if (this.data.index>0){
      this.setData({
        index: this.data.index - 1
      });
    }
  },
  onsuccess: function(){
    let that = this;
    let items = this.data.items
    wx.setStorage({
      key: 'items',
      data: items
    })
    wx.redirectTo({
      url:'../gendertestseccuss/gendertestseccuss',
      success: function(){

      }
    })
  }
})
