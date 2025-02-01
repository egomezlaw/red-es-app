<template>
    <div class="flex flex-col space-y-4">
        <!-- Primer ComboBox -->
            <h1>Selecciona la comunidad autónoma</h1>            
            <select v-model="selectedCCAA" class="appearance-none w-full bg-red-500 text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option v-for="(item, index) in schools_data" :key="index" :value="item.title">
                    {{ item.ccaa   }}
                </option>
            </select>
        
        <!-- Segundo ComboBox (Solo se muestra si hay una ccaa  seleccionada) -->
        <div v-if="selectedCCAA">
            <h1>Selecciona la provincia</h1>
            <select v-model="selectedProvince" class="appearance-none w-full bg-red-500 text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option v-for="(p, index) in provinces" :key="index" :value="p.title">
                    {{ p.title }}
                </option>
            </select>
        </div>
        
        <!-- Tercer ComboBox (Solo se muestra si hay una provincia  seleccionada) -->
        <div v-if="selectedProvince">
            <h1>Selecciona la municipalidad</h1>
            <select v-model="selectedMunicipality" class="appearance-none w-full bg-red-500 text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option v-for="(m, key) in municipalities" :value="key">
                    {{ key }}
                </option>
            </select>
        </div>
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


</style>
