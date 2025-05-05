<script setup lang="ts">
import {getAllProductsCard} from '@/api/product';
import { ref } from 'vue';
import product_card from '@/components/components/product_card.vue';
interface product_info {
  id: number;
  product_id: number;
  special_code: string;
  image_url: string;
  sequence: number;
  product_name: string; 
  description: string;
  ingredients: {
    前調: string[];
    中調: string[];
    後調: string[];
    香調: string[];
  };
  vendor_name: string;
}
const ids = ref<product_info[]>([]);
const getpro_ids = async() =>{
    const res = await getAllProductsCard();
    if(res.status == 200){
        ids.value = res.data
    }
}
getpro_ids();
     
</script>

<template>
    <v-container class="w-[80%]">
        <v-row align-item="left" align-content="center" justify="space-evenly">
        <v-col v-for=" i in ids">
            <product_card :prop_data="i"></product_card>
        </v-col>
    </v-row>
    </v-container>

</template>

<style scoped>
</style>