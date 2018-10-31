//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')

Page({
  data: {
    items:'',
  },
  onLoad: function (data){
    this.setData({
      items: JSON.parse(data.data.replace(/08862ca061997a4d/img, '=').replace(/54f19ac2aa52aac5/img, '&').replace(/c3fb323a2671125a/img, '?'))
    })
  },
  onback: function (e) {
    wx.navigateBack({
      delta: 1,
      success: function () {

      }
    })
  },
})  