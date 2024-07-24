import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/createSongsDto';
import { UpdateSongDto } from './dto/updateSongDto';

describe('SongsController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [SongsService,
        {
          provide: SongsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'songs1' }]),
            findOne: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ id: id, title: 'songs1' });
            }),
            create: jest
              .fn()
              .mockImplementation((createSongDto: CreateSongDTO) => {
                return Promise.resolve({ id: 1, ...createSongDto });
              }),
            update: jest
              .fn()
              .mockImplementation((updateSongDto: UpdateSongDto) => {
                return Promise.resolve({ affected: 1 });
              }),
            delete: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ affected: 1 });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetch all the songs', () => {
    it('should fetch all the songs', async () => {
      const songs = await controller.findAll();
      expect(songs).toEqual([{ id: 1, title: 'songs1' }]);
    });
  });

  describe('fetch song by id', () => {
    it('should fetch song by id', async () => {
      const song = await controller.findOne(6323);
      expect(song.id).toBe(6323);
    });
  });

  describe('create song', () => {
    it('should create a new song', async () => {
      const newSongDto: CreateSongDTO = {
        title: 'Runaway',
        artists: [2, 5],
        duration: '12:03',
        releasedDate: '2024-09-08',
      };
      const song = await controller.create(newSongDto, 'req');  
      expect(song.title).toBe('Runaway');
      expect(song).toEqual({
        id: 1,
        title: 'Runaway',
        artists: [2, 5],
        duration: '12:03',
        releasedDate: '2024-09-08',
      });
    });
  });

  describe('update song',()=>{
    it('should update the song',async()=>{
      const updateSongDto: UpdateSongDto= {
        title: 'Animals',
      };
      const updatedResult = await controller.update(1,updateSongDto);
      expect(updatedResult).toBeDefined();
      expect(updatedResult.affected).toBe(1)
    })
  })

  describe('delete song',()=>{
    it('should delete a song',async()=>{
      const deletedResult = await controller.delete(1);
      expect(deletedResult.affected).toBe(1)
    })
  })
});
