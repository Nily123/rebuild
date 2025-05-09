<script setup lang="ts">
interface vendor {
  id: number;
  name: string;
  website: string;
  description: string;
  sub_title: string;
  img_icon: string;
  img_pic: string;
  slug:string;
}
defineProps<{
  prop_data: vendor;
}>();
</script>

<template>
<router-link :to="`/vendor/${prop_data.slug}`">
  <v-card
    class="mx-auto xl-max-w-[400px] xl-w-[25vw] lg-w-[30vw] sm-w-[40vw] w-[300px]"
    hover
  >
  
    <v-img
      class="align-end text-white"
      height="200"
      :src="prop_data.img_pic"
      cover
    >
    </v-img>
    <template v-slot:prepend>
      <v-avatar size="24">
        <v-img :src="prop_data.img_icon"></v-img>
      </v-avatar>
    </template>
    <v-card-title> {{ prop_data.name }}</v-card-title>
    <v-card-subtitle class="py-2">
      {{ prop_data.sub_title }}
    </v-card-subtitle>
  
  </v-card></router-link>
</template>

<style scoped></style>
