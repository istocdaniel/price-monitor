import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import {AppService} from './app.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';

@Controller('api')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private jwtService: JwtService
    ) {
    }

    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        const existingUser = await this.appService.findOne({email});

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await this.appService.create({
            name,
            email,
            password: hashedPassword
        });

        return { name: user.name, email: user.email };
    }


    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.appService.findOne({email});

        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return {
            message: 'Successful login'
        };
    }


    @Get('user')
    async user(@Req() request: Request) {
        
        try {
            const cookie = request.cookies['jwt'];

            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException();
            }

            const user = await this.appService.findOne({id: data['id']});

            const {password, ...result} = user;

            return result;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'Successful logout'
        }
    }

    @Post('add-product')
    async addProduct(
        @Body('name') name: string,
        @Body('url') url: string,
        @Req() request: Request
    ) {
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException();
        }

        const user = await this.appService.findOne({id: data['id']});

        const existingProduct = await this.appService.findProductByNameOrUrl(name, url);

        if (existingProduct) {
            throw new BadRequestException('Product with the same name or URL already exists');
        }

        const product = await this.appService.createProduct({
            name,
            url,
            user
        });

        return {
            message: 'Product added successfully'
        };
    }

    @Get('products')
    async getProducts(@Req() request: Request) {
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException();
        }

        const products = await this.appService.findProductsByUser(data['id']);

        return products;
    }
}
