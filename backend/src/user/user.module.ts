import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Itt importáljuk a User-t
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Ha más modulok is használni akarják a UserService-t
})
export class UserModule {}
