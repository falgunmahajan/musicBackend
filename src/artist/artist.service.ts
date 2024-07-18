import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
  ) {}
  async findArtist(userId: number): Promise<Artist> {
    return await this.artistRepo.findOneBy({ user: { id: userId } });
  }
}
