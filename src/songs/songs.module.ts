import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs.entity';
import { Artist } from 'src/artist/artist.entity';
// const mockSongsService = {
//   findAll(){
//     return [{id:1, title:"Lasting hover"}]
//   }
// }
@Module({
  imports:[TypeOrmModule.forFeature([Song,Artist])],
  controllers: [SongsController],
  providers: [SongsService,
  //   {
  //   provide:SongsService,
  //   useValue:mockSongsService
  // },
  // {
  //   provide:"CONNECTION",
  //   useValue:connection
  // }
]
})
export class SongsModule {}
