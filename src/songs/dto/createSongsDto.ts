import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
     title:string;

    @IsArray()
    @IsNumber({},{each:true})
    @IsNotEmpty()
     artists;

    @IsDateString()
    @IsNotEmpty()
     releasedDate;

    @IsMilitaryTime()
    @IsNotEmpty()
     duration;

    @IsString()
    @IsOptional()
     lyrics?:string;
}