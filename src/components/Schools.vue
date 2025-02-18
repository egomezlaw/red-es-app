<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="normalizedCCAA" v-model="selectedCCAA" @change="onCAAChange">Comunidad</SelectorBox>
            </div>
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="provinces" v-model="selectedProvince" @change="onProvinceChange">Provincia</SelectorBox>
            </div>
            <div class="flex items-center justify-center">
                <SelectorBox :items="municipalities" v-model="selectedMunicipality" @change="onMunicipalityChange">Municipio</SelectorBox>
            </div>
            
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250" ref="globeRef" @marker-select="onMarkerSelected" :type="'dynamic'"></Globe>
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
            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));
        },    
        
        onCAAChange(){
            if (this.selectedCCAA){
                
                this.selectedProvince = '';
                this.selectedMunicipality = '';
                
                const items = [];
                let count = 0;
                
                const provinces = this.schools_data[this.selectedCCAA].provincias;
                
                for(const p in provinces){
                    for (const m in provinces[p].municipios){
                        if (this.locations[m]){
                            let geoData = this.locations[m];
                            items.push(geoData);
                            items[items.length - 1].count = provinces[p].municipios[m];
                            items[items.length - 1].location = m;
                            count += parseInt(provinces[p].municipios[m]);
                        }
                    }
                }
                
                const budget = this.schools_data[this.selectedCCAA].budget ? this.schools_data[this.selectedCCAA].budget : null;
                const desc = `Dentro de ${this.selectedCCAA}, contamos con ${count} sedes.`
                const data = {items:items, budget, type:"school", desc};
                this.$refs.globeRef.setMarkers(items);
                this.$emit('onMessage', JSON.parse(JSON.stringify(data)));
            }
        },
        
        onProvinceChange(){
            if (this.selectedProvince){
                this.selectedMunicipality = '';
                
                const items = [];
                const province = this.schools_data[this.selectedCCAA].provincias[this.selectedProvince];
                
                let count = 0;                
                let geoData = null;
                for (const m in province.municipios){
                    if (this.locations[m]){
                        geoData = this.locations[m];
                    }else if (this.locations[this.selectedProvince]){
                        geoData = this.locations[this.selectedProvince];
                    }else{
                        geoData = this.locations[this.selectedCCAA];
                    }

                    items.push(geoData);
                    items[items.length - 1].count = province.municipios[m];
                    items[items.length - 1].location = m;
                    count += parseInt(province.municipios[m]);
                }
                
                const desc = `En la provincia de ${this.selectedProvince} dentro de ${this.selectedCCAA}, contamos con ${count} sedes.`
                const data = {items:items, type:"school", desc};
                this.$refs.globeRef.setMarkers(items);
                this.$emit('onMessage', JSON.parse(JSON.stringify(data)));
            }
        },
        
        onMunicipalityChange(){
            if (this.selectedMunicipality){
                const items = [];
                let geoData = null;

                if (this.locations[this.selectedMunicipality]){
                        geoData = this.locations[this.selectedMunicipality];
                     }else if (this.locations[this.selectedProvince]){
                        geoData = this.locations[this.selectedProvince];
                    }else{
                        geoData = this.locations[this.selectedCCAA];
                    }

                items.push(geoData);

                items[0].count = this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios[this.selectedMunicipality];
                items[0].desc = `En el municipio de ${this.selectedMunicipality.toLocaleLowerCase()}, ubicado en la provincia de ${this.selectedProvince} dentro de ${this.selectedCCAA}, contamos con ${this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios[this.selectedMunicipality]} sedes.`
                items[0].location = this.selectedMunicipality;

                this.$refs.globeRef.setMarkers(items);
                this.$refs.globeRef.selectedLocation = this.selectedMunicipality;

                this.$emit('onMessage', JSON.parse(JSON.stringify(items[0])));
            }
        }
    },
    
    computed: {
        normalizedCCAA(){
            return Object.keys(this.schools_data);
        },
        
        provinces(){
            if (this.selectedCCAA === '' || this.selectedCCAA === undefined){
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
            
            return Object.keys(this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios);
        }        
    }
}
</script>