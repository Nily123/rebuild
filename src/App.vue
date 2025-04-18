<script setup lang="ts">
import { onMounted } from "vue";
import layout from "./components/layout/layout.vue";
import { useUserStore } from "./stores";
import { getUserInfo } from "./api/auth";
const userStore = useUserStore();
// onMounted(async () => {
//   userStore.loadUserFromSession();

//   // 每次掛載都向後端刷新一次狀態
//   if (userStore.user) {
//     try {
//       const updatedUser = await getUserInfo(userStore.user.id);
//       if (updatedUser.status == 200) {
//         console.log('1');
//         userStore.setUser(updatedUser);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });
</script>

<template>
  <layout class="bg-[#FCFCF8]" />
</template>

<style scoped></style>
