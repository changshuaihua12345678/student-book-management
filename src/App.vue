<template>
  <div class="app-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <Layout>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </Layout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from './components/Layout.vue'

const backgroundImages = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peaceful%20nature%20landscape%20with%20mountains%20and%20lake%2C%20soft%20colors%2C%20minimalist%20style&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zen%20garden%20with%20stones%20and%20water%2C%20calm%20and%20serene&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunset%20over%20ocean%2C%20warm%20colors%2C%20peaceful%20atmosphere&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=forest%20path%20with%20sunlight%20filtering%20through%20trees%2C%20tranquil%20scene&image_size=landscape_16_9'
]

const backgroundImage = ref(backgroundImages[0])

const changeBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length)
  backgroundImage.value = backgroundImages[randomIndex]
}

onMounted(() => {
  // 每30分钟更换一次背景图
  setInterval(changeBackground, 30 * 60 * 1000)
})
</script>

<style scoped>
.app-container {
  width: 100vw;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>