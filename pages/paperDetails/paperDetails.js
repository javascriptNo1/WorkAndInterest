//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    items:'',
    tolicarr:[],
    collstate: true,
    reportstate: true,
    colltion:true
  },
  onLoad: function (data){
  
    if (data.collection === '1'){
      this.setData({
        colltion: false,
      })
    }
    let datas = JSON.parse(data.data.replace(/08862ca061997a4d/img, '=').replace(/54f19ac2aa52aac5/img, '&').replace(/c3fb323a2671125a/img, '?'))
    let obj ={
      paperid: datas._id
    }
    this.setData({
      items: datas,
    })
    api.getpaperInTopic(datas.options).then((data) => {
      this.setData({
        tolicarr: data.data
      })
    })
    api.iscollectionandreporting(obj).then((data)=>{
      this.setData({
        ['items.collect']: data.data.collectionnumber
      })
      if (data.data.reportstate){
          this.setData({
            reportstate: false
          })
        }
      if (data.data.papercollectionstate) {
        this.setData({
          collstate: false
        })
      }
    })
  },
  onsee: function (e) {
    let data = JSON.stringify(this.data.tolicarr[e.target.id]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a');
    wx.navigateTo({
      url: '../subjectDetails/subjectDetails?data=' + data,
      success: function () {

      }
    })
  },
  onback: function (e) {
    wx.navigateBack({
      delta: 1,
      success: function () {

      }
    })
  },
  oncollectionpaper: function (e) {
    api.collectiontestPaper(e.target.id).then((data) => {
      if (data.data === 1) {
        this.setData({
          collstate: false,
          ['items.collect']: this.data.items.collect + 1
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
      else if (data.data === 2) {
        this.setData({
          collstate: true,
          ['items.collect']: this.data.items.collect - 1
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onreportpaper: function (e) {
    if (this.data.reportstate) {
      api.reportpaper(e.target.id).then((data) => {
        if (data.data === 2) {
          wx.showToast({
            title: '不能重复举报',
            icon: 'none',
            duration: 2000
          })
        }
        else if (data.data === 1) {
          this.setData({
            reportstate: false
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
        icon: 'none',
        duration: 2000
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '我分享了一套选择题，快来做做看吧！',
      path: '/pages/gendertestpaper/gendertestpaper?paperid=' + this.data.items._id + '&data=' + JSON.stringify(this.data.items).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a')
    }
  }
})  