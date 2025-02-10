<template>
    <div class="flex justify-between pb-5 align-middle">
        <div class="w-60 flex-none">
            <img
            src="/images/header_logo.png"
            alt="Header Image"
            class="absolute w-48 h-auto"
            :style="{ top: '50px', left: '50px' }"
            />
        </div>
        <div class="bg-[#DD0031] h-auto pt-5 pb-6 ml-20 text-white text-4xl text-left grow">
            <h1 class="mx-20">{{title}}</h1>
        </div>
    </div>
    <div>
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
                <h2>Proyecto</h2>
                <p>{{ title }}</p>
            </div>
            <div class="">
                <h2>Ámbito</h2>
                <p>{{ ambit }}</p>
               <!-- 
                -->
            </div>
        </div>
        <div class="text-xl mx-10">
            <h2 >Descripción</h2>
            <h2>{{ description }}</h2>
        </div>
    </div>
    <div class="flex justify-between w-screen items-start pt-20">
        <div class="flex flex-col my-10 w-md">
            <div class="bg-[#DD0031] h-26  pb-6 text-white text-2xl text-center">
                <h1 class="mx-20">{{ ambit }}</h1>
            </div>
            <div class="my-5 mx-10" v-if="validImage">
                <img
                :src="image_url"
                alt="Header Image"
                class="w-48 h-auto"
                :style="{ top: '50px', left: '50px' }"
                />
            </div>
            <div class="text-2xl mx-10 pt-10" v-if="budget!==''">
                <h2 class="text-bold ">Presupuesto</h2>
                <h2>{{ budget }}</h2>            

            </div>
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="640" :height="576" :zoom="300" ref="globeRef" :type="'static'"></Globe>
        </div>
    </div>

</template>
<script>
export default{
    props: ['project_data'],
    
    data(){
        return{
            image_url : this.project_data.picture,
            euro: Intl.NumberFormat('en-DE', {style: 'currency', currency: 'EUR',})
        }
    },
    methods:{
        setMarkers(markers){
            this.$refs.globeRef.setMarkers(markers);
        }
    },
    
    computed: {
        validImage(){
            return (this.image_url !== "" && String(this.image_url).startsWith('http'));
        },
        initiative(){
            return (this.project_data.initiative === "" ? "TODOS" : this.project_data.initiative);
        },
        description(){
            return (this.project_data.desc === "" ? "TODOS" : this.project_data.desc);
        },
        acting(){
           return this.project_data.acting;
        },
        title(){
            return (this.project_data.title === "" ? "TODOS" : this.project_data.title);
        },
        ambit(){
            return (this.project_data.ambit === "" ? "TODOS" : this.project_data.ambit);
        },
        beneficiaries(){
            return (this.project_data.beneficiaries === "" ? "TODOS" : this.project_data.beneficiaries);
        },
        budget(){
            return (this.project_data.budget === "" ? "" :  `${this.euro.format(this.project_data.budget)} ${this.budget_text}`);
        },
        budget_text(){
            return (this.project_data.budget_text === "" || this.project_data.budget_text === null ? "" :  this.project_data.budget_text);
        },
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
</style>