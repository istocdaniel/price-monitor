import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto'; // A DTO importálása

@Controller('users')  // Base route: /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register') // A végpont: POST /users/register
  async register(@Body() createUserDto: CreateUserDto) {
    // A createUserDto tartalmazza az email és password mezőket
    return this.userService.createUser(createUserDto.email, createUserDto.password);
  }
}
