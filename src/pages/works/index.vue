<template>
  <view class="works-page">
    <!-- 搜索与分类模块 - 全屏宽度 -->
    <view class="search-filter-module">
      <view class="search-filter-module__inner">
        <!-- 搜索栏 -->
        <SearchBar v-model="searchKeyword" placeholder="搜索作品标题或描述" @search="onSearch" />

        <!-- 分类筛选 -->
        <FilterBar
          :items="categoryItems"
          :selected="selectedCategories"
          @update:selected="onCategoryChange"
        />
      </view>
    </view>

    <view class="works-page__content page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
      <!-- 作品列表 -->
      <view v-if="filteredWorks.length > 0" class="work-grid">
        <WorkCard
          v-for="work in filteredWorks"
          :key="work.id"
          :title="work.title"
          :cover-image="work.coverImage"
          :description="work.description"
          :category="work.category"
          :date="work.createdAt"
          @tap="goToDetail(work.id)"
        />
      </view>
      <EmptyState v-else text="暂无作品" sub-text="点击右下角按钮上传作品" />

      <!-- 上传/编辑弹窗 -->
      <Modal
        :visible="modalVisible"
        :title="editingId ? '编辑作品' : '上传作品'"
        size="large"
        cancel-text="取消"
        confirm-text="保存"
        @close="closeModal"
        @confirm="onSave"
        @cancel="closeModal"
      >
        <view class="form">
          <view class="form__field">
            <text class="form__label">标题 <text class="form__required">*</text></text>
            <input class="form__input" v-model="form.title" placeholder="请输入作品标题（最多50字）" maxlength="50" />
          </view>

          <ImageUploader
            title="封面图"
            :v-model="form.coverImages"
            :max-count="1"
            tips="支持jpg/png/webp，大小≤5MB，自动裁剪1:1"
          />

          <ImageUploader
            title="作品集图片"
            :v-model="form.images"
            :max-count="9"
            tips="至少上传一张，可拖拽调整展示顺序"
          />

          <view class="form__field">
            <text class="form__label">描述</text>
            <textarea class="form__textarea" v-model="form.description" placeholder="请输入作品描述（最多500字）" maxlength="500" />
          </view>

          <view class="form__field">
            <text class="form__label">分类标签 <text class="form__required">*</text></text>
            <view class="form__category-grid">
              <text
                v-for="cat in presetCategories"
                :key="cat"
                :class="['form__category-tag', { active: form.category === cat }]"
                @tap="form.category = cat"
              >{{ cat }}</text>
            </view>
          </view>

          <view class="form__field">
            <text class="form__label">创作年份</text>
            <picker mode="date" fields="year" :value="form.year.toString()" @change="onYearChange">
              <view class="form__picker">{{ form.year || '请选择' }}</view>
            </picker>
          </view>

          <view class="form__field">
            <text class="form__label">项目链接</text>
            <input class="form__input" v-model="form.projectLink" placeholder="填写在线原型或正式产品URL" />
          </view>

          <view class="form__field form__field--row">
            <text class="form__label">是否公开</text>
            <switch :checked="form.isPublic" @change="form.isPublic = $event.detail.value" color="#1962EC" />
          </view>
        </view>
      </Modal>

      <!-- 自定义TabBar -->
      <CustomTabBar />
    </view>

    <!-- 添加按钮 -->
    <view class="fab" @tap="openUploadModal">
      <text class="fab__icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorksStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import CustomTabBar from '@/custom-tab-bar/index.vue'
import SearchBar from '@/components/SearchBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import WorkCard from '@/components/WorkCard.vue'
import Modal from '@/components/Modal.vue'
import EmptyState from '@/components/EmptyState.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import type { IWork } from '@/types'

const worksStore = useWorksStore()
const { pageVisible } = usePageTransition()

const searchKeyword = ref('')
const selectedCategories = ref<string[]>([])

onMounted(() => {})

const presetCategories = worksStore.presetCategories

const categoryItems = computed(() => [
  { label: '全部', value: '' },
  ...presetCategories.map(c => ({ label: c, value: c }))
])

const filteredWorks = computed(() => {
  let list = [...worksStore.works]

  if (selectedCategories.value.length > 0 && selectedCategories.value[0] !== '') {
    list = list.filter(w => selectedCategories.value.includes(w.category))
  }

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(w =>
      w.title.toLowerCase().includes(kw) ||
      w.description.toLowerCase().includes(kw)
    )
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
})

function onCategoryChange(cats: string[]) {
  selectedCategories.value = cats
}

function onSearch() {
  // 搜索已通过 computed 自动更新
}

// ----- 弹窗 -----
const modalVisible = ref(false)
const editingId = ref('')

const defaultForm = (): {
  title: string
  coverImages: string[]
  images: string[]
  description: string
  category: string
  year: number
  projectLink: string
  isPublic: boolean
} => ({
  title: '',
  coverImages: [],
  images: [],
  description: '',
  category: 'UI设计',
  year: new Date().getFullYear(),
  projectLink: '',
  isPublic: true
})

const form = ref(defaultForm())

function openUploadModal() {
  uni.navigateTo({
    url: '/pages/works/upload'
  })
}

function closeModal() {
  modalVisible.value = false
}

function onYearChange(e: { detail: { value: string } }) {
  form.value.year = parseInt(e.detail.value)
}

function onSave() {
  if (!form.value.title.trim()) {
    uni.showToast({ title: '请输入作品标题', icon: 'none' })
    return
  }
  if (!form.value.coverImages.length) {
    uni.showToast({ title: '请上传封面图', icon: 'none' })
    return
  }
  if (!form.value.category) {
    uni.showToast({ title: '请选择分类标签', icon: 'none' })
    return
  }

  const now = new Date().toISOString().slice(0, 10)

  if (editingId.value) {
    worksStore.updateWork(editingId.value, {
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      year: form.value.year,
      projectLink: form.value.projectLink,
      isPublic: form.value.isPublic,
      updatedAt: now
    })
    uni.showToast({ title: '更新成功', icon: 'success' })
  } else {
    worksStore.addWork({
      id: 'w' + Date.now(),
      title: form.value.title,
      coverImage: form.value.coverImages[0] || '',
      images: form.value.images,
      description: form.value.description,
      category: form.value.category,
      year: form.value.year,
      projectLink: form.value.projectLink,
      isPublic: form.value.isPublic,
      createdAt: now,
      updatedAt: now
    })
    uni.showToast({ title: '上传成功', icon: 'success' })
  }

  modalVisible.value = false
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/works/detail?id=${id}` })
}

onMounted(() => {
  if (worksStore.works.length === 0) {
    worksStore.initMockData()
  }
})
</script>

<style lang="scss" scoped>
.works-page {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  &__content {
    min-height: 100vh;
    padding-top: 96px;
    padding-right: $spacing-md;
    padding-bottom: 36px;
    padding-left: $spacing-md;
    width: 100%;
    box-sizing: border-box;
  }
}

// ----- 搜索与分类模块 -----
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

// ----- 浮动按钮 -----
.fab {
  position: fixed;
  right: $spacing-lg;
  bottom: calc(#{$tab-height} + #{$safe-bottom} + 28px);
  width: 44px;
  height: 44px;
  border-radius: $radius-round;
  background: $color-primary;
  @include flex-center;
  box-shadow: 0 4px 16px rgba(25, 98, 236, 0.4);
  z-index: 10;
  transition: transform $transition-fast;
  
  &:active {
    transform: scale(0.9);
  }
  
  &__icon {
    font-size: 28px;
    color: #FFFFFF;
    line-height: 1;
  }
}

// ----- 表单样式 -----
.form {
  &__field {
    margin-bottom: $spacing-md;
    
    &--row {
      @include flex-between;
    }
  }
  
  &__label {
    @include font-body;
    display: block;
    margin-bottom: $spacing-sm;
  }
  
  &__required {
    color: $color-danger;
  }
  
  &__input {
    @include input;
    width: 100%;
  }
  
  &__textarea {
    width: 100%;
    height: 80px;
    @include bg-card;
    @include border;
    border-radius: $radius-input;
    padding: $spacing-sm;
    font-size: $font-size-body;
    @include text-primary;
  }
  
  &__picker {
    @include input;
    @include flex-center;
    width: 100%;
    justify-content: flex-start;
    @include text-secondary;
  }
  
  &__category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  &__category-tag {
    @include tag-outline($color-primary);
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-caption;
    border-radius: 20px;
    
    &.active {
      background-color: $color-primary;
      color: #FFFFFF;
    }
  }
}
</style>