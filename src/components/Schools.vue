<template>
    <div class="flex  items-center">

        <div class="flex flex-col space-y-4 w-full">
            <!-- Primer ComboBox -->
            <div class="flex items-center justify-center pt-4">
                <ListPicker :items="normalizedCCAA" v-model="selectedCCAA">Comunidad autónoma</ListPicker>
            </div>

            <!-- Segundo ComboBox -->
            <div class="flex items-center justify-center pt-4">
                <ListPicker :items="provinces" v-model="selectedProvince">Provincia</ListPicker>
            </div>

            <!-- Tercer ComboBox -->
            <div class="flex items-center justify-center pt-4">
                <ListPicker :items="municipalities" v-model="selectedMunicipality">Municipio</ListPicker>
            </div>
            
        </div>
        <Globe></Globe>
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