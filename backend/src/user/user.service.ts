import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;
    
    // Ellenőrizzük, hogy létezik-e már a felhasználó
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Jelszó hash-elése
    const hashedPassword = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    // Felhasználó mentése az adatbázisba
    await this.usersRepository.save(user);
    return user;
  }
}
