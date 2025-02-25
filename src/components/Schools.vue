<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="ambits" v-model="selectedAmbit" @change="onAmbitChange">Ámbito</SelectorBox>
            </div>

            <div class="flex items-center justify-center">
                <SelectorBox :items="normalizedCCAA" v-model="selectedCCAA" :disabled="!LocalAmbit" @change="onCAAChange">Comunidad</SelectorBox>
            </div>
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="provinces" v-model="selectedProvince" :disabled="!LocalAmbit" @change="onProvinceChange">Provincia</SelectorBox>
            </div>
            <div class="flex items-center justify-center">
                <SelectorBox :items="municipalities" v-model="selectedMunicipality" :disabled="!LocalAmbit" @change="onMunicipalityChange">Municipio</SelectorBox>
            </div>
            
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250" ref="globeRef" @marker-select="onMarkerSelected" :type="'dynamic'"></Globe>
        </div>
    </div>
</template>
<script>
import DataProject from '../data/DataProject';

export default{
    props: ['projects_data'],
    
    data(){
        return{
            selectedAmbit:'Todos',
            selectedCCAA:'',
            selectedProvince:'',
            selectedMunicipality:'',
            selectedPoints:[],
            ambits: [
                "Todos",
                "Autonómico",
                "Internacional",
                "Nacional",
            ]
        }
    },
    mounted(){
        this.onAmbitChange();
    },
    
    methods:{
        onMarkerSelected(markerData){
            if (markerData.project){
                if (markerData.project.items){
                    markerData.project.items = [];
                }
            }

            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));
        },    
        
        onAmbitChange(){

            if ( !this.LocalAmbit)
            {
                this.selectedMunicipality = "";
                this.selectedProvince = "";
                this.selectedCCAA = "";
            }

            let title = "";
            let total_budget = 0;
            let filteredItems = [];
            let budget = 0;

            if (this.selectedAmbit === "Todos")
            {
                title = "TODOS LOS PROYECTOS"
                filteredItems = this.projects_data.getItems(); 
                
            }else{
                title = `PROYECTOS DE ÁMBITO ${this.selectedAmbit.toUpperCase()}`;
                filteredItems = this.projects_data.getItemsByAmbit(this.selectedAmbit);
            }


            budget = filteredItems.reduce(
                    (accumulator, item) => { 
                        if (item.project){
                            return accumulator + item.project.budget;
                        }
                        return accumulator;
                    }, 
                    total_budget,
                );

            this.$refs.globeRef.setMarkers(filteredItems);
            this.$emit('onMessage', JSON.parse(JSON.stringify({title, budget})));
        },

        onCAAChange(){
            if (this.selectedCCAA){
                
                this.selectedProvince = '';
                this.selectedMunicipality = '';

                const caa = this.projects_data.getByIdentifierAndType(DataProject.TYPE_CCAA, this.selectedCCAA)[0];

                this.$refs.globeRef.setMarkers(caa.items);
                this.$emit('onMessage', JSON.parse(caa.asJSON()));
            }
        },
        
        onProvinceChange(){
            if (this.selectedProvince){
                this.selectedMunicipality = '';
                
                const province = this.projects_data.getByIdentifierAndType(DataProject.TYPE_PROVINCE, this.selectedProvince)[0];

                //console.log(province);
                this.$refs.globeRef.setMarkers(province.items);
                this.$emit('onMessage', JSON.parse(province.asJSON()));
            }
        },
        
        onMunicipalityChange(){
            if (this.selectedMunicipality){
                const municipality = this.projects_data.getByIdentifierAndType(DataProject.TYPE_MUNICIPALITY, this.selectedMunicipality)[0];

                //console.log(municipality);
                this.$refs.globeRef.setMarkers(municipality.items);
                this.$emit('onMessage', JSON.parse(municipality.asJSON()));
            }
        }
    },
    
    computed: {        
        LocalAmbit(){
            return this.selectedAmbit === "Nacional" || this.selectedAmbit === "Autonómico";
        },

        normalizedCCAA(){
            if (this.LocalAmbit)
            {
                return this.projects_data.getCCAAs();                
            }
            return [];
        },

        provinces(){
            if (this.selectedCCAA === '' || this.selectedCCAA === undefined){
                return [];
            }
            
            return this.projects_data.getProvinces(this.selectedCCAA);
        },
        
        municipalities(){
            if (this.selectedCCAA === '' || this.selectedProvince === ''){
                return [];
            }
            /*if (!this.schools_data[this.selectedCCAA].provincias[this.selectedProvince])
            {                
                return [];
            }*/
            
            return this.projects_data.getMunicipalities(this.selectedCCAA, this.selectedProvince);
        }        
    }
}
</script>