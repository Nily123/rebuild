<script setup lang="ts">
import {getAllActivity} from '@/api/acivity';
import { computed, ref } from 'vue';

const data = ref();
const sortOrder = ref<'desc' | 'asc'>('desc')

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
};
// 排序後的活動列表
const sortedEvents = computed(() => {
  return [...data.value].sort((a, b) => {
    const timeA = new Date(a.start_date).getTime()
    const timeB = new Date(b.start_date).getTime()
    return sortOrder.value === 'desc' ? timeB - timeA : timeA - timeB
  })
})

// 切換排序順序
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const init =async()=>{
    try{
        const res = await getAllActivity();
        if(res.status == 200){
            data.value = res.data;
        }
    }catch(err){
        console.log(err);
    }
}
init();
</script>

<template>
    <v-container>
        <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="auto">
        <v-btn @click="toggleSort()" color="#CFA149" variant="tonal">
          時間排序：{{ sortOrder === 'desc' ? '新到舊' : '舊到新' }}
        </v-btn>
      </v-col>
    </v-row>
        <v-row>
            <v-col
        v-for="event in sortedEvents"
        :key="event.id"
        cols="12"
        md="6"
      >
        <v-card class="pa-4" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            {{ event.name }}
          </v-card-title>
          <v-card-subtitle class="text-grey-800 text-sm">
            活動期間：{{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
          </v-card-subtitle>
          <v-card-text class="text-body-2 mt-2">
            {{ event.description }}
          </v-card-text>
          <v-chip class="mt-3 text-white bg-[#CFA149]"  label>
            適用範圍：{{ event.coverage }}
          </v-chip>
        </v-card>
      </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
</style>