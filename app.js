//app.js
const config = require('./utils/config.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let thar = this;
    // 登录
    wx.getStorage({
      key: 'login_key',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        // console.log(res.data)
      },
      fail: function () {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId  
            wx.request({
              url: config.server + 'xcx/login.php',
              method: 'POST',
              data: {
                code: res.code
              },
              success: function (data) {
                wx.setStorageSync('login_key', data.data)
              }
            })
          }
        })
      }
    })
   
   
  },
  globalData: {
    userInfo: null
  }
})