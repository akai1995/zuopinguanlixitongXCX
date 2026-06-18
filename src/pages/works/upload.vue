<template>
  <view class="upload-page">
    <view class="upload-page__header">
      <view class="upload-page__back" @tap="goBack">
        <svg class="upload-page__back-icon" width="26" height="26" viewBox="0 0 32 32">
          <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" />
        </svg>
      </view>
      <text class="upload-page__title">{{ editingId ? '编辑作品' : '上传作品' }}</text>
      <view class="upload-page__placeholder"></view>
    </view>

    <scroll-view class="upload-page__content" scroll-y>
      <view class="form">
        <view class="form__field">
          <text class="form__label">标题 <text class="form__required">*</text></text>
          <input class="form__input" v-model="form.title" placeholder="请输入作品标题（最多50字）" maxlength="50" />
        </view>

        <ImageUploader
          title="封面图"
          v-model="form.coverImages"
          :max-count="1"
          tips="支持jpg/png/webp，大小≤5MB，自动裁剪1:1"
        />

        <ImageUploader
          title="作品集图片"
          v-model="form.images"
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
              :class="['form__category-tag', { active: form.categories.includes(cat) }]"
              @tap="toggleCategory(cat)"
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
          <view class="form__switch-wrapper">
            <switch :checked="form.isPublic" @change="form.isPublic = $event.detail.value" color="#1962EC" />
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="upload-page__actions">
      <button class="upload-page__btn upload-page__btn--outline" @tap="goBack">取消</button>
      <button class="upload-page__btn upload-page__btn--primary" @tap="onSave">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWorksStore, usePopupStore } from '@/stores'
import ImageUploader from '@/components/ImageUploader.vue'
import type { IWork } from '@/types'

const worksStore = useWorksStore()
const popupStore = usePopupStore()

const presetCategories = worksStore.presetCategories

const editingId = ref('')

const defaultForm = (): {
  title: string
  coverImages: string[]
  images: string[]
  description: string
  categories: string[]
  year: number
  projectLink: string
  isPublic: boolean
} => ({
  title: '',
  coverImages: [],
  images: [],
  description: '',
  categories: [],
  year: new Date().getFullYear(),
  projectLink: '',
  isPublic: true
})

const form = ref(defaultForm())

onMounted(() => {
  popupStore.hideTabBar()
  
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as { options?: { id?: string } }
  if (currentPage.options?.id) {
    editingId.value = currentPage.options.id
    const work = worksStore.getWorkById(currentPage.options.id)
    if (work) {
      form.value = {
        title: work.title,
        coverImages: work.coverImage ? [work.coverImage] : [],
        images: work.images || [],
        description: work.description,
        categories: work.category ? work.category.split(',') : [],
        year: work.year || new Date().getFullYear(),
        projectLink: work.projectLink || '',
        isPublic: work.isPublic !== undefined ? work.isPublic : true
      }
    }
  }
})

onUnmounted(() => {
  popupStore.showTabBar()
})

function goBack() {
  uni.navigateBack()
}

function onYearChange(e: { detail: { value: string } }) {
  form.value.year = parseInt(e.detail.value)
}

function toggleCategory(cat: string) {
  const index = form.value.categories.indexOf(cat)
  if (index > -1) {
    form.value.categories.splice(index, 1)
  } else {
    form.value.categories.push(cat)
  }
}

function onSave() {
  if (!form.value.title.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }

  if (form.value.categories.length === 0) {
    uni.showToast({ title: '请选择至少一个分类', icon: 'none' })
    return
  }

  if (form.value.coverImages.length === 0) {
    uni.showToast({ title: '请上传封面图', icon: 'none' })
    return
  }

  if (form.value.images.length === 0) {
    uni.showToast({ title: '请至少上传一张作品图片', icon: 'none' })
    return
  }

  const work: IWork = {
    id: editingId.value || Date.now().toString(),
    title: form.value.title.trim(),
    coverImage: form.value.coverImages[0],
    images: form.value.images,
    description: form.value.description.trim(),
    category: form.value.categories.join(','),
    year: form.value.year,
    projectLink: form.value.projectLink.trim(),
    isPublic: form.value.isPublic,
    createdAt: editingId.value ? new Date().toISOString() : new Date().toISOString()
  }

  if (editingId.value) {
    worksStore.updateWork(work)
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    worksStore.addWork(work)
    uni.showToast({ title: '上传成功', icon: 'success' })
  }

  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.upload-page {
  min-height: 100vh;
  background: $bg-card-light;

  [data-theme='dark'] & {
    background: $bg-card-dark;
  }

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
    background: $bg-card-light;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    [data-theme='dark'] & {
      background: $bg-card-dark;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
  }

  &__back {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    width: 26px;
    height: 26px;
    fill: $text-primary-light;

    [data-theme='dark'] & {
      fill: $text-primary-dark;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $text-title-light;

    [data-theme='dark'] & {
      color: $text-title-dark;
    }
  }

  &__placeholder {
    width: 44px;
  }

  &__content {
    padding-top: 44px;
    padding-bottom: 0px;
  }

  &__actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 12px;
    padding: 16px;
    background: $bg-card-light;
    box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.05);
    padding-bottom: calc(16px + constant(safe-area-inset-bottom));
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    z-index: 100;

    [data-theme='dark'] & {
      background: $bg-card-dark;
      box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.3);
    }
  }

  &__btn {
    flex: 1;
    height: 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;

    &--primary {
      background-color: $color-primary;
      color: #FFFFFF;
    }

    &--outline {
      background-color: transparent;
      border: 1px solid $color-primary;
      color: $color-primary;

      [data-theme='dark'] & {
        border-color: $color-primary;
        color: $text-primary-dark;
      }
    }
  }
}

.form {
  padding: 16px;
  padding-bottom: 80px;
  height: auto;

  &__field {
    margin-bottom: 16px;

    &--row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: $text-primary-light;
    margin-bottom: 8px;

    [data-theme='dark'] & {
      color: $text-primary-dark;
    }
  }

  &__required {
    font-size: 16px !important;
    font-weight: 500 !important;
    color: #ff4d4f !important;

    span {
      font-size: 16px !important;
      font-weight: 500 !important;
      color: #ff4d4f !important;
    }
  }

  &__input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    background: $bg-control-light;
    border-radius: 8px;
    font-size: 14px;
    color: $text-primary-light;
    box-sizing: border-box;

    [data-theme='dark'] & {
      background: $bg-control-dark;
      color: $text-primary-dark;
    }
  }

  &__textarea {
    width: 100%;
    height: 120px;
    padding: 12px;
    background: $bg-control-light;
    border-radius: 8px;
    font-size: 14px;
    color: $text-primary-light;
    box-sizing: border-box;

    [data-theme='dark'] & {
      background: $bg-control-dark;
      color: $text-primary-dark;
    }
  }

  &__category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__category-tag {
    font-size: 13px;
    font-weight: 400;
    padding: 4px 12px;
    border-radius: 6px;
    background-color: rgba(25, 98, 236, 0.15);
    color: #1962EC;
    display: inline-block;

    &.active {
      background-color: #1962EC;
      color: #FFFFFF;
    }
  }

  &__picker {
    height: 44px;
    padding: 0 12px;
    background: $bg-control-light;
    border-radius: 8px;
    font-size: 14px;
    color: $text-primary-light;
    display: flex;
    align-items: center;

    [data-theme='dark'] & {
      background: $bg-control-dark;
      color: $text-primary-dark;
    }
  }

  &__switch-wrapper {
    transform: scale(0.85);
    transform-origin: right center;
  }
}
</style>
