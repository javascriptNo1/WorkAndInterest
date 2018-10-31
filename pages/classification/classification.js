//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    datas:[]
  },
  onLoad: function (){
    this.setData({
      datas: config.classlay
    })
  },
  onShareAppMessage: function () {
    return {
      title: '星空问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/index/index'
    }
  },
 
})
