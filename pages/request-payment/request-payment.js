

var app = getApp()

Page({
  onLoad: function() {
    var getCardata = wx.getStorageSync("GoodsCarList");
    console.log(getCardata);

    //总价格计算
    var totalData = 0;
    for (var i = 0; i < getCardata.length; i++) {
      totalData = totalData + getCardata[i].carPrice * getCardata[i].carNum;
    }


    this.setData({
      totalPrice: totalData,
      carArray: getCardata
    })
  },
  requestPayment: function() {
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function(err, openid) {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            openid
          },
          method: 'POST',
          success: function(res) {
            console.log('unified order success, response is:', res)
            var payargs = res.data.payargs
            wx.requestPayment({
              'timeStamp': '',
              'nonceStr': '',
              'package': '',
              'signType': 'MD5',
              'paySign': ''
            })

            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
      }
    })
  }
})

