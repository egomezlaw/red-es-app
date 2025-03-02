<template>
  <div class="h-screen w-screen text-white bg-black overflow-hidden">
    <TextAnimator v-if="isIdle" text="Punto por punto, el camino hacia la transformación digital" class="mr-[100px]" image="/images/globe.png"/>
    <template v-if="!isIdle" 
        class="flex items-start justify-items-start"
      >
      <Summary :project_data="project" ref="summaryRef" ></Summary>
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
        count:0,
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
            initiative : "NA",
            desc : "NA",
            acting : "",
            title : "NA",
            ambit : "",
            beneficiaries : "NA",
            budget : 0,
            count : 0,
            budget_text :""
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
        
        this.isIdle = false;
        
        if (this.message == "awake"){
          return;
        }

        const data = event.data.data;
        
        if (data.project)
        {
          console.log(data);
          this.initProjectData();          
          this.project = Object.assign(this.project, data.project);
          
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
            if (this.project.items){
              this.$refs.summaryRef.setMarkers(this.project.items);
            }else if (data.lat){
              let temp_items = [];
              temp_items.push(data);
              this.$refs.summaryRef.setMarkers(temp_items);
            }
            return;
        }
        else {
          console.log(data);

          const budget = data.budget ? data.budget : 0;
          // const budget_text = data.budget ? "" : "TOTAL PROYECTO";
          const budget_text = "";
          this.initProjectData();          
          this.project = Object.assign(this.project, data);

          if (data.items){
            this.$refs.summaryRef.setMarkers(data.items);
          }else if (data.lat){
            let temp_items = [];
              temp_items.push(data);
              this.$refs.summaryRef.setMarkers(temp_items);
          }
          if (data.municipality){
                this.$refs.summaryRef.setLocationLabel(data.municipality);
              }

          return;
        }
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