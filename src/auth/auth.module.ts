import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtPayloadService } from './jwt/jwt.payload.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from './user/user.entity';
import { UsersModule } from './user/users.module';


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: true }),
        JwtModule.register({
            secret: 'secret',
            signOptions: {
                expiresIn: '1d',
            },
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtPayloadService],
})
export class AuthModule { }