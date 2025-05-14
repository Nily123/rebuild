<script setup lang="ts">
</script>

<template>
    <div
    class="w-[100vw] h-a items-center border-4 border-t-double border-[#C99F5C]">
        <v-row class="items-center m-0 sm-text-3 text-2">
            <v-spacer></v-spacer>
            <v-col class="text-" cols="auto" sm="4">
                地址:xx市cc區vv北路b段n號1樓<br/>
                客服電話: (00)0000-0000
            </v-col>
            <v-col cols="auto" sm="2">
                版權所有©2025ReBuild
            </v-col>
            <v-col class="flex items-center justify-center sm-p-a px-0"  cols="auto" sm="4">
                社群連結:
                <v-btn icon="mdi-facebook" variant="text" class="text-3 sm-text-4 ic"></v-btn>
                <v-btn icon="mdi-instagram" variant="text" class="text-3 sm-text-4 ic"></v-btn>
                <v-btn icon="mdi-twitter" variant="text" class="text-3 sm-text-4 ic"></v-btn>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </div>
</template>

<style scoped>
.ic {
  width: calc(var(--v-btn-height) - 12px) !important;
  height: calc(var(--v-btn-height) - 12px) !important;
}
@media (min-width: 640px) {
.ic {
  width: calc(var(--v-btn-height) + 12px) !important;
  height: calc(var(--v-btn-height) + 12px) !important;
}
}
</style>