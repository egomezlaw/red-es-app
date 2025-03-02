<template>
    <div >
    <div class="flex justify-between pb-5 align-middle">
        <div class="w-60 flex-none">
            <img
            src="/images/header_logo.png"
            alt="Project Image"
            class="absolute w-48 h-auto"
            :style="{ top: '50px', left: '50px' }"
            />
        </div>
        <div class="bg-[#DD0031] h-auto pt-5 pb-6 ml-20 text-white text-4xl text-left grow">
            <h1 class="mx-20">{{title}}</h1>
        </div>
    </div>
    <transition name="fade">
    <div v-if="shouldAnimate">
        <div class="text-white flex  my-5 mx-10 text-xl justify-between gap-1 place-content-around">
            <div class=" ">
                <h2>Beneficiarios</h2>
                <p>{{ beneficiaries }}</p>    
                <h2>Iniciativa</h2>
                <p>{{ initiative }}</p>
            </div>
            <div class=" ">
                <h2>Actuación</h2>
                <p>{{ acting }}</p>
                <h2>Actuaciones</h2>
                <p>{{ count }}</p>
            </div>
            <div class="">
                <h2>Ámbito</h2>
                <p>{{ ambit }}</p>
            </div>
        </div>
        <div class="text-xl mx-10">
            <h2 >Descripción</h2>
            <h2>{{ description }}</h2>
        </div>
    </div>
    </transition>

    <div class="flex justify-between w-screen items-start pt-20">
        <transition name="fade">
        <div class="flex flex-col my-10 w-md"  v-if="shouldAnimate">
            <div class="bg-[#DD0031] h-26 text-white text-2xl text-center flex items-center justify-center">
                <h1 
                class="text-center line-clamp-3leading-snug">{{ location }}</h1>
            </div>
            <div class="my-5 mx-10" v-if="validImage">
                <img
                :src="project_data.picture"
                alt="Project Image" 
                class="w-48 h-auto"
                :style="{ top: '50px', left: '50px' }"
                />
            </div>
            <div class="text-2xl mx-10 pt-10" v-if="budget!==''">
                <h2 class="text-bold ">Presupuesto</h2>
                <h2>{{ budget }}</h2>            
                <h2>{{ budget_text }}</h2>            

            </div>
        </div>
        </transition>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="640" :height="576" :zoom="300" ref="globeRef" :type="'static'" :small="true"></Globe>
        </div>
    </div>
</div>

</template>
<script>
import { data } from 'autoprefixer';

export default{
    props: ['project_data'],
    
    data(){
        return{
            shouldAnimate: true,
            euro: Intl.NumberFormat('en-DE', {style: 'currency', currency: 'EUR',})
        }
    },
    methods:{
        setMarkers(markers){
            this.$refs.globeRef.setMarkers(markers);
        },        

        setLocationLabel(label){
            this.$refs.globeRef.setLocationLabel(label);
        }
    },

    watch: {
        project_data: {
        handler(newVal, oldVal) {
            // Si cualquier atributo del objeto cambia, activa la animación
            this.shouldAnimate = false;
            setTimeout(() => {
            this.shouldAnimate = true; // Desactiva la animación después de 300 ms
            }, 300);
        },
        deep: true, // Habilita la observación profunda
        },
    },
    
    computed: {
        validImage(){            
            return (this.project_data.picture !== "" && String(this.project_data.picture).startsWith('http'));
        },
        initiative(){
            return (this.project_data.initiative === ""  ? "NA" : this.project_data.initiative);
        },
        description(){
            return (this.project_data.desc === ""  ? "NA" : this.project_data.desc);
        },
        acting(){
           return this.project_data.acting;
        },
        title(){
            return (this.project_data.title === ""  ? "NA" : this.project_data.title);
        },
        ambit(){
            return (this.project_data.ambit === ""  ? "NA" : this.project_data.ambit);
        },
        beneficiaries(){
            return (this.project_data.beneficiaries === ""  ? "NA" : this.project_data.beneficiaries);
        },
        budget(){
            return ((this.project_data.budget === ""  || this.project_data.budget == 0)  ?  `${this.budget_text}` :  `${this.euro.format(this.project_data.budget)} ${this.budget_text}`);
        },
        budget_text(){
            return ((
                (this.project_data.budget === "" || this.project_data.budget == 0) && 
                (this.project_data.budget_text === ""  || this.project_data.budget_text === null)
            ) ? "Sin Información" :  this.project_data.budget_text);
        },
        count(){
            return ( (this.project_data.count === 0 || !this.project_data.count) ? "NA" : this.project_data.count);
        },
        location(){
            return ( (this.project_data.location === "" || !this.project_data.location) ? "" : this.project_data.location);
        }
    }
    
}
</script>
<style scoped>
h2 {
    font-weight: bold;
    text-align: left;
}
p{
    text-align: left;
    padding-bottom: 2rem;
    opacity: 70%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 300ms;
}

.fade-enter, .fade-leave-to /* .fade-leave-active en versiones anteriores a 2.1.8 */ {
  opacity: 0;
}

/* Estilos adicionales para el div */
.box {
  width: 200px;
  height: 200px;
  background-color: lightblue;
  margin-top: 20px;
}
</style>