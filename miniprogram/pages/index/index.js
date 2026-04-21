// pages/index/index.js
const app = getApp()

Page({
  data: {
    isWorking: false,
    checkInStatus: 'unchecked', // unchecked, checked
    checkOutStatus: 'unchecked',
    currentDate: '',
    currentTime: '',
    taskList: [
      {
        id: 1,
        name: '项目A-核心算法开发',
        progress: 30,
        totalHours: 488,
        filledHours: 146,
        filledToday: false
      },
      {
        id: 2,
        name: '项目B-前端界面开发',
        progress: 40,
        totalHours: 388,
        filledHours: 100,
        filledToday: true
      },
      {
        id: 3,
        name: '项目C-测试验证',
        progress: 40,
        totalHours: 288,
        filledHours: 188,
        filledToday: false
      }
    ]
  },

  onLoad() {
    this.updateDateTime()
    this.loadTodayStatus()
    // 每秒更新时间
    setInterval(() => {
      this.updateDateTime()
    }, 1000)
  },

  onShow() {
    this.loadTodayStatus()
  },

  // 更新日期时间
  updateDateTime() {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[now.getDay()]
    
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    
    this.setData({
      currentDate: `${month}月${day}日 ${weekDay}`,
      currentTime: `${hours}:${minutes}:${seconds}`
    })
  },

  // 加载今天的打卡状态
  loadTodayStatus() {
    const today = new Date().toDateString()
    const checkInTime = wx.getStorageSync('checkInTime')
    const checkOutTime = wx.getStorageSync('checkOutTime')
    const savedDate = wx.getStorageSync('checkDate')
    
    if (savedDate === today) {
      this.setData({
        checkInStatus: checkInTime ? 'checked' : 'unchecked',
        checkOutStatus: checkOutTime ? 'checked' : 'unchecked',
        isWorking: checkInTime && !checkOutTime
      })
    } else {
      // 新的一天，重置状态
      wx.removeStorageSync('checkInTime')
      wx.removeStorageSync('checkOutTime')
      wx.setStorageSync('checkDate', today)
      this.setData({
        checkInStatus: 'unchecked',
        checkOutStatus: 'unchecked',
        isWorking: false
      })
    }
  },

  // 切换打卡状态
  toggleClock() {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    if (!this.data.isWorking) {
      // 上班打卡
      wx.showModal({
        title: '确认上班打卡',
        content: `当前时间：${timeStr}`,
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('checkInTime', timeStr)
            this.setData({
              isWorking: true,
              checkInStatus: 'checked'
            })
            wx.showToast({
              title: '上班打卡成功',
              icon: 'success'
            })
            // 记录打卡日志
            this.saveCheckLog('checkIn', timeStr)
          }
        }
      })
    } else {
      // 下班打卡
      wx.showModal({
        title: '确认下班打卡',
        content: `当前时间：${timeStr}`,
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('checkOutTime', timeStr)
            this.setData({
              isWorking: false,
              checkOutStatus: 'checked'
            })
            wx.showToast({
              title: '下班打卡成功',
              icon: 'success'
            })
            // 记录打卡日志
            this.saveCheckLog('checkOut', timeStr)
          }
        }
      })
    }
  },

  // 保存打卡日志
  saveCheckLog(type, time) {
    const logs = wx.getStorageSync('checkLogs') || []
    const today = new Date().toDateString()
    
    logs.unshift({
      date: today,
      type: type,
      time: time,
      timestamp: Date.now()
    })
    
    // 只保留最近30天的记录
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const filteredLogs = logs.filter(log => log.timestamp > thirtyDaysAgo)
    
    wx.setStorageSync('checkLogs', filteredLogs)
  },

  // 填报工时
  fillWorkHour(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/work-hour/work-hour?projectId=${item.id}&projectName=${item.name}`
    })
  },

  // 跳转到申请页面
  goToApply() {
    wx.showToast({
      title: '申请功能开发中',
      icon: 'none'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadTodayStatus()
    wx.stopPullDownRefresh()
  }
})
