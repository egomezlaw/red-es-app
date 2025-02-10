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
    //window.addEventListener('close', this.notifyClose);
  },
  methods: {
    handleMessage(event) {
      const items = [];
      if (event.data.type === 'MESSAGE_FROM_PARENT') {
        this.message = event.data.data;
        //console.log(this.message);
        if (this.message == "sleep"){
           this.isIdle = true;
            return;
        }

        const data = event.data.data;
        //Escuelas conectadas
        if (data.type === 'school') {
          console.log(data);
          const budget = data.budget ? data.budget : 254052500;
          const budget_text = data.budget ? "" : "TOTAL PROYECTO";
          this.project = {id:0, title:"Escuelas Conectadas", desc:data.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget, budget_text};
          this.$refs.summaryRef.setMarkers(event.data.items);

        }

        if (this.message.count){

          this.project = {id:0, title:"Escuelas Conectadas", desc:this.message.desc,acting:" ",initiative:"",ambit:"",beneficiaries:"Alumnos y centros docentes", budget:254052500, budget_text:"TOTAL PROYECTO"};

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

        //Project
        if (this.message.project)
        {
          this.project = this.message.project;

          console.log(this.project)
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
        this.isIdle = false;

      }
    },
    notifyClose(){
      //console.log("closing");
      //window.opener.postMessage({ type: 'MESSAGE_FROM_CHILD', data: "closing" });
    }
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