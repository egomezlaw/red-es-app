import { default } from '../App.vue';
import { computed } from 'vue';
<template>
    <div class="flex items-center justify-center h-screen text-4xl ">
        <div class="flex space-x-19" v-if="filter=='none'">
            <button @click="filter='schools'"class="bg-[#DD0031] text-white font-bold py-4 px-8 rounded" >ESCUELAS CONECTADAS</button>
            <button @click="filter='projects'"class="bg-[#DD0031] text-white font-bold py-4 px-8 rounded" >PROYECTOS</button>
        </div>
        <div class="flex space-x-19" v-if="filter=='schools'">
            <Schools v-bind="$attrs"></Schools>
        </div>

    </div>
  </template>
  
  <script>
  export default{
    props: ['school_data'],

    data(){
        return{
            filter:'none',
        }
    },

    created() {
    }


  }
  </script>
  
  <style scoped>
  /* Estilos básicos para el nuevo componente */
  </style>