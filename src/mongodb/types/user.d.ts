declare namespace UserType {
    export interface Model {
        name: string;
        email: string;
        tel: string;
        pwd: string;
        createdAt: Date;
    }
    export interface Jwt {
        id: string;
        name: Model['name'];
        tel: Model['tel'];
        email: Model['email'];
    }
}
