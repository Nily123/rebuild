<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import User_fav from '@/components/user/user_fav.vue';
import User_cart from '@/components/user/user_cart.vue';
import User_info from '@/components/user/user_info.vue';
import User_order from '@/components/user/user_order.vue';

const route = useRoute();
const router = useRouter();
const windowWidth = ref(window.innerWidth);
// 先從路由讀 section
const currentSection = ref(route.path.split("/").pop() || "user_info");

// 監聽 tab 切換
watch(currentSection, (newVal) => {
  router.push(`/user/${newVal}`);
});

// 如果從外部點進來，也要跟著變
watch(
  () => route.path,
  (newPath) => {
    currentSection.value = newPath.split("/").pop() || "user_info";
  }
);
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
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-account" text="使用者資訊" value="user_info"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-heart" text="收藏的商品" value="user_fav"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-cart" text="購物車" value="user_cart"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-text-box" text="購買紀錄" value="user_order"></v-tab>
      </v-tabs>
      </v-navigation-drawer>
      <v-tabs
        v-if="windowWidth > 425"
        v-model="currentSection"
        color="primary"
        direction="vertical"
        class="mx-2"
        
      >
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-account" text="使用者資訊" value="user_info"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-heart" text="收藏的商品" value="user_fav"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-cart" text="購物車" value="user_cart"></v-tab>
        <v-tab class="mx-2 font-800" color="#E6AE4F" prepend-icon="mdi-text-box" text="購買紀錄" value="user_order"></v-tab>
      </v-tabs>
      <v-tabs-window v-model="currentSection" class="mx-a w-auto">
        <v-tabs-window-item value="user_info" class="sm-w-a w-[90vw] mx-0">
          <User_info/>
        </v-tabs-window-item>

        <v-tabs-window-item value="user_fav" class="w-auto">
          <User_fav/>
        </v-tabs-window-item>

        <v-tabs-window-item value="user_cart" class="w-auto">
          <User_cart/>
        </v-tabs-window-item>

        <v-tabs-window-item value="user_order" class="w-auto">
          <User_order/>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-container>
</template>
