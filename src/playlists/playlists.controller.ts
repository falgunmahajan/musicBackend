import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDTO } from './dto/createPlaylist.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlists')
@ApiTags('playlists')
export class PlaylistsController {
    constructor(private playListService: PlaylistsService){}
    @Post()
    create(@Body() createPlayListDTO : CreatePlayListDTO){
      return this.playListService.create(createPlayListDTO)
    }
}
