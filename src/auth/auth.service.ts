import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateLoginDto } from './dto/createLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: CreateLoginDto) {
    const user = await this.userService.findOne(loginDto);
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatched)
      throw new UnauthorizedException('Invalid Email or Password');
    delete user.password;
    const payload = { email: user.email, sub: user.id };
    return {
        user,
        accessToken:this.jwtService.sign(payload)
    };
  }
}
