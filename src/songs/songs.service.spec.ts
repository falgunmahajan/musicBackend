import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { FindOneOptions, Repository } from 'typeorm';
import { Song } from './songs.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/createSongsDto';
import { UpdateSongDto } from './dto/updateSongDto';
import { Artist } from 'src/artist/artist.entity';

describe('SongsService', () => {
  let service: SongsService;
  let SongRepo: Repository<Song>;
  let artistRepo: Repository<Artist>;
  const oneSong = { id: 1, title: 'Runaway' };
  const songArray = [{ id: 1, title: 'Runaway' }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            createQueryBuilder: jest
              .fn()
              .mockImplementation(() => Promise.resolve(songArray)),
            findOneBy: jest
              .fn()
              .mockImplementation((options: FindOneOptions) =>
                Promise.resolve(oneSong),
              ),
            save: jest
              .fn()
              .mockImplementation((createSongDTO: CreateSongDTO) =>
                Promise.resolve({ id: 1, ...createSongDTO }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: string, updateSongDto: UpdateSongDto) =>
                Promise.resolve({ affected: 1 }),
              ),
            delete: jest
              .fn()
              .mockImplementation((id: string) =>
                Promise.resolve({ affected: 1 }),
              ),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    SongRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    artistRepo = module.get<Repository<Artist>>(getRepositoryToken(Artist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should give me the song by id', async () => {
    const song = await service.findOne(1);
    const repoSpy = jest.spyOn(SongRepo, 'findOneBy');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should create a song', async () => {
    const newSongDto: CreateSongDTO = {
      title: 'Runaway',
      artists: [2, 5],
      duration: '12:03',
      releasedDate: '2024-09-08',
    };
    const song = await service.create(newSongDto);

    expect(song).toEqual({
      id: 1,
      title: 'Runaway',
      artists: undefined,
      duration: '12:03',
      releasedDate: '2024-09-08',
    });
    expect(artistRepo.findByIds).toHaveBeenCalledTimes(1);
    expect(artistRepo.findByIds).toHaveBeenCalledWith([2, 5]);
    expect(SongRepo.save).toHaveBeenCalledTimes(1);
    expect(SongRepo.save).toHaveBeenCalledWith(newSongDto);
  });

  it('should update the song', async () => {
    const updateSongDto: UpdateSongDto = {
      title: 'Animals',
    };
    const song = await service.update(1, updateSongDto);

    expect(SongRepo.update).toHaveBeenCalledTimes(1);
    expect(SongRepo.update).toHaveBeenCalledWith(1, updateSongDto);
  });

  it('should delete the song', async()=>{
    const song = await service.delete(1);
    expect(SongRepo.delete).toHaveBeenCalledTimes(1);
    expect(song.affected).toBe(1)
    expect(SongRepo.delete).toHaveBeenCalledWith(1);
  })
});
