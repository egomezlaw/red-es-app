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
            count: 0,
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
        
        onCAAChange(){
            this.selectedProvince = '';
            this.selectedMunicipality = '';

            const items = [];
            this.count = 0;

            const provinces = this.schools_data[this.selectedCCAA].provincias;

            for(const p in provinces){
                for (const m in provinces[p].municipios){
                    if (this.locations[m]){
                        let geoData = this.locations[m];
                        items.push(geoData);
                        items[items.length - 1].count = provinces[p].municipios[m];
                        this.count += parseInt(provinces[p].municipios[m]);
                    }
                }
            }

            const budget = this.schools_data[this.selectedCCAA].budget ? this.schools_data[this.selectedCCAA].budget : null;
            const desc = `Dentro de ${this.selectedCCAA}, contamos con ${this.count} sedes.`
            const data = {items:items, budget, type:"school", desc};
            this.$emit('onMessage', JSON.parse(JSON.stringify(data)));
        },

        onProvinceChange(){
            this.selectedMunicipality = '';
        },

        onMunicipalityChange(){
            if (this.selectedMunicipality !== ''){
                const items = [];
                const province = this.schools_data[this.selectedCCAA].provincias[this.selectedProvince]
                if (this.locations[this.selectedMunicipality]){
                    let geoData = this.locations[this.selectedMunicipality];
                    items.push(geoData);
                    items[items.length - 1].count = province.municipios[this.selectedMunicipality];
                    items[items.length - 1].desc = `En el municipio de ${this.selectedMunicipality}, ubicado en la provincia de ${this.selectedProvince} dentro de ${this.selectedCCAA}, contamos con ${province.municipios[this.selectedMunicipality]} sedes.`
                }
                const data = {items:items, type:"school"};
                this.$emit('onMessage', JSON.parse(JSON.stringify(data)));
            }
        }
    },
    
    computed: {
        normalizedCCAA(){
            return Object.keys(this.schools_data);
        },

        provinces(){
            if (this.selectedCCAA === '' && this.selectedCCAA !== undefined){
                return [];
            }
            
            //get info for globe
            const provinces = this.schools_data[this.selectedCCAA].provincias; 
            const items = [];
            this.count = 0;

            for(const p in provinces){
                for (const m in provinces[p].municipios){
                    if (this.locations[m]){
                        let geoData = this.locations[m];
                        items.push(geoData);
                        items[items.length - 1].count = provinces[p].municipios[m];
                        this.count += parseInt(provinces[p].municipios[m]);
                    }
                }
            }

            this.$refs.globeRef.setMarkers(items);

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
                    items[items.length - 1].desc = `En el municipio de ${m}, ubicado en la provincia de ${this.selectedProvince} dentro de ${this.selectedCCAA}, contamos con ${province.municipios[m]} sedes.`
                }
            }

            //this.$refs.globeRef.setMarkers(items);

            const data = {items:items, type:"school"};

            return Object.keys(this.schools_data[this.selectedCCAA].provincias[this.selectedProvince].municipios);
        }        
    }
}
</script>