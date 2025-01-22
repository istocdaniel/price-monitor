import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Debugging
      console.log('Token:', token);

      const decoded = this.jwtService.verify(token);
      console.log('Decoded:', decoded);

      request.user = decoded;  // A decoded token a payload-ot tartalmazza
      return true;
    } catch (error) {
      console.log('Error decoding token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
