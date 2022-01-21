<script setup lang="ts">
import { reactive, ref } from "vue";
import { fetchToken, hmsActions } from "../hms";

const defaultRoomName = import.meta.env.VITE_APP_DEFAULT_ROOM;
const isLoading = ref(false);
const formData = reactive({
  name: "",
  room: `${defaultRoomName}`,
});

const joinHmsRoom = async () => {
  try {
    isLoading.value = true;
    const authToken = await fetchToken(formData.name, formData.room);

    hmsActions.join({
      userName: formData.name,
      authToken: authToken,
      settings: {
        isAudioMuted: true, // Join with audio muted
      },
    });
  } catch (error) {
    alert(error);
  }

  isLoading.value = false;
};
</script>

<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-10 px-5 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" @submit.prevent="joinHmsRoom">
        <div>
          <label for="name" class="block text-sm font-2xl text-gray-700">
            Name
          </label>
          <div class="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="username"
              required
              v-model="formData.name"
              class="
                appearance-none
                block
                w-full
                px-3
                py-2
                border border-gray-300
                rounded-md
                shadow-sm
                placeholder-gray-400
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                sm:text-sm
              "
            />
          </div>
        </div>

        <div>
          <label for="room" class="block text-sm font-medium text-gray-700">
            Room
          </label>
          <div class="mt-1">
            <input
              id="room"
              name="room"
              type="text"
              required
              disabled
              v-model="formData.room"
              class="
                appearance-none
                block
                w-full
                px-3
                py-2
                border border-gray-300
                rounded-md
                shadow-sm
                placeholder-gray-400
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                sm:text-sm
                disabled:cursor-not-allowed
              "
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="formData.name === '' || isLoading"
            :class="{ 'cursor-not-allowed': isLoading }"
            class="
              w-full
              flex
              justify-center
              py-2
              px-4
              border border-transparent
              rounded-md
              shadow-sm
              text-sm
              font-medium
              text-white
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
            "
          >
            <svg
              class="animate-spin mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              v-if="isLoading"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            {{ isLoading ? "Joining..." : "Join" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>