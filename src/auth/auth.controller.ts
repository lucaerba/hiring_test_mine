import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UsersService } from './user/users.service';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.userService.findOneByName(req.user);
    }

    @Post('login')
    async login(@Body() loginUserDto: CreateUserDto) {
        //console.log('loginUser :', loginUserDto);
        return await this.authService.validateUserByPassword(loginUserDto);
    }
}