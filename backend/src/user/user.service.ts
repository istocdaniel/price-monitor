import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // A Repository<User> injektálása
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);  // Jelszó titkosítása
    const user = this.usersRepository.create({ email, password: hashedPassword });  // A titkosított jelszó mentése
    await this.usersRepository.save(user);
    return user;
  }
}