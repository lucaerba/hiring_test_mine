import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOneByName(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async create(username: string, hashedPassword: string): Promise<User> {
        const user = new User({ username, password: hashedPassword });
        return this.usersRepository.save(user);
    }

}