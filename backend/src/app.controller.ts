import {BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';
import { AuthMiddleware } from './middleware/auth.middleware';

@Controller('api')
@UseGuards(AuthMiddleware)
export class AppController {
    constructor(
        private readonly appService: AppService,
        private jwtService: JwtService
    ) {
    }

    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        const existingUser = await this.appService.findOne({email});

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await this.appService.createUser({
            username,
            email,
            password: hashedPassword
        });

        return { username: user.username, email: user.email };
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.appService.findOne({username});

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
        const user = await this.appService.findOne({id: request.user['id']});
        const {password, ...result} = user;
        return result;
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'Successful logout'
        }
    }

    @Get('products')
    async getProducts(@Req() request: Request) {
        const products = await this.appService.findProductsByUser(request.user['id']);
        return products;
    }

    @Post('add-product')
    async addProduct(
        @Body('name') name: string,
        @Body('url') url: string,
        @Req() request: Request
    ) {
        const existingProduct = await this.appService.findProduct({name, url});

        if (existingProduct) {
            throw new BadRequestException('Product with the same name or URL already exists');
        }

        const product = await this.appService.createProduct({
            user: request.user['id'],
            name,
            url
        });

        const priceData = await this.appService.getPrice(url);
        const price = await this.appService.setPrice(product.id, Number(priceData.price), priceData.currency);

        return {product, priceData};
    }

    @Post('get-price')
    async getPrice(
        @Body('url') url: string
    ) {
        return await this.appService.getPrice(url);
    }

    @Post('delete-product')
    async deleteProduct(
        @Body('productId') productId: number,
        @Req() request: Request
    ) {
        const product = await this.appService.findProductById(productId);

        if (!product || product.user !== request.user['id']) {
            throw new BadRequestException('Product not found or unauthorized');
        }

        await this.appService.deleteProduct(productId);

        return {
            message: 'Product deleted successfully'
        };
    }

    @Post('set-threshold')
    async setThreshold(
        @Body('productId') productId: number,
        @Body('threshold') threshold: number,
        @Req() request: Request
    ) {
        const updatedProduct = await this.appService.setThreshold(productId, threshold);

        return {
            message: 'Threshold updated successfully',
            product: updatedProduct
        }
    }

    @Post('check-thresholds')
    async checkThresholds() {
        await this.appService.checkThresholds();

        return {
            message: 'Thresholds checked successfully'
        }
    }
}
