import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import {AppService} from './app.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';
import {EmailService} from './email/email.service';

@Controller('api')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly emailService: EmailService,
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
        
        const user = await this.appService.create({
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
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        try {
            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException('Please log in');
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

    @Get('products')
    async getProducts(@Req() request: Request) {
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException('Please log in');
        }
        
        const products = await this.appService.findProductsByUser(data['id']);

        return products;
    }

    @Post('add-product')
    async addProduct(
        @Body('name') name: string,
        @Body('url') url: string,
        @Req() request: Request
    ) {
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException('Please log in');
        }

        const existingProduct = await this.appService.findProduct({name, url});

        if (existingProduct) {
            throw new BadRequestException('Product with the same name or URL already exists');
        }

        const product = await this.appService.createProduct({
            user: data['id'],
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
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException('Please log in');
        }

        const product = await this.appService.findProductById(productId);

        if (!product || product.user !== data['id']) {
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
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException('Please log in');
        }

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
