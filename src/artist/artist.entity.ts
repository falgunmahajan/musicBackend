import { Song } from "src/songs/songs.entity";
import { User } from "src/user/user.entity";
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('artists')
export class Artist{
    @PrimaryGeneratedColumn('uuid')
    id:number

    @OneToOne(()=>User)
    @JoinColumn()
    user:User

    @ManyToMany(()=>Song,(song)=>song.artists)
    song:Song[]
}