import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:number
    @ApiProperty({
        example:"Jane",
        description:"Provide the firstname of the user"
    })
    @Column()
    firstName:string;

    @ApiProperty({
        example:"Doe",
        description:"Provide the lastname of the user"
    })
    @Column()
    lastName:string;

    @ApiProperty({
        example:"jane_doe@gmail.com",
        description:"Provide the email of the user"
    })
    @Column({unique:true})
    email:string;

    @ApiProperty({
        description:"Provide the password of the user"
    })
    @Column()
    @Exclude()
    password:string;

    @Column({nullable:true, type:'text'})
    twoFASecret:string;

    @Column({default:false,type:'boolean'})
    enable2FA:boolean;

    @Column()
    apiKey:string;

    @ApiProperty({
        description:"A user can create many playlists"
    })
    @OneToMany(()=>Playlist,(PlayList)=>PlayList.user)
    playLists:Playlist[]
}