//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
  
  },
  onLoad: function (){
    
  },
  onsubmission(){
    wx.switchTab({
      url: '../personalCenter/personalCenter',
      success: function () {

      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '趣工问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/feedback/feedback'
    }
  },
})
