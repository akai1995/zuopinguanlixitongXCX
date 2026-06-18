// ========================================
// 作品管理系统 - 作品 Store
// ========================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IWork, IFilterState } from '@/types'

export const useWorksStore = defineStore('works', () => {
  const works = ref<IWork[]>([])
  const filter = ref<IFilterState>({
    category: [],
    keyword: '',
    sort: 'newest'
  })

  // 预设分类标签
  const presetCategories = ['UI设计', 'UX研究', '品牌视觉', '插画', '动效', '其他']

  // 所有自定义分类（包含预设 + 用户自定义）
  const allCategories = ref<string[]>([...presetCategories])

  const filteredWorks = computed(() => {
    let list = [...works.value]

    // 分类筛选
    if (filter.value.category.length > 0) {
      list = list.filter(w => filter.value.category.includes(w.category))
    }

    // 关键词搜索
    if (filter.value.keyword) {
      const kw = filter.value.keyword.toLowerCase()
      list = list.filter(w =>
        w.title.toLowerCase().includes(kw) ||
        w.description.toLowerCase().includes(kw)
      )
    }

    // 排序
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return filter.value.sort === 'newest' ? timeB - timeA : timeA - timeB
    })

    return list
  })

  // 获取作品总数
  const totalCount = computed(() => works.value.length)

  // 近30天新增数量
  const recent30DaysNew = computed(() => {
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
    return works.value.filter(w => new Date(w.createdAt).getTime() > thirtyDaysAgo).length
  })

  // 最常用分类标签
  const topCategory = computed(() => {
    const counts: Record<string, number> = {}
    works.value.forEach(w => {
      counts[w.category] = (counts[w.category] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || '无'
  })

  function setFilter(newFilter: Partial<IFilterState>) {
    Object.assign(filter.value, newFilter)
  }

  function addWork(work: IWork) {
    works.value.unshift(work)
  }

  function updateWork(id: string, data: Partial<IWork>) {
    const idx = works.value.findIndex(w => w.id === id)
    if (idx !== -1) {
      works.value[idx] = { ...works.value[idx], ...data, updatedAt: new Date().toISOString() }
    }
  }

  function deleteWork(id: string) {
    works.value = works.value.filter(w => w.id !== id)
  }

  function getWorkById(id: string): IWork | undefined {
    return works.value.find(w => w.id === id)
  }

  // 初始化模拟数据
  function initMockData() {
    const mockWorks: IWork[] = [
      {
        id: 'w1',
        title: '电商APP界面设计',
        coverImage: 'https://picsum.photos/id/26/600/338',
        images: [
          'https://picsum.photos/id/26/600/338',
          'https://picsum.photos/id/48/600/338',
          'https://picsum.photos/id/65/600/338'
        ],
        description: '一款面向Z世代的潮流电商应用，聚焦个性化推荐和社交购物体验。采用深色主题设计，配合流畅的动画过渡效果。',
        category: 'UI设计',
        year: 2026,
        projectLink: 'https://dribbble.com/shots/2345678-E-commerce-App-Design',
        isPublic: true,
        createdAt: '2026-06-08T10:30:00Z',
        updatedAt: '2026-06-08T10:30:00Z'
      },
      {
        id: 'w2',
        title: '科技品牌视觉识别系统',
        coverImage: 'https://picsum.photos/id/48/600/338',
        images: [
          'https://picsum.photos/id/48/600/338',
          'https://picsum.photos/id/180/600/338'
        ],
        description: '为科技创新企业设计的完整品牌视觉识别系统，包含LOGO、色彩体系、字体规范及应用延展。',
        category: '品牌视觉',
        year: 2026,
        projectLink: '',
        isPublic: true,
        createdAt: '2026-06-05T14:20:00Z',
        updatedAt: '2026-06-05T14:20:00Z'
      },
      {
        id: 'w3',
        title: '用户体验研究报告',
        coverImage: 'https://picsum.photos/id/180/600/338',
        images: [
          'https://picsum.photos/id/180/600/338',
          'https://picsum.photos/id/160/600/338'
        ],
        description: '基于可用性测试和深度用户访谈的产品体验优化方案，包含用户画像、旅程地图和改进建议。',
        category: 'UX研究',
        year: 2026,
        projectLink: '',
        isPublic: true,
        createdAt: '2026-05-28T09:15:00Z',
        updatedAt: '2026-06-01T16:45:00Z'
      },
      {
        id: 'w4',
        title: '插画系列 - 城市记忆',
        coverImage: 'https://picsum.photos/id/160/600/338',
        images: [
          'https://picsum.photos/id/160/600/338',
          'https://picsum.photos/id/366/600/338',
          'https://picsum.photos/id/429/600/338'
        ],
        description: '以城市生活为主题的系列插画作品，展现现代都市的人文情怀与日常生活中的温暖瞬间。',
        category: '插画',
        year: 2026,
        projectLink: 'https://www.behance.net/gallery/12345678/City-Memories-Illustration',
        isPublic: true,
        createdAt: '2026-05-20T11:00:00Z',
        updatedAt: '2026-05-20T11:00:00Z'
      },
      {
        id: 'w5',
        title: '微交互动效设计合集',
        coverImage: 'https://picsum.photos/id/366/600/338',
        images: [
          'https://picsum.photos/id/366/600/338',
          'https://picsum.photos/id/1/600/338'
        ],
        description: '包含按钮悬停、页面切换、加载动画等多个微交互动效设计，提升用户体验的细节质感。',
        category: '动效',
        year: 2026,
        projectLink: '',
        isPublic: false,
        createdAt: '2026-05-15T15:30:00Z',
        updatedAt: '2026-05-15T15:30:00Z'
      },
      {
        id: 'w6',
        title: '金融APP仪表盘重构',
        coverImage: 'https://picsum.photos/id/1/600/338',
        images: [
          'https://picsum.photos/id/1/600/338',
          'https://picsum.photos/id/9/600/338'
        ],
        description: '对传统金融APP进行现代化改造，突出数据可视化与操作便捷性，采用深色模式设计。',
        category: 'UI设计',
        year: 2026,
        projectLink: 'https://dribbble.com/shots/2345679-Finance-Dashboard-Redesign',
        isPublic: true,
        createdAt: '2026-05-10T08:00:00Z',
        updatedAt: '2026-05-10T08:00:00Z'
      },
      {
        id: 'w7',
        title: '教育平台界面设计',
        coverImage: 'https://picsum.photos/id/9/600/338',
        images: [
          'https://picsum.photos/id/9/600/338',
          'https://picsum.photos/id/20/600/338'
        ],
        description: '在线教育平台界面设计，包含课程浏览、学习进度追踪、视频播放等核心功能模块。',
        category: 'UI设计',
        year: 2026,
        projectLink: '',
        isPublic: true,
        createdAt: '2026-04-28T13:45:00Z',
        updatedAt: '2026-04-28T13:45:00Z'
      },
      {
        id: 'w8',
        title: '品牌吉祥物设计',
        coverImage: 'https://picsum.photos/id/20/600/338',
        images: [
          'https://picsum.photos/id/20/600/338',
          'https://picsum.photos/id/26/600/338'
        ],
        description: '为科技公司设计的可爱吉祥物形象，包含多种表情和动作姿态，便于品牌传播。',
        category: '品牌视觉',
        year: 2026,
        projectLink: '',
        isPublic: true,
        createdAt: '2026-04-15T10:20:00Z',
        updatedAt: '2026-04-15T10:20:00Z'
      },
      {
        id: 'w9',
        title: '智能家居APP全案设计',
        coverImage: 'https://picsum.photos/id/42/600/338',
        images: [
          'https://picsum.photos/id/42/600/338',
          'https://picsum.photos/id/43/600/338',
          'https://picsum.photos/id/44/600/338',
          'https://picsum.photos/id/45/600/338'
        ],
        description: '为智能家居品牌打造的完整APP设计方案，包含设备控制、场景模式、能源管理等核心功能模块。',
        category: 'UI设计',
        year: 2026,
        projectLink: '',
        isPublic: true,
        createdAt: '2026-05-20T14:30:00Z',
        updatedAt: '2026-05-20T14:30:00Z'
      }
    ]
    works.value = mockWorks
  }

  return {
    works,
    filter,
    presetCategories,
    allCategories,
    filteredWorks,
    totalCount,
    recent30DaysNew,
    topCategory,
    setFilter,
    addWork,
    updateWork,
    deleteWork,
    getWorkById,
    initMockData
  }
})