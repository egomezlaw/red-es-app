<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">
            <!-- Primer ComboBox -->
            <div class="flex items-center justify-center">
                <ListPicker :items="normalizedCCAA" v-model="selectedCCAA">Comunidad</ListPicker>
            </div>

            <!-- Segundo ComboBox -->
            <div class="flex items-center justify-center">
                <ListPicker :items="provinces" v-model="selectedProvince">Provincia</ListPicker>
            </div>

            <!-- Tercer ComboBox -->
            <div class="flex items-center justify-center">
                <ListPicker :items="municipalities" v-model="selectedMunicipality">Municipio</ListPicker>
            </div>
            
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250"></Globe>
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

    methods:{
        
    },
    
    computed: {
        normalizedCCAA(){
            return Object.keys(this.schools_data);
        },

        provinces(){
            if (this.selectedCCAA === ''){
                return [];
            }
            
            return Object.keys(this.schools_data[this.selectedCCAA].provincias);
        },
        
        municipalities(){
            if (this.selectedCCAA === '' || this.selectedProvince === ''){
                return [];
            }
            if (!this.schools_data[this.selectedCCAA].provincias[this.selectedProvince])
            {
                return [];
            }
            return Object.keys(this.schools_data[this.selectedCCAA].provincias[this.selectedProvince]['municipios']);
        }
        
    }
}
</script>