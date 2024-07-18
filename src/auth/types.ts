export interface PayloadType{
    email:string;
    userId:number;
    artistId?:number
}

export interface Enable2FAType{
    token:string;
}