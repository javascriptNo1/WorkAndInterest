//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    items:[],
    fraction:0,
    paperdata:'',
    paperid:'',
    list:'',
    reportstate:true,
    collstate: true,
    datastate: false
  },
  onLoad: function (parameter){
    let that = this
    api.getonepaper(parameter.paperid).then((data)=>{
      if (data.data == '0'){
        this.setData({
          datastate:true,
          items:[1]
        })
      }
      else{
        this.setData({
          paperdata: data.data,
          paperid: parameter.paperid,
          list: parameter.list
        })
      }
    })

    wx.getStorage({
      key: 'login_key',
      success: (res) => {
        that.getshareTestQuestions(parameter)
      },
      fail: (res) => {
       let intre = setInterval(()=>{
         if (that.data.items.length){
            clearInterval(intre)
          }else{
           that.getshareTestQuestions(parameter)
          }
        },1000)
      }
    })

   
  },
  getshareTestQuestions: function (parameter){
    let that = this
    api.getshareTestQuestions(parameter.paperid).then((data) => {
      if (data.data == 0) {
        return
      }
      let tolicarr = []
      let list = parameter.list.split(',')
      let items = data.data
      for (let i = 0; i < items.length; i++) {
        items[i].options[list[i]].state = true
      }
      for (let i = 0; i < items.length; i++) {
        items[i].collstate = true,
          items[i].reportstate = true
      }
      this.setData({
        items: items
      })
      for (let i = 0; i < items.length; i++) {
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
      api.sethavefinishedpaper(parameter.paperid).then((data) => {
        console.log(data.data)
      })
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
  oncollectionpaper: function (e) {
    api.collectiontestPaper(e.target.id).then((data) => {
      if (data.data === 1) {
        this.setData({
          collstate: false
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
      else if (data.data === 2) {
        this.setData({
          collstate : true
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onreportpaper:function(e){
    if (this.data.reportstate) {
      api.reportpaper(e.target.id).then((data) => {
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
            reportstate : false
          })
          wx.showToast({
            title: '举报成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
    else {
      wx.showToast({
        title: '不能重复举报',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onbutclick: function(){
    wx.switchTab ({
      url: '../index/index',
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
  },
  onShareAppMessage: function () {
    return {
      title: '我分享了一份试卷的答题结果，快来看看成绩吧！',
      path: '/pages/gendertestpaperseccuss/gendertestpaperseccuss?paperid=' + this.data.paperid + '&list=' + this.data.list
    }
  }
})
