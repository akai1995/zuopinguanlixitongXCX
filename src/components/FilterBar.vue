<template>
  <view class="tui-tabs">
    <scroll-view scroll-x class="tui-tabs__scroll" :show-scrollbar="false">
      <view class="tui-tabs__nav">
        <view
          v-for="(item, index) in items"
          :key="item.value"
          :class="['tui-tabs__item', { 'tui-tabs__item--active': selectedTabIndex === index }]"
          @tap="onTabTap(index)"
        >
          <text class="tui-tabs__text">{{ item.label }}</text>
          <view v-if="selectedTabIndex === index" class="tui-tabs__indicator"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  items: { label: string; value: string }[]
  selected: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: string[]): void
}>()

const selectedTabIndex = ref(0)

watch(() => props.selected, (newVal) => {
  if (newVal.length > 0) {
    const idx = props.items.findIndex(item => item.value === newVal[0])
    if (idx !== -1) {
      selectedTabIndex.value = idx
    }
  } else {
    selectedTabIndex.value = 0
  }
}, { immediate: true })

function onTabTap(index: number) {
  selectedTabIndex.value = index
  const selectedValue = props.items[index].value
  emit('update:selected', [selectedValue])
}
</script>

<style lang="scss" scoped>
.tui-tabs {
  padding: $spacing-xs 0 0;
  
  &__scroll {
    white-space: nowrap;
    width: 100%;
  }
  
  &__nav {
    display: inline-flex;
    padding: 0;
  }
  
  &__item {
    position: relative;
    padding: $spacing-sm $spacing-lg;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    &--active {
      .tui-tabs__text {
        color: $color-primary;
        font-weight: $font-weight-bold;
      }
    }
    
    [data-theme='dark'] &--active {
      .tui-tabs__text {
        color: $color-primary;
      }
    }
  }
  
  &__text {
    font-size: $font-size-body;
    font-weight: $font-weight-regular;
    color: $text-secondary-light;
    white-space: nowrap;
    transition: color $transition-fast;
    line-height: 1.4;
    
    [data-theme='dark'] & {
      color: $text-secondary-dark;
    }
  }
  
  &__indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background: $color-primary;
    border-radius: 2px;
    transition: width $transition-fast;
  }
}
</style>
