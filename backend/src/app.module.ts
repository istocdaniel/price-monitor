import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module'; // Importáljuk a UserModule-t
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity'; // Importáljuk a User entitást
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // A konfigurációs modult betöltjük a .env fájlhoz
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // TypeOrm konfigurálása a .env fájlból
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User], // Használjuk az User entitást
        synchronize: true, // Fejlesztési környezetben használható
      }),
    }),

    // Importáljuk a UserModule-t
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
