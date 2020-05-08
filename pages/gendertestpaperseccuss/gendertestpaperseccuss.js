//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    userInfo:'',
    items:[],
    fraction:0,
    paperdata:'',
    paperid:'',
    list:'',
    reportstate:true,
    collstate: true,
    datastate: false,
    name:undefined
  },
  onLoad: function (parameter){

    if (parameter.name){
      this.setData({
        name: parameter.name
      })
    }
    let that = this
    let obj = {
      paperid: parameter.paperid
    }
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        that.setData({
          userInfo: res.data
        })
      },
    })
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
    api.iscollectionandreporting(obj).then((data) => {
      this.setData({
        ['paperdata.collect']: data.data.collectionnumber
      })
      if (data.data.reportstate) {
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
      if (parameter.have === 'true'){
        api.sethavefinishedpaper(parameter.paperid).then((data) => {
          console.log(data.data)
        })
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
              console.log('??',this.data.paperdata.collect)
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
            if (data.data === 2) {
              this.setData({
                ['items[' + i + '].reportstate']: false
              })
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
            icon: 'none',
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
          collstate: false,
          ['paperdata.collect']: this.data.paperdata.collect + 1
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
      else if (data.data === 2) {
        this.setData({
          collstate : true,
          ['paperdata.collect']: this.data.paperdata.collect - 1
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
        if (data.data === 2) {
          wx.showToast({
            title: '不能重复举报??',
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
  getUserInfo() {
    wx.showLoading({
      title: '获取中',
    })
    wx.getUserInfo({
      success: res => {
        wx.showToast({
          title: '获取成功',
          icon: 'success',
          duration: 2000
        })
        // 可以将 res 发送给后台解码出 unionId
        this.setData({
          userInfo: res.userInfo
        })
        wx.setStorageSync('userInfo', res.userInfo)
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        api.setinformation(res.userInfo.nickName, res.userInfo.gender).then((data) => { })
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      },
      fail: function () {
        wx.showModal({
          title: '',
          showCancel: false,
          content: '您拒绝了信息授权，请前往右上角>关于>右上角>设置处开启',
          success: function (res) {
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    let gender;
    if (this.data.userInfo.gender === 1){
      gender = '他'
    }
    else if (this.data.userInfo.gender === 2){
      gender = '她'
    } 
    else{
      gender = 'Ta'
    }

    let name
    if (this.data.name !== undefined){
      name = this.data.name
    }
    else if (this.data.userInfo.nickName && this.data.name === undefined){
       name = this.data.userInfo.nickName;
    }
    else{
      name='我'
    }
    return {
      title: name + '分享了一份试卷的答题结果，快来看看' + gender+'的成绩吧！',
      path: '/pages/gendertestpaperseccuss/gendertestpaperseccuss?paperid=' + this.data.paperid + '&list=' + this.data.list + '&name=' + name
    }
  }
})
