<template>
  <div class="max-h-screen max-w-screen">
    <TextAnimator v-if="isIdle" text="Punto por punto, el camino hacia la transformación digital" image="/images/globe.png"/>
    <div v-if="!isIdle" class="flex items-start justify-items-start">
      <Summary :project_data="project" class="h-auto min-w-0.5"></Summary>
      <Globe class="min-w-0.5 w-0.5 -ml-1"></Globe>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
export default {
  data() {
    return {      
      message: '',
      isIdle:true,
      project:{
        title:"título",
        desc:"descripción",
        acting:"actuación",
        initiative:"iniciativa",
        ambit:"ámbito nal/internacional",
        beneficiaries:"beneficiarios",
        budget:"presupuesto",
      }
    };
  },

  mounted() {
    window.addEventListener('message', this.handleMessage);
  },
  methods: {
    handleMessage(event) {
      if (event.data.type === 'MESSAGE_FROM_PARENT') {
        this.message = event.data.data;
        console.log(this.message);
        if (this.message == "sleep"){
          this.isIdle = true;
          return;
        }
        this.isIdle = false;
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