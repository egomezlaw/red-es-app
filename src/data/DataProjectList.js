import DataProject from './DataProject';

export default class DataProjectList{
    constructor({projects, locations}){
        this.list = [];
        this.locations = locations;
        for(const p in projects){
            projects[p].type = DataProject.TYPE_PROJECT;
            this.addProject(projects[p]);
        }

        this.raw_schools_data = null;
    }

    sortProjects(){
        this.list.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
    }

    fromSchools(schools){

        this.raw_schools_data = schools;

        let budget = 0;
        let budget_text = "";
        let desc = ""
        let items = [];
        let p_items = [];
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
                    items[items.length - 1].location = m;

                    p_items.push(geoData);
                    p_items[p_items.length - 1].location = m;

                    p_count += parseInt(provinces[p].municipios[m]);
                    ccaa_count += parseInt(provinces[p].municipios[m]);

                    let m_items = [];
                    m_items.push(geoData);
                    m_items[0].location = m;

                    desc = `En el municipio de ${m.toLocaleLowerCase()}, ubicado en la provincia de ${p} dentro de ${ccaa}, contamos con ${parseInt(provinces[p].municipios[m])} sedes.`
                    this.addProject({items:m_items, budget, budget_text, identifier:m, desc, type:DataProject.TYPE_MUNICIPALITY });
                }

                if (this.locations[p]){
                    geoData = this.locations[p];
                }
                
                p_items.push(geoData);
                //p_items[p_items.length - 1].count = p_count;
                p_items[p_items.length - 1].location = p;

                desc = `En la provincia de ${p} dentro de ${ccaa}, contamos con ${p_count} sedes.`
                this.addProject({items:p_items, budget, budget_text, desc, identifier:p, type:DataProject.TYPE_PROVINCE });
            }

            desc = `Dentro de ${ccaa}, contamos con ${ccaa_count} sedes.`
            this.addProject({items:items, budget, budget_text, type:"school", desc, identifier:ccaa, type:DataProject.TYPE_CCAA, ambit:"Autonómico" });

            ccaa_count = 0;
        }
        this.sortProjects();
    }

    addProject(project){

        if (project['location']){
            project.items = [];
            const points = project['location'].split(",");
            for(let i = 0; i < points.length; i++){
                const loc = points[i];
                if (this.locations[loc]){
                    let geoData = this.locations[loc];
                    project.items.push(geoData);
                    project.items[project.items.length - 1].location = loc;
                    project.items[project.items.length - 1].project = project;
                }
            }
        }

        this.list.push(new DataProject(project));
    }

    getByIdentifierAndType(type, identifier){
        return this.list.filter(project => project.identifier === identifier && project.type === type);
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
        return Object.keys(this.raw_schools_data[caa].provincias[province].municipios);
    }

}