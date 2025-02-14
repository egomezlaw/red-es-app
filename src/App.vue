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
      <NavButton v-if="!isIdle" @click="inProjects = !inProjects">{{navigationLabel}}</NavButton>
      <TextAnimator v-if="isIdle" text="Descubre, punto por punto, un mundo de transformación digital" image="/images/hand.png" :arrow="true"/>
      <Schools v-if="!inProjects" :schools_data="schoolsData" :locations="locationsData" @on-message="sendMessageToWindow"></Schools>
     <Projects v-if="inProjects" :projects_data="projectsData" :locations="locationsData" @on-message="sendMessageToWindow"></Projects>
    </template>
  </div>
</template>

<script>
import school_json from './data/schools.json'
import projects_json from './data/projects.json'
import locations_json from './data/locations.json'
export default {
  name: 'App', 
  data(){
    return{
      isIdle:true,
      inProjects:true,
      childWnd:null,
      inactivityTimer:0,
      schoolsData: school_json,
      projectsData: projects_json,
      locationsData: locations_json
    }
  },
  methods: {

    handleUserEvent(){
      console.log("activity detected");
      if(!this.dataWnd){
        return;
      }

      this.isIdle = false;
      this.sendMessageToWindow("awake");

      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(this.handleInactivity, 60000);
    },

    handleInactivity(){
      this.isIdle = true;
      this.inProjects = true;
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
        return "Escuelas Conectadas";
      }
        return  "Proyectos Zona red.es";
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
/*  margin-top: 50px;*/
}
</style>