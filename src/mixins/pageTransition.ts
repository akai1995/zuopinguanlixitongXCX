import { ref, onMounted } from 'vue'

/**
 * 页面切换动画组合式函数
 * 提供进入和离开页面的柔和动画效果
 */
export function usePageTransition() {
  const pageVisible = ref(false)

  onMounted(() => {
    // 使用 requestAnimationFrame 确保 DOM 已渲染后再触发动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pageVisible.value = true
      })
    })
  })

  return {
    pageVisible
  }
}
