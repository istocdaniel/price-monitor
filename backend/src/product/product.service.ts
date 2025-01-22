import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { AddProductDto } from './dto/add-product.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Ellenőrizd, hogy a termék létezik-e már az adott user számára
  async isProductExists(userId: number, name: string, url: string): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { userId, name, url },
    });
    return product ? true : false;
  }

  async addProduct(userId: number, addProductDto: AddProductDto): Promise<Product> {
    // Ellenőrizd, hogy a termék létezik-e már az adott felhasználó számára
    const productExists = await this.isProductExists(userId, addProductDto.name, addProductDto.url);

    if (productExists) {
      throw new BadRequestException('Product with this name and URL already exists for this user');
    }

    // Más felhasználók ugyanazt a terméket hozzáadhatják, így nem szükséges a globális egyediség
    // Új termék létrehozása és mentése
    const newProduct = this.productRepository.create({
      ...addProductDto,
      userId, // userId hozzáadása
    });

    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
