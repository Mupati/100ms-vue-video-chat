<script setup lang="ts">
import { ref } from "vue";
import { selectIsConnectedToRoom } from "@100mslive/hms-video-store";
import { hmsStore } from "./hms";
import Join from "./components/Join.vue";
import Conference from "./components/Conference.vue";

const isConnected = ref(false);
const onConnection = (connectionState: boolean | undefined) => {
  console.log("CONNECTION_STATE: ", connectionState);
  isConnected.value = Boolean(connectionState);
};

hmsStore.subscribe(onConnection, selectIsConnectedToRoom);
</script>

<template>
  <div class="px-auto pt-10">
    <Conference v-if="isConnected" />
    <Join v-else />
  </div>
</template>

<style>
</style>
