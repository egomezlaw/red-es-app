<template>
    <div class="w-auto">
        <div class="bg-[#DD0031] h-auto py-20 text-white text-7xl text-left font-bold">
            <h1 class="mx-20">title</h1>
        </div>
        <div class="text-white flex mx-20 my-10 items-start min-h-screen ">
            <div class="text-3xl">
                <h2 >Breve descripción de la actuación</h2>
                <p>{{ description }}</p>
                <h2>Actuación</h2>
                <p>{{ acting }}</p>
                <h2>Iniciativa</h2>
                <p>{{ initiative }}</p>
            </div>
            <div class="mx-20 text-3xl">
                <h2>Proyecto</h2>
                <p>{{ title }}</p>
                <h2>Ámbito</h2>
                <p>{{ ambit }}</p>
                <h2>Beneficiarios</h2>
                <p>{{ beneficiaries }}</p>            
                <h2>Presupuesto</h2>
                <p>{{ budget }}</p>            
            </div>
        </div>
    </div>
</template>
<script>
export default{
    props: ['project_data'],
    
    data(){
        return{
            description : this.project_data.desc,
            initiative : this.project_data.initiative,
            acting : this.project_data.acting,
            title : this.project_data.title,
            ambit : this.project_data.ambit,
            beneficiaries : this.project_data.beneficiaries,
            budget : this.project_data.budget
        }
    },
    
    computed: {
    }
    
}
</script>
<style scoped>
h2 {
    font-weight: bold;
    font-size: larger;
    text-align: left;
}
p{
    text-align: left;
    padding-bottom: 2rem;
}
</style>