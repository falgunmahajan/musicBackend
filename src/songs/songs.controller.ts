import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/createSongsDto';
import { Connection } from 'src/common/constants/connection';
import { UpdateSongDto } from './dto/updateSongDto';
import { ArtistJwtGuard } from 'src/auth/artists-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// @Controller({path:'songs',scope:Scope.REQUEST})
@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(
    private songsService: SongsService,
    // @Inject('CONNECTION') private connection: Connection,
  ) {
    // console.log(
    //   `this is connection string ${this.connection.CONNECTION_STRING}`,
    // );
  }
  @Post()
  @UseGuards(ArtistJwtGuard)
  create(@Body() createSongDto: CreateSongDTO , @Req() request) {
    console.log(request.user);
    
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.update(id, updateSongDto);
  }
  
  @Delete(':id')
  delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.songsService.delete(id);
  }
}
