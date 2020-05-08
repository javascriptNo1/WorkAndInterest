//index.js
//获取应用实例
const app = getApp()
let config = require('../../utils/config.js')
const api = require('../../utils/api.js')

Page({
  data: {
    imgurl: '../../images/upload.png',
    userid:'',
    title:'',
    arrayanswer: ['选项一', '选项二', '选项三', '选项四','未设置'],
    indexanswer: 4,
    options:[0,0,0,0],
    remarks:"",
    overt: false,
    assets:'',
    multiArray: [['娱乐', '生活', '职业', '综合'], ['电影']],
    multiIndex: [0, 0],
    state:false,
    userInfo:{},
    submissionstate:true
  },
  onLoad: function (){
    this.setData({
      ['multiArray[0]']: config.setmaxclass,
      ['multiArray[1]']: config.setclasslay[0].minclass
    })
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: (res)=>{
        wx.showModal({
          title: '',
          showCancel: false,
          content: '自定义题目需要获取您的昵称，请前往个人中心获取',
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
        state: true,
        multiIndex: defaults.defaultsubjectclassify,
        overt: defaults.defaultsubjectovet,
        ['multiArray[1]']:config.setclasslay[defaults.defaultsubjectclassify[0]].minclass
      })
      if (defaults.Numberofreports >= 100) {
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
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column === 0){
      data.multiIndex[1] = 0;
    }
    for (let i = 0; i < config.maxclass.length; i++) {
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
  oninputremarks: function (e) {
    this.setData({
      remarks: e.detail.value.trim()
    })
  },
  oninput: function (e){
    if (e.detail.value.trim() !== ''){
      this.setData({
        ['options[' + e.target.id + ']']: { message: e.detail.value },
      })
    }
  },
  switch1Change: function (e){
    this.setData({
      overt: e.detail.value
    })
  },
  bindPickerAnswer: function (e) {
    this.setData({
      indexanswer: e.detail.value
    })
  },
  onseecss: function (){
    wx.chooseImage({
      count:1,
      success:  (res) => {
        var tempFilePaths = res.tempFilePaths
        if (res.tempFiles[0].size >= 5000000){
          wx.showModal({
            title: '',
            showCancel:false,
            content: '上传的图片大小不能大于5M',
            success: function (res) {
            }
          })
        }
        else{
          this.setData({
            imgurl: tempFilePaths[0]
          })
        }
      }
    })
  },
  onsubmission: function(){
    if (!this.verification()){
      return
    }
    if (this.data.submissionstate) {
      this.setData({
        submissionstate: false
      })
    }
    else{
      return
    }
    if (this.data.imgurl !== '../../images/upload.png'){
      let uploadTask = wx.uploadFile({
        url: config.server +'xcx/uploadimage',
        filePath: this.data.imgurl,
        name: 'file',
        success: (res) => {
          this.setData({
            assets: res.data
          })
          wx.showLoading({
            title: '题目上传中',
          })
          this.submiss()
        }
      })
      uploadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: '上传中 ' + res.progress + '%',
        })
      })
    }
    else{
      this.submiss()
    } 
  },
  verification: function(){
    let classlay = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
    let state = true;
    let content = '';
    let sun=0;
    for (let i = 0; i < this.data.options.length;i++){
      if (this.data.options[i] === 0){
        sun+=1;
      }
    }
    if (this.data.title.trim() === ''){
      state = false
      content = '题目必须填写'
    }
    else if(this.data.title.length > 150) {
      state = false
      content = '题目不能超过150字'
    }
    else if (sun > 2) {
      state = false
      content = '选项最少填写二个'
    }
    else if (this.data.indexanswer == 4) {
      state = false
      content = '请设置答案项，注意设置您的题目相应分类以及是否公开'
    }
    else if (this.data.options[this.data.indexanswer] === 0) {
      state = false
      content = '设置为答案的选项为空'
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
  submiss: function () {
    
    this.setData({
      ['options['+this.data.indexanswer+'].answar']: true
    })
    let userid='' 
    wx.getStorage({
      key: 'login_key',
      success: (res) => {
        let classlay = this.data.multiArray[1][this.data.multiIndex[1]] || this.data.multiArray[0][this.data.multiIndex[0]]
        wx.request({
          url: config.server +'xcx/setsubject.php',
          method: 'POST',
          data: {
            "title": this.data.title,
            "options": this.data.options,
            "remarks": this.data.remarks,
            "classify": classlay,
            "assets": this.data.assets,
            "userid": res.data,
            "username": this.data.userInfo.nickName,
            "overt": this.data.overt,
          },
          success: (res) => {
            if (res.data === 1){
              wx.hideLoading()
              
              wx.showModal({
                title: '',
                content: '提交成功，可以前往我的题目查看',
                cancelText:'返回',
                cancelColor:'#fb7299',
                confirmText:'继续出题',
                success: (res)=> {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../setsubject/setsubject'
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
            else{
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
})
