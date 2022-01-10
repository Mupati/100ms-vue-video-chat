<script setup lang="ts">
import { onDeactivated } from "vue";
import { selectPeers, HMSPeer } from "@100mslive/hms-video-store";
import { hmsStore, hmsActions } from "../hms";

const peers = hmsStore.getState(selectPeers);
console.log(peers);

defineProps<{ msg?: string; title?: String }>();

onDeactivated(() => {
  leaveMeeting();
});

const leaveMeeting = () => {
  console.log("Leaving the Meeting");
  hmsActions.leave();
};

const renderPeers = (peers: HMSPeer[]) => {
  console.log("peers inside renderPeers: ", peers);
};

hmsStore.subscribe(renderPeers, selectPeers);
</script>

<template>
  <p>This is where we render the video call screens</p>
  <button @click="leaveMeeting">Leave Meeting</button>
</template>

<style scoped>
</style>
