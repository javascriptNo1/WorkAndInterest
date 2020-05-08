//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    alltolicarr:[],
    tolicarr:[],
    toView: 'red',
    scrollTop: 0,
    state:false,
    page:0,
    nodata: false,
    state2: true,
    multiArray: [['娱乐', '生活', '职业', '综合', '所有'], config.classlay[0].minclass],
    multiIndex: [0, 0],
    search: '',
    overt: true,
  },
  //事件处理函数
  onLoad: function () {
    let _this = this;
    this.setData({
      ['multiArray[1]']: [],
      ['multiArray[0]']: config.maxclass
    })
    this.getdata(true)
  },
  getdata: function (all){
    this.setData({
      state2: false
    })
    let classlay = all ? '' : this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    if (classlay === '所有') {
      classlay = ''
    }
    let parameter={
      page: this.data.page,
      classify: classlay,
      overt: this.data.overt,
      search: this.data.search
    }
    api.getmyTopic(parameter).then((data) => {
      if (!data.data.length) {
        this.setData({
          nodata: true
        })
      }
      this.data.tolicarr = this.data.tolicarr.concat(data.data)
      this.setData({
        tolicarr: this.data.tolicarr,
        state: true,
        state2: true
      })
    })
    this.setData({
      page: this.data.page += 1,
    })
  },
  ondelete: function (e){
    wx.showModal({
      title: '',
      showCancel: true,
      content: '您确定删除这条题目吗,删除题目不会影响加入试卷的题目',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          api.deleteTopic(e.target.id).then((data)=>{
            if(data.data === 1){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              for (let i = 0; i < this.data.tolicarr.length;i++){             
                if (this.data.tolicarr[i]._id == e.target.id){
                  this.data.tolicarr.splice(i, 1)
                  this.data.alltolicarr.splice(i, 1)
                  this.setData({
                    tolicarr: this.data.tolicarr,
                    alltolicarr: this.data.alltolicarr
                  })
                }
              }
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
    })  
  },
  onback: function (){
    wx.switchTab({
      url: '../personalCenter/personalCenter',
      success: function () {

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
  tolower: function () {
    if (!this.data.nodata) {
      this.getdata()
    }
  },
  over: function () {
    // console.log(33333)
  },
  upper: function () {
    // console.log(33333)
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
    for (let i = 0; i < config.maxclass.length; i++) {
      if (data.multiIndex[0] === i) {
        data.multiArray[1] = config.classlay[i].minclass;
      }
    }
    this.setData(data);
  },
  switch1Change(e) {
    this.setData({
      overt: e.detail.value
    })
    this.onseachbut()
  },
  oninput: function (e) {
    this.setData({
      search: e.detail.value.trim()
    })
  },
  onseachbut: function () {
    this.setData({
      tolicarr: [],
      page: 0,
      nodata: false,
      state:false
    })
    if (this.data.state2) {
      this.getdata()
    }
  },
})
