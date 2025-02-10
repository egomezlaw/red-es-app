<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">

            <div class="flex items-center justify-center">
                <SelectorBox :items="normalizedCCAA" v-model="selectedCCAA">Comunidad</SelectorBox>
            </div>

            <div class="flex items-center justify-center">
                <SelectorBox :items="provinces" v-model="selectedProvince">Provincia</SelectorBox>
            </div>
            <div class="flex items-center justify-center">
                <SelectorBox :items="municipalities" v-model="selectedMunicipality">Municipio</SelectorBox>
            </div>
            
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250" ref="globeRef" @marker-select="onMarkerSelected"></Globe>
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
            selectedPoints:[]
        }
    },

    methods:{
        onMarkerSelected(markerData){
            //console.log(markerData);
            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));
        },        
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
            let allCount = 0;

            for(const p in provinces){
                for (const m in provinces[p].municipios){
                    if (this.locations[m]){
                        let geoData = this.locations[m];
                        items.push(geoData);
                        items[items.length - 1].count = provinces[p].municipios[m];
                        allCount += parseInt(provinces[p].municipios[m]);
                    }
                }
            }

            this.$refs.globeRef.setMarkers(items);

            const budget = this.schools_data[this.selectedCCAA].budget ? this.schools_data[this.selectedCCAA].budget : null;
            const desc = `Dentro de ${this.selectedCCAA}, contamos con ${allCount} sedes.`
            const data = {items, budget, type:"school", desc};
            this.$emit('onMessage', JSON.parse(JSON.stringify(data)));

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
                    items[items.length - 1].count = province.municipios[m];
                    items[items.length - 1].desc = `En el municipio de ${this.selectedMunicipality}, ubicado en la provincia de ${this.selectedProvince} dentro de ${this.selectedCCAA}, contamos con ${province.municipios[m]} sedes.`
                }
            }

            this.$refs.globeRef.setMarkers(items);

            return Object.keys(this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios);
        }        
    }
}
</script>