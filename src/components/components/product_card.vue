<script setup lang="ts">
import { useUserStore } from "@/stores";
import { ref } from "vue";
const store = useUserStore();
const fav = ref(false);
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
const price =ref<number|string>();

const props = defineProps<{
  prop_data: product_info;
}>();
const name_size = ref(0);

// const processProductName = () => {
//   let name = props.prop_data.product_name;
//   const hasChinese = /[\u4e00-\u9fa5]/.test(name);
//   const hasEnglish = /[a-zA-Z]/.test(name);

//   if (hasChinese && hasEnglish) {
//     // 插入換行在中英交界處
//     name = name.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1\n$2');
//     name = name.replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1\n$2');
//     props.prop_data.product_name = name;
//     name_size.value = 2;
//     return;
//   }

//   // 如果是純中文，依照原本規則處理
//   if (hasChinese) {
//     const length = name.length;

//     if (length > 9 && length <= 12) {
//       name_size.value = 1;
//     }

//     if (length > 12) {
//       const start = Math.floor(length * 0.4);
//       const end = Math.floor(length * 0.9);

//       let modifiedName = name;
//       let foundSpace = false;

//       for (let i = start; i <= end; i++) {
//         if (name[i] === ' ') {
//           modifiedName = name.slice(0, i) + '\n' + name.slice(i + 1);
//           foundSpace = true;
//           break;
//         }
//       }

//       if (!foundSpace) {
//         const mid = Math.floor(length / 2);
//         modifiedName = name.slice(0, mid) + '\n' + name.slice(mid);
//       }

//       props.prop_data.product_name = modifiedName;
//       name_size.value = 2;
//     }
//   }
// };



const fav_check =() =>{
  store.user?.favorites.map((item: number)=>{
  if (item == props.prop_data.product_id){
    fav.value = true;
  }})
}

const fav_change = () =>{
  if(fav.value == true){
    store.DelToFavorites(props.prop_data.product_id);
    fav.value = !fav.value;
  }else{
    store.addToFavorites(props.prop_data.product_id);
    fav.value = !fav.value;
  }
}
const price_check=()=>{
  if(props.prop_data.variant_prices.length == 1){
    price.value = props.prop_data.variant_prices[0].price;
  }else if(props.prop_data.variant_prices.length > 1){
    let min_price = 9999999999;
    let max_price = 0;
    props.prop_data.variant_prices.forEach(ele =>{
      if(ele.price >= max_price){
        max_price = ele.price;
      }
      if(ele.price <= min_price){
        min_price = ele.price;
      }
    })
    price.value = min_price+"~"+max_price;
  }
}

const init=()=>{
  //processProductName();
  fav_check()
  price_check();
}

init();
</script>

<template>
  <v-card class="mx-auto hover:text-[#B58F52] hover:bg-white hover:font-1000 sm-max-w-[250px] sm-max-h-[350px] sm-min-w-[220px] max-w-[125px] min-w-[110px] min-h-[190px] max-h-[220px]" hover :to="`/products/${prop_data.special_code0}`">
    
    <div class="sm-h-[200px] h-[100px] overflow-hidden">
        <v-img class="sm-h-[200px] h-[100px] hover:scale-120" :src="prop_data.image_url"></v-img>
    </div>
    

    <v-card-subtitle class="sm-text-base text-[10px] mt-1">
      {{ prop_data.vendor_name }}
    </v-card-subtitle>
    <v-card-title
      class="break-all h-[45px] sm-h-[70px] font-800 items-center whitespace-pre-line sm-text-base text-[10px]"
      :class="[
        name_size == 1 
          ? ''
          : ' ',
        name_size == 2 
        ?' leading-[0px]'
        :' '
      ]"
      style="line-height: 1.2;"
    >
      {{ prop_data.product_name }}
    </v-card-title>

    <div class="z-50 sm-h-a h-[20px] py-0 flex px-2 items-center">
      
      <v-btn 
        color="orange-lighten-2"
        variant="text"
        :class="fav? '':''"
        class="sm-text-4 text-2 sm-w-[25px] w-[10px] h-max p-0 m-0 ic z-100"
        :icon=" fav ?'mdi-heart':'mdi-heart-outline'"
        style=""
        @click="fav_change()"></v-btn>
      <v-spacer></v-spacer>
      <p class="text-2 sm-text-5 sm-px-3 p-0 font-500">${{ price }}</p>
    </div>

  </v-card>
</template>

<style scoped>
.ic {
  width: calc(var(--v-btn-height) - 12px) !important;
  height: calc(var(--v-btn-height) - 12px) !important;
}
@media (min-width: 640px) {
.ic {
  width: calc(var(--v-btn-height) + 12px) !important;
  height: calc(var(--v-btn-height) + 12px) !important;
}
}
</style>
