//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
Page({
  data: {
    logs: [],
    imgurl:[],
    imgurlall:[],
    page:0,
    footerlode:true,
    toView: 'red',
    scrollTop: 100,
    l:''
  },
  onLoad: function () {
    let thar = this
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    // wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     var tempFilePaths = res.tempFilePaths
    //     console.log(tempFilePaths)
    //     thar.setData({
    //       l: tempFilePaths[0]
    //     })
    //   }
    // }),
    wx.checkSession({
      success: function () {
        console.log('未过期')
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        console.log('已经失效')
        // session_key 已经失效，需要重新执行登录流程
  },
  onShareAppMessage: function () {
    return {
      title: '星空问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/index/index'
    }
  },
})
    
  
  
  },
  tolower: function (){
    this.data.page++;
    this.setData({
      imgurl: this.data.imgurlall.slice(0, (this.data.page * 5) + 4)
    });
    if (this.data.imgurl.length+5 >= this.data.imgurlall.length && this.data.imgurl.length !==0){
      this.setData({
        footerlode: false
      });
    }
  },
  over:  function () {
    // console.log(33333)
  }
})
