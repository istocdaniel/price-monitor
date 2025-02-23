import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const cookie = req.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException('JWT token must be provided');
        }

        try {
            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException('Please log in');
            }

            req.user = data;
            next();
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
