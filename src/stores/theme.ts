// ========================================
// 作品管理系统 - 主题 Store
// ========================================
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { TThemeMode } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<TThemeMode>('light')

  function initTheme() {
    // #ifdef H5
    const saved = uni.getStorageSync('theme-mode') as TThemeMode | ''
    if (saved) {
      currentTheme.value = saved
    } else {
      // 跟随系统
      const darkModeMq = window.matchMedia('(prefers-color-scheme: dark)')
      currentTheme.value = darkModeMq.matches ? 'dark' : 'light'
      darkModeMq.addEventListener('change', (e) => {
        if (!uni.getStorageSync('theme-mode')) {
          currentTheme.value = e.matches ? 'dark' : 'light'
        }
      })
    }
    applyTheme()
    // #endif

    // #ifdef MP-WEIXIN
    const saved = uni.getStorageSync('theme-mode') as TThemeMode | ''
    if (saved) {
      currentTheme.value = saved
    } else {
      const sysInfo = uni.getSystemInfoSync()
      // 微信小程序暂无法直接获取系统暗色模式，默认亮色
      currentTheme.value = 'light'
    }
    applyTheme()
    // #endif
  }

  function setTheme(mode: TThemeMode) {
    currentTheme.value = mode
    uni.setStorageSync('theme-mode', mode)
    applyTheme()
  }

  function toggleTheme() {
    const next = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  function applyTheme() {
    // #ifdef H5
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    applyNavigationBarTheme()
    // #endif
  }

  function applyNavigationBarTheme() {
    // #ifdef H5
    const isDarkMode = currentTheme.value === 'dark'
    const navBar = document.querySelector('.uni-page-head') as HTMLElement | null
    if (navBar) {
      navBar.style.backgroundColor = isDarkMode ? '#141414' : '#FFFFFF'
      navBar.style.color = isDarkMode ? '#DCDCDC' : '#000000'
      const titleEl = navBar.querySelector('.uni-page-head__title') as HTMLElement | null
      if (titleEl) {
        titleEl.style.color = isDarkMode ? '#DCDCDC' : '#000000'
      }
    }
    // 同时处理所有页面的导航栏（reLaunch 会创建多个）
    document.querySelectorAll('.uni-page-head').forEach((el) => {
      const nav = el as HTMLElement
      nav.style.backgroundColor = isDarkMode ? '#141414' : '#FFFFFF'
      nav.style.color = isDarkMode ? '#DCDCDC' : '#000000'
      const titleEl = nav.querySelector('.uni-page-head__title') as HTMLElement | null
      if (titleEl) {
        titleEl.style.color = isDarkMode ? '#DCDCDC' : '#000000'
      }
    })
    // #endif
  }

  const isDark = ref(false)
  watch(currentTheme, (val) => {
    isDark.value = val === 'dark'
  }, { immediate: true })

  return {
    currentTheme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme
  }
})