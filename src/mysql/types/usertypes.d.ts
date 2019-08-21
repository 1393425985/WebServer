declare namespace UserTypes {
  export interface Model {
    id: number;
    password: string;
    nickname: string;
    email: string;
    tel: string;
  }
  export type Jwt = Partial<Model>
}
