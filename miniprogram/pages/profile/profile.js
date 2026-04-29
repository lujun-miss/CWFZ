// pages/profile/profile.js
Page({
  data: {
    userInfo: {
      name: '卢君',
      role: '研发工程师',
      department: '装饰销售事业部',
      totalHours: 128,
      projectCount: 15,
      attendanceRate: '98%'
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo() {
    // 从本地存储或服务器加载用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  // 工时管理
  goToWorkHourManage() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 项目管理
  goToProjectManage() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 考勤记录
  goToAttendanceRecord() {
    wx.switchTab({
      url: '/pages/records/records'
    })
  },

  // 系统设置
  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 帮助中心
  goToHelp() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 关于我们
  goToAbout() {
    wx.showModal({
      title: '关于我们',
      content: '研知π v1.0.0\n\n专为研发企业打造的费用管理工具',
      showCancel: false
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            success: () => {
              // 可以跳转到登录页面
              // wx.redirectTo({ url: '/pages/login/login' })
            }
          })
        }
      }
    })
  }
})
