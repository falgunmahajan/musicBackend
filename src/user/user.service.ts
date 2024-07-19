import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from "bcryptjs"
import { CreateLoginDto } from 'src/auth/dto/createLogin.dto';
import {v4 as uuid4} from "uuid";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}
    async signUp(userDto:CreateUserDto):Promise<User>{
        try {
            const user = new User()
            user.firstName = userDto.firstName;
            user.lastName = userDto.lastName;
            user.email = userDto.email;
            user.apiKey = uuid4();
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(userDto.password,salt);
            const NewUser = await this.userRepo.save(user);
            delete NewUser.password;
            return NewUser
        } catch (error) {
            console.log(error);
            
          if(error.driverError.code==="23505"){
            throw new ConflictException("Email already exists",{description:"AccountExists"})
          }
          throw new InternalServerErrorException()
        }
    
    }

    async findOne(data : CreateLoginDto):Promise<User>{
        const user = await this.userRepo.findOneBy({email:data.email});
        if(!user) throw new UnauthorizedException("Invalid Email or Password");
        return user;
    }

    async findById(id:number):Promise<User>{
        return await this.userRepo.findOneBy({id})
    }

    async updateSecretKey(id:number,secret:string):Promise<UpdateResult>{
        return await this.userRepo.update(id,{
            twoFASecret:secret,
            enable2FA:true
        })
    }

    async disable2FA(id:number):Promise<UpdateResult>{
        return await this.userRepo.update(id,{
            enable2FA:false,
            twoFASecret:null
        })
    }

    async findByApiKey(apiKey:string){
 return await this.userRepo.findOneBy({apiKey})
    }
}
