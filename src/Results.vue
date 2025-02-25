<template>
  <div class="h-screen w-screen text-white bg-black overflow-hidden">
    <TextAnimator v-if="isIdle" text="Punto por punto, el camino hacia la transformación digital" image="/images/globe.png"/>
    <template v-if="!isIdle" 
        class="flex items-start justify-items-start"
      >
      <Summary :project_data="project" ref="summaryRef"></Summary>
    </template>
  </div>
</template>
<script>
import { nextTick, computed } from 'vue';
import locations_json from './data/locations.json'
export default {
  data() {
    return {      
      message: '',
      isIdle:true,
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
        if (this.message == "sleep"){
          this.isIdle = true;
          return;
        }
        
        if (this.message == "awake"){
          this.isIdle = false;
          return;
        }
        
        const data = event.data.data;
        console.log(data);

        
        // if (this.message.count){
        //   this.initProjectData();

        //   this.project = {id:0, title:"Escuelas Conectadas", desc:this.message.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget:254052500, budget_text:"TOTAL PROYECTO"};

        //   if (this.project['location']){
        //     const points = this.project['location'].split(",");

        //   for(let i = 0; i < points.length; i++){
        //         const loc = points[i];
        //         if (this.locations[loc]){
        //             let geoData = this.locations[loc];
        //             items.push(geoData);
        //         }
        //     }
        //     this.$refs.summaryRef.setMarkers(items);
        //   }
        //   return;
        // }

        //Project
        //console.log(this.message);  
        if (data.project)
        {
          this.initProjectData();
          
          this.project = Object.assign(this.project, this.message.project);
          
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
            return;
        }
        else {
            //console.log(data);

          const budget = data.budget ? data.budget : 0;
          const budget_text = data.budget ? "" : "TOTAL PROYECTO";
          this.project = {id:0, title:"Escuelas Conectadas", desc:data.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget, budget_text};
          this.$refs.summaryRef.setMarkers(data.items);
          return;
        }

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