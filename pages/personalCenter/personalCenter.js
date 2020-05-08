//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    userInfo: '',
    hasUserInfo: false,
  },
  //事件处理函数
  onLoad: function () {
    let _this = this
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        _this.setData({
          userInfo: res.data
        })
      },
    })
   
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '趣工问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/personalCenter/personalCenter'
    }
  },
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.setData({
          userInfo: res.userInfo
        })
        wx.setStorageSync('userInfo', res.userInfo)
        api.setinformation(res.userInfo.nickName, res.userInfo.gender).then((data)=>{
          console.log(data)
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
      fail:function(){
        wx.showModal({
          title: '',
          showCancel: false,
          content: '您拒绝了信息授权，请前往右上角>关于>右上角>设置处开启',
          success: function (res) {
          }
        })
      }
    })
  }
})
