//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    alltolicarr: [],
    tolicarr: [],
    alltolicarr2: [],
    tolicarr2: [],
    toView: 'red',
    scrollTop: 100,
    h:'400px',
    h2:'0px',
    rotate:'rotate(90deg)',
    rotate2:'rotate(0deg)',
    userid:'',
    title:'',
    overt: false,
    multiArray: [['娱乐', '生活', '职业', '综合'], config.classlay[0].minclass],
    multiIndex: [0, 0],
    options:[],
    state:false,
    page1:0,
    page2:0
  },
  onLoad: function (){
    api.getinformation().then((data)=>{
      let defaults = data.data
      if (defaults.defaulttestpaperclassify[0] === 3){
        this.setData({
          ['multiArray['+1+']']: [],
        })
      }
      this.setData({
        multiIndex: defaults.defaulttestpaperclassify[0] === 3 ? [3] : defaults.defaulttestpaperclassify,
        overt: defaults.defaulttestpaperovet,
        ['multiArray[1]']: defaults.defaulttestpaperclassify[0] === 3 ? [] : config.classlay[defaults.defaulttestpaperclassify[0]].minclass,
      })
    })
    this.getdata1()
  },
  getdata1: function () {
    api.getmyTopic(this.data.page1).then((data) => {
      this.data.tolicarr = this.data.tolicarr.concat(data.data)
      this.setData({
        tolicarr: this.data.tolicarr,
        state: true,
        page1: this.data.page1 += 1
      })
    })
  },
  getdata2: function () {
    api.getmycollectionTopic(this.data.page2).then((data) => {
      this.data.tolicarr2 = this.data.tolicarr2.concat(data.data)
      this.setData({
        tolicarr2: this.data.tolicarr2,
        state: true,
        page2: this.data.page2 += 1
      })
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
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  oninputtitle: function (e){
    this.setData({
      title: e.detail.value
    })
  },
  onhidden: function(){
    if(this.data.h==='400px'){
      this.setData({
        h: '0px',
        rotate: 'rotate(0deg)',
      })
    }
    else{
      this.setData({
        h: '400px',
        rotate: 'rotate(90deg)',
      })
    }
   
  },
  onhidden2: function () {
    if (this.data.h2 === '400px') {
      this.setData({
        h2: '0px',
        rotate2: 'rotate(0deg)',
      })
    }
    else {
      this.setData({
        h2: '400px',
        rotate2: 'rotate(90deg)',
      })
    }

  },
  switch1Change: function (e){
    this.setData({
      overt: e.detail.value
    })
  },
  tolower: function () {
   this.getdata1()
  },
  tolower2: function () {
   this.getdata2()
  },
  onsee: function (e) {
    let data = JSON.stringify(this.data.tolicarr[e.target.id]);
    wx.navigateTo({
      url: '../subjectDetails/subjectDetails?data=' + data,
      success: function () {

      }
    })
  },
  onadd: function(e){
    for (let i = 0; i < this.data.options.length; i++) {
      if (this.data.options[i] === e.target.id) {
        wx.showToast({
          title: '该题已加入试卷,不能重复加入',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    this.data.options.push(e.target.id)
    this.setData({
      options: this.data.options
    })
    for (let i = 0; i < this.data.tolicarr.length;i++){
      if (this.data.tolicarr[i]._id === e.target.id){
        this.setData({
          ['tolicarr[' + i + '].add']: true
        })
      }
    }
  },
  onremove: function (e) {
    for (let i = 0; i < this.data.options.length; i++) {
      if (this.data.options[i] === e.target.id) {
        this.data.options.splice(i, 1)
        this.setData({
          options: this.data.options,
        })
      }
    }
  
    for (let i = 0; i < this.data.tolicarr.length; i++) {
      if (this.data.tolicarr[i]._id === e.target.id) {
        this.setData({
          ['tolicarr[' + i + '].add']: false
        })
      }
    }
  },
  onadd2: function (e) {
    for (let i = 0; i < this.data.options.length;i++){
      if (this.data.options[i] === e.target.id){
        wx.showToast({
          title: '该题已加入试卷,不能重复加入',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    this.data.options.push(e.target.id)
    this.setData({
      options: this.data.options
    })
    for (let i = 0; i < this.data.tolicarr2.length; i++) {
      if (this.data.tolicarr2[i]._id === e.target.id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: true
        })
      }
    }
  },
  onremove2: function (e) {
    for (let i = 0; i < this.data.options.length; i++) {
      if (this.data.options[i] === e.target.id) {
        this.data.options.splice(i, 1)
        this.setData({
          options: this.data.options,
        })
      }
    }
    for (let i = 0; i < this.data.tolicarr2.length; i++) {
      if (this.data.tolicarr2[i]._id === e.target.id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: false
        })
      }
    }
  },
  verification: function(){
    let classlay = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    let state = true;
    let content = '';
    if(this.data.title === ''){
      state = false
      content = '题目必须填写'
    }
    else if (this.data.title.length > 100) {
      state = false
      content = '题目不能超过100字'
    }
    else if (this.data.options.length===0){
      state = false
      content = '必须加入至少一道题目'
    }
    if(!state){
      wx.showModal({
        title: '',
        showCancel: false,
        content: content,
        success: function (res) {
        }
      })
    }
    return state;
  },
  onsubmiss: function () {
    if (!this.verification()) {
      return
    }
    let userid='' 
    wx.getStorage({
      key: 'login_key',
      success: (res) => {
        let classify = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
        wx.showLoading({
          title: '试卷上传中',
        })
        wx.request({
          url: config.server + 'xcx/settestpaper.php',
          method: 'POST',
          data: {
            "title": this.data.title,
            "options": this.data.options,
            "classify": classify,
            "userid": res.data,
            "overt": this.data.overt,
          },
          success: (res) => {
            if (res.data === 1) {
              wx.hideLoading()
              wx.showModal({
                title: '',
                content: '提交成功，可以前往我的试卷查看',
                cancelText: '返回',
                cancelColor: '#fb7299',
                confirmText: '继续出卷',
                success: (res) => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../setpaper/setpaper'
                    })
                  } else if (res.cancel) {
                    //返回
                    wx.navigateBack({
                      delta: 1,
                      success: function () {

                      }
                    })
                  }
                }
              })
            }
            else {
              wx.showToast({
                title: '失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '页面提示',
          showCancel: false,
          content: '您尚未登录，无法进行此操作',
          success: function (res) {
          }
        })
      },
      complete: function(res) {},
    })
  }, 
  over: function () {
    // console.log(33333)
  },
  upper: function () {
    // console.log(33333)
  }
})
