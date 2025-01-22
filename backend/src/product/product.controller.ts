import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './dto/add-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add-product')
  @UseGuards(AuthGuard)
  async addProduct(@Body() addProductDto: AddProductDto, @Req() req) {
    const userId = req.user.sub;
    const product = await this.productService.addProduct(userId, addProductDto);
    return { productId: product.id };
  }

}
