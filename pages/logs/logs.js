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
    scrollTop: 100
  },
  onLoad: function () {
    let thar = this
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    api.getbilibilir().then((data)=>{
      let imgyurldata = JSON.parse(data.data.substring(9, data.data.length - 2)).result
      thar.setData({
        imgurlall: imgyurldata,
        imgurl: imgyurldata.slice(0, 4)
      });
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
