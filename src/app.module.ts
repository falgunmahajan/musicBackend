import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DevConfigService } from './common/providers/DevConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/songs.entity';
import { Artist } from './artist/artist.entity';
import { User } from './user/user.entity';
import { Playlist } from './playlists/playlist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const devConfig = {port:3000}
const proConfig =  {port:4000}
@Module({
  imports: [SongsModule,
    TypeOrmModule.forRoot({
      type:"postgres",
      database:'MusicApp',
      host:"localhost",
      port:5432,
      username:"postgres",
      password:"falgunmahajan",
      entities:[Song, Artist, User, Playlist],
      synchronize:true
    }),
    PlaylistsModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide:DevConfigService,
    useClass:DevConfigService
  },{
    provide:"CONFIG",
    useFactory:()=>{
      return process.env.NODE_ENV === "development" ? devConfig : proConfig
      }
  }],
})
export class AppModule implements NestModule{
  constructor(private dataSource:DataSource){
    console.log(this.dataSource.driver.database);
    
  }
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes("songs")
  }
}
