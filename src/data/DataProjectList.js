import DataProject from './DataProject';

export default class DataProjectList{
    constructor({projects, locations}){
        console.log("CONSTRUCTOR");
        this.list = Array();
        this.locations = locations;

        for(const p in projects){
            let dataProject = this.addProject(p, projects[p]);
            this.list.push(dataProject);             
        }

        this.raw_schools_data = null;
    }

    sortProjects(){
        this.list.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
    }

    //deprecated
    /*fromSchools(schools){

        this.raw_schools_data = schools;

        let budget = 0;
        let budget_text = "";
        let desc = ""
        let items = [];
        let p_items = [];
        let m_items = [];
        let ccaa_count = 0;
        let p_count = 0;
        let geoData = null;

        for(const ccaa in schools){
            items = [];
            ccaa_count = 0;
            const provinces = schools[ccaa].provincias;

            budget = schools[ccaa].budget ? schools[ccaa].budget : null;
            budget_text = "TOTAL DEL PROYECTO";
            
            for(const p in provinces){
                p_count = 0;
                p_items = [];


                for (const m in provinces[p].municipios){

                    

                    geoData = null;

                    if (this.locations[m]){
                        geoData = this.locations[m];
                    }
                    else if (this.locations[p]){
                        geoData = this.locations[p];
                    }
                    else if (this.locations[ccaa]){
                        geoData = this.locations[ccaa];
                    }

                    items.push(geoData);
                    items[items.length - 1].count = provinces[p].municipios[m];
                    //items[items.length - 1].location = m;

                    p_items.push(geoData);
                    //p_items[p_items.length - 1].location = m;

                    p_count += parseInt(provinces[p].municipios[m]);
                    ccaa_count += parseInt(provinces[p].municipios[m]);


                    desc = `En el municipio de ${m.toLocaleLowerCase()}, ubicado en la provincia de ${p} dentro de ${ccaa}, contamos con ${parseInt(provinces[p].municipios[m])} sedes.`

                    let pj = this.addProject({budget, budget_text, identifier:m, desc, type:DataProject.TYPE_MUNICIPALITY, ambit:"Autonómico" });
                    pj.items = [];
                    pj.items.push(geoData);
                    pj.items[0].location = pj.identifier;
                    
                    /*if (p === "Murcia")
                    {
                        console.log(pj.type);
                        console.log(pj.identifier);
                        console.log(pj.items[0].location);
                        console.log(pj.items[0]);
                    }
                }


                desc = `En la provincia de ${p} dentro de ${ccaa}, contamos con ${p_count} sedes.`
                this.addProject({items:p_items, budget, budget_text, desc, identifier:p, type:DataProject.TYPE_PROVINCE, ambit:"Autonómico" });
            }

            desc = `Dentro de ${ccaa}, contamos con ${ccaa_count} sedes.`
            this.addProject({items:items, budget, budget_text, desc, identifier:ccaa, type:DataProject.TYPE_CCAA, ambit:"Autonómico" });

            ccaa_count = 0;
        }
        this.sortProjects();
    }*/

    addProject(id, raw_project){
        if (raw_project.ambit === DataProject.AMBIT_AUTONOMIC){
            if (raw_project.municipality){
                raw_project.type = DataProject.TYPE_MUNICIPALITY;
            }else if (raw_project.province){
                raw_project.type = DataProject.TYPE_PROVINCE;                    
            }else{
                raw_project.type = DataProject.TYPE_CCAA;
                        //custom validation
                if (raw_project.title !== "Escuelas Conectadas"){
                    raw_project.type = DataProject.TYPE_PROJECT;
                }
            }
        }else{
            raw_project.type = DataProject.TYPE_PROJECT;
        }

        let dataProject = new DataProject(id, raw_project);


        if (dataProject.location){
            const points = dataProject.location.split(",");

            for(let i = 0; i < points.length; i++){
                let loc = points[i];
                if (dataProject.municipality){
                    if(this.locations[dataProject.municipality] || this.locations[dataProject.municipality.toUpperCase()]){
                        loc = dataProject.municipality;
                    }
                }else if (dataProject.province){
                    if(this.locations[dataProject.province] || this.locations[dataProject.province.toUpperCase()]){
                        loc = dataProject.province;
                    }
                }

                let location = {...this.locations[loc]};

                if (location){            
                    
                    let data = location;
                    data.location = loc;
                    data.project = {
                        location: loc,
                        title:dataProject.title, 
                        desc:dataProject.desc, 
                        beneficiaries:dataProject.beneficiaries, 
                        initiative:dataProject.initiative, 
                        acting:dataProject.acting, 
                        count:dataProject.venues, 
                        ambit:dataProject.ambit, 
                        budget:dataProject.budget, 
                        budget_text:dataProject.budget_text, 
                        picture:dataProject.picture};
                    
                        dataProject.items.push(data);
                    /*
                    project.items.push(geoData);
                    project.items[project.items.length - 1].location = loc;
                    project.items[project.items.length - 1].project = {
                        location: loc,
                        title:project.title, 
                        desc:project.desc, 
                        beneficiaries:project.beneficiaries, 
                        initiative:project.initiative, 
                        acting:project.acting, 
                        count:project.venues, 
                        ambit:project.ambit, 
                        budget:project.budget, 
                        budget_text:project.budget_text, 
                        picture:project.picture};*/
                }
            }
        }
        
        /*if (project.municipality){
            project.location = project.municipality;
        }else if (project.province){
            project.location = project.province;
        }*/

/*        let dataProject = new DataProject(raw_project);
        this.list.push(dataProject);
*/

        if (dataProject.acting === "TIC y Transformación Digital en los Servicios Sociales" && dataProject.location === "Andalucía"){
            console.log(dataProject);
        }


        //console.log(dataProject);
        return dataProject;
    }

    getByIdentifierAndType(type, identifier){
        //console.log(type, identifier);
        return this.list.filter(project => project.location === identifier && project.type === type);
    }

    getProvinceItemsOf(caa){
        let filteredProjects = this.list.filter(project => project.location === caa);

        let items = [];
        for (let index = 0; index < filteredProjects.length; index++) {
            items = items.concat(filteredProjects[index].items);
        }
        return [...new Set(items)];
    }

    getProvince(province){
        let filteredProjects = this.list.filter(
            
            project => (((project.province.toLocaleLowerCase() === province.toLocaleLowerCase()) || 
            (project.province.toUpperCase() === province.toUpperCase())))
        );
        //console.log("getProvince", province, filteredProjects);
        return filteredProjects;
    }

    getMunicipality(municipality){
        let filteredProjects = this.list.filter(
            
            project => (((project.municipality.toLocaleLowerCase() === municipality.toLocaleLowerCase()) || 
            (project.municipality.toUpperCase() === municipality.toUpperCase())) && project.type === DataProject.TYPE_MUNICIPALITY)
        );
        return filteredProjects;
    }

    getMunicipalityItemsOf(province){
        let filteredProjects = this.list.filter(project => project.province.toLocaleLowerCase() === province.toLocaleLowerCase() && project.municipality !== "");

        ///console.log(filteredProjects);
        let items = [];
        for (let index = 0; index < filteredProjects.length; index++) {
            items = items.concat(filteredProjects[index].items);
        }
        console.log("getMunicipalityItemsOf", province, items);
        return items;
    }

    getItemsByAmbit(ambit){
        let filteredProjects = this.list.filter(project => {
            let result = project.ambit === ambit;
            result =  (ambit === "Nacional" && project.ambit === "Autonómico" ) || result;
            return result;
        });
        let items = [];
        for (let index = 0; index < filteredProjects.length; index++) {
            items = items.concat(filteredProjects[index].items);
        }
        return [...new Set(items)];
    }

    getItemsByProp(prop, value){
        let filteredProjects = this.list.filter(project =>  project[prop] === value);

        console.log(filteredProjects);
        let items = [];
        for (let index = 0; index < filteredProjects.length; index++) {
            items = items.concat(filteredProjects[index].items);
        }
        console.log(items);
        return items;

    }

    getItems(){
        let items = [];
        for (let index = 0; index < this.list.length; index++) {
            items = items.concat(this.list[index].items);
        }
        return [...new Set(items)];
    }


    filterByType(type){
        return this.list.filter(project => project.type === type);
    }

    getCCAAs(){
        return Object.keys(this.raw_schools_data);
    }

    getProvinces(caa){
        return Object.keys(this.raw_schools_data[caa].provincias);
    }

    getMunicipalities(caa, province){

       let validItems = [];
       const municipalites = Object.keys(this.raw_schools_data[caa].provincias[province].municipios);

        for (let index = 0; index < municipalites.length; index++) {
            const element = municipalites[index];
            if (this.list.filter(project => project.municipality === element))
            {
                validItems.push(element);
            }
            else{
                console.log(ccaa, province, element);
            }
            
        }
        return validItems;

        //return Object.keys(this.raw_schools_data[caa].provincias[province].municipios);
    }

}