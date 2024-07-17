import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSongDto{
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly title;

    @IsArray()
    @IsNumber({},{each:true})
    @IsNotEmpty()
    @IsOptional()
    readonly artists;

    @IsDateString()
    @IsNotEmpty()
    @IsOptional()
    readonly releasedDate:Date;

    @IsMilitaryTime()
    @IsNotEmpty()
    @IsOptional()
    readonly duration :Date;

    @IsString()
    @IsOptional()
    readonly lyrics:string;
}