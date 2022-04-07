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
              Shared by: {{ item.author && item.author.email || 'Unknown' }}
            </template>
            {{ item.desc }}
            <template #action>
              <n-space>
                <n-button
                  size="medium"
                  :disabled="!(user && user.email)"
                  :type="item.likes.includes(user.id || '') ? 'primary' : 'default'"
                  @click="hitThumb(item, LikeType.Like)"
                >
                  <template #icon>
                    <n-icon>
                      <i-mdi-thumb-up-outline />
                    </n-icon>
                  </template>
                  {{ item.likes.length }}
                </n-button>
                <n-button
                  size="medium"
                  :disabled="!(user && user.email)"
                  :type="item.dislikes.includes(user.id || '') ? 'primary' : 'default'"
                  @click="hitThumb(item, LikeType.Dislike)"
                >
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
import { storeToRefs } from 'pinia'

import { useRootStore } from '@/stores/index'
import { getMovies, reactOnMovie } from '@/services/movie'

type movieItem = {
  id: string
  title: string
  desc: string
  thumbnailPath: string
  srcPath: string
  author: {
    id: string,
    email: string
  }
  likes: string[]
  dislikes: string[]
}

enum LikeType {
  Like = 'likes',
  Dislike = 'dislikes',
}

const { user } = storeToRefs(useRootStore())
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

const hitThumb = async (mit: movieItem, actionType: LikeType) => {
  if (user.value && user.value.email) {
    let action: string = actionType.substr(0, actionType.length - 1)
    if (mit[actionType].includes(user.value.id || '')) {
      action = `${action}-undo`
    }
    const { data } = await reactOnMovie({ movieId: mit.id, action })
    if (movies.value) {
      for (const m of movies.value) {
        if (m.id === mit.id) {
          m.likes = data.likes
          m.dislikes = data.dislikes
          break
        }
      }
    }
  }
}

onMounted(() => {
  fetchMovies()
})
</script>
