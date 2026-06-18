// ========================================
// 作品管理系统 - 全局配置
// ========================================

export const config = {
  /** API 基础地址 */
  apiBaseUrl: import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',

  /** 应用名称 */
  appName: '作品管理系统',

  /** 默认语言 */
  defaultLang: 'zh-CN',

  /** 上传限制 */
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['jpg', 'png', 'webp'],
    maxImageCount: 9
  },

  /** 分页 */
  pagination: {
    defaultPageSize: 20
  },

  /** 作品分类预设 */
  workCategories: ['UI设计', 'UX研究', '品牌视觉', '插画', '动效', '其他'],

  /** AI工具预设 */
  aiTools: ['Midjourney', 'DALL·E 3', 'Stable Diffusion', 'Leonardo', '其他']
}