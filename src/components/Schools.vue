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
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250" ref="globeRef"></Globe>
        </div>
    </div>
</template>
<script>

export default{
    props: ['schools_data', 'locations'],
    
    data(){
        return{
            selectedCCAA:'',
            selectedProvince:'',
            selectedMunicipality:'',
        }
    },

    methods:{
        getAllMunicipalities(obj){
            return Object.values(obj).reduce((acc, valor) => {
                if (Array.isArray(valor) && obj.municipios) {
                    return acc.concat(obj.municipios);
                } else if (typeof valor === 'object' && valor !== null) {
                    return acc.concat(this.getAllMunicipalities(valor));
                }
                return acc;
             }, []);
        }
        
    },
    
    computed: {
        normalizedCCAA(){
            return Object.keys(this.schools_data);
        },

        provinces(){
            if (this.selectedCCAA === ''){
                return [];
            }
            

            //get info for globe
            const provinces = this.schools_data[this.selectedCCAA].provincias; 
            const items = [];

            for(const p in provinces){
                for (const m in provinces[p].municipios){
                    if (this.locations[m]){
                        let geoData = this.locations[m];
                        items.push(geoData);
                        items[items.length - 1].count = provinces[p].municipios[m]
                    }
                }
            }

            this.$refs.globeRef.setMarkers(items);

            this.selectedProvince = '';
            this.selectedMunicipality = '';

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
            

            const province = this.schools_data[this.selectedCCAA].provincias[this.selectedProvince]

            //get info for globe
            const items = [] 
            for (const m in province.municipios){
                if (this.locations[m]){
                    let geoData = this.locations[m];
                    items.push(geoData);
                    items[items.length - 1].count = province.municipios[m]
                }
            }

            this.$refs.globeRef.setMarkers(items);

            return Object.keys(this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios);
        }        
    }
}
</script>