<template>
  <view class="ai-page">
    <!-- 搜索与分类模块 - 全屏宽度 -->
    <view class="search-filter-module">
      <view class="search-filter-module__inner">
        <!-- 搜索栏 -->
        <SearchBar v-model="searchKeyword" placeholder="搜索标题或提示词" @search="onSearch" />

        <!-- 分类标签筛选 -->
        <FilterBar
          :items="categoryItems"
          :selected="selectedCategories"
          @update:selected="onCategoryChange"
        />
      </view>
    </view>

    <view class="ai-page__content page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
      <!-- AI 工具筛选模块 -->
      <view class="ai-tool-filter">
        <scroll-view scroll-x class="ai-tool-filter__scroll" :show-scrollbar="false">
          <view class="ai-tool-filter__nav">
            <view
              v-for="(item, index) in aiToolItems"
              :key="item.value"
              :class="['ai-tool-filter__item', { 'ai-tool-filter__item--active': item.value === '' ? selectedAiTools.length === 0 : selectedAiTools[0] === item.value }]"
              @tap="onAiToolChange([item.value])"
            >
              <text class="ai-tool-filter__text">{{ item.label }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- AI生图列表 -->
      <view v-if="filteredImages.length > 0" class="work-grid">
        <AiImageCard
          v-for="img in filteredImages"
          :key="img.id"
          :title="img.title"
          :cover-image="img.coverImage"
          :prompt="img.prompt"
          @tap="goToDetail(img.id)"
        />
      </view>
      <EmptyState v-else icon="&#x1F4F7;" text="暂无AI生图" sub-text="点击右下角按钮添加AI生图" />

      <!-- 自定义TabBar -->
      <CustomTabBar />
    </view>

    <!-- 添加按钮 -->
    <view class="fab" @tap="openUploadPage">
      <text class="fab__icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAiImagesStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import CustomTabBar from '@/custom-tab-bar/index.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import EmptyState from '@/components/EmptyState.vue'
import AiImageCard from '@/components/AiImageCard.vue'

const aiImagesStore = useAiImagesStore()
const { pageVisible } = usePageTransition()

const STORAGE_KEY = 'ai-images-filter'

interface FilterState {
  aiTools: string[]
  categories: string[]
  keyword: string
}

function loadFilterState(): FilterState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('Failed to load filter state:', e)
  }
  return { aiTools: [], categories: [], keyword: '' }
}

function saveFilterState(state: FilterState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to save filter state:', e)
  }
}

const savedState = loadFilterState()
const searchKeyword = ref(savedState.keyword)
const selectedAiTools = ref<string[]>(savedState.aiTools)
const selectedCategories = ref<string[]>(savedState.categories)

const aiTools = aiImagesStore.presetAiTools
const presetCategories = aiImagesStore.presetCategories

const aiToolItems = computed(() => [
  { label: '全部', value: '' },
  ...aiTools.map(t => ({ label: t, value: t }))
])
const categoryItems = computed(() => presetCategories.map(c => ({ label: c, value: c })))

const filteredImages = computed(() => {
  let list = [...aiImagesStore.aiImages]

  if (selectedAiTools.value.length > 0) {
    list = list.filter(img => selectedAiTools.value.includes(img.aiTool))
  }
  
  if (selectedCategories.value.length > 0) {
    list = list.filter(img => selectedCategories.value.includes(img.category))
  }
  
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(img =>
      img.title.toLowerCase().includes(kw) ||
      img.prompt.toLowerCase().includes(kw)
    )
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
})

function onAiToolChange(tools: string[]) {
  selectedAiTools.value = tools.filter(t => t !== '')
  saveFilterState({
    aiTools: selectedAiTools.value,
    categories: selectedCategories.value,
    keyword: searchKeyword.value
  })
}
function onCategoryChange(cats: string[]) { 
  selectedCategories.value = cats 
  saveFilterState({
    aiTools: selectedAiTools.value,
    categories: selectedCategories.value,
    keyword: searchKeyword.value
  })
}
function onSearch() {
  saveFilterState({
    aiTools: selectedAiTools.value,
    categories: selectedCategories.value,
    keyword: searchKeyword.value
  })
}

function openUploadPage() {
  uni.navigateTo({ url: '/pages/ai-images/upload' })
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/ai-images/detail?id=${id}` })
}

onMounted(() => {
  if (aiImagesStore.aiImages.length === 0) {
    aiImagesStore.initMockData()
  }
})
</script>

<style lang="scss" scoped>
.ai-page {
  min-height: 100vh;
  
  &__content {
    min-height: 100vh;
    padding: 96px $spacing-md 36px;
  }
}

// ----- 搜索筛选模块 -----
.search-filter-module {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  background: $bg-card-light;
  border-radius: 0;
  padding: calc(44px + #{$spacing-md}) 0 0;
  margin: 0;
  box-shadow: $shadow-card;
  
  [data-theme='dark'] & {
    background: $bg-card-dark;
    box-shadow: $shadow-card-dark;
  }
  
  &__inner {
    padding: 0 $spacing-md;
    width: 100%;
    box-sizing: border-box;
  }
}

// ----- AI 工具筛选模块 -----
.ai-tool-filter {
  padding: 0;
  margin-bottom: $spacing-md;
  overflow: hidden;
  
  &__scroll {
    width: 100%;
    white-space: nowrap;
  }
  
  &__nav {
    display: inline-flex;
    gap: $spacing-sm;
    padding: 0;
  }
  
  &__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px $spacing-md;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    border-radius: 20px;
    background-color: $bg-card-light;
    color: $text-secondary-light;
    margin: 0;
    flex-shrink: 0;
    
    [data-theme='dark'] & {
      background-color: $bg-card-dark;
      color: $text-secondary-dark;
      
      &--active {
        background-color: $color-primary;
        color: #FFFFFF;
      }
    }
    
    &--active {
      background-color: $color-primary;
      color: #FFFFFF;
    }
  }
  
  &__text {
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    color: inherit;
    white-space: nowrap;
    line-height: 1.5;
  }
}

.fab {
  position: fixed;
  right: $spacing-lg;
  bottom: calc(#{$tab-height} + #{$safe-bottom} + 28px);
  width: 52px;
  height: 52px;
  border-radius: $radius-round;
  background: $color-primary;
  @include flex-center;
  box-shadow: 0 4px 16px rgba(25, 98, 236, 0.4);
  z-index: 10;
  
  &:active { transform: scale(0.9); }
  
  &__icon { font-size: 28px; color: #FFFFFF; line-height: 1; }
}

</style>