import axios from "axios";
import { HMSReactiveStore } from "@100mslive/hms-video-store";
import { HmsTokenRes } from "./types";

const FUNCTION_BASE_URL = "/.netlify/functions";
const hmsManager = new HMSReactiveStore();

export const hmsStore = hmsManager.getStore();
export const hmsActions = hmsManager.getHMSActions();

export const fetchTokens = async (
  name: string,
  room: string
): Promise<HmsTokenRes | any> => {
  try {
    // create or fetch the room_id
    const roomRes = await axios.post(
      `${FUNCTION_BASE_URL}/createRoom`,
      { name, room },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = roomRes;

    // Generate the app/authToken
    const tokenRes = await axios.post(
      `${FUNCTION_BASE_URL}/generateAppToken`,
      {
        user_id: data.user,
        room_id: data.id,
        role: "host",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      user_id: data.user,
      room_id: data.id,
      authToken: tokenRes.data,
    };
  } catch (error: any) {
    throw error;
  }
};
