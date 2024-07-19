import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/createLogin.dto';
import { JwtAuthGuard } from './jwt.guard';
import { ValidateTokenDto } from './dto/ValidateToken.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  @ApiOperation({summary:"Register new user"})
  @ApiResponse({
    status:201,
    description:"It will return the user in the response"
  })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Req() req) {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Req() req,
    @Body() validateTokenDto: ValidateTokenDto,
  ) {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDto.token,
    );
  }

  @Get("disable-2fa")
  @UseGuards(JwtAuthGuard)
  disable2FA(@Req() req){
    return this.authService.disable2FA(req.user.userId)
  }

  @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(@Req() req){
      delete req.user.password;
      return{
        msg:"authenticated with api key",
        user:req.user
      }
    }

    @Get('test')
    testEnvVariable(){
      return this.authService.getEnvVariable()
    }
  
}
