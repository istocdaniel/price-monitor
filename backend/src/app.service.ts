import {Injectable, BadRequestException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Product} from './product.entity';
import {Repository} from "typeorm";
import {Cron} from '@nestjs/schedule';
import { PriceHistory } from './price-history.entity';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(PriceHistory) private readonly pricetRepository: Repository<PriceHistory>
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

    async getPrice(url: string) {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const priceSelectors = [
            '.price', // generic price class
            '.x-price-primary', // eBay
            '.a-price-whole', // Amazon
            '[class*="price"]', // any class containing 'price'
            '[id*="price"]' // any id containing 'price'
        ];

        const currencySymbols: { [key: string]: string } = {
            '$': 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '₽': 'RUB',
            '₹': 'INR',
            '₩': 'KRW',
            'Ft': 'HUF',
            '¥': 'JPY',
            '₺': 'TRY',
            'US': 'USD',
            'GBP': 'GBP',
            'USD': 'USD',
            'EUR': 'EUR',
            'RUB': 'RUB',
            'INR': 'INR',
            'KRW': 'KRW',
            'HUF': 'HUF'
        };

        for (const selector of priceSelectors) {
            const priceElement = $(selector).first();
            if (priceElement.length) {
                const priceText = priceElement.text();
                const match = priceText.match(/(\d[\d\s]*)/);

                if (match) {
                    const price = match[0].replace(/\s/g, ''); // Get the first match which is the desired number

                    let currency = '';

                    for (const symbol in currencySymbols) {
                        if (priceText.includes(symbol)) {
                            currency = currencySymbols[symbol];
                            break;
                        }
                    }

                    return { price, currency };
                }
            }
        }

        return null;
    }

    async setPrice(productId: number, price: number, currency: string) {
        await this.pricetRepository.save({
            date: new Date(),
            product: { id: productId },
            price,
            currency
        })
    }

    @Cron('0 0 * * * *')
    async updatePrices() {
        const products = await this.productRepository.find({ relations: ['prices'] });
    
        for (const product of products) {
            const priceData = await this.getPrice(product.url);
    
            if (!priceData) {
                continue;
            }
    
            await this.setPrice(product.id, Number(priceData.price), priceData.currency);
        }
    }
}
