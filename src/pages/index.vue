<script setup lang="ts">
import top5 from '@/components/components/top5.vue';
import new5 from '@/components/components/new5.vue';
import explore_card from '@/components/components/explore_card.vue';
</script>

<template>
    <v-div class="w-full h-[500px] bg-blue-400 mt-14"  >
        <explore_card></explore_card>
    </v-div>
    <v-div class="w-full h-auto bg-blue-300 pb-8"  >
        <h2 class="my-4">最新產品</h2>
        <new5/>
        
    </v-div>
    <v-div class="w-full h-auto bg-white-500 pb-8"  >
        <h2 class="my-4">熱銷商品</h2>
        <top5/>
    </v-div>
</template>

<style scoped>
</style>