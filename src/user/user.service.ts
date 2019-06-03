import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserEntity} from './user.entity';
import { UserDTO, UserRO } from './user.dto';

@Injectable()
export class UserService {

    constructor (
        @InjectRepository(UserEntity) 
        private userRepository: Repository<UserEntity>
    ) {} 

    async showAllUsers(): Promise <UserRO []> {      
        const users = await this.userRepository.find({relations: ['movies','favourites']});
        return users.map(user => user.toResponseObject(false));
    }

    async login(data: UserDTO): Promise<UserRO> {
        const {username, password} = data;
        const user = await this.userRepository.findOne({where: {username}, relations:['movies','favourites']});

        if (!user || !(await user.comparePassword(password))){
            throw new HttpException (
                'Invalid Username or Password',
                HttpStatus.UNAUTHORIZED
            );
        }

        return user.toResponseObject();
    }

    async register (data: UserDTO): Promise <UserRO> {
        const {username, password} = data;
        let user= await this.userRepository.findOne(username);
        if (user) {
            throw new HttpException (
                'This user already exists',
                HttpStatus.BAD_REQUEST
            );
        }

        user = await this.userRepository.create ({username,password});     
        await this.userRepository.save(user);
        return user.toResponseObject();
    }


}
