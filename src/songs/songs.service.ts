import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './songs.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/createSongsDto';
import { UpdateSongDto } from './dto/updateSongDto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artist/artist.entity';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}
  private readonly songs = [];
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const artists = await this.artistRepository.findByIds(songDTO.artists);
    songDTO.artists = artists;
    return await this.songRepository.save(songDTO);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Song> {
    return await this.songRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.songRepository.delete(id);
  }

  async update(id: number, songDTO: UpdateSongDto): Promise<UpdateResult> {
    return await this.songRepository.update(id, songDTO);
  }
}
