//index.js
//获取应用实例
const app = getApp()
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
Page({
  data: {
    imgurl: '../../images/upload.png',
    userid:'',
    title:'',
    arrayanswer: ['选项一', '选项二', '选项三', '选项四','未设置'],
    indexanswer: 4,
    options:[0,0,0,0],
    overt: false,
    assets:'',
    multiArray: [['娱乐', '生活', '职业', '综合'], config.classlay[0].minclass],
    multiIndex: [0, 0],
    state:false
  },
  onLoad: function (){
    api.getinformation().then((data)=>{
      let defaults = data.data
      if (defaults.defaultsubjectclassify[0] === 3) {
        this.setData({
          ['multiArray[' + 1 + ']']: [],
        })
      }
      this.setData({
        state: true,
        multiIndex: defaults.defaultsubjectclassify[0] === 3 ? [3] : defaults.defaultsubjectclassify,
        overt: defaults.defaultsubjectovet,
        ['multiArray[1]']: defaults.defaultsubjectclassify[0] === 3 ? [] : config.classlay[defaults.defaultsubjectclassify[0]].minclass
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
  oninput: function (e){
    this.setData({
        ['options[' + e.target.id +']']: { message: e.detail.value},
    })
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
    if (this.data.imgurl !== '../../images/upload.png'){
      wx.showLoading({
        title: '图片上传中',
      })
      wx.uploadFile({
        url: config.server +'xcx/uploadimage', //仅为示例，非真实的接口地址
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
    if(this.data.title === ''){
      state = false
      content = '题目必须填写'
    }
    else if(this.data.title.length > 100) {
      state = false
      content = '题目不能超过100字'
    }
    else if (sun > 2) {
      state = false
      content = '选项最少填写二个'
    }
    else if (this.data.indexanswer == 4) {
      state = false
      content = '请设置答案项'
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
            "classify": classlay,
            "assets": this.data.assets,
            "userid": res.data,
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
