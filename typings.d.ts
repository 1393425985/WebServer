declare module "*.png";
declare module "*.json";

declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;