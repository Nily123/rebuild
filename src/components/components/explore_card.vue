<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const op = ref({
  autoplay: true,
  loop: true,
  muted: true,
  playsinline: true,
  controls: false,
  playbackRates : 0.5,
});
const windowWidth = ref(window.innerWidth);

// 比例：1920:500 = width:height → height = width * (500 / 1920)
const dynamicHeight = computed(() => {
  return Math.round((windowWidth.value * 500) / 1920);
});

const updateWindowSize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowSize);
  updateWindowSize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowSize);
});
</script>

<template>
  <div class="w-full max-h-[500px] bg-white relative overflow-hidden "
   :style="{ width: windowWidth + 'px', height: dynamicHeight + 'px' }"
  >
    <div class="absolute z-10 backdrop-hue-rotate-180 w-full">
      <v-img
        src="/02.png"
        fill
        position="20% 50%"
        class="overflow-hidden max-h-[500px] opacity-50"
        :style="{ width: windowWidth*0.9 + 'px', height: dynamicHeight + 'px' }"
      />
      <!-- <h3
        class="dm-serif-text-regular-italic text-white opacity-70 text-[300px] mix-blend-screen backdrop-hue-rotate-270"
        style="filter: brightness(1.2) sepia(0.3)"
      >
        REBORN
      </h3> -->
    </div>
    <div class="z-0  w-full " :style="{ width: windowWidth + 'px', height: dynamicHeight + 'px' }">
      <video-player class="w-[1920px]" src="/t0.mp4" :options="op"/>
    </div>
    <h3 class="text-white z-10 absolute right-[2%] sm-right-[11vw] top-[5%] sm-top-[40%] md-top-[40%] font-800 text-left lg-text-8">不知道什麼樣的香味適合你嗎?<br/>一起來尋找屬於你的味道~</h3>
    <v-btn
      class="z-10 absolute right-[3vw] sm-right-[15vw] top-[60%] sm-top-[70%] font-800 text-3 p-2 lg-px-4 lg-py-5 sm-text-5 md-text-6"
      size=""
      variant="outlined"
      color="white"
      to="/explore"
      >開始探索</v-btn
    >
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap");
.dm-serif-text-regular {
  font-family: "DM Serif Text", serif;
  font-weight: 400;
  font-style: normal;
}

.dm-serif-text-regular-italic {
  font-family: "DM Serif Text", serif;
  font-weight: 400;
  font-style: italic;
}

</style>
