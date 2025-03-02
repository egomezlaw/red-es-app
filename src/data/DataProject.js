export default class DataProject{
    static TYPE_PROJECT = "project";
    static TYPE_SCHOOL = "schools";
    static TYPE_CCAA = "ccaa";
    static TYPE_PROVINCE = "PROVINCE";
    static TYPE_MUNICIPALITY = "municipality";

    static AMBIT_INTERNATIONAL = "InternaciOnal";
    static AMBIT_NATIONAL = "Nacional";
    static AMBIT_AUTONOMIC = "Autonómico";

    constructor(id, {title, identifier, desc, beneficiaries, initiative, acting, venues, ambit, location, budget, budget_text, picture, type, province, municipality}){
        this.id = id;
        this.title = title ??= "NA";
        this.identifier = identifier ??= "";
        this.desc = desc ??= "";
        this.beneficiaries = beneficiaries ??= "NA";
        this.initiative = initiative ??= "NA";
        this.acting = acting ??= "";
        this.count = venues ??= "NA";
        this.ambit = ambit;
        this.location = location;
        this.budget = budget ??= 0;
        this.budget_text = budget_text ??= "";
        this.picture = picture;
        this.items = [];
        this.type = type;
        this.province = province;
        this.municipality = municipality ??= "";
    }

    asJSON(){
        this.venues = this.count;
        return JSON.stringify(this.clone());
    }

    clone(){
        let clonedProject = new DataProject({...this});
        for (let index = 0; index < clonedProject.items.length; index++) {
            clonedProject.items[index].project = null;            
        }
        return clonedProject;
    }

}

