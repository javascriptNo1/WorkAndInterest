//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    items:[],
    fraction:0,
  },
  onLoad: function(){
    let that = this
    wx.getStorage({
      key: 'items',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        let items = res.data
        for(let i=0;i<items.length;i++){
          items[i].collstate=true,
          items[i].reportstate = true
        }
        that.setData({
          items: items
        })
        let havefinished = []
        for (let i = 0; i < items.length; i++) {
          havefinished.push(items[i]._id)
          for (let j = 0; j < items[i].options.length; j++) {
            if (items[i].options[j].state) {
              if (items[i].options[j].answar) {
                that.setData({
                  fraction: that.data.fraction + 5
                })
              }
            }
          }
        }
        api.sethavefinishedlist(havefinished).then((data)=>{
          console.log(data.data)
        })
      },
      fail: function () {
        console.log('读取items发生错误')
      }
    })
  },
  oncollection: function(e){
    for (let i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i]._id === e.target.id) {
          api.collectionsubject(e.target.id).then((data) => {
            if (data.data === 1) {
              this.setData({
                ['items[' + i + '].collstate']: false
              })
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 2000
              })
            }
            else if(data.data=== 2){
              this.setData({
                ['items[' + i + '].collstate']: true
              })
              wx.showToast({
                title: '取消收藏成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
      }
    }
  },
  onreport: function (e) {
    for (let i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i]._id === e.target.id){
        if (this.data.items[i].reportstate) {
          api.reportsubject(e.target.id).then((data) => {
            console.log(data)
            if (data.data === 2) {
              wx.showToast({
                title: '不能重复举报',
                icon: 'none',
                duration: 2000
              })
            }
            else if (data.data === 1) {
              this.setData({
                ['items['+i+'].reportstate']: false
              })
              wx.showToast({
                title: '举报成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
        else{
          wx.showToast({
            title: '不能重复举报',
            icon: 'success',
            duration: 2000
          })
        }
      } 
    }
  },
  onbutclick: function(){
    wx.switchTab ({
      url: '../classification/classification',
      success: function () {
       
      }
    })
  },
  ondetails: function (e) {
    let data = JSON.stringify(this.data.items[e.target.id]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a');
    wx.navigateTo({
      url: '../subjectDetails/subjectDetails?data=' + data,
      success: function () {

      }
    })
  }
})
