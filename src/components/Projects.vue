<template>
    <div class="flex flex-row items-center justify-center h-screen w-full">
        <div class="flex flex-col space-y-2 w-3xl ml-10 align-middle">     
            <div class="flex items-center justify-center">
                <SelectorBox :items="beneficiaries" v-model="selectedBeneficiaries" @change="onBeneficiariesChange">Beneficiarios</SelectorBox>
            </div>

            <div class="flex items-center justify-center">
                <SelectorBox :items="initiatives" v-model="selectedInitiative" @change="onInitiativeChange">Iniciativa</SelectorBox>
            </div>
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="projects" v-model="selectedProject" @change="onProjectsChange">Proyecto</SelectorBox>
            </div>
            
            <div class="flex items-center justify-center">
                <SelectorBox :items="actings" v-model="selectedActing" @change="onActingsChange">Actuación</SelectorBox>
            </div>                        
        </div>
        <div class="flex grow">
            <Globe class="w-full h-full" :width="960" :height="720" :zoom="250"  ref="globeRef" @marker-select="onMarkerSelected" :type="'dynamic'"></Globe>
        </div>
    </div>
    <div>
    </div>
</template>
<script>
import DataProject from '../data/DataProject';


export default{
    props: ['projects_data', 'locations'],
    
    data(){
        return{
            selectedBeneficiaries:'',
            selectedInitiative:'',
            selectedProject:'',
            selectedActing:'',
            beneficiaries: [
                "Administración",
                "Ciudadanía",
                "Empresas"
            ],
            initiatives : [
                "Ciudades y Territorios Inteligentes",
                "Dominios.es",
                "Educación",
                "Emprendimiento",
                "IA y Tecnología Habilitadoras Digitales",
                "ONTSI",
                "Red FabLabs",
                "RedIRIS",
                "Sanidad",
                "Servicios Sociales",
                "Sociedad Digital",
                "Talento Digital",
                "Tecnología 5G",
                "Transformación Digital PYMES",
                "Internacionalización",
            ],                  
            projects : [
                "4YFN",
                "Acelera pyme",
                "Aporta - datos.gob.es",
                "Apoyo a la regulación. Aporta - datos.gob.es",
                "Cronicidad",
                "Derechos Digitales",
                "Desafía",
                "Dominios.es",
                "Dron Conectado 5G",
                "Edificios Inteligentes",
                "Educa en Digital",
                "Escuelas Conectadas",
                "Generación D",
                "Historia Social Única Electrónica en Andalucía",
                "Incubadora de Realidades Inmersivas (IRIA) de Almendralejo",
                "Innovación basada en datos. Aporta - datos.gob.es",
                "Inteligencia Artificial",
                "Islas Inteligentes",
                "MWC",
                "Piloto 5G",
                "Plan Nacional de Ciudades Inteligentes",
                "Plan Nacional de Territorios Inteligentes",
                "Red FabLabs",
                "Smart City Expo World Congress",
                "South Summit",
                "UNI-DIGITAL RedIRIS Infraestructuras Digitales",
                "UNI-DIGITAL RedIRIS Servicios TIC comunes",
                "Web Summit",

            ],
            actings : [
                "Apoyo a la regularización",
                "Bono de Conectividad",
                "Capacitación Digital de la Ciudadanía",
                "Carta de Derechos Digitales",
                "Catálogo Digital",
                "Cóctel Oficial del Pabellón de España en MWC Barcelona",
                "Colaboración nacional e internacional",
                "Desafía Berlín",
                "Desafía Londres",
                "Desafía New York",
                "Desafía Nórdicos",
                "Desafía San Francisco",
                "Desafía Suiza",
                "Desafía Tel Aviv",
                "Desempleados",
                "Destinos Turísticos Inteligentes y Objetos Internos de Ciudad",
                "Dinamización y Sensibilización.",
                "Formación en competencias digitales",
                "Gestión del registro de nombres de dominio",
                "IA en Cadenas de Valor",
                "IA y Tecnología Habilitadoras Digitales",
                "Innovación basada en datos",
                "Kit Consulting",
                "Kit Digital",
                "Oficinas Acelera pyme",
                "Otros equipamientos adicionales",
                "Pabellón de España en 4YFN",
                "Pabellón de España en eMerge Américas",
                "Pabellón de España en MWC Barcelona",
                "Pabellón de España en MWC Las Vegas",
                "Pabellón de España en MWC Shanghái y Los Ángeles",
                "Pabellón de España en Smart City Expo World Congress",
                "Pabellón de España en South Summit",
                "Pabellón de España en Web Summit",
                "Plataforma Acelera pyme",
                "Programas de atracción y retención del talento",
                "Proyecto Piloto 5G Castilla-La Mancha (2ª convocatoria)",
                "Proyecto Piloto 5G Cataluña (2ª convocatoria)",
                "Proyecto Piloto 5G Extremadura (2ª convocatoria)",
                "Proyecto Piloto 5G Galicia (2ª convocatoria)",
                "Proyecto Piloto 5G Madrid (2ª convocatoria)",
                "Proyecto Piloto 5G País Vasco (2ª convocatoria)",
                "Proyecto Piloto 5G Valencia (2ª convocatoria)",
                "Proyecto piloto en Andalucía (1ª convocatoria)",
                "Proyecto piloto en Andalucía (2ª convocatoria)",
                "Proyecto Piloto en Galicia (1ª convocatoria)",
                "Puesto educativo en el hogar",
                "Soporte, asesoramiento y desarrollo tecnológico ",
                "TIC y Transformación Digital en los Servicios Sociales",
            ],
            filteredProjects:[],
        }
    },

    methods:{
        onMarkerSelected(markerData){
            this.$emit('onMessage', JSON.parse(JSON.stringify(markerData)));
        },

        geMarkersData(prop, value){
            const items = this.projects_data.getItemsByProp(prop, value);

            //console.log(items); 
            this.$refs.globeRef.setMarkers(items);

            //console.log(this.filteredProjects);
            this.$emit('onMessage', JSON.parse(JSON.stringify({project:this.filteredProjects[0]})));
            /*if (this.filteredProjects.length == 1)
            {
            }else{                
                let project_summary = new DataProject({title: `Proyectos de ${value}`, desc:"", beneficiaries:"TODOS", initiative:"TODOS", acting:"TODOS", venues:"NA", ambit:"TODOS", budget:0, items});
                project_summary[prop] = value;
                /*project_summary.budget = 0;
                let total_budget = 0;

                project_summary.budget = this.filteredProjects.reduce(
                    (accumulator, item) => accumulator + parseInt(item.budget), 
                    total_budget,
                );

                const project = project_summary;
                this.$emit('onMessage', JSON.parse(JSON.stringify({project})));
            }*/
        },
    
    
        onBeneficiariesChange(){
            if (this.selectedBeneficiaries != "")
            {
                this.filteredProjects = this.projects_data.list.filter(project =>  project.beneficiaries.toUpperCase() == this.selectedBeneficiaries.toUpperCase() && project.type === DataProject.TYPE_PROJECT );
                // this.geMarkersData({beneficiaries:this.selectedBeneficiaries});
                this.geMarkersData("beneficiaries", this.selectedBeneficiaries);
            }
            this.selectedInitiative = '';
            this.selectedProject = '';
            this.selectedActing = '';
        },

        onInitiativeChange(){
            if (this.selectedInitiative != "")
            {
                this.filteredProjects = this.projects_data.list.filter(project =>  project.initiative.toUpperCase() == this.selectedInitiative.toUpperCase());
                // this.geMarkersData({initiative:this.selectedInitiative});     
                this.geMarkersData("initiative", this.selectedInitiative);
            }
            this.selectedBeneficiaries = '';
            this.selectedProject = '';
            this.selectedActing = '';

        },
        onProjectsChange(){
            //console.log(this.selectedProject);
            if (this.selectedProject != "")
            {
                this.filteredProjects = this.projects_data.list.filter(project =>  project.title == this.selectedProject);

                //console.log(this.filteredProjects);
                // this.geMarkersData({title:this.selectedProject});
                this.geMarkersData("title",this.selectedProject);
                
            }

            this.selectedBeneficiaries = '';
            this.selectedInitiative = '';
            this.selectedActing = '';

        },
        onActingsChange(){
            console.log(this.selectedActing);   
            if (this.selectedActing != "")
            {
                this.filteredProjects = this.projects_data.list.filter(project =>  project.acting.toUpperCase() == this.selectedActing.toUpperCase());
                console.log(this.filteredProjects);
                //this.geMarkersData({acting:this.selectedActing});                
                this.geMarkersData("acting",this.selectedActing);
            }
            this.selectedBeneficiaries = '';
            this.selectedInitiative = '';
            this.selectedProject = '';
        }
        
    }
}
</script>
