<script setup lang="ts">
import { ref } from "vue";
import manage_product from "@/components/components/manage/manage_product.vue";
import manage_order from "@/components/components/manage/manage_order.vue";
import manage_user from "@/components/components/manage/manage_user.vue";
import manage_activity from "@/components/components/manage/manage_activity.vue";

const windowWidth = ref(window.innerWidth);
// 先從路由讀 section
const currentSection = ref('manage_user');

const drawer = ref(false);
console.log(windowWidth);
</script>

<template>
  <v-container>
    
<div class="h-[50px] bg-[#E6AE4F] m-a text-left">
  <v-btn variant="text" v-show="windowWidth <= 425" @click.stop="drawer = !drawer" icon="mdi-format-list-bulleted"></v-btn>
</div>
    <div class="flex flex-row min-h-[80vh] pt-4  border-b-[#E6AE4F] border-b-solid border-b-2px">
      <v-navigation-drawer
        v-model="drawer"
        mobile-breakpoint="sm"
        :location="$vuetify.display.sm ? 'left' : 'bottom'"
        temporary
      >
      <v-tabs
        v-model="currentSection"
        color="primary"
        direction="vertical"
        class="mx-2"
        
      >
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-account" text="用戶管理" value="manage_user"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-bottle-tonic" text="商品管理" value="manage_product"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-cart" text="訂單管理" value="manage_order"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-text-box" text="活動管理" value="manage_activity"></v-tab>
      </v-tabs>
      </v-navigation-drawer>
      <v-tabs
        v-if="windowWidth > 425"
        v-model="currentSection"
        color="primary"
        direction="vertical"
        class="mx-2"
        
      >
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-account" text="用戶管理" value="manage_user"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-bottle-tonic" text="商品管理" value="manage_product"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-cart" text="訂單管理" value="manage_order"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-text-box" text="活動管理" value="manage_activity"></v-tab>
      </v-tabs>
      <v-tabs-window v-model="currentSection" class="mx-a w-auto">
        <v-tabs-window-item value="manage_user" class="sm-w-a w-[90vw] mx-0">
          <manage_user/>
        </v-tabs-window-item>

        <v-tabs-window-item value="manage_product" class="w-auto">
          <manage_product/>
        </v-tabs-window-item>

        <v-tabs-window-item value="manage_order" class="w-auto">
          <manage_order/>
        </v-tabs-window-item>

        <v-tabs-window-item value="manage_activity" class="w-auto">
          <manage_activity/>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-container>
</template>
