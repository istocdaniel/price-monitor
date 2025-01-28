import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Product} from './product.entity';
import {Repository} from "typeorm";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) {
    }

    async create(data: any): Promise<User> {
        return this.userRepository.save(data);
    }

    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne({
            where: condition, 
        });
    }

    async createProduct(data: any): Promise<Product> {
        return this.productRepository.save(data);
    }

    async findProductsByUser(userId: number): Promise<Product[]> {
        return this.productRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    async findProduct(criteria: { name?: string; url?: string }): Promise<Product | undefined> {
        return this.productRepository.findOne({ where: [{ name: criteria.name }, { url: criteria.url }] });
    }

    async findProductById(productId: number) {
        return this.productRepository.findOne({ where: { id: productId } });
    }

    async deleteProduct(productId: number) {
        return this.productRepository.delete({ id: productId });
    }
}
