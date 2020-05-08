//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    weburl:'',
    gamename:''
  },
  onLoad: function (data){
    wx.setNavigationBarTitle({ title: data.gamename })
    if (data.weburl){
      this.setData({
        weburl: data.weburl,
        gamename: data.gamename
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '趣工问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/web/web?weburl=' + this.data.weburl + '&gamename=' + this.data.gamename
    }
  }
})
