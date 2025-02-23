import {Module, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import { AdminController } from './admin/admin.controller';
import {AppService} from './app.service';
import {User} from "./entities/user.entity";
import {Product} from './entities/product.entity';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from '@nestjs/config';
import { PriceHistory } from './entities/price-history.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email/email.service';
import { AdminService } from './admin/admin.service';
import { AlertHistory } from './entities/alert-history.entity';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, 
            envFilePath: '.env', 
        }),

        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DB'),
            entities: [User, Product, PriceHistory, AlertHistory], 
            synchronize: true,
        }),
        inject: [ConfigService],
      }),
        
        TypeOrmModule.forFeature([User, Product, PriceHistory, AlertHistory]),
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        }),
        ScheduleModule.forRoot(), 
    ],
    controllers: [AppController, AdminController],
    providers: [AppService, EmailService, AdminService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'api/*path', method: RequestMethod.ALL },
                { path: 'admin/*path', method: RequestMethod.ALL }
            );
    }
}