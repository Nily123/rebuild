<script setup lang="ts">
import navcom from './nav.vue';
import foot from './foot.vue';
import { RouterView } from 'vue-router';

</script>

<template>
    <v-app class="w-full">
        <navcom/>
        <RouterView class="w-100vw min-h-[calc(100%-50px)] pt-[75px] bg-[#FCFCF8]"/>
        <foot/>
    </v-app>
</template>

<style scoped>
</style>  