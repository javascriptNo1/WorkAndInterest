//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    items:'',
    tolicarr:[]
  },
  onLoad: function (data){
    let datas = JSON.parse(data.data.replace(/08862ca061997a4d/img, '=').replace(/54f19ac2aa52aac5/img, '&').replace(/c3fb323a2671125a/img, '?'))
    this.setData({
      items: datas
    })
    api.getpaperInTopic(datas.options).then((data) => {
      this.setData({
        tolicarr: data.data
      })
    })
  },
  onsee: function (e) {
    let data = JSON.stringify(this.data.tolicarr[e.target.id]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a');
    wx.navigateTo({
      url: '../subjectDetails/subjectDetails?data=' + data,
      success: function () {

      }
    })
  },
  onback: function (e) {
    wx.navigateBack({
      delta: 1,
      success: function () {

      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '我自己出了一套选择题，快来做做看吧！',
      path: '/pages/gendertestpaper/gendertestpaper?paperid=' + this.data.items._id + '&data=' + JSON.stringify(this.data.items).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a')
    }
  }
})  