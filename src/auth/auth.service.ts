import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateLoginDto } from './dto/createLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
import { Enable2FAType, PayloadType } from './types';
import * as speakeasy from 'speakeasy';
import { User } from 'src/user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private artistService: ArtistService,
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
    const payload: PayloadType = { email: user.email, userId: user.id };
    const artist = await this.artistService.findArtist(user.id);
    if (artist) payload.artistId = artist.id;
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      const token = this.get2FAToken(user.twoFASecret);
      return { token };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    user.enable2FA = true;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    const token = this.get2FAToken(user.twoFASecret);
    return { token };
  }

  get2FAToken(secret: string): string {
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });
    return token;
  }

  async validate2FAToken(
    id: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(id);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      if (verified) return { verified: true };
      return { verified: false };
    } catch (error) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async disable2FA(id:number){
    return this.userService.disable2FA(id)
  }

  async validateUserByApiKey(apiKey:string):Promise<User>{
    return this.userService.findByApiKey(apiKey)
  }
}
