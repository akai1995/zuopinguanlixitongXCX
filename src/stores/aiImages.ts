// ========================================
// 作品管理系统 - AI 生图 Store
// ========================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IAiImage, IFilterState } from '@/types'

export const useAiImagesStore = defineStore('aiImages', () => {
  const aiImages = ref<IAiImage[]>([])
  const filter = ref<IFilterState>({
    category: [],
    keyword: '',
    sort: 'newest'
  })

  // AI 工具筛选（独立于分类）
  const aiToolFilter = ref<string[]>([])

  // 预设 AI 工具
  const presetAiTools = ['Midjourney', 'DALL·E 3', 'Stable Diffusion', 'Leonardo', '其他']

  // 预设分类标签
  const presetCategories = ['写实', '插画', '3D', '抽象']

  const filteredImages = computed(() => {
    let list = [...aiImages.value]

    // 分类筛选
    if (filter.value.category.length > 0) {
      list = list.filter(img => filter.value.category.includes(img.category))
    }

    // AI 工具筛选
    if (aiToolFilter.value.length > 0) {
      list = list.filter(img => aiToolFilter.value.includes(img.aiTool))
    }

    // 关键词搜索
    if (filter.value.keyword) {
      const kw = filter.value.keyword.toLowerCase()
      list = list.filter(img =>
        img.title.toLowerCase().includes(kw) ||
        img.prompt.toLowerCase().includes(kw)
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

  const totalCount = computed(() => aiImages.value.length)

  const recent30DaysNew = computed(() => {
    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
    return aiImages.value.filter(img => new Date(img.createdAt).getTime() > thirtyDaysAgo).length
  })

  const topAiTool = computed(() => {
    const counts: Record<string, number> = {}
    aiImages.value.forEach(img => {
      counts[img.aiTool] = (counts[img.aiTool] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || '无'
  })

  function setFilter(newFilter: Partial<IFilterState>) {
    Object.assign(filter.value, newFilter)
  }

  function setAiToolFilter(tools: string[]) {
    aiToolFilter.value = tools
  }

  function addAiImage(image: IAiImage) {
    aiImages.value.unshift(image)
  }

  function updateAiImage(id: string, data: Partial<IAiImage>) {
    const idx = aiImages.value.findIndex(img => img.id === id)
    if (idx !== -1) {
      aiImages.value[idx] = { ...aiImages.value[idx], ...data, updatedAt: new Date().toISOString() }
    }
  }

  function deleteAiImage(id: string) {
    aiImages.value = aiImages.value.filter(img => img.id !== id)
  }

  function getAiImageById(id: string): IAiImage | undefined {
    return aiImages.value.find(img => img.id === id)
  }

  // 初始化模拟数据
  function initMockData() {
    const mockImages: IAiImage[] = [
      {
        id: 'a1',
        title: '赛博朋克城市夜景',
        coverImage: 'https://picsum.photos/id/111/600/338',
        images: [
          'https://picsum.photos/id/111/600/338',
          'https://picsum.photos/id/119/600/338'
        ],
        aiTool: 'Midjourney',
        prompt: 'A futuristic cyberpunk city at night, neon lights reflecting on wet streets, flying cars, cinematic lighting, ultra detailed, 8K, photorealistic, dramatic shadows',
        negativePrompt: 'blurry, low quality, people, text, watermark, cartoon, anime',
        parameters: '--ar 16:9 --v 6 --stylize 250 --q 2',
        category: '写实',
        isPublic: true,
        createdAt: '2026-06-09T18:30:00Z',
        updatedAt: '2026-06-09T18:30:00Z'
      },
      {
        id: 'a2',
        title: '梦幻森林精灵',
        coverImage: 'https://picsum.photos/id/119/600/338',
        images: [
          'https://picsum.photos/id/119/600/338',
          'https://picsum.photos/id/129/600/338'
        ],
        aiTool: 'Stable Diffusion',
        prompt: 'A beautiful forest elf with glowing translucent wings, sitting on a mushroom in a magical enchanted forest, magical atmosphere, volumetric lighting, fantasy art style, intricate details, soft colors',
        negativePrompt: 'ugly, deformed, lowres, bad anatomy, blurry, realistic, photograph',
        parameters: 'Steps: 30, CFG: 7, Size: 768x1344, Model: AnythingV4.5',
        category: '插画',
        isPublic: true,
        createdAt: '2026-06-07T14:20:00Z',
        updatedAt: '2026-06-07T14:20:00Z'
      },
      {
        id: 'a3',
        title: '3D卡通角色设计',
        coverImage: 'https://picsum.photos/id/129/600/338',
        images: [
          'https://picsum.photos/id/129/600/338',
          'https://picsum.photos/id/169/600/338'
        ],
        aiTool: 'DALL·E 3',
        prompt: 'A cute 3D cartoon character, chibi style, big sparkling eyes, soft pastel colors, clean design, game asset style, friendly smile, multiple poses',
        negativePrompt: '',
        parameters: '--style vivid --ar 4:5',
        category: '3D',
        isPublic: true,
        createdAt: '2026-06-03T10:15:00Z',
        updatedAt: '2026-06-03T10:15:00Z'
      },
      {
        id: 'a4',
        title: '抽象几何艺术',
        coverImage: 'https://picsum.photos/id/169/600/338',
        images: [
          'https://picsum.photos/id/169/600/338',
          'https://picsum.photos/id/177/600/338'
        ],
        aiTool: 'Midjourney',
        prompt: 'Abstract geometric patterns, vibrant primary colors, minimalist composition, Bauhaus style, modern art, clean lines, geometric abstraction',
        negativePrompt: 'realistic, photographic, text, people, landscape',
        parameters: '--ar 1:1 --v 6 --stylize 100',
        category: '抽象',
        isPublic: true,
        createdAt: '2026-05-25T09:00:00Z',
        updatedAt: '2026-05-25T09:00:00Z'
      },
      {
        id: 'a5',
        title: '超写实狮子肖像',
        coverImage: 'https://picsum.photos/id/177/600/338',
        images: [
          'https://picsum.photos/id/177/600/338',
          'https://picsum.photos/id/188/600/338'
        ],
        aiTool: 'Leonardo',
        prompt: 'Ultra realistic portrait of a majestic male lion, dramatic golden hour lighting, fine details in fur, intense eyes, wildlife photography style, shallow depth of field',
        negativePrompt: 'cartoon, painting, illustration, blurry, low quality',
        parameters: 'Alchemy: Yes, Resolution: 1024x1024, Style: Photorealistic',
        category: '写实',
        isPublic: false,
        createdAt: '2026-05-18T16:45:00Z',
        updatedAt: '2026-05-18T16:45:00Z'
      },
      {
        id: 'a6',
        title: '未来科技飞船',
        coverImage: 'https://picsum.photos/id/188/600/338',
        images: [
          'https://picsum.photos/id/188/600/338',
          'https://picsum.photos/id/192/600/338'
        ],
        aiTool: 'Midjourney',
        prompt: 'Futuristic sci-fi spaceship, detailed design, glowing blue engines, flying through space with stars and nebula, cinematic lighting, hyper detailed, 8K',
        negativePrompt: 'cartoon, low quality, blurry, text, watermark',
        parameters: '--ar 16:9 --v 6 --stylize 300',
        category: '写实',
        isPublic: true,
        createdAt: '2026-05-10T11:30:00Z',
        updatedAt: '2026-05-10T11:30:00Z'
      },
      {
        id: 'a7',
        title: '日式浮世绘风格',
        coverImage: 'https://picsum.photos/id/192/600/338',
        images: [
          'https://picsum.photos/id/192/600/338',
          'https://picsum.photos/id/200/600/338'
        ],
        aiTool: 'Stable Diffusion',
        prompt: 'Japanese ukiyo-e woodblock print style, Mount Fuji with cherry blossoms, traditional Japanese art, vibrant colors, classic composition',
        negativePrompt: 'modern, realistic, photograph, digital art',
        parameters: 'Steps: 25, CFG: 6, Size: 768x1024, Model: Ukiyo-e Diffusion',
        category: '插画',
        isPublic: true,
        createdAt: '2026-05-05T14:00:00Z',
        updatedAt: '2026-05-05T14:00:00Z'
      },
      {
        id: 'a8',
        title: '可爱猫咪咖啡馆',
        coverImage: 'https://picsum.photos/id/200/600/338',
        images: [
          'https://picsum.photos/id/200/600/338',
          'https://picsum.photos/id/201/600/338'
        ],
        aiTool: 'DALL·E 3',
        prompt: 'Cute cartoon cats running a cozy coffee shop, kawaii anime style, pastel colors, warm atmosphere, adorable characters',
        negativePrompt: '',
        parameters: '--style cute',
        category: '插画',
        isPublic: true,
        createdAt: '2026-04-28T09:20:00Z',
        updatedAt: '2026-04-28T09:20:00Z'
      }
    ]
    aiImages.value = mockImages
  }

  return {
    aiImages,
    filter,
    aiToolFilter,
    presetAiTools,
    presetCategories,
    filteredImages,
    totalCount,
    recent30DaysNew,
    topAiTool,
    setFilter,
    setAiToolFilter,
    addAiImage,
    updateAiImage,
    deleteAiImage,
    getAiImageById,
    initMockData
  }
})