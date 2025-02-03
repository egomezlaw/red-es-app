<template>
    <div class="flex flex-col space-y-4 w-full">
        <!-- Primer ComboBox -->
        <div class="flex justify-center">
             <p class="">Comunidad autónoma<i class="mx-10 arrow right max-h-36"></i>
             </p>            
             <select v-model="selectedCCAA" class="appearance-none text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 min-w-96">
                 <option v-for="(item, index) in schools_data" :key="index" :value="item.title">
                     {{ item.title }}
                    </option>
                </select>
        </div>         
        <!-- Segundo ComboBox (Solo se muestra si hay una ccaa  seleccionada) -->
        <div class="flex justify-center" v-if="selectedCCAA">
            <p class="">Provincia<i class="mx-10 arrow right max-h-36"></i></p>
            <select v-model="selectedProvince" class="appearance-none text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 min-w-96">
                <option v-for="(p, index) in provinces" :key="index" :value="p.title">
                    {{ p.title }}
                </option>
            </select>
        </div>       
        <!-- Tercer ComboBox (Solo se muestra si hay una provincia  seleccionada) -->
        <div  class="flex justify-center" v-if="selectedProvince">
            <p class="">Municipio<i class="mx-10 arrow right max-h-36"></i></p>
            <select v-model="selectedMunicipality" class="appearance-none text-white text-lg px-4 py-2  shadow-md focus:outline-none focus:ring-2 min-w-96">
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
            if (!this.selectedCCAA && !this.selectedProvince){
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
    width: 10px;
}

select::-webkit-scrollbar-track {
    background: #000000; /* Track color */
}   

select::-webkit-scrollbar-thumb {
    background: #DD0031; /* Thumb color */
    border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
    background: #000000; /* Thumb color on hover */
}

select.decorated option:hover {
    box-shadow: 0 0 10px 100px #ffffff inset;
}

/* Custom option styling */
option {
    color: #ffffff; /* Text color for options */
    background-color: #000000   ; /* Background color for options */
    font-size: 1.5rem; /* Font size for options */
}

.arrow {
  border: solid #DD0031;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}
</style>
