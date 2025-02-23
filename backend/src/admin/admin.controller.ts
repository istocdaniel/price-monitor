import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from '@nestjs/common';
import {AppService} from '../app.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from 'express';
import {EmailService} from '../email/email.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly appService: AppService,
        private readonly adminService: AdminService,
        private readonly emailService: EmailService,
        private jwtService: JwtService
    ) {
    }

    @Get('users')
    async listUsers(@Req() request: Request) {
        console.log((await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])))
        
        if (await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listUsers()
        } else {
            throw new UnauthorizedException()
        }
    }

    @Get('products')
    async listProducts(@Req() request: Request) {
        console.log((await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])))
        
        if (await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listProducts()
        } else {
            throw new UnauthorizedException()
        }
    }

    @Get('logs')
    async listLogs(@Req() request: Request) {
        console.log((await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])))
        
        if (await this.appService.authorizeUser(request.cookies['jwt']) && await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listLogs()
        } else {
            throw new UnauthorizedException()
        }
    }
}