<template>
  <n-space
    vertical
    justify="center"
    align="center"
    item-style="width: 100%;"
  >
    <h1 class="mt-8 text-center">Share a Youtube movie</h1>
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      :label-width="160"
      class="max-w-2xl mx-auto flex-none"
    >
      <n-form-item label="Youtube URL" path="videoUrl">
        <n-input v-model:value="formValue.videoUrl" placeholder="Input an URL" />
      </n-form-item>
      <n-form-item label=" " label-align="right">
        <n-button @click="doShare" class="mt-1">
          Share
        </n-button>
      </n-form-item>
    </n-form>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage, FormItemRule, FormInst } from 'naive-ui'

const message = useMessage()

// form validation
const formRef = ref<FormInst | null>(null)
const rules = {
  videoUrl: [{
    required: true,
    message: 'Please enter a valid Youtube URL',
    validator: (rule: FormItemRule, value: string): boolean => /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/.test(value)
  }]
}

// data
const formValue = ref({
  videoUrl: ''
})

// methods
const doShare = (e: MouseEvent) => {
  e.preventDefault()
  if (formRef.value) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        message.success('Shared successfully!')
      }
    })
  }
}
</script>
