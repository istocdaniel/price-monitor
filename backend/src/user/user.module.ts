import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';  // User entitás importálása

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // User entitás regisztrálása
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
