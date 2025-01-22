import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { LoginUserDto } from './dto/login-user.dto';

@Controller()  
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register') // endpoint: /register
  async register(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.userService.createUser(createUserDto.email, createUserDto.password);
  }

  @Post('login') // endpoint: /login
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto.email, loginUserDto.password);
  }
}