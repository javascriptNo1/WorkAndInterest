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
    scrollTop: 0,
    h:'400px',
    h2:'0px',
    rotate:'rotate(90deg)',
    rotate2:'rotate(0deg)',
    userid:'',
    title:'',
    overt: false,
    multiArray: [['娱乐', '生活', '职业', '综合'], config.setclasslay[0].minclass],
    multiIndex: [0, 0],
    options:[],
    state:false,
    page1:0,
    page2:0,
    nodata1:false,
    nodata2:false,
    state1:true,
    state2: true,
    seachstate1:true,
    seachstate2:true,
    userInfo: {},
    multiArray1: [['娱乐', '生活', '职业', '综合', '所有'], config.classlay[0].minclass],
    multiIndex1: [0, 0],
    search1: '',
    overt1: true,
    multiArray2: [['娱乐', '生活', '职业', '综合', '所有'], config.classlay[0].minclass],
    multiIndex2: [0, 0],
    search2: '',
    overt2: true,
    paperSubject:true,
    submissionstate:true
  },
  onLoad: function (){
    let setmaxclass = JSON.parse(JSON.stringify(config.setmaxclass))
    this.setData({
      ['multiArray1[1]']: [],
      ['multiArray2[1]']: [],
      ['multiArray1[0]']: config.maxclass,
      ['multiArray2[0]']: config.maxclass,
      ['multiArray[0]']: setmaxclass
    })

    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: (res) => {
        wx.showModal({
          title: '',
          showCancel: false,
          content: '自定义试卷需要获取您的昵称，请前往个人中心获取',
          success: function (res) {
            wx.navigateBack({
              delta: 1,
              success: function () {
              }
            })
          }
        })
      }
    })

    api.getinformation().then((data)=>{
      let defaults = data.data
      this.setData({
        multiIndex: defaults.defaulttestpaperclassify,
        overt: defaults.defaulttestpaperovet,
        ['multiArray[1]']: config.setclasslay[defaults.defaulttestpaperclassify[0]].minclass,
      })

      if (defaults.Numberofreports >=100){
        wx.showModal({
          title: '',
          showCancel: false,
          content: '您的题目或试卷内容涉及违规暂时无法自定义题目和试卷',
          success: function (res) {
            wx.navigateBack({
              delta: 1,
              success: function () {
              }
            })
          }
        })
      }
    })
    this.getdata1()
    this.getdata2()
  },
  getdata1: function (all) {
    this.setData({
      state1: false
    })
    let classlay = all ? '' : this.data.multiArray1[1][this.data.multiIndex1[1]] || this.data.multiArray1[0][this.data.multiIndex1[0]]
    if (classlay === '所有') {
      classlay = ''
    }
    let parameter = {
      page: this.data.page1,
      classify: classlay,
      overt: this.data.overt1,
      search: this.data.search1
    }
    api.getmyTopic(parameter).then((data) => {
      if (!data.data.length) {
        this.setData({
          nodata1: true
        })
      }
      //对已经加入试卷的题目做标记
      this.data.options.map(itme=>{
        data.data.map(itme2=>{
          if (itme === itme2._id){
            itme2.add = true
          }
        })
      })
      this.setData({
        tolicarr: this.data.tolicarr.concat(data.data),
        state: true,
        state1: true,
        seachstate1:true
      })
    })
    this.setData({
      page1: this.data.page1 += 1
    })
  },
  getdata2: function (all) {
    this.setData({
      state2: false
    })
    let classlay = all ? '' : this.data.multiArray2[1][this.data.multiIndex2[1]] || this.data.multiArray2[0][this.data.multiIndex2[0]]
    if (classlay === '所有') {
      classlay = ''
    }
    let parameter = {
      page: this.data.page2,
      classify: classlay,
      overt: this.data.overt2,
      search: this.data.search2
    }
    api.getmycollectionTopic(parameter).then((data) => {
      if (!data.data.length) {
        this.setData({
          nodata2: true
        })
      }
       //对已经加入试卷的题目做标记
      this.data.options.map(itme => {
        data.data.map(itme2 => {
          if (itme === itme2._id) {
            itme2.add = true
          }
        })
      })
 
      this.setData({
        tolicarr2: this.data.tolicarr2.concat(data.data),
        state: true,
        state2: true,
        seachstate2:true
      })
    })
    this.setData({
      page2: this.data.page2 += 1
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
    for (let i = 0; i < config.setmaxclass.length; i++) {
      if (data.multiIndex[0] === i) {
        data.multiArray[1] = config.setclasslay[i].minclass;
      }
    }
    this.setData(data);
  },
  oninputtitle: function (e){
    this.setData({
      title: e.detail.value
    })
  },
  onmysubjet(){
    this.setData({
      paperSubject: true,
    })
  },
  onmycollectionsubjet(){
    this.setData({
      paperSubject: false,
    })
  },
  switch1Change: function (e){
    this.setData({
      overt: e.detail.value
    })
  },
  tolower: function () {
    if (!this.data.nodata1){
      this.getdata1()
    }
  },
  tolower2: function () {
    if (!this.data.nodata2) {
      this.getdata2()
    }
  },
  onsee: function (e) {
    let data = JSON.stringify(this.data.tolicarr[e.target.id]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a');
    wx.navigateTo({
      url: '../subjectDetails/subjectDetails?data=' + data,
      success: function () {

      }
    })
  },
  onsee2: function (e) {
    let data = JSON.stringify(this.data.tolicarr2[e.target.id]).replace(/=/img, '08862ca061997a4d').replace(/&/img, '54f19ac2aa52aac5').replace(/\?/img, 'c3fb323a2671125a');
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
    //同步我的试卷
    for (let i = 0; i < this.data.tolicarr.length;i++){
      if (this.data.tolicarr[i]._id === e.target.id){
        this.setData({
          ['tolicarr[' + i + '].add']: true
        })
      }
    }
    // 同步我收藏的试卷
    this.data.tolicarr2.map((itme2, i) => {
      if (e.target.id === itme2._id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: true
        })
      }
    })
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
    //同步我的试卷
    for (let i = 0; i < this.data.tolicarr.length; i++) {
      if (this.data.tolicarr[i]._id === e.target.id) {
        this.setData({
          ['tolicarr[' + i + '].add']: false
        })
      }
    }
    // 同步我收藏的试卷
    this.data.tolicarr2.map((itme2, i) => {
      if (e.target.id === itme2._id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: false
        })
      }
    })
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
    // 同步我收藏的试卷
    for (let i = 0; i < this.data.tolicarr2.length; i++) {
      if (this.data.tolicarr2[i]._id === e.target.id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: true
        })
      }
    }
    // 同步我的试卷
    this.data.tolicarr.map((itme2, i) => {
      if (e.target.id === itme2._id) {
        this.setData({
          ['tolicarr[' + i + '].add']: true
        })
      }
    })
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
     // 同步我收藏的试卷
    for (let i = 0; i < this.data.tolicarr2.length; i++) {
      if (this.data.tolicarr2[i]._id === e.target.id) {
        this.setData({
          ['tolicarr2[' + i + '].add']: false
        })
      }
    }
    // 同步我的试卷
    this.data.tolicarr.map((itme2, i) => {
      if (e.target.id === itme2._id) {
        this.setData({
          ['tolicarr[' + i + '].add']: false
        })
      }
    })
  },
  verification: function(){
    let classlay = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    let state = true;
    let content = '';
    if (this.data.title.trim() === ''){
      state = false
      content = '试卷名称必须填写'
    }
    else if (this.data.title.length > 40) {
      state = false
      content = '试卷名称不能超过40字'
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
    if (this.data.submissionstate) {
      this.setData({
        submissionstate: false
      })
    }
    else {
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
            "username": this.data.userInfo.nickName,
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
            else if (res.data === 2){
              wx.showToast({
                title: '试卷名称已存在',
                icon: 'none',
                duration: 2000
              })
              this.setData({
                submissionstate: true
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
  },
  bindMultiPickerColumnChange1: function (e) {
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1
    };
    data.multiIndex1[e.detail.column] = e.detail.value;
    if (e.detail.column === 0) {
      data.multiIndex1[1] = 0;
    }
    for (let i = 0; i < config.maxclass.length; i++) {
      if (data.multiIndex1[0] === i) {
        data.multiArray1[1] = config.classlay[i].minclass;
      }
    }
    this.setData(data);
  },
  switch1Change1(e) {
    this.setData({
      overt1: e.detail.value
    })
    this.onseachbut1()
  },
  oninput1: function (e) {
    this.setData({
      search1: e.detail.value.trim()
    })
  },
  onseachbut1: function () {
    this.setData({
      tolicarr: [],
      page1: 0,
      nodata1: false,
      seachstate1:false
    })
    if (this.data.state1) {
      this.getdata1()
    }
  },
  bindMultiPickerColumnChange2: function (e) {
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    if (e.detail.column === 0) {
      data.multiIndex2[1] = 0;
    }
    for (let i = 0; i < config.maxclass.length; i++) {
      if (data.multiIndex2[0] === i) {
        data.multiArray2[1] = config.classlay[i].minclass;
      }
    }
    this.setData(data);
  },
  switch1Change2(e) {
    this.setData({
      overt2: e.detail.value
    })
    this.onseachbut2()
  },
  oninput2: function (e) {
    this.setData({
      search2: e.detail.value.trim()
    })
  },
  onseachbut2: function () {
    this.setData({
      tolicarr2: [],
      page2: 0,
      nodata2: false,
      seachstate2:false
    })
    if (this.data.state2) {
      this.getdata2()
    }
  },
})
