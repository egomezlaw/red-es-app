<template>
  <div id="app" class="text-white bg-black"
    @click="handleUserEvent"
    @keydown="handleUserEvent"
    tabindex="0">
    <Header></Header>
    <!-- <button @click="openDataWindow"class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Open Fullscreen Windows</button> -->
    <!-- <button @click="sendMessageToNewWindow" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send Message</button> -->
    <TextAnimator v-if="isIdle" text="Descubre, punto por punto, un mundo de transformación digital"/>
    <FilterHome v-if="!isIdle" :schools_data="schoolsData"/>
  </div>
</template>

<script>
import school_json from './data/schools.json'
export default {
  name: 'App', 
  data(){
    return{
      isIdle:true,
      inactivityTimer:0,
      schoolsData: school_json  
    }
  },
  methods: {

    handleUserEvent(){
      this.isIdle = false;
      /*clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(this.handleInactivity, 60000);*/
    },

    handleInactivity(){
      this.isIdle = true;
    },

    openDataWindow() {
      // Open the first window
      this.data_window = window.open('/DataWindow', 'DataWindow', 'fullscreen=yes');
      this.enterFullscreen(data_window);

    },
    sendMessageToNewWindow() {
      // Send a message to the new window
      if (this.data_window) {
        this.data_window.postMessage('Hello from Main Window', '*');
      } else {
        console.error('New window is not open');
      }
    },
    enterFullscreen(win) {
      if (win.document.documentElement.requestFullscreen) {
        win.document.documentElement.requestFullscreen();
      } else if (win.document.documentElement.mozRequestFullScreen) { // Firefox
        win.document.documentElement.mozRequestFullScreen();
      } else if (win.document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, etc.
        win.document.documentElement.webkitRequestFullscreen();
      } else if (win.document.documentElement.msRequestFullscreen) { // IE/Edge
        win.document.documentElement.msRequestFullscreen();
      }
    }
  }
};
</script>

<style>
html {
  background-color: black;
  /*color: white;*/
}


#app {
  text-align: center;
  margin-top: 50px;
}
</style>