<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getvendor, getvendor_id } from '@/api/vendor';
import Product_card from '@/components/components/product_card.vue';

interface Vendor {
  id: number;
  name: string;
  website: string;
  description: string;
  sub_title: string;
  img_icon: string;
  img_pic: string;
  slug:string;
}

interface ProductInfo {
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

const route = useRoute("/vendor/[VendorName]");
const vendorName = route.params.VendorName as string;

const vendorData = ref<Vendor | null>(null);
const productData = ref<ProductInfo[] | null>(null);

const fetchData = async (slug: string) => {
  try {
    const vendorRes = await getvendor();
    if (vendorRes.status === 200) {
      const vendorList: Vendor[] = vendorRes.data;
      const found = vendorList.find(v => v.slug === slug);
      if (found) {
        vendorData.value = found;

        const detailRes = await getvendor_id(found.id);
        if (detailRes.status === 200) {
          productData.value = detailRes.data;
        }
      }
    }
  } catch (err) {
    console.error('fetchData error:', err);
  }
};

onMounted(() => {
  fetchData(vendorName);
});
</script>

<template>
  <div v-if="vendorData && productData">
    <v-container class="px-0 pt-0">
      <v-card class="rounded-0 mb-8 mt-0 pt-0">   
        <v-img class="w-full sticky" cover min-height="100" max-height="300" :src="vendorData.img_pic">
          <v-card-item class="bg-gradient-linear shape-[45deg] from-black/50 via-gray/10 to-white/10 absolute bottom-0 w-full">
            <v-card-subtitle class="text-white font-800 text-left">{{ vendorData.sub_title }}</v-card-subtitle>
            <v-card-title style="line-height:1.3" class="text-white font-1000 text-24 m-0 p-0 line-height-none text-left">{{ vendorData.name }}</v-card-title>
          </v-card-item>
        </v-img>
      </v-card>
      <v-row>
        <v-col v-for="item in productData" :key="item.special_code">
          <Product_card :prop_data="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <p>Loading or vendor not found...</p>
  </div>
</template>

<style scoped></style>
