//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data:{
    items:'',
    showimg:true,
    collstate: true,
    reportstate: true,
    updatepage:0,
    colltion: true
  },
  onLoad: function (data){
    if (data.collection === '1') {
      this.setData({
        colltion: false,
      })
    }
    this.setData({
      items: JSON.parse(data.data.replace(/08862ca061997a4d/img, '=').replace(/54f19ac2aa52aac5/img, '&').replace(/c3fb323a2671125a/img, '?')),
    })
    let obj = {
      subjectid: this.data.items._id
    }
    api.iscollectionandreporting(obj).then((data) => {
      this.setData({
        ['items.collect']: data.data.collectionnumber
      })
      if (data.data.reportstate) {
        this.setData({
          reportstate: false
        })
      }
      if (data.data.subjectcollectionstate) {
        this.setData({
          collstate: false
        })
      }
    })
  },
  onshowimg: function(e){
    this.setData({
      showimg:false
    })
  },
  onhiddenimg: function(){
    this.setData({
      showimg: true
    })
  },
  oncollection: function (e) {
    api.collectionsubject(e.target.id).then((data) => {
      if (data.data === 1) {

        this.setData({
          collstate: false,
          ['items.collect']: this.data.items.collect+1
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
  onreport: function (e) {
    if (this.data.reportstate) {
      api.reportsubject(e.target.id).then((data) => {
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
        icon: 'success',
        duration: 2000
      })
    }
  },
  ondownloadFile: function (e) {
    let downloadTask  = wx.downloadFile({
      url: e.currentTarget.dataset.img,
      success: function (res) {
        if (res.statusCode === 200){
          let rr = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: rr,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(res){
              wx.hideLoading()
              wx.showModal({
                title: '',
                showCancel: false,
                content: '保存失败，请前往右上角>关于>右上角>设置处开启相册权限',
                success: function (res) {
                }
              })
            }
          })
        }
      }
    })
    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '下载进度 ' + res.progress+'%',
      })
    })
  },
  onback: function (e) {
    wx.navigateBack({
      delta: 1,
      success: function () {

      }
    })
    // if (this.data.updatepage === '1'){
    //   wx.navigateTo({
    //     url: '../mycollectionTopic/mycollectionTopic',
    //     success: function () {

    //     }
    //   })
    // }
    // else{
    //   wx.navigateBack({
    //     delta: 1,
    //     success: function () {

    //     }
    //   })
    // }
  },
})  