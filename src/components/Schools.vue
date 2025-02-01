<template>
    <div class="flex flex-col space-y-4">
        <!-- Primer ComboBox -->
        <div class="relative">
            <h1>Selecciona la comunidad autónoma</h1>            
            <select v-model="selectedCCAA" class="appearance-none w-full bg-red-400 text-blue  text-lg px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-100">
                <option class="text-white "value="Comunidad Autónoma" disabled></option>
                <option v-for="(item, index) in schools_data" :key="index" :value="item.title" class="text-white">
                    {{ item.ccaa   }}
                </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
        
        <!-- Segundo ComboBox (Solo se muestra si hay una ccaa  seleccionada) -->
        <div v-if="selectedCCAA">
            <h1>Selecciona la provincia</h1>
            <select v-model="selectedProvince" class="p-2 border rounded-lg">
                <option v-for="(p, index) in provinces" :key="index" :value="p.title">
                    {{ p.title }}
                </option>
            </select>
        </div>
        
        <!-- Tercer ComboBox (Solo se muestra si hay una provincia  seleccionada) -->
        <div v-if="selectedProvince">
            <h1>Selecciona la municipalidad</h1>
            <select v-model="selectedMunicipality" class="p-2 border rounded-lg">
                <option v-for="(m, key) in municipalities" :value="key">
                    {{ key }}
                </option>
            </select>
        </div>
    </div>
    
    <div class="relative">
        <select class="appearance-none w-full bg-red-500 text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 focus:ring-red-500" aria-placeholder="Comunidad Autónoma">
            <option value="0" class="bg-red-500 text-white" disabled selected>Comunidad Autónoma</option>
            <option value="1" class="bg-red-500 text-white">Option 1</option>
            <option value="2" class="bg-red-500 text-white">Option 2</option>
            <option value="3" class="bg-red-500 text-white">Option 3</option>
            <option value="4" class="bg-red-500 text-white">Option 4</option>
        </select>
        
    </div>
</template>
<script>

export default{
    props: ['schools_data'],
    
    data(){
        return{
            selectedCCAA:'',
            selectedProvince:'',
            selectedMunicipality:'',
        }
    },
    
    computed: {
        provinces(){
            if (!this.selectedCCAA){
                return null;
            }
            
            return this.schools_data[this.selectedCCAA].provincias;
        },
        
        municipalities(){
            if (!this.selectedProvince){
                return null;
            }
            
            return this.schools_data[this.selectedCCAA].provincias[this.selectedProvince]['municipios'];
        }
        
    }
}
</script>
<style scoped>
/* Custom scrollbar */
select::-webkit-scrollbar {
    width: 8px;
}

select::-webkit-scrollbar-track {
    background: #DD0031; /* Track color */
}   

select::-webkit-scrollbar-thumb {
    background: #DD0031; /* Thumb color */
    border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #DD0031; /* Thumb color on hover */
}

select.decorated option:hover {
    box-shadow: 0 0 10px 100px #ffffff inset;
}

/* Custom option styling */
option {
    background-color: #DD0031; /* Background color for options */
    color: #ffffff; /* Text color for options */
    font-size: 1.5rem; /* Font size for options */
}

option:disabled{
    background-color: #DD0031; /* Background color for options */
    color: #AAAAAA; /* Text color for options */
    font-size: 1.5rem; /* Font size for options */
}

</style>
