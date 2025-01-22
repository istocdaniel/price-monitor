import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsUrl()
  url!: string;
}