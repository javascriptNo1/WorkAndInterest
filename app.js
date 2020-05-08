//app.js
const config = require('./utils/config.js')
const api = require('./utils/api.js')
String.prototype.trim = function () {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
App({
  onLaunch: function () {
    // 展示本地存储能力
    let thar = this;
    api.getallclassfiy().then((data) => {
      data.data.unshift({
        maxclass:'所有',
        minclass:[]
      })
      let maxclass = [];
      data.data.map((itme) => {
        maxclass.push(itme.maxclass)
      })
      config.maxclass = maxclass
      config.classlay = data.data
      let setmaxclass = JSON.parse(JSON.stringify(maxclass))
      let setclasslay = JSON.parse(JSON.stringify(data.data))
      setmaxclass.shift()
      setclasslay.shift()
      config.setmaxclass = setmaxclass
      config.setclasslay = setclasslay
    })
    // 登录
    wx.getStorage({
      key: 'login_key',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        // console.log(res.data)
        wx.checkSession({
          success(res) {
            //session_key 未过期，并且在本生命周期一直有效
          },
          fail() {
            // session_key 已经失效，需要重新执行登录流程
            login() //重新登录
            // 更新用户资料
            wx.getStorage({
              key: 'userInfo',
              success: (res) => {
                wx.getUserInfo({
                  success: res2 => {
                    // 可以将 res 发送给后台解码出 unionId
                    wx.setStorageSync('userInfo', res2.userInfo)
                    api.setinformation(res.userInfo.nickName, res.userInfo.gender).then((data) => { })
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res2)
                    }
                  }
                })
              }
            })
          }
        })
      },
      fail: function () {
        // 未登陆，调用登陆
        login()
      }
    })
    function login() {
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
  },
  globalData: {
    userInfo: null
  }
})