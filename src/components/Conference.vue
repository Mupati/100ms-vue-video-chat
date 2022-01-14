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
  if (allPeers.value.length) leaveMeeting();
});

const leaveMeeting = () => {
  hmsActions.leave();
};

const isAudioEnabled = ref(hmsStore.getState(selectIsLocalAudioEnabled));
const isVideoEnabled = ref(hmsStore.getState(selectIsLocalVideoEnabled));

const onAudioChange = (newAudioState: boolean) => {
  isAudioEnabled.value = newAudioState;
};
const onVideoChange = (newVideoState: boolean) => {
  isVideoEnabled.value = newVideoState;
};

const toggleAudio = async () => {
  const enabled = hmsStore.getState(selectIsLocalAudioEnabled);
  await hmsActions.setLocalAudioEnabled(!enabled);
};

const toggleVideo = async () => {
  const enabled = hmsStore.getState(selectIsLocalVideoEnabled);
  await hmsActions.setLocalVideoEnabled(!enabled);
  renderPeers(hmsStore.getState(selectPeers));
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

// HMS Listeners
hmsStore.subscribe(renderPeers, selectPeers);
hmsStore.subscribe(onAudioChange, selectIsLocalAudioEnabled);
hmsStore.subscribe(onVideoChange, selectIsLocalVideoEnabled);
</script>

<template>
  <main class="mx-10 min-h-[80vh]">
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
        <p
          class="text-white text-center absolute top-1/2 right-0 left-0"
          v-if="!isVideoEnabled"
        >
          Camera Off
        </p>
      </div>
    </div>

    <div
      class="mx-auto mt-10 flex items-center justify-center"
      v-if="allPeers.length"
    >
      <button
        class="bg-teal-800 text-white rounded-md p-3 block"
        @click="toggleAudio"
      >
        {{ isAudioEnabled ? "Mute" : "Unmute" }} Microphone
      </button>
      <button
        class="bg-indigo-400 text-white rounded-md p-3 block mx-5"
        @click="toggleVideo"
      >
        {{ isVideoEnabled ? "Mute" : "Unmute" }} Camera
      </button>
      <button
        class="bg-rose-800 text-white rounded-md p-3 block"
        @click="leaveMeeting"
      >
        Leave Meeting
      </button>
    </div>
    <div v-else>
      <p class="text-white text-center font-bold text-2xl">
        Hold On!, Loading Video Tiles...
      </p>
    </div>
  </main>
</template>

<style scoped>
</style>
