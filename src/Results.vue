<template>
  <div class="h-screen w-screen text-white bg-black overflow-hidden">
    <TextAnimator v-if="isIdle" text="Punto por punto, el camino hacia la transformación digital" image="/images/globe.png"/>
    <template v-if="!isIdle" 
        class="flex items-start justify-items-start"
      >
      <Summary :project_data="project" ref="summaryRef" class="transition-opacity duration-250  ease-out" :class="{'opacity-100': dataLoaded, 'opacity-0': !dataLoaded}"></Summary>
    </template>
  </div>
</template>
<script>
import { nextTick, computed } from 'vue';
import locations_json from './data/locations.json'
export default {
  data() {
    return {      
      loadingData: false,
      message: '',
      isIdle:false,
      project:{
        id:0,
        title:"",
        desc:"",
        acting:" ",
        initiative:"",
        ambit:"",
        beneficiaries:"",
        budget:"",
        image_url:""
      },
      locations: locations_json,
      markers: [],
    };
  },
  mounted() {
    window.addEventListener('message', this.handleMessage);
    //window.addEventListener('close', this.notifyClose);
  },
  computed: {
    dataLoaded() {
      return this.loadingData;
    },
  },
  methods: {

    initProjectData() {
      this.project = {
            picture : "",
            initiative : "TODOS",
            desc : "TODOS",
            acting : "",
            title : "TODOS",
            ambit : "TODOS",
            beneficiaries : "TODOS",
            budget : 0 ,
            budget_text :"TOTAL PROYECTO"
      }
    },
    handleMessage(event) {

      const items = [];
      if (event.data.type === 'MESSAGE_FROM_PARENT') {
        this.message = event.data.data;
        //console.log(this.message);
        if (this.message == "sleep"){
          this.isIdle = true;
          return;
        }

        if (this.message == "awake"){
          this.isIdle = false;
          return;
        }

        this.loadingData = false;
        const data = event.data.data;
        //Escuelas conectadas
        if (data.type === 'school') {
          //console.log(data);

          const budget = data.budget ? data.budget : 254052500;
          const budget_text = data.budget ? "" : "TOTAL PROYECTO";
          this.project = {id:0, title:"Escuelas Conectadas", desc:data.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget, budget_text};
          this.$refs.summaryRef.setMarkers(event.data.items);
          setTimeout(() => {
            this.loadingData = true;
          }, 300);
          return;
        }

        
        if (this.message.count){
          this.initProjectData();

          this.project = {id:0, title:"Escuelas Conectadas", desc:this.message.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget:254052500, budget_text:"TOTAL PROYECTO"};

          for(let i = 0; i < points.length; i++){
                const loc = points[i];
                if (this.locations[loc]){
                    let geoData = this.locations[loc];
                    items.push(geoData);
                }
            }
            this.$refs.summaryRef.setMarkers(items);
            setTimeout(() => {
            this.loadingData = true;
          }, 300);

          return;
        }

        //Project
        if (this.message.project)
        {
          this.initProjectData();

          this.project = this.message.project;

          console.log(this.project)
          if (this.project['location']){
            const points = this.project['location'].split(",");
            for(let i = 0; i < points.length; i++){
                const loc = points[i];
                if (this.locations[loc]){
                    let geoData = this.locations[loc];
                    items.push(geoData);
                }
            }
          }
          this.$refs.summaryRef.setMarkers(items);
          setTimeout(() => {
            this.loadingData = true;
          }, 300);

          return;
        }
        setTimeout(() => {
            this.loadingData = true;
          }, 300);        
        this.initProjectData();

      }
    },

  },
  beforeUnmount() {
    window.removeEventListener('message', this.handleMessage);
  },
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