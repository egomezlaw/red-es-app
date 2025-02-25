export default class DataProject{
    static TYPE_PROJECT = "project";
    static TYPE_CCAA = "ccaa";
    static TYPE_PROVINCE = "PROVINCE";
    static TYPE_MUNICIPALITY = "municipality";

    constructor({title, identifier, desc, beneficiaries, initiative, acting, ambit, location, budget, budget_text, picture, items, type}){
        this.title = title ??= "TODOS";
        this.identifier = identifier ??= "";
        this.desc = desc ??= "";
        this.beneficiaries = beneficiaries ??= "TODOS";
        this.initiative = initiative ??= "TODOS";
        this.acting = acting ??= "";
        this.ambit = ambit;
        this.location = location;
        this.budget = budget ??= 0;
        this.budget_text = budget_text ??= "";;
        this.picture = picture;
        this.items = items ??= [];
        this.type = type;
    }

    asJSON(){
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

