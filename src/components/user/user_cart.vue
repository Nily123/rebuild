<script setup lang="ts">
import { getCartByUserId } from "@/api/cart";
import router from "@/router";
import { useUserStore } from "@/stores";
import { ref } from "vue";
import Check from "../components/check.vue";

interface CartItem {
  id: number;
  special_code: string;
  quantity: number;
  product_id: number;
  capacity: number;
  price: number;
  image_url: string;
  name: string;
  special_code0: string;
}
interface BuyItem {
  special_code: string;
  quantity: number;
  price: number;
}
const dialogVisible = ref(false)
const store = useUserStore();
const id = store.user.id;
const data = ref<CartItem[]>([]);
const buyItems = ref<BuyItem[]>([]);

const total_number = ref<number>(0);
const total_cost = ref<number>(0);

const getdata = async () => {
  try {
    const res = await getCartByUserId(id);
    if (res.status == 200) {
      data.value = res.data.carts;
    }
  } catch (err) {
    console.log(err);
  }
};

// 勾選或取消勾選的邏輯
const toggleItem = (item: CartItem) => {
  const idx = buyItems.value.findIndex(
    (buy) => buy.special_code === item.special_code
  );
  if (idx === -1) {
    // 沒有選過 -> 加入
    buyItems.value.push({
      special_code: item.special_code,
      quantity: item.quantity,
      price: item.price,
    });
  } else {
    // 已選過 -> 移除
    buyItems.value.splice(idx, 1);
  }
  updateTotals();
};

// 計算總數量跟總金額
const updateTotals = () => {
  total_number.value = buyItems.value.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  total_cost.value = buyItems.value.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
};
const delcart = async(special_code:string) =>{
    const res = await store.DelToCarts(special_code);
    if(res?.status == 200){
        router.go(0);
    }
}
getdata();
</script>

<template>
  <v-container class=" sm-w-[60vw] mx-a sm-min-w-[500px]" >
    <div class="sm-h-[630px] overflow-auto w-[100%]">
      <v-row class="w-[100%] items-center text-3 sm-text-4">
        <v-col cols="0" sm="1">

        </v-col>
        <v-col cols="2" sm="2">
            
        </v-col>
        <v-col cols="4" sm="5">
            名稱
        </v-col>
        <v-col cols="2" sm="1">
         數量   
        </v-col>
        <v-col cols="2" sm="2">
            金額
        </v-col>
        <v-col cols="2" sm="1">
            刪除
        </v-col>
      </v-row>
      <v-row
        v-if="data"
        v-for="(item, index) in data"
        :key="item.special_code"
        class="w-[100%] items-center border-t-solid border-t-1px border-[#BC8E40] text-3 sm-text-4"
      >
        <v-col class="gap-2">
          <v-checkbox
          class="items-center translate-y-8px"
            :model-value="
              buyItems.some((buy) => buy.special_code === item.special_code)
            "
            @change="toggleItem(item)"
        /></v-col>
        <v-col cols="2" sm="2">
          <v-img
            :src="item.image_url"
            max-width="50"
            cover
            @click="$router.push(`/products/${item.special_code0}`)"
          ></v-img
        ></v-col>
        <v-col
           cols="3" sm="5"
          @click="$router.push(`/products/${item.special_code0}`)"
        >
          {{ item.name }}
        </v-col>
        <v-col>
          <div  cols="2" sm="2">
            {{ item.quantity }}
          </div>
        </v-col>
        <v-col  cols="2" sm="2">
          <div>
            {{ item.quantity * item.price }}
          </div>
        </v-col>
        <v-col  cols="2" sm="1">
          <v-btn icon="mdi-trash-can-outline" variant="text" @click="delcart(item.special_code)"></v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        尚無購物車內容
      </v-row>
    </div>

    <div class="my-4">
      <v-row class="border-t">
        <v-spacer></v-spacer>
        <v-col> 共 {{ total_number }} 項 </v-col>
        <v-col> $ {{ total_cost }} </v-col>
        <v-col>
          <v-btn variant="tonal" color="blue" @click="dialogVisible = true"> 去結帳 </v-btn>
        </v-col>
      </v-row>
    </div>
    
    <Check v-if="dialogVisible" :prop_data="{buyItems,data}"  v-model:visible="dialogVisible" />

  </v-container>
</template>
