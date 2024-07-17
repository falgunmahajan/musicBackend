import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/createLogin.dto';

@Controller('auth')
export class AuthController {
    constructor(private userService:UserService, private authService:AuthService){}
    @Post('signup')
    signUp(@Body() createUserDto:CreateUserDto){
        return this.userService.signUp(createUserDto)
    }

    @Post('login')
    login(@Body() createLoginDto:CreateLoginDto){
        return this.authService.login(createLoginDto)
    }
}
