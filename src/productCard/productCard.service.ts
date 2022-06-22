import { Injectable } from '@nestjs/common';
import { productCardHandler } from 'src/handlers/productCardHandler';

@Injectable()
export class ProductCardService {
  public getProducts(): Promise<object> {
    return productCardHandler();
  }
}
