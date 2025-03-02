<template>
    <button @click="openDataWindow" class="bg-[#DD0031] text-white font-bold py-4 px-8 rounded mt-100" v-if="dataWnd==null">ABRIR VENTANA DE RESULTADOS</button>
  <div class="text-white bg-black"
    @click="handleUserEvent"
    @keydown="handleUserEvent"
    @touchstart="handleUserEvent" 
    @touchmove="handleUserEvent" 
    @touchend="handleUserEvent"
    @wheel="handleUserEvent"
    tabindex="0">
    
    <Header></Header>
    <template v-if="dataWnd">
      <NavButton v-if="!isIdle" @click="inProjects = !inProjects" class="click-option">{{navigationLabel}}</NavButton>
      <TextAnimator v-if="isIdle" text="Descubre, punto por punto, un mundo de transformación digital" image="/images/hand.png" :arrow="true"/>
      <Schools v-if="!inProjects" :projects_data="allProjects" @on-message="sendMessageToWindow"></Schools>
      <Projects v-if="inProjects" :projects_data="allProjects" @on-message="sendMessageToWindow"></Projects>
    </template>
  </div>
</template>

<script>
import school_json from './data/schools.json';
import projects_json from './data/data.json?';
import locations_json from './data/locations.json';
import DataProject from './data/DataProject';
import DataProjectList from './data/DataProjectList';
export default {
  name: 'App', 
  data(){
    return{
      isIdle:true,
      inProjects:false,
      childWnd:null,
      inactivityTimer:0,
      schoolsData: school_json,
      locationsData: locations_json,
    }
  },
  allProjects:null, 
  mounted(){
    this.allProjects = new DataProjectList({projects:projects_json, locations:locations_json});
    this.allProjects.raw_schools_data = school_json;
  },

  methods: {
    handleUserEvent(){
      if(!this.dataWnd){
        return;
      }

      this.isIdle = false;
      this.sendMessageToWindow("awake");

      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(this.handleInactivity, 120000);
    },

    handleInactivity(){
      this.isIdle = true;
      this.inProjects = false;
      this.sendMessageToWindow("sleep");
    },

    openDataWindow(event) {
      // Open the window
      event.preventDefault();
      this.childWnd = window.open('/results.html', 'fullscreen=yes');
    },
    

    sendMessageToWindow(message) {
      // Send a message to the new window
      if (this.dataWnd) {
        this.dataWnd.postMessage({ type: 'MESSAGE_FROM_PARENT', data: message }, '*');
      } else {
        console.error('New window is not open');
      }
    },

  },

  computed: {
    dataWnd(){
      return this.childWnd;
    },
    navigationLabel(){
      if (this.inProjects){
        return "Búsqueda por Ámbito";
      }
        return  "Búsqueda Avanzada";
    }
  }
};
</script>

<style>
html {
  background-color: black;
  touch-action: none;
  /*color: white;*/
}


#app {
  text-align: center;
/*  margin-top: 50px;*/
}
</style>