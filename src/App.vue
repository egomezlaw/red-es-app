<template>
  <div id="app" class="text-white bg-black"
    @click="handleUserEvent"
    @keydown="handleUserEvent"
    tabindex="0">
    <Header></Header>
    <button @click="openDataWindow"class="bg-[#DD0031] text-white font-bold py-4 px-8 rounded" v-if="dataWnd==null">ABRIR VENTANA DE RESULTADOS</button>
    <template v-if="dataWnd">
      <TextAnimator v-if="isIdle" text="Descubre, punto por punto, un mundo de transformación digital" image="/images/hand.png" :arrow="true"/>
      <FilterHome v-if="!isIdle" :schools_data="schoolsData"/>
    </template>
  </div>
</template>

<script>
import school_json from './data/schools.json'
export default {
  name: 'App', 
  data(){
    return{
      isIdle:true,
      dataWnd:null,
      inactivityTimer:0,
      schoolsData: school_json  
    }
  },
  methods: {

    handleUserEvent(){
      this.isIdle = false;
      this.sendMessageToWindow("awake");
      
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(this.handleInactivity, 60000);
    },

    handleInactivity(){
      this.isIdle = true;
      this.sendMessageToWindow("sleep");

    },

    openDataWindow() {
      // Open the window
      this.dataWnd = window.open('/results.html', 'fullscreen=yes');

    },
    sendMessageToWindow(message) {
      // Send a message to the new window
      if (this.dataWnd) {
        this.dataWnd.postMessage({ type: 'MESSAGE_FROM_PARENT', data: message }, '*');
      } else {
        console.error('New window is not open');
      }
    },

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