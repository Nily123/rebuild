<script setup lang="ts">
import{getfavcard} from'@/api/fav'
import { useUserStore } from '@/stores';
import { ref } from 'vue';
import Product_card from '../components/product_card.vue';
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
  variant_prices:{
    price:number;
    capacity:string;
  }[];
}
const store = useUserStore();
const data =ref<product_info[]>()
const getdata = async()=>{
    if(store.user){
        const id = ref(store.user.id);
        try{
            const res = await getfavcard(id.value)
            if(res.status == 200){
                data.value = res.data;
            }
        }catch(err){
            console.log(err);
        }
    }
}
getdata();
</script>

<template>
    <v-container class="mx-a">
        <v-row class="mx-a">
            <v-col v-for="i in data" class="flex-grow-0">
                <Product_card :prop_data="i"></Product_card>
            </v-col>
              
        </v-row>
    </v-container>
</template>

<style scoped>
</style>