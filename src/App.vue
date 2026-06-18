<template>
  <view class="app-root">
    <slot />
    <GlobalPopup
      v-if="popupStore.filterVisible"
      title="选择分类"
      :visible="popupStore.filterVisible"
      @close="popupStore.closeFilter()"
      @confirm="popupStore.confirmFilter()"
    >
      <view
        v-for="item in popupStore.filterItems"
        :key="item.value"
        :class="['filter-popup__item', { 'is-active': popupStore.isFilterSelected(item.value) }]"
        @tap="popupStore.toggleFilter(item.value)"
      >
        <view v-if="popupStore.isFilterSelected(item.value)" class="filter-popup__check">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </view>
        <text class="filter-popup__label">{{ item.label }}</text>
      </view>
    </GlobalPopup>
  </view>
</template>

<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useThemeStore } from '@/stores'
import { usePopupStore } from '@/stores/popup'
import GlobalPopup from '@/components/GlobalPopup.vue'

const popupStore = usePopupStore()

onLaunch(() => {
  const themeStore = useThemeStore()
  themeStore.initTheme()
})
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.app-root {
  width: 100%;
  min-height: 100vh;
}

.filter-popup__item {
  display: flex;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-light;

  [data-theme='dark'] & {
    border-bottom-color: $border-dark;
  }

  &:last-child {
    border-bottom: none;
  }

  &.is-active {
    .filter-popup__label {
      @include text-primary;
    }

    .filter-popup__check {
      @include text-primary;
    }
  }
}

.filter-popup__check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-md;
  @include text-auxiliary;
}

.filter-popup__label {
  flex: 1;
  font-size: $font-size-body;
  @include text-secondary;
}
</style>
