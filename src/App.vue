<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld :msg="message" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { ref } from "vue";
export default {
  name: "App",
  components: {
    HelloWorld,
  },

  setup(props) {
    const message = ref("100ms with Vuejs3");
    console.log(props);

    return {
      message,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
