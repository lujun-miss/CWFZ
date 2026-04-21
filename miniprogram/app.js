// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录成功', res.code)
      }
    })
  },
  globalData: {
    userInfo: null,
    apiBaseUrl: 'https://your-api-domain.com/api',
    version: '1.0.0'
  },
  // 全局方法：显示提示
  showToast(title, icon = 'none') {
    wx.showToast({
      title: title,
      icon: icon,
      duration: 2000
    })
  },
  // 全局方法：显示加载
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },
  // 全局方法：隐藏加载
  hideLoading() {
    wx.hideLoading()
  },
  // 全局方法：请求封装
  request(options) {
    const { url, method = 'GET', data = {}, success, fail, complete } = options
    
    wx.request({
      url: this.globalData.apiBaseUrl + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          success && success(res.data)
        } else if (res.statusCode === 401) {
          // token过期，重新登录
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          fail && fail(res)
        }
      },
      fail: (err) => {
        fail && fail(err)
        this.showToast('网络请求失败')
      },
      complete: complete
    })
  }
})
