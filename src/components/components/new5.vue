<script setup lang="ts">
import product_card from './product_card.vue';
import { getNEW5 } from '@/api/product';
import { ref } from 'vue';
interface product_info {
  id: number;
  product_id: number;
  special_code: string;
  special_code0: string;
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
const new5 = ref<product_info[]>()
const getNEW5data =async() =>{
    console.log('1');
    try{
        const res = await getNEW5()
        if(res.status == 200){
            console.log(res.data);
            new5.value = res.data
        }else {
            console.log('top5 err')
        }
    }
    catch(err){
        console.log('getTop5 err:',err)
    }
};
getNEW5data();
</script>

<template>
    <v-row class="w-[80vw] mx-a border-2px border-[#997A5C] border-solid py-4" align-item="center" align-content="center" justify="space-evenly">
        <v-col v-for="item in new5">
            <product_card :prop_data="item"/>
        </v-col>        
    </v-row>
</template>

<style scoped>
</style>