<script setup lang="ts">
import { ref, reactive, onUnmounted } from "vue";
import {
  selectPeers,
  HMSPeer,
  HMSTrackID,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from "@100mslive/hms-video-store";
import { hmsStore, hmsActions } from "../hms";

onUnmounted(() => {
  leaveMeeting();
});

const leaveMeeting = () => {
  hmsActions.leave();
};

const isAudioEnabled = ref(hmsStore.getState(selectIsLocalAudioEnabled));
const isVideoEnabled = ref(hmsStore.getState(selectIsLocalVideoEnabled));

const toggleAudio = async () => {
  const enabled = hmsStore.getState(selectIsLocalAudioEnabled);
  isAudioEnabled.value = enabled;
  await hmsActions.setLocalAudioEnabled(!enabled);
};

const toggleVideo = async () => {
  const enabled = hmsStore.getState(selectIsLocalVideoEnabled);
  isVideoEnabled.value = Boolean(enabled);
  await hmsActions.setLocalVideoEnabled(!enabled);
};

const videoRefs: any = reactive({});
const allPeers = ref<HMSPeer[]>([]);

function renderPeers(peers: HMSPeer[]) {
  allPeers.value = peers;
  peers.forEach((peer: HMSPeer) => {
    if (videoRefs[peer.id]) {
      hmsActions.attachVideo(peer.videoTrack as HMSTrackID, videoRefs[peer.id]);
    }
  });
}
hmsStore.subscribe(renderPeers, selectPeers);
</script>

<template>
  <main class="mx-10">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 my-6">
      <div v-for="peer in allPeers" :key="peer.id" class="relative">
        <video
          autoplay
          :muted="peer.isLocal"
          playsinline
          class="h-full w-full object-cover"
          :ref="
            (el) => {
              if (el) videoRefs[peer.id] = el;
            }
          "
        ></video>
        <p
          class="
            py-1
            px-2
            text-sm
            font-medium
            bg-black bg-opacity-80
            text-white
            pointer-events-none
            absolute
            bottom-0
            left-0
          "
        >
          {{ peer.isLocal ? "You" : peer.name }}
        </p>
      </div>
    </div>

    <div class="mx-auto mt-10 flex items-center justify-center">
      <button
        class="bg-teal-800 text-white rounded-md p-3 block"
        @click="toggleAudio"
      >
        {{ !isAudioEnabled ? "Mute" : "Unmute" }} Microphone
      </button>
      <button
        class="bg-indigo-400 text-white rounded-md p-3 block mx-5"
        @click="toggleVideo"
      >
        {{ !isVideoEnabled ? "Mute" : "Unmute" }} Camera
      </button>
      <button
        class="bg-rose-800 text-white rounded-md p-3 block"
        @click="leaveMeeting"
      >
        Leave Meeting
      </button>
    </div>
  </main>
</template>

<style scoped>
</style>
