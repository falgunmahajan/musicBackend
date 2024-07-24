import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DevConfigService } from './common/providers/DevConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { dataSourceOptions, typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { EventsModule } from './events/events.module';

const devConfig = {port:3000}
const proConfig =  {port:4000}
@Module({
  imports: [SongsModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      envFilePath:['.env.development','.env.production'],
      isGlobal:true,
      load:[configuration],
      validate
    }),
    PlaylistsModule,
    AuthModule,
    UserModule,
    ArtistModule,
    SeedModule,
    EventsModule
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
