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
}

const props = defineProps<{
  prop_data: product_info;
}>();

const flavor = ref(props.prop_data.ingredients.香調);
const name_size = ref(0);

const processProductName = () => {
  let name = props.prop_data.product_name;
  const hasChinese = /[\u4e00-\u9fa5]/.test(name);
  const hasEnglish = /[a-zA-Z]/.test(name);

  if (hasChinese && hasEnglish) {
    // 插入換行在中英交界處
    name = name.replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1\n$2');
    name = name.replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1\n$2');
    props.prop_data.product_name = name;
    name_size.value = 2;
    return;
  }

  // 如果是純中文，依照原本規則處理
  if (hasChinese) {
    const length = name.length;

    if (length > 9 && length <= 12) {
      name_size.value = 1;
    }

    if (length > 12) {
      const start = Math.floor(length * 0.4);
      const end = Math.floor(length * 0.9);

      let modifiedName = name;
      let foundSpace = false;

      for (let i = start; i <= end; i++) {
        if (name[i] === ' ') {
          modifiedName = name.slice(0, i) + '\n' + name.slice(i + 1);
          foundSpace = true;
          break;
        }
      }

      if (!foundSpace) {
        const mid = Math.floor(length / 2);
        modifiedName = name.slice(0, mid) + '\n' + name.slice(mid);
      }

      props.prop_data.product_name = modifiedName;
      name_size.value = 2;
    }
  }
};



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

const init=()=>{
  processProductName();
  fav_check()
}

init();
</script>

<template>
  <v-card class="mx-auto hover:text-[#B58F52] hover:bg-white hover:font-1000 sm-max-w-[250px] sm-max-h-[350px] sm-min-w-[220px] max-w-[125px] min-w-[110px] max-h-[250px]" hover :to="`/products/${prop_data.special_code0}`">
    <div class="sm-h-[200px] h-[100px] overflow-hidden">
        <v-img class="sm-h-[200px] h-[100px] hover:scale-120" :src="prop_data.image_url"></v-img>
    </div>
    <v-card-title
      class="break-all h-[45px] sm-h-[70px] items-center whitespace-pre-line sm-text-base text-[10px]"
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

    <v-card-subtitle class="sm-text-base text-[10px]">
      {{ prop_data.vendor_name }}
    </v-card-subtitle>

    <v-card-actions>
      <!-- <div>
           <p v-for="i in flavor">
                {{ i }}
            </p> 
        </div> -->

      <v-spacer></v-spacer>
      <v-btn color="orange-lighten-2" icon="mdi-cart"></v-btn>
      <v-btn 
        color="orange-lighten-2" 
        :icon=" fav ?'mdi-heart':'mdi-heart-outline'"
        @click="fav_change()"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
