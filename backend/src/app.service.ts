import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Product} from './entities/product.entity';
import {Repository} from "typeorm";
import {Cron} from '@nestjs/schedule';
import { PriceHistory } from './entities/price-history.entity';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { EmailService } from './email/email.service';
import { AlertHistory } from './entities/alert-history.entity';

@Injectable()
export class AppService {
    constructor(
        private readonly emailService: EmailService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(PriceHistory) private readonly pricetRepository: Repository<PriceHistory>,
        @InjectRepository(AlertHistory) private readonly alertRepository: Repository<AlertHistory>
    ) {
    }

    async createUser(data: any): Promise<User> {
        return this.userRepository.save({
            username: data.username,
            email: data.email,
            password: data.password,
            admin: false,
        });
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

    async setThreshold(productId: number, threshold: number) {
        await this.productRepository.update({ id: productId }, { threshold });
        return this.productRepository.findOne({ where: { id: productId } });
    }

    @Cron('0 0 0 * * *')
    async checkThresholds() {
        const products = await this.productRepository.find({ relations: ['prices', 'user'] });

        for (const product of products) {
            const latestPrice = product.prices[product.prices.length - 1];

            if (latestPrice.price < product.threshold) {
                const user = await this.userRepository.findOne({ where: { id: product.user.id } });

                if (user && user.email) {

                    const email_subject = 'Price Alert';
                    const email_body = `The price of ${product.name} has dropped below the ${product.threshold} ${latestPrice.currency} threshold. Current price: ${latestPrice.price} ${latestPrice.currency}`;
                    
                    await this.emailService.sendMail(
                        user.email,
                        email_subject,
                        email_body
                    );

                    await this.alertRepository.save({
                        date: new Date(),
                        email: user.email,
                        email_body: email_body,
                    });
                }
            }
        }
    }
}
