<script setup lang="ts">
import { ref, reactive, onUnmounted } from "vue";
import {
  selectPeers,
  HMSPeer,
  HMSTrackID,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
} from "@100mslive/hms-video-store";
import { hmsStore, hmsActions } from "../hms";

const videoRefs: any = reactive({});
const remotePeerProps: any = reactive({});
const allPeers = ref<HMSPeer[]>([]);
const isAudioEnabled = ref(hmsStore.getState(selectIsLocalAudioEnabled));
const isVideoEnabled = ref(hmsStore.getState(selectIsLocalVideoEnabled));

enum MediaState {
  isAudioEnabled = "isAudioEnabled",
  isVideoEnabled = "isVideoEnabled",
}

onUnmounted(() => {
  if (allPeers.value.length) leaveMeeting();
});

const leaveMeeting = () => {
  hmsActions.leave();
};

const onAudioChange = (newAudioState: boolean) => {
  isAudioEnabled.value = newAudioState;
};
const onVideoChange = (newVideoState: boolean) => {
  isVideoEnabled.value = newVideoState;
};

const onPeerAudioChange = (isEnabled: boolean, peerId: string) => {
  if (videoRefs[peerId]) {
    remotePeerProps[peerId][MediaState.isAudioEnabled] = isEnabled;
  }
};
const onPeerVideoChange = (isEnabled: boolean, peerId: string) => {
  if (videoRefs[peerId]) {
    remotePeerProps[peerId][MediaState.isVideoEnabled] = isEnabled;
  }
};

const renderPeers = (peers: HMSPeer[]) => {
  allPeers.value = peers;
  peers.forEach((peer: HMSPeer) => {
    if (videoRefs[peer.id]) {
      hmsActions.attachVideo(peer.videoTrack as HMSTrackID, videoRefs[peer.id]);

      // If the peer is a remote peer, attach a listener to get video and audio states
      if (!peer.isLocal) {
        // Set up a property to track the audio and video states of remote peer so that
        if (!remotePeerProps[peer.id]) {
          remotePeerProps[peer.id] = {};
        }
        remotePeerProps[peer.id][MediaState.isAudioEnabled] = hmsStore.getState(
          selectIsPeerAudioEnabled(peer.id)
        );
        remotePeerProps[peer.id][MediaState.isVideoEnabled] = hmsStore.getState(
          selectIsPeerVideoEnabled(peer.id)
        );

        // Subscribe to the audio and video changes of the remote peer
        hmsStore.subscribe(
          (isEnabled) => onPeerAudioChange(isEnabled, peer.id),
          selectIsPeerAudioEnabled(peer.id)
        );
        hmsStore.subscribe(
          (isEnabled) => onPeerVideoChange(isEnabled, peer.id),
          selectIsPeerVideoEnabled(peer.id)
        );
      }
    }
  });
};

const toggleAudio = async () => {
  const enabled = hmsStore.getState(selectIsLocalAudioEnabled);
  await hmsActions.setLocalAudioEnabled(!enabled);
};

const toggleVideo = async () => {
  const enabled = hmsStore.getState(selectIsLocalVideoEnabled);
  await hmsActions.setLocalVideoEnabled(!enabled);
  // rendering again is required for the local video to show after turning off
  renderPeers(hmsStore.getState(selectPeers));
};

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
            flex
            justify-center
            items-center
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
          <span
            class="inline-block w-6"
            v-show="
              (peer.isLocal && isAudioEnabled) ||
              (!peer.isLocal &&
                remotePeerProps?.[peer.id]?.[MediaState.isAudioEnabled])
            "
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke="#FFF"
                fill="#FFF"
                d="m23 14v3a7 7 0 0 1 -14 0v-3h-2v3a9 9 0 0 0 8 8.94v2.06h-4v2h10v-2h-4v-2.06a9 9 0 0 0 8-8.94v-3z"
              />
              <path
                stroke="#FFF"
                fill="#FFF"
                d="m16 22a5 5 0 0 0 5-5v-10a5 5 0 0 0 -10 0v10a5 5 0 0 0 5 5z"
              />
              <path d="m0 0h32v32h-32z" fill="none" />
            </svg>
          </span>
          <span
            class="inline-block w-6"
            v-show="
              (peer.isLocal && !isAudioEnabled) ||
              (!peer.isLocal &&
                !remotePeerProps?.[peer.id]?.[MediaState.isAudioEnabled])
            "
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#FFF"
                d="m23 17a7 7 0 0 1 -11.73 5.14l1.42-1.41a5 5 0 0 0 8.31-3.73v-4.58l9-9-1.41-1.42-26.59 26.59 1.41 1.41 6.44-6.44a8.91 8.91 0 0 0 5.15 2.38v2.06h-4v2h10v-2h-4v-2.06a9 9 0 0 0 8-8.94v-3h-2z"
              />
              <path
                fill="#FFF"
                d="m9 17.32c0-.11 0-.21 0-.32v-3h-2v3a9 9 0 0 0 .25 2.09z"
              />
              <path fill="#FFF" d="m20.76 5.58a5 5 0 0 0 -9.76 1.42v8.34z" />
              <path d="m0 0h32v32h-32z" fill="none" />
            </svg>
          </span>
          <span class="inline-block">
            {{ peer.isLocal ? `You (${peer.name})` : peer.name }}</span
          >
        </p>

        <p
          class="text-white text-center absolute top-1/2 right-0 left-0"
          v-show="
            (peer.isLocal && !isVideoEnabled) ||
            (!peer.isLocal &&
              !remotePeerProps?.[peer.id]?.[MediaState.isVideoEnabled])
          "
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
