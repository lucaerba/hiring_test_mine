import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtPayloadService {
    constructor(private readonly jwtService: JwtService) { }

    createJwtPayload(user: { username: any; }) {
        const data: JwtPayload = {
            username: user.username,
        };

        let jwt;
        try {
            jwt = this.jwtService.sign(data);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                'Internal Server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            token: jwt,
        };
    }
}