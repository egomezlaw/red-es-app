<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="ambits" v-model="selectedAmbit" @change="onAmbitChange">Ámbito</SelectorBox>
            </div>

            <div class="flex items-center justify-center">
                <SelectorBox :items="normalizedCCAA" v-model="selectedCCAA" :disabled="!localAmbit" @change="onCAAChange">Comunidad</SelectorBox>
            </div>
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="provinces" v-model="selectedProvince" :disabled="!localAmbit" @change="onProvinceChange">Provincia</SelectorBox>
            </div>
            <div class="flex items-center justify-center">
                <SelectorBox :items="municipalities" v-model="selectedMunicipality" :disabled="!localAmbit" @change="onMunicipalityChange">Municipio</SelectorBox>
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
            currentType: "",
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

            console.log(markerData);
            
            let location = markerData.location;
            if (this.localAmbit){
                let region = null;
                if (this.selectedMunicipality !== ""){
                    region = this.projects_data.getByIdentifierAndType(DataProject.TYPE_MUNICIPALITY, this.selectedMunicipality)[0];
                    location = this.selectedMunicipality;
                }else if(this.selectedProvince !== ""){
                    region = this.projects_data.getByIdentifierAndType(DataProject.TYPE_PROVINCE, this.selectedProvince)[0];
                    location = this.selectedProvince;
                }else if (this.selectedCCAA !== ""){
                    region = this.projects_data.getByIdentifierAndType(DataProject.TYPE_CCAA, this.selectedCCAA)[0];
                    location = this.selectedCCAA;
                }
                
                //console.log(region);
                //this.$emit('onMessage', JSON.parse(region.asJSON()));                
            }
            this.$refs.globeRef.setLocationLabel(location);
            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));

        },    
        
        onAmbitChange(){

            if ( !this.localAmbit)
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
                
                this.currentType = DataProject.TYPE_CCAA;
                this.selectedProvince = '';
                this.selectedMunicipality = '';

                const caa = this.projects_data.getByIdentifierAndType(DataProject.TYPE_CCAA, this.selectedCCAA)[0];

                //this.$refs.globeRef.setMarkers(caa.items);
                this.$refs.globeRef.setMarkers(this.projects_data.getProvinceItemsOf(this.selectedCCAA));
                this.$emit('onMessage', JSON.parse(caa.asJSON()));
            }
        },
        
        onProvinceChange(){
            if (this.selectedProvince){
                this.selectedMunicipality = '';

                this.currentType = DataProject.TYPE_PROVINCE;
                
                let province = this.projects_data.getByIdentifierAndType(DataProject.TYPE_PROVINCE, this.selectedProvince)[0];

                if(!province){
                    province = this.projects_data.list.filter(project => project.province === this.selectedProvince && project.type === DataProject.TYPE_MUNICIPALITY)[0];
                }
//                this.$refs.globeRef.setMarkers(province.items);
                this.$refs.globeRef.setMarkers(this.projects_data.getMunicipalityItemsOf(this.selectedProvince));
                this.$emit('onMessage', JSON.parse(province.asJSON()));
            }
        },
        
        onMunicipalityChange(){
            if (this.selectedMunicipality){ 

                this.currentType = DataProject.TYPE_MUNICIPALITY;
                console.log(this.selectedMunicipality);
                
                const municipality = this.projects_data.getMunicipality(this.selectedMunicipality)[0];

                this.$refs.globeRef.setMarkers(municipality.items);
                this.$emit('onMessage', JSON.parse(municipality.asJSON()));
            }
        }
    },
    
    computed: {        
        localAmbit(){
            return this.selectedAmbit === "Nacional" || this.selectedAmbit === "Autonómico";
        },

        normalizedCCAA(){
            if (this.localAmbit)
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
            
            return this.projects_data.getMunicipalities(this.selectedCCAA, this.selectedProvince);
        }        
    }
}
</script>