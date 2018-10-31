//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    h:400,
    hasUserInfo: false,
    state2:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    src: '../../img/669c25f41bd5ad6eed13938f87cb39dbb7fd3c70.jpg',
    imgUrls: [
      '../../images/67010036_p0_master1200.jpg',
      '../../images/67828607_p0_master1200.jpg',
      '../../images/67926018_p0_master1200.jpg',
      '../../images/thumb-1920-122468.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    alltolicarr: [],
    tolicarr: [],
    toView: 'red',
    scrollTop: 100,
    multiArray: [['娱乐', '生活', '职业', '综合','所有'], config.classlay[0].minclass],
    multiIndex: [4, 0],
    search:'',
    page:0,
    nodata: false,
    iscomplete:true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this =this
  
    const query = wx.createSelectorQuery()
    query.select('.container').boundingClientRect()
    query.exec(function (res) {
      const query2 = wx.createSelectorQuery()
      query2.select('.selectclassbox').boundingClientRect()
      query2.exec(function (res2) {
        _this.setData({
          h: res[0].height - res2[0].height
        })
      })
     
    })

    this.setData({
      ['multiArray[1]']:[]
    })
    this.getdata(true)
    wx.getStorage({
      key: 'login_key',
      success: (res) => {
      },
      fail(res){
        setTimeout(() => {
          _this.getdata(true)
        },500)
      }
    })
  },
  oncancel: function(){
    console.log('取消')
  },
  getdata: function(all){
    this.setData({
      state2: false
    })
    let classlay = all ? '': this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    if (classlay === '所有'){
      classlay=''
    }
    api.getsearchpaper(classlay, this.data.search, this.data.page).then((data) => {
      if (!data.data.length) {
        this.setData({
          nodata: true
        })
      }
      api.getinformation().then((infodatas)=>{
        let infodata = infodatas.data.havefinishedpaper
        for(let j=0;j<infodata.length;j++){
          for (let i = 0; i < data.data.length; i++) {
            if (infodata[j] === data.data[i]._id) {
              data.data[i].ishavefinishedpaper = true
            }
          }
        }
        let tolicarr = []
        for (let i = 0; i < data.data.length; i++) {
          if (tolicarr.length < 50) {
            tolicarr.push(data.data[i])
          }
        }
        this.setData({
          tolicarr: this.data.tolicarr.concat(data.data),
          state: true,
          page:this.data.page+=1,
          state2:true
        })
      })
      
    })
  },
  oninput: function(e){
    this.setData({
      search:e.detail.value
    })
  },
  onseach: function(){
    this.setData({
      tolicarr: [],
      page: 0,
    })
  },
  onseachbut: function(){
    this.setData({
      tolicarr: [],
      page:0
    })
    if (this.data.state2) {
      this.getdata()
    }
  },
  onpaper: function(e){
    // gendertestpaper
   
    let data={}
    for (let i = 0; i < this.data.tolicarr.length;i++){
      if (this.data.tolicarr[i]._id === e.target.id){
        data = JSON.stringify(this.data.tolicarr[i]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a')
      }
    }
    wx.navigateTo({
      url: '../gendertestpaper/gendertestpaper?paperid=' + e.target.id+'&data='+data,
      success: function () {

      }
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = config.classlay[0].minclass;
            break;
          case 1:
            data.multiArray[1] = config.classlay[1].minclass;
            break;
          case 2:
            data.multiArray[1] = config.classlay[2].minclass;;
            break;
          case 3:
            data.multiArray[1] = [];
            break;
          case 4:
            data.multiArray[1] = [];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  tolower: function () {
    let classlay = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    if (classlay === '所有') {
      if (!this.data.nodata) {
        this.getdata(true)
      }
    }
    else {
      if (!this.data.nodata) {
        this.getdata()
      }
    }
  },
  over: function () {
    // console.log(33333)
  },
  upper: function () {
    // console.log(33333)
  },
  onShareAppMessage: function () {
    return {
      title: '星空问答，可以自行定义选择题让您的好友答题，快来试试吧！',
      path: '/pages/index/index'
    }
  },
  switch1Change(e){
    this.setData({
      iscomplete: e.detail.value      
    })
  }
})
