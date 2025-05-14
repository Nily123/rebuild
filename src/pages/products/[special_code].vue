<script setup lang="ts">
import { useRoute } from "vue-router";
import { getProductBySC } from "@/api/product";
import { ref } from "vue";
import { useUserStore } from "@/stores";
import { addItemToCart } from "@/api/cart";
import { getvendor_id } from "@/api/vendor";
import Product_card from "@/components/components/product_card.vue";

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
    vendor_id:number;
  };
  products_variants: {
    special_code: string;
    capacity: number;
    price: number;
  }[];
  product_images_common: {
    image_url: string;
  }[];
  product_images_variants: {
    special_code: string;
    images: {
      special_code: string;
      image_url: string;
    }[];
  }[];
}
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
const ingredients0 = ref<string[]>([]);
const ingredients1 = ref<string[]>([]);
const ingredients2 = ref<string[]>([]);
const ingredients_all = ref<string[]>([]);
const store = useUserStore();
const fav = ref(false);
const route = useRoute("/products/[special_code]");
const special_code = route.params.special_code as string;
const data = ref<data>();
const select_variant = ref<string>("");
const buy_number = ref<number>(1);
const variant_image_url = ref<string[]>([]);
const variant_price = ref<number>(999);
const cartalter1 = ref<boolean>(false);
const cartalter0 = ref<boolean>(false);
const moreproductData =ref();
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
      if (data.value?.product_info.ingredients.前調) {
        ingredients0.value = data.value.product_info.ingredients.前調;
      }
      if (data.value?.product_info.ingredients.中調) {
        ingredients1.value = data.value.product_info.ingredients.中調;
      }
      if (data.value?.product_info.ingredients.後調) {
        ingredients2.value = data.value.product_info.ingredients.後調;
      }
      if (data.value?.product_info.ingredients.香調) {
        ingredients_all.value = data.value.product_info.ingredients.香調;
      }
      console.log(ingredients0.value);
      console.log(ingredients1.value);
      console.log(ingredients2.value);
      console.log(ingredients_all.value);
      fetchData();
    }
  } catch (err) {
    console.log(err);
  }
};
const fetchData = async () => {
  try {
    if (data.value) {
      const id = data.value.product_info.vendor_id;
      const detailRes = await getvendor_id(id);
      if (detailRes.status === 200) {
        moreproductData.value = detailRes.data
          .filter((ele: product_info) => ele.id !== id)
          .slice(0, 3);
      }
    }
  } catch (err) {
    console.error('fetchData error:', err);
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
const addToCart = async () => {
  if (store.user) {
    const payload = {
      user_id: store.user?.id,
      special_code: select_variant.value,
      quantity: buy_number.value,
    };
    try {
      const res = await addItemToCart(payload);
      if (res.status == 200) {
        cartalter1.value = true;
      } else {
        cartalter0.value = true;
      }
    } catch (err) {
      console.log(err);
    }
  }
};
getdata(special_code);
</script>

<template>
  <v-container max-width="1400" class="mt-11">
    <v-row class="pb-4">
      <v-col cols="12" sm="6">
        <v-carousel mandatory touch show-arrows="hover" model-value="0">
          <v-carousel-item
            v-for="(i, key) in variant_image_url"
            :key="key"
            :src="i"
            :value="key"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="12" sm="6" class="md-min-h-[500px]">
        <v-row class="mt-8 md-min-h-[150px] text-left mx-4">
          <v-col class="sm-text-10 text-6">
            {{ data?.product_info.name }}
          </v-col>
        </v-row>

        <v-row class="md-min-h-[40px] content-center text-left mx-4">
          <RouterLink :to="`/vendor/${data?.product_info.slug}`">
            <v-col class="text-left text-3 sm-text-4">
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
          <v-col cols="12" sm="4">
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
          <v-col cols="12" sm="4">
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
    <v-card class="my-6 bg-white/50 border-[#ECBD69] border-solid border-1px">
      <v-row class="justify-center">
      <v-col  cols="auto" sm="12" v-if="ingredients_all.length > 0" class="sm-border-b-1px sm-border-b-solid sm-border-[#E9B351]">
      <v-card-item >
        <v-card-title class=" font-bold sm-text-6 text-4">香調</v-card-title>
        <v-card-text class="flex gap-2 text-center justify-center sm-text-5 text-4">
          <div
            v-for="(i, index) in ingredients_all"
            :key="index"
            class="flex gap-2"
          >
            <div>{{ i }}</div>
            <div v-if="index + 1 != ingredients_all.length">、</div>
          </div>
        </v-card-text>
      </v-card-item></v-col>
      
        <v-col cols="auto" sm="auto"  v-if="ingredients0.length > 0">
          <v-card-item>
        <v-card-title class=" font-bold sm-text-6 text-4">前調</v-card-title>
        <v-card-text class="flex gap-2 text-center justify-center sm-text-5 text-4 max-w-[80vw] flex-wrap">
          <div
            v-for="(i, index) in ingredients0"
            :key="index"
            class="flex gap-2"
          >
            <div>{{ i }}</div>
            <div v-if="index + 1 != ingredients0.length">、</div>
          </div>
        </v-card-text>
      </v-card-item>
        </v-col>
        <v-col cols="auto" sm="auto"  v-if="ingredients1.length > 0">
          <v-card-item>
        <v-card-title class=" font-bold sm-text-6 text-4">中調</v-card-title>
        <v-card-text class="flex gap-2 text-center justify-center sm-text-5 text-4 max-w-[80vw] flex-wrap">
          <div
            v-for="(i, index) in ingredients1"
            :key="index"
            class="flex gap-2"
          >
            <div>{{ i }}</div>
            <div v-if="index + 1 != ingredients1.length">、</div>
          </div>
        </v-card-text>
      </v-card-item>
        </v-col>
        <v-col cols="auto" sm="auto" v-if="ingredients2.length > 0">
          <v-card-item >
        <v-card-title class=" font-bold sm-text-6 text-4">後調</v-card-title>
        <v-card-text class="flex gap-2 text-center justify-center sm-text-5 text-4 max-w-[80vw] flex-wrap">
          <div
            v-for="(i, index) in ingredients2"
            :key="index"
            class="flex gap-2"
          >
            <div>{{ i }}</div>
            <div v-if="index + 1 != ingredients2.length">、</div>
          </div>
        </v-card-text>
      </v-card-item>
        </v-col>
      </v-row>
    </v-card>
  
    <v-row class="border-t ">
      <v-col cols="10" v-for="i in data?.product_images_common" class="m-a">
        <v-img :src="i.image_url"> </v-img>
      </v-col>
    </v-row>
    <div class="my-4">
      <h3 class="text-6  py-4">相似的商品</h3>
      <v-row class="border-[#ECBD69] rounded justify-center flex-grow-0 bg-white/80 border-solid border-1px">
        <v-col v-for="i in moreproductData">
          <Product_card :prop_data="i"></Product_card>
        </v-col>
      </v-row>
    </div>
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
      <v-btn color="blue" variant="text" @click="cartalter1 = false"> x </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="cartalter0" :timeout="5000">
    加入購物車失敗 QAQ

    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="cartalter0 = false"> x </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
