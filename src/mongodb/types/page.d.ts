declare namespace PageType {
    export interface Model {
        _id: any;
        name: string;
        icon: string;
        path: string;
        children?: Model[];
    }
}
