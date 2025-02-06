<template>
  <div class="h-screen w-screen text-white bg-black overflow-hidden">
    <TextAnimator v-if="isIdle" text="Punto por punto, el camino hacia la transformación digital" image="/images/globe.png"/>
    <template v-if="!isIdle" class="flex items-start justify-items-start">
      <Summary :project_data="project"></Summary>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {      
      message: '',
      isIdle:false,
      project:{
        title:"título",
        desc:"descripción",
        acting:"actuación",
        initiative:"iniciativa",
        ambit:"ámbito nal/internacional",
        beneficiaries:"beneficiarios",
        budget:"250.000.000 €",
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