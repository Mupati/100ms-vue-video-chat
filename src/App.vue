<script setup lang="ts">
import { ref } from "vue";
import { selectRoomStarted } from "@100mslive/hms-video-store";
import { hmsStore } from "./hms";
import Join from "./components/Join.vue";
import Conference from "./components/Conference.vue";

const isConnected = ref(false);
const onConnection = (connectionState: boolean | undefined) => {
  isConnected.value = Boolean(connectionState);
};

hmsStore.subscribe(onConnection, selectRoomStarted);
</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="mx-auto block h-20 w-auto"
        src="https://www.100ms.live/assets/logo.svg"
        alt="100ms"
      />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Kofi Mupati Video Call Meeting
      </h2>
    </div>
    <Conference v-if="isConnected" />
    <Join v-else />
  </div>
</template>
