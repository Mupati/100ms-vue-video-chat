// import {
//   HMSReactiveStore,
//   selectIsConnectedToRoom,
//   selectIsLocalAudioEnabled,
//   selectIsLocalVideoEnabled,
//   selectPeers,
// } from "@100mslive/hms-video-store";

// const hmsManager = new HMSReactiveStore();
// hmsManager.triggerOnSubscribe();
// const hmsStore = hmsManager.getStore();
// const hmsActions = hmsManager.getHMSActions();

export const joinRoom = async (name: string, room: string) => {
  const res = await fetch("/.netlify/functions/createRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, room }),
  });

  console.log(res?.json());

  // hmsActions.join({
  //   userName: name,
  //   authToken: room,
  // });
};
