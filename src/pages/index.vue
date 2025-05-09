<script setup lang="ts">
import top5 from "@/components/components/top5.vue";
import new5 from "@/components/components/new5.vue";
import explore_card from "@/components/components/explore_card.vue";
</script>

<template>
  <v-div class="w-full h-a mt-14">
    <explore_card></explore_card>
  </v-div>
  <v-div class="w-full h-auto pb-8 my-4">
    <h2 class="sm-my-4 sm-text-12">最新產品</h2>

    <v-img src="/11.png" class="w-[80vw] h-[50px] my-2 mx-a" fill></v-img>
    <div class="">
      <new5 />
    </div>
    <v-img src="/1.png" class="w-[80vw] h-[50px] my-2 mx-a" fill></v-img>
  </v-div>
  <v-div class="w-full h-auto bg-white-500 pb-8">
    <h2 class="sm-my-4 sm-text-12">熱銷商品</h2>
    <v-img src="/11.png" class="w-[80vw] h-[50px] my-2 mx-a" fill></v-img>
    <div class="">
    <top5 />
</div>
<v-img src="/1.png" class="w-[80vw] h-[50px] my-2 mx-a" fill></v-img>
  </v-div>
</template>

<style scoped></style>
