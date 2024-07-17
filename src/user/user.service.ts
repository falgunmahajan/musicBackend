import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcryptjs"
import { CreateLoginDto } from 'src/auth/dto/createLogin.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}
    async signUp(userDto:CreateUserDto):Promise<User>{
        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password,salt);
        const NewUser = await this.userRepo.save(userDto);
        delete NewUser.password;
        return NewUser
    }

    async findOne(data : CreateLoginDto):Promise<User>{
        const user = await this.userRepo.findOneBy({email:data.email});
        if(!user) throw new UnauthorizedException("Invalid Email or Password");
        return user;
    }
}
