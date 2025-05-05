<script setup lang="ts">
import router from "@/router";
import { useStateStore, useUserStore } from "@/stores/index";
import { computed, ref, watch } from "vue";

const userStore = useUserStore();
const stateStore = useStateStore();
const member = ref(false);
const name = ref("");
const dialog = ref(false);
const role = ref(userStore.user?.role);
if (userStore.user) {
  name.value = userStore.user?.username;
}
const isLoggedIn = computed(() => userStore.user !== null)
const logout = () => {
  name.value = "";
  member.value = false;
  userStore.clearUser();
  router.push('/')
};
const mount = () => {
  console.log("mounttt");
  if (userStore.user) {
    name.value = userStore.user?.username;
    role.value = userStore.user?.role;
  }
};

watch(() => stateStore.justlogin, (val) => {
  if (val) {
    stateStore.justlogin = false;
    history.go(0);
  }
});

const toindex = () => {
  router.push("/");
};
mount();
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <div v-bind="props">
      <v-app-bar
        scroll-behavior="hide"
        color="white"
        density="comfortable"
        class="w-[100vw] max-h-[60px] flex z-99 hover:bg-red"
      >
        <v-img
          src="/rebuild.png"
          class="max-w-[200px] object-cover contnet-center mt-1 ml-[calc(50%-100px)] z-9 cursor-pointer"
          @click="toindex"
        />

        <v-menu v-model="member" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn color="#EAB655" icon class="absolute right-0" v-bind="props">
              <v-icon> mdi-account </v-icon>
              <v-tooltip activator="parent" location="bottom">會員</v-tooltip>
            </v-btn>
          </template>

          <v-card min-width="200" max-width="350">
            <v-list>
              <v-list-item
                v-if="isLoggedIn"
                prepend-icon="mdi-account"
                :title="name"
                class="ml-1"
              >
              </v-list-item>
              <v-list-item
                v-if="!isLoggedIn"
                prepend-icon="mdi-account"
                title="請先登入 >.0~"
              >
                <template v-slot:append>
                  <v-btn to="/login" class="ml-1">點我</v-btn>
                </template>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list v-if="isLoggedIn">
              <v-list-item v-if="role === 'customer'">
                <v-btn
                  variant="text"
                  to="/user/user_info"
                  prepend-icon="mdi-account-details"
                >
                  帳號資訊
                </v-btn>
              </v-list-item>
              <v-list-item v-if="role === 'customer'">
                <v-btn
                  variant="text"
                  to="/user/user_fav"
                  prepend-icon="mdi-heart"
                >
                  我的收藏
                </v-btn>
              </v-list-item>
              <v-list-item v-if="role === 'customer'">
                <v-btn
                  variant="text"
                  to="/user/user_cart"
                  prepend-icon="mdi-cart"
                >
                  購物車
                </v-btn>
              </v-list-item>
              <v-list-item v-if="role === 'customer'">
                <v-btn
                  variant="text"
                  to="/user/user_order"
                  prepend-icon="mdi-text-box"
                >
                  訂單紀錄
                </v-btn>
              </v-list-item>
              <v-list-item v-if="role === 'staff' || role === 'manager'">
                <v-btn
                  variant="text"
                  to="/user/manage"
                  prepend-icon="mdi-cog"
                  active-color="red"
                >
                  管理系統
                </v-btn>
              </v-list-item>
            </v-list>

            <v-card-actions v-if="isLoggedIn">
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" @click="dialog = true">
                登出
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <template v-slot:extension v-if="isHovering">
          <v-tabs class="bg-white w-full z-98">
            <v-spacer></v-spacer>
            <v-tab text="首頁" exact to="/" color="amber-lighten-1" class="hover:text-[#EAB653]"></v-tab>
            <v-tab text="香氛" exact to="/products" color="amber-lighten-1"  class="hover:text-[#EAB653]"></v-tab>
            <v-tab text="品牌" exact to="/vendor" color="amber-lighten-1" class="hover:text-[#EAB653]"></v-tab>
            <v-tab text="探索" exact to="/explore" color="amber-lighten-1" class="hover:text-[#EAB653]"></v-tab>
            <v-tab text="活動" exact to="/activity" color="amber-lighten-1" class="hover:text-[#EAB653]"></v-tab>
            <v-spacer></v-spacer>
          </v-tabs>
        </template>
      </v-app-bar>
    </div>
  </v-hover>
  <v-dialog v-model="dialog" width="auto">
    <v-card
      max-width="450"
      prepend-icon="mdi-alert-circle"
      title="您確認要登出嗎?"
    >
      <template v-slot:actions>
        <v-btn class="mx-auto" text="取消" @click="dialog = false"></v-btn>
        <v-btn class="mx-auto" text="確認" @click="logout"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
