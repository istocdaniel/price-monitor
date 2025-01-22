import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity'; 
import { Product } from 'src/product/product.entity';
import { JwtModule } from '@nestjs/jwt/dist'; // User entitás importálása
import { ProductModule } from 'src/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User,Product]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' }
    }),
  ],  
  providers: [UserService, AuthGuard],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
