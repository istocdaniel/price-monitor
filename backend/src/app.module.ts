import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {User} from "./user.entity";
import {Product} from './product.entity';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from '@nestjs/config';
import { PriceHistory } from './price-history.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, 
        }),

        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DB'),
            entities: [User, Product, PriceHistory],
            synchronize: true,
        }),
        inject: [ConfigService],
      }),
        
        TypeOrmModule.forFeature([User,Product,PriceHistory]),
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        }),
        ScheduleModule.forRoot(), // Import ScheduleModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}