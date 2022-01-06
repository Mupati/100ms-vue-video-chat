import {
  HMSReactiveStore,
  // selectIsConnectedToRoom,
  // selectIsLocalAudioEnabled,
  // selectIsLocalVideoEnabled,
  // selectPeers,
} from "@100mslive/hms-video-store";

const hmsManager = new HMSReactiveStore();
hmsManager.triggerOnSubscribe();
// const hmsStore = hmsManager.getStore();
const hmsActions = hmsManager.getHMSActions();

export const joinRoom = (name: string, room: string) => {
  hmsActions.join({
    userName: name,
    authToken: room,
  });
};
