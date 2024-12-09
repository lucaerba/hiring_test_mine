import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { Repository } from 'typeorm';
import { JwtPayloadService } from './jwt/jwt.payload.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { User } from './user/user.entity';
import { UsersService } from './user/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtPayloadService: JwtPayloadService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const user = await this.usersService.findOneByName(createUserDto.username);

        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const newUser = new User(
            {
                username: createUserDto.username,
                password: createUserDto.password
            }
        );

        const userResponse = await this.userRepository.save(newUser);
        const token = await this.jwtPayloadService.createJwtPayload(newUser);

        return { userResponse, token };
    }

    async validateUserByPassword(loginUserDto: CreateUserDto) {
        const user = await this.usersService.findOneByName(loginUserDto.username);
        //console.log('user :', user);
        if (!user) {
            throw new UnauthorizedException('User does not exist ', loginUserDto.username);
        }

        const isPasswordValid = loginUserDto.password === user.password; // Assuming passwords are already hashed
        //console.log('isPasswordValid :', isPasswordValid);
        if (!isPasswordValid) {
            throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.jwtPayloadService.createJwtPayload(user);
        //console.log('token :', token);
        return {
            token: token.token,
            expiresIn: '1d',
        };
    }

}