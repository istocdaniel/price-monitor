import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Product} from '../entities/product.entity';
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import { EmailService } from '../email/email.service';
import { AlertHistory } from '../entities/alert-history.entity';

@Injectable()
export class AdminService {
    constructor(
        private jwtService: JwtService,
        private readonly emailService: EmailService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(AlertHistory) private readonly alertRepository: Repository<AlertHistory>,
    ) {
    }

    async listUsers() {
        return this.userRepository.find();
    }

    async authorizeAdmin(jwt: string) {
        const user = await this.userRepository.findOne({ where: { id: this.jwtService.decode(jwt)['id'] } });
        return user.admin;
    }

    async listProducts() {
        return this.productRepository.find();
    }

    async listLogs() {
        return this.alertRepository.find();
    }
}
