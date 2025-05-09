<script setup lang="ts">
import { getAllProductsCard } from "@/api/product";
import { computed, ref } from "vue";
import product_card from "@/components/components/product_card.vue";
import product_filter from "@/components/components/product_filter.vue";
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
  special_code0: string;
}
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
getpro_ids();
</script>

<template>
  <v-container class="w-full sm-w-[85%] flex items-start">
    <product_filter
      @update-filters="handleFilterUpdate"
      class="sm-w-20% w-[30%] sm-px-4"
    ></product_filter>

    <v-row
      class="sm-w-80% w-[70%]"
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
  </v-container>
</template>

<style scoped></style>
