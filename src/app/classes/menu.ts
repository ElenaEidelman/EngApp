export class Menu{
    constructor(private label: string, private ischecked: boolean, private controlname: string, private path?: string){
        this.label = label;
        this.ischecked = ischecked;
        this.controlname = controlname;
        this.path = path;
    }
}