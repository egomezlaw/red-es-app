<template>
    <div class="window">
      <h1>Window 1</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Window1',
    mounted() {
      this.enterFullscreen();

      window.addEventListener('message', (event) => {
      console.log('Message received in DataWindow:', event.data);
    });

    },
    methods: {
      enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, etc.
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
          document.documentElement.msRequestFullscreen();
        }
      }
    },


  };
  </script>
  
  <style>
  .window {
    text-align: center;
    margin-top: 50px;
  }
  </style>