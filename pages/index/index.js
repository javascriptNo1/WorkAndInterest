//index.js
//获取应用实例
const app = getApp()
let config = require('../../utils/config.js')
let maxclass = []
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
    tolicarr: [],
    toView: 'red',
    scrollTop: 0,
    multiArray: [['所有'], config.classlay[0].minclass],
    multiIndex: [0, 0],
    search:'',
    page:0,
    nodata: false,
    iscomplete:false,
    isload:false,
    message:'没有搜索到相关试卷'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this =this
    setTimeout(()=>{
      this.setData({
        ['multiArray[0]']: config.maxclass
      })
    },500)
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
    wx.getStorage({
      key: 'login_key',
      success: (res) => {
        _this.getdata(true)
      },
      fail(res){
        setTimeout(() => {
          _this.getdata(true)
        },1000)
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
    api.getsearchpaper(
      classlay,
      this.data.search,
      this.data.page,
      this.data.iscomplete)
      .then((data) => {
        if (data.data === 0){
          data.data = [],
          this.setData({
            message: '网络出现问题，请点击搜索重试'
          })
        }
        else{
          data.data.map((itme)=>{
            if (this.data.iscomplete)
              itme.iscomplete = true
          })
        }
      if (!data.data.length && this.data.tolicarr.length) {
        this.setData({
          nodata: true,
          message: '没有搜索到相关试卷'
        })
      }
      this.setData({
        tolicarr: this.data.tolicarr.concat(data.data),
        state: true,
        state2: true
      })
    })
    this.setData({
      page: this.data.page += 1
    })
  },
  oninput: function(e){
    this.setData({
      search: e.detail.value.trim()
    })
  },
  onseach: function(){
    this.setData({
      tolicarr: [],
      page: 0,
      nodata: false,
      message: '没有搜索到相关试卷'
    })
    if (this.data.state2) {
      this.getdata()
    }
  },
  onseachbut: function(){
    this.setData({
      tolicarr: [],
      page:0,
      nodata: false
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
    if (e.detail.column === 0) {
      data.multiIndex[1] = 0;
    }
    for (let i = 0; i < config.maxclass.length;i++){
      if (data.multiIndex[0] === i){
       data.multiArray[1] = config.classlay[i].minclass;
      }
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
    this.onseachbut()
  }
})
