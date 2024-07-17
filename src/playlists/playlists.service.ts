import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/songs.entity';
import { User } from 'src/user/user.entity';
import { CreatePlayListDTO } from './dto/createPlaylist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist) private playListRepo: Repository<Playlist>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(playListDTO: CreatePlayListDTO): Promise<Playlist> {
    playListDTO.name = playListDTO.name;
    const songs = await this.songRepo.findByIds(playListDTO.songs);
    playListDTO.songs = songs;
    const user = await this.userRepo.findOneBy({ id: playListDTO.user });
    playListDTO.user = user;
    return await this.playListRepo.save(playListDTO);
  }
}
