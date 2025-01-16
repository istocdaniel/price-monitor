import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    // Ellenőrizzük, hogy létezik-e már felhasználó ezzel az email címmel
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Jelszó titkosítása
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása és mentése
    const user = this.usersRepository.create({ email, password: hashedPassword });
    await this.usersRepository.save(user);
    return user;
  }
}
