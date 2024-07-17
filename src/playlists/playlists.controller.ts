import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDTO } from './dto/createPlaylist.dto';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
    constructor(private playListService: PlaylistsService){}
    @Post()
    create(@Body() createPlayListDTO : CreatePlayListDTO){
      return this.playListService.create(createPlayListDTO)
    }
}
