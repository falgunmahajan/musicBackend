import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/createSongsDto';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService){}
    @Post()
    create(@Body() createSongDto:CreateSongDTO){
        return this.songsService.create(createSongDto)
    }
    @Get()
    findAll(){
        return this.songsService.findAll()
    }
    @Get(":id")
    findOne(@Param("id",new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id:number){
        return `find song based on id ${typeof id}`
    }
    @Put(":id")
    update(){
        return "update song based on id"
    }
    @Delete(":id")
    delete(){
        return "delete song based on id"
    }
}
