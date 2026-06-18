// ========================================
// 作品管理系统 - 类型定义
// ========================================

// ---------- 主题 ----------
export type TThemeMode = 'light' | 'dark'

// ---------- 作品 ----------
export interface IWork {
  id: string
  title: string
  coverImage: string
  images: string[]
  description: string
  category: string
  year: number
  projectLink: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// ---------- AI 生图 ----------
export interface IAiImage {
  id: string
  title: string
  coverImage: string
  images: string[]
  aiTool: string
  prompt: string
  negativePrompt: string
  parameters: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// ---------- 用户 ----------
export interface IUserInfo {
  id: string
  nickname: string
  phone: string
  avatar: string
}

// ---------- 统计 ----------
export interface IStatistics {
  totalWorks: number
  totalAiImages: number
  recent30DaysNew: number
  topCategory: string
  topAiTool: string
}

// ---------- 月度趋势 ----------
export interface IMonthlyTrend {
  month: string
  works: number
  aiImages: number
}

// ---------- 动态 ----------
export interface IActivity {
  id: string
  type: 'work_add' | 'work_edit' | 'ai_image_add' | 'ai_image_edit'
  title: string
  description: string
  time: string
}

// ---------- 分类标签 ----------
export interface ICategoryOption {
  label: string
  value: string
}

// ---------- 筛选条件 ----------
export interface IFilterState {
  category: string[]
  keyword: string
  sort: 'newest' | 'oldest'
}

// ---------- AI 工具选项 ----------
export interface IAiToolOption {
  label: string
  value: string
}

// ---------- 导航 Tab ----------
export interface ITabItem {
  label: string
  icon: string
  pagePath: string
}