<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">
            <div class="flex items-center justify-center">
                <ListPicker :items="beneficiaries" v-model="selectedBeneficiaries" @change="onBeneficiariesChange">Beneficiarios</ListPicker>
            </div>

            <div class="flex items-center justify-center">
                <ListPicker :items="initiatives" v-model="selectedInitiative" @change="onInitiativeChange">Iniciativa</ListPicker>
            </div>

            <div class="flex items-center justify-center">
                <ListPicker :items="projects" v-model="selectedProject" @change="onProjectsChange">Proyecto</ListPicker>
            </div>
            
            <div class="flex items-center justify-center">
                <ListPicker :items="actings" v-model="selectedActing" @change="onActingsChange">Actuación</ListPicker>
            </div>            
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250"  ref="globeRef" @marker-select="onMarkerSelected"></Globe>
        </div>
    </div>
</template>
<script>

export default{
    props: ['projects_data', 'locations'],
    
    data(){
        return{
            selectedBeneficiaries:'',
            selectedInitiative:'',
            selectedProject:'',
            selectedActing:'',
            beneficiaries: [
                "PYMES y emprendedores", 
                "Ciudadanía",
                "Administraciones y servicios públicos",
                "Iniciativas para la ciudadanía",
                "Empresas",
                "Alumnos y centros docentes"
            ],
            initiatives : [
                "Internacionalización",
                "Sociedad Digital",
                "Transformación Digital PYMES",
                "Tecnología 5G",
                "Talento Digital",
                "Sanidad",
                "Servicios Sociales",
                "Educación",
                "Ciudades y Territorios Inteligentes",
                "IA y Tecnología Habilitadoras Digitales",
                "ONTSI",
                "Emprendimiento",
                "RedIRIS",
                "Dominios.es",
                "Red FabLabs"
            ],
            initiatives : [
                "Internacionalización",
                "Sociedad Digital",
                "Transformación Digital PYMES",
                "Tecnología 5G",
                "Talento Digital",
                "Sanidad",
                "Servicios Sociales",
                "Educación",
                "Ciudades y Territorios Inteligentes",
                "IA y Tecnología Habilitadoras Digitales",
                "ONTSI",
                "Emprendimiento",
                "RedIRIS",
                "Dominios.es",
                "Red FabLabs"
            ],        
            projects : [
                "Web Summit",
                "South Summit",
                "Smart City Expo World Congress",
                "Desafía",
                "MWC",
                "4YFN",
                "Aporta - datos.gob.es",
                "Aporta - datos.gob.es ",
                "Innovación basada en datos. Aporta - datos.gob.es ",
                "Apoyo a la regulación. Aporta - datos.gob.es ",
                "Acelera pyme",
                "Piloto 5G",
                "Generación D",
                "Cronicidad",
                "Historia Social Única Electrónica en Andalucía",
                "Educa en Digital",
                "Plan Nacional de Territorios Inteligentes",
                "Islas Inteligentes",
                "Plan Nacional de Ciudades Inteligentes",
                "Edificios Inteligentes",
                "Inteligencia Artificial",
                "Derechos Digitales",
                "Dron Conectado 5G",
                "Escuelas Conectadas",
                "Incubadora de Realidades Inmersivas (IRIA) de Almendralejo (VR/AR)",
                "UNI-DIGITAL RedIRIS Infraestructuras Digitales",
                "UNI-DIGITAL RedIRIS Servicios TIC comunes",
                "Dominios.es",
                "Red FabLabs"
            ],
            actings : [
                "Pabellón de España en Web Summit",
                "Pabellón de España en South Summit",
                "Pabellón de España en Smart City Expo World Congress",
                "Desafía Nórdicos",
                "Desafía Suiza",
                "Desafía San Francisco",
                "Desafía Londres",
                "Desafía Berlín",
                "Desafía Tel Aviv",
                "Desafía New York",
                "Pabellón de España en MWC Barcelona",
                "Cóctel Oficial del Pabellón de España en MWC Barcelona",
                "Pabellón de España en MWC Shanghái y Los Ángeles",
                "Pabellón de España en MWC Las Vegas",
                "Pabellón de España en eMerge Américas",
                "Pabellón de España en 4YFN",
                "Catálogo Digital",
                "Dinamización y Sensibilización",
                "Dinamización y Sensibilización.",
                "Innovación basada en datos",
                "Soporte, asesoramiento y desarrollo tecnológico ",
                "Apoyo a la regularización",
                "Colaboración nacional e internacional",
                "Plataforma Acelera pyme",
                "Oficinas Acelera pyme",
                "Kit Digital",
                "Kit Consulting",
                "Bono de Conectividad",
                "Proyecto piloto en Andalucía (1ª convocatoria)",
                "Proyecto Piloto en Galicia (1ª convocatoria)",
                "Proyecto piloto en Andalucía (2ª convocatoria)",
                "Proyecto Piloto 5G Castilla-La Mancha (2ª convocatoria)",
                "Proyecto Piloto 5G Cataluña (2ª convocatoria)",
                "Proyecto Piloto 5G Extremadura (2ª convocatoria)",
                "Proyecto Piloto 5G Galicia (2ª convocatoria)",
                "Proyecto Piloto 5G Madrid (2ª convocatoria)",
                "Proyecto Piloto 5G País Vasco (2ª convocatoria)",
                "Proyecto Piloto 5G Valencia (2ª convocatoria)",
                "Capacitación Digital de la Ciudadanía",
                "Programas de atracción y retención del talento",
                "Desempleados",
                "Formación en competencias digitales",
                "Aplicación de las TIC en la gestión de patologías crónicas",
                "Aplicación de las TIC para la transformación digital de los servicios sociales",
                "Puesto educativo en el hogar",
                "Otros equipamientos adicionales",
                "Destinos Turísticos Inteligentes y Objetos Internos de Ciudad",
                "IA y Tecnología Habilitadoras Digitales",
                "IA en Cadenas de Valor",
                "Carta de Derechos Digitales",
                "Gestión del registro de nombres de dominio"
            ],
            filteredProjects:[],
        }
    },

    methods:{
        onMarkerSelected(markerData){
            //console.log(markerData);
            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));
        },

        geMarkersData(){
            const items = [];
            for(const p in this.filteredProjects){
                const points = this.filteredProjects[p]['location'].split(",");
                for(let i = 0; i < points.length; i++){
                    const loc = points[i];
                    if (this.locations[loc]){
                        let geoData = this.locations[loc];
                        items.push(geoData);
                        items[items.length - 1].project = this.filteredProjects[p];
                    }
                }
            }

            this.$refs.globeRef.setMarkers(items);

            this.$emit('onMessage', JSON.parse(JSON.stringify(this.filteredProjects)));
        },
    
        onBeneficiariesChange(){
            if (this.selectedBeneficiaries != "")
            {
                this.filteredProjects = this.projects_data.filter(project =>  project.beneficiaries == this.selectedBeneficiaries);
                this.geMarkersData();
            }
        },

        onInitiativeChange(){
            if (this.selectedInitiative != "")
            {
                this.filteredProjects = this.projects_data.filter(project =>  project.initiative == this.selectedInitiative);
                this.geMarkersData();     
            }

        },
        onProjectsChange(){
            if (this.selectedProject != "")
            {
                this.filteredProjects = this.projects_data.filter(project =>  project.title == this.selectedProject);
                this.geMarkersData();                
            }
        },
        onActingsChange(){
            if (this.selectedActing != "")
            {
                this.filteredProjects = this.projects_data.filter(project =>  project.acting == this.selectedActing);
                this.geMarkersData();                
            }

        }
        
    }
}
</script>
