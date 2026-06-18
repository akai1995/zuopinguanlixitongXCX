<template>
  <view class="tag-input">
    <view v-if="showPreset" class="tag-input__preset">
      <text
        v-for="t in presetTags"
        :key="t"
        :class="['tag-input__preset-tag', { active: modelValue.includes(t) }]"
        @tap="toggleTag(t)"
      >{{ t }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  presetTags?: string[]
  maxTags?: number
}>(), {
  maxTags: 0
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const showPreset = !!props.presetTags && props.presetTags.length > 0

function toggleTag(tag: string) {
  if (props.modelValue.includes(tag)) {
    const next = props.modelValue.filter(t => t !== tag)
    emit('update:modelValue', next)
  } else {
    if (props.maxTags > 0 && props.modelValue.length >= props.maxTags) {
      uni.showToast({ title: '最多选择' + props.maxTags + '个标签', icon: 'none' })
      return
    }
    emit('update:modelValue', [...props.modelValue, tag])
  }
}
</script>

<style lang="scss" scoped>
.tag-input {
  &__preset {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  &__preset-tag {
    font-size: 13px;
    font-weight: 400;
    padding: 4px 12px;
    border-radius: 6px;
    background-color: rgba(25, 98, 236, 0.15);
    color: #1962EC;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &.active {
      background-color: #1962EC;
      color: #FFFFFF;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>