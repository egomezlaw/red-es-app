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
import locations_json from './data/locations.json'
export default {
  data() {
    return {      
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
  },
  methods: {
    handleMessage(event) {
      if (event.data.type === 'MESSAGE_FROM_PARENT') {
        this.message = event.data.data;
        //console.log(this.message);
        if (this.message == "sleep"){
           this.isIdle = true;
            return;
        }
        this.isIdle = false;

        //Escuelas conectadas
        if (this.message.count){

          return;
        }

        //Project
        if (this.message.project)
        {
          this.project = this.message.project;

          const items=[];
          const points = this.project['location'].split(",");
            for(let i = 0; i < points.length; i++){
                const loc = points[i];
                if (this.locations[loc]){
                    let geoData = this.locations[loc];
                    items.push(geoData);
                }
            }
            this.$refs.summaryRef.setMarkers(items);                
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