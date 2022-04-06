<template>
  <n-list>
    <n-list-item v-for="item in movies" :key="item.id">
      <n-grid x-gap="12" :cols="2">
        <n-gi class="flex justify-end">
          <n-image class="flex-none" :src="item.thumbnailPath" :alt="item.title" />
        </n-gi>
        <n-gi>
          <n-thing>
            <template #header>
              <strong class="text-red">{{ item.title }}</strong>
            </template>
            <template #description>
              Shared by: {{ item.author }}
            </template>
            {{ item.desc }}
            <template #action>
              <n-space>
                <n-button size="medium">
                  <template #icon>
                    <n-icon>
                      <i-mdi-thumb-up-outline />
                    </n-icon>
                  </template>
                  {{ item.likes.length }}
                </n-button>
                <n-button size="medium">
                  <template #icon>
                    <n-icon>
                      <i-mdi-thumb-down-outline />
                    </n-icon>
                  </template>
                  {{ item.dislikes.length }}
                </n-button>
              </n-space>
            </template>
          </n-thing>
        </n-gi>
      </n-grid>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'

import { getMovies } from '@/services/movie'

type movieItem = {
  id: string
  title: string
  desc: string
  thumbnailPath: string
  srcPath: string
  author: string
  likes: string[]
  dislikes: string[]
}

const message = useMessage()

const movies = ref<movieItem[] | null>([])

const fetchMovies = async () => {
  try {
    const { data } = await getMovies()
    movies.value = data.data
  } catch (err: any) {
    if (err.response) {
      message.error((err.response.data && err.response.data.message) || err.message)
    } else if (err.request) {
      message.error(err.request)
    } else {
      message.error(err.message)
    }
  }
}

onMounted(() => {
  fetchMovies()
})
</script>
