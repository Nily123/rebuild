<script setup lang="ts">
import { getAllProductsCard } from "@/api/product";
import { computed, ref } from "vue";
import product_card from "@/components/components/product_card.vue";
import product_filter from "@/components/components/product_filter.vue";
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
const windowWidth = ref(window.innerWidth);
const drawer = ref(false);
const ids = ref<product_info[]>([]);
const fil_ids = ref<product_info[]>([]);
const getpro_ids = async () => {
  const res = await getAllProductsCard();
  if (res.status == 200) {
    ids.value = res.data;
    fil_ids.value = res.data;
  }
};
// 來自子組件的篩選條件
const selectedNames = ref<string[]>([]);
const selectedNotes = ref<string[]>([]);
const ifselected = ref(0);
// 處理從子組件來的篩選條件
const handleFilterUpdate = (filters: {
  names: string[];
  notes: string[];
  selected: number;
}) => {
  selectedNames.value = filters.names;
  selectedNotes.value = filters.notes;
  ifselected.value = filters.selected;
};
const filteredProducts = computed(() => {
  switch (ifselected.value) {
    case 0:
      return ids.value;
    case 1:
      return ids.value.filter((p) => {
        const nameMatch =
          selectedNames.value.length !== 0
            ? selectedNames.value.some((name) => p.product_name?.includes(name))
            : true;

        return nameMatch;
      });
    case 2:
      return ids.value.filter((p) => {
        const noteMatch =
          selectedNotes.value.length !== 0
            ? Array.isArray(p.ingredients?.香調) &&
              selectedNotes.value.some((note) =>
                p.ingredients.香調.some((n) => n.includes(note))
              )
            : true;

        return noteMatch;
      });
    case 3:
      return ids.value.filter((p) => {
        const nameMatch =
          selectedNames.value.length !== 0
            ? selectedNames.value.some((name) => p.product_name?.includes(name))
            : true;

        const noteMatch =
          selectedNotes.value.length !== 0
            ? Array.isArray(p.ingredients?.香調) &&
              selectedNotes.value.some((note) =>
                p.ingredients.香調.some((n) => n.includes(note))
              )
            : true;

        return nameMatch || noteMatch;
      });
  }
});

const top =()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
}
getpro_ids();
</script>

<template>
  <v-container class="w-full sm-w-[85%] flex items-start">
    <product_filter
      v-if="windowWidth > 425"
      @update-filters="handleFilterUpdate"
      class="sm-w-20% w-[30%] sm-px-4"
    ></product_filter>
    <v-navigation-drawer
      v-model="drawer"
      mobile-breakpoint="sm"
      :location="$vuetify.display.sm ? 'bottom' : 'left'"
      temporary
      v-if="windowWidth <= 425"
    >
      <product_filter
        @update-filters="handleFilterUpdate"
        class="w-[100%] sm-px-4"
      ></product_filter>
    </v-navigation-drawer>
    <v-row
      class="sm-w-80% w-[70%] mr-a"
      align-item="left"
      align-content="center"
      justify="space-evenly"
    >
      <v-col
        cols="6"
        sm=""
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <product_card :prop_data="product"></product_card>
      </v-col>
    </v-row>
    <div v-if="windowWidth <= 425" class="bg-w border-1px border-solid bg-[#FFE38D] border-[#F3C251] w-[40px] h-[40px] fixed bottom-[45px] right-[3%] rounded-full ">
    <v-speed-dial
      location="top left"
      transition="slide-y-reverse-transition"
      v-show="windowWidth <= 425"
      close-on-content-click
    >
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab
          class="fixed bottom-[55px] right-[8%] text-[#F3C251]"
          color="#FFE38D"
          v-bind="activatorProps"
          size="4"
          icon="mdi-format-list-bulleted"
        ></v-fab>
      </template>
      <v-btn
        key="1"
        icon="mdi-filter-outline"
        @click.stop="drawer = !drawer"
      ></v-btn>
      <v-btn key="2" icon="mdi-cart-outline" to="/user/user_order"></v-btn>
      <v-btn key="3" icon="mdi-chevron-up" @click="top()"></v-btn>
    </v-speed-dial>
    </div>
  </v-container>
</template>

<style scoped></style>
