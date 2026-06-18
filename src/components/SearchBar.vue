<template>
  <view class="search-bar">
    <view class="search-bar__inner">
      <view class="search-bar__icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </view>
      <input
        class="search-bar__input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @confirm="$emit('search')"
        confirm-type="search"
      />
      <text
        v-if="modelValue"
        class="search-bar__clear"
        @tap="onClear"
      >&#x2715;</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

function onInput(e: { detail: { value: string } }) {
  emit('update:modelValue', e.detail.value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('search')
}
</script>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  
  &__inner {
    @include flex-center;
    width: 100%;
    max-width: 100%;
    height: 32px;
    @include bg-card;
    @include border;
    border-radius: 8px;
    padding: 0 $spacing-sm;
    box-sizing: border-box;
  }
  
  &__icon {
    font-size: $font-size-body;
    margin-right: $spacing-sm;
    @include text-auxiliary;
    flex-shrink: 0;
    height: 20px;
  }
  
  &__input {
    flex: 1;
    height: 100%;
    font-size: $font-size-body;
    @include text-primary;
    margin: 0;
    padding: 0;
  }
  
  &__clear {
    @include flex-center;
    width: 20px;
    height: 20px;
    border-radius: $radius-round;
    @include bg-control;
    font-size: $font-size-caption;
    @include text-weak;
    margin-left: $spacing-sm;
    flex-shrink: 0;
  }
}
</style>