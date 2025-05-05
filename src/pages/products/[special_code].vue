<script setup lang="ts">
import { useRoute } from "vue-router";
import { getProductBySC } from "@/api/product";
import { ref } from "vue";
import { useUserStore } from "@/stores";
import { addItemToCart } from '@/api/cart';

interface data {
  product_info: {
    id: number;
    special_code: string;
    name: string;
    description: string;
    ingredients: {
      前調: string[];
      中調: string[];
      後調: string[];
      香調: string[];
    };
    vendor_name: string;
    slug: string;
  };
  products_variants: {
    special_code: string;
    capacity: number;
    price: number;
  }[];
  product_images_common: {
    image_url:string
  }[];
  product_images_variants: {
    special_code: string;
    images: {
      special_code: string;
      image_url: string;
    }[];
  }[];
}
const store = useUserStore();
const fav = ref(false);
const route = useRoute("/products/[special_code]");
const special_code = route.params.special_code as string;
const data = ref<data>();
const select_variant = ref<string>("");
const buy_number = ref<number>(1);
const variant_image_url = ref<string[]>([]);
const variant_price = ref<number>(999);
const cartalter1 =ref<boolean>(false);
const cartalter0 =ref<boolean>(false);
let pro_id: number;
// 取得資料
const getdata = async (id: string | number) => {
  try {
    const res = await getProductBySC(id);
    if (res.status === 200) {
      data.value = res.data;
      pro_id = res.data.product_info.id;
      const first_variant_code = res.data.products_variants[0]?.special_code;
      select_variant.value = first_variant_code;
      updateVariantData(first_variant_code);
      if (pro_id) {
        fav_check(pro_id);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// 更新圖片
const updateVariantData = (variant_code: string) => {
  if (!data.value) return;
  data.value.product_info.description =
    data.value?.product_info.description.replace("/n", "<br/>");
  const found = data.value.product_images_variants.find(
    (item) => item.special_code === variant_code
  );
  const price = data.value.products_variants.find(
    (item) => item.special_code === variant_code
  );
  if (found) {
    variant_image_url.value = found.images.map((img) => img.image_url);
  } else {
    variant_image_url.value = [];
  }
  if (price) {
    variant_price.value = price.price;
  } else {
    variant_price.value = 999999;
  }
};

//收藏判斷
const fav_check = (pro_id: number) => {
  store.user?.favorites.map((item: number) => {
    if (item == pro_id) {
      fav.value = true;
    }
  });
};

const fav_change = (pro_id: number) => {
  if (fav.value == true && data.value) {
    store.DelToFavorites(pro_id);
    fav.value = !fav.value;
  } else {
    store.addToFavorites(pro_id);
    fav.value = !fav.value;
  }
};

//購物車
const addToCart = async() =>{
  if(store.user){
    const payload ={
    user_id: store.user?.id,
    special_code: select_variant.value,
    quantity: buy_number.value
    }
    try{
      const res = await addItemToCart (payload);
      if(res.status == 200)
      {
        cartalter1.value = true;
      }else{
        cartalter0.value = true;
      }
    }catch(err){
      console.log(err);
    }
    
    
  }
  
}
getdata(special_code);
</script>

<template>
  <v-container max-width="1400">
    <v-row class="pb-4">
      <v-col cols="6">
        <v-carousel  mandatory touch  show-arrows="hover" model-value="0">
          <v-carousel-item
            v-for="(i,key) in variant_image_url"
            :key="key"
            :src="i"
            :value="key"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="6" class="md-min-h-[500px]">
        <v-row class="mt-8 md-min-h-[150px] text-left mx-4">
          <v-col class="text-10">
            {{ data?.product_info.name }}
          </v-col>
        </v-row>

        <v-row class="md-min-h-[40px] content-center text-left mx-4">
          <RouterLink :to="`/vendor/${data?.product_info.slug}`">
            <v-col class="text-left text-4">
              {{ data?.product_info.vendor_name }}
            </v-col>
          </RouterLink>
          <v-spacer></v-spacer>
        </v-row>

        <v-row class="md-min-h-[40px] mx-4 mt-0">
          <v-col class="text-left">
            <v-btn
              variant="text"
              color="orange-lighten-2"
              icon="mdi-share-variant"
              @click=""
            ></v-btn>
            <v-btn
              variant="text"
              color="orange-lighten-2"
              :icon="fav ? 'mdi-heart' : 'mdi-heart-outline'"
              @click="fav_change(pro_id)"
            ></v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row class="md-min-h-[80px] mx-4 items-center">
          <v-col class="text-left">
            <v-btn-toggle v-model="select_variant" divided>
              <v-btn
                v-for="i in data?.products_variants"
                :text="`${i.capacity}ml`"
                :value="i.special_code"
                @click="updateVariantData(i.special_code)"
              >
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="font-800 text-5 items-center">
            $ {{ buy_number * variant_price }}
          </v-col>
        </v-row>
        <v-row class="md-min-h-[100px] mx-4">
          <v-col>
            <v-number-input
              max-width="300"
              min-width="200"
              :reverse="false"
              controlVariant="split"
              label=""
              :hideInput="false"
              inset
              variant="outlined"
              :min="1"
              v-model="buy_number"
            ></v-number-input>
          </v-col>

          <v-spacer></v-spacer>
          <v-col>
            <v-btn
              variant="flat"
              rounded="xl"
              size="large"
              color="#EEBF62"
              class="text-white font-800"
              @click="addToCart()"
            >
              加入購物車
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" class="my-8">
        <div
          class="overflow-y-auto text-left whitespace-normal"
          v-html="data?.product_info.description"
        ></div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-divider></v-divider>
    <v-card class="my-6">
      <v-card-item
        v-for="([key, value], index) in Object.entries(
          data?.product_info.ingredients || {}
        )"
        :key="index"
        :v-if="value.length > 0"
      >
        <v-card-title class="text-lg font-bold">{{ key }}</v-card-title>
        <v-card-text>
          {{ value.join("、") }}
        </v-card-text>
      </v-card-item>
    </v-card>
    <v-divider></v-divider>
    <v-row>
      
      <v-col cols="10" v-for="i in data?.product_images_common" class="m-a">
        <v-img :src="i.image_url">
        </v-img>
      </v-col>
      
    </v-row>
  </v-container>
  <v-snackbar
      v-model="cartalter1"
      :timeout="5000"
      color=""
      class=""
      location="top"
    >
      成功加入購物車!

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="cartalter1 = false"
        >
          x
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="cartalter0"
      :timeout="5000"
    >
      加入購物車失敗 QAQ 

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="cartalter0 = false"
        >
          x
        </v-btn>
      </template>
    </v-snackbar>
</template>

<style scoped></style>
