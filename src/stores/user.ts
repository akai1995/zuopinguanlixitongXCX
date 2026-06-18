// ========================================
// 作品管理系统 - 用户 Store
// ========================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUserInfo } from '@/types'
import { useWorksStore } from './works'
import { useAiImagesStore } from './aiImages'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserInfo>({
    id: 'u1',
    nickname: '设计师小王',
    phone: '138****8888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  })

  const isLogin = computed(() => !!userInfo.value.id)

  // 统计数据（聚合作品和AI生图）
  const stats = computed(() => {
    const worksStore = useWorksStore()
    const aiImagesStore = useAiImagesStore()

    return {
      totalWorks: worksStore.totalCount,
      totalAiImages: aiImagesStore.totalCount,
      recent30DaysNew: worksStore.recent30DaysNew + aiImagesStore.recent30DaysNew
    }
  })

  function updateUserInfo(data: Partial<IUserInfo>) {
    userInfo.value = { ...userInfo.value, ...data }
  }

  return {
    userInfo,
    isLogin,
    stats,
    updateUserInfo
  }
})