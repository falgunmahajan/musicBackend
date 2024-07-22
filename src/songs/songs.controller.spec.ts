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
      providers: [
        {
          provide: SongsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'songs1' }]),
            findOne:jest.fn().mockImplementation((id:string)=>{
              return Promise.resolve({id:id, title:"songs1"})
            }),
            create:jest.fn().mockImplementation((createSongDto:CreateSongDTO)=>{
              return Promise.resolve({id:'a uuid',...CreateSongDTO})
            }),
            update:jest.fn().mockImplementation((updateSongDto:UpdateSongDto)=>{
              return Promise.resolve({affected:1})
            }),
            delete:jest.fn().mockImplementation((id:string)=>{
              return Promise.resolve({affected:1})
            })
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
    it('should fetch all the songs',async()=>{
      const songs = await controller.findAll();
      expect(songs).toEqual([{ id: 1, title: 'songs1' }])
    });
  });
  describe('fetch song by id', () => {
    it('should fetch song by id',async()=>{
      const song = await controller.findOne(6323);
      expect (song.id).toBe(6323)
    });
  });
});
