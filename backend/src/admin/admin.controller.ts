import {Controller, Get, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import { AdminService } from './admin.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Controller('admin')
@UseGuards(AuthMiddleware)
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {
    }

    @Get('users')
    async listUsers(@Req() request: Request) {
        if (await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listUsers();
        } else {
            throw new UnauthorizedException();
        }
    }

    @Get('products')
    async listProducts(@Req() request: Request) {
        if (await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listProducts();
        } else {
            throw new UnauthorizedException();
        }
    }

    @Get('logs')
    async listLogs(@Req() request: Request) {
        if (await this.adminService.authorizeAdmin(request.cookies['jwt'])) {
            return this.adminService.listLogs();
        } else {
            throw new UnauthorizedException();
        }
    }
}