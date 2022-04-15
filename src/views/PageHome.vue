<template>
  <n-list class="max-w-screen-md m-auto">
    <template v-if="loading">
      <n-list-item>
        <n-grid x-gap="12" :cols="2">
          <n-gi class="flex justify-end">
            <n-skeleton
              :width="350"
              :height="250"
              :sharp="false"
              size="medium"
            />
          </n-gi>
          <n-gi>
            <n-thing>
              <template #header>
                <n-skeleton
                  :width="200"
                  :sharp="false"
                  size="medium"
                />
              </template>
              <template #description>
                <n-skeleton
                  :width="150"
                  :sharp="false"
                  size="medium"
                />
              </template>
              <n-skeleton
                :width="300"
                :height="100"
                :sharp="false"
                size="medium"
              />
              <template #action>
                <n-space>
                  <n-skeleton
                    :width="60"
                    :height="35"
                    :sharp="false"
                    :round="true"
                    size="medium"
                  />
                  <n-skeleton
                    :width="60"
                    :height="35"
                    :sharp="false"
                    :round="true"
                    size="medium"
                  />
                </n-space>
              </template>
            </n-thing>
          </n-gi>
        </n-grid>
      </n-list-item>
      <n-list-item>
        <n-grid x-gap="12" :cols="2">
          <n-gi class="flex justify-end">
            <n-skeleton
              :width="350"
              :height="250"
              :sharp="false"
              size="medium"
            />
          </n-gi>
          <n-gi>
            <n-thing>
              <template #header>
                <n-skeleton
                  :width="200"
                  :sharp="false"
                  size="medium"
                />
              </template>
              <template #description>
                <n-skeleton
                  :width="150"
                  :sharp="false"
                  size="medium"
                />
              </template>
              <n-skeleton
                :width="300"
                :height="100"
                :sharp="false"
                size="medium"
              />
              <template #action>
                <n-space>
                  <n-skeleton
                    :width="60"
                    :height="35"
                    :sharp="false"
                    :round="true"
                    size="medium"
                  />
                  <n-skeleton
                    :width="60"
                    :height="35"
                    :sharp="false"
                    :round="true"
                    size="medium"
                  />
                </n-space>
              </template>
            </n-thing>
          </n-gi>
        </n-grid>
      </n-list-item>
    </template>
    <template v-else>
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
    </template>
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
const loading = ref(true)

const isSubmitting = ref(false)

const fetchMovies = async () => {
  loading.value = true
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
  loading.value = false
}

const hitThumb = async (mit: movieItem, actionType: LikeType) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  if (user.value && user.value.email) {
    let action: string = actionType.substr(0, actionType.length - 1)
    if (mit[actionType].includes(user.value.id || '')) {
      action = `${action}-undo`
    }
    try {
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
  isSubmitting.value = false
}

onMounted(() => {
  // console.log('onMounted')
  fetchMovies()
})
</script>
