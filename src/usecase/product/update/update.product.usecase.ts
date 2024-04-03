import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export default class UpdateProductUseCase {
    private productRepository: ProductRepositoryInterface;
    constructor(productRepository: ProductRepositoryInterface) {
      this.productRepository = productRepository;
    }
  
    async execute(
      input: InputUpdateProductDto
    ): Promise<OutputUpdateProductDto> {
      const productDefault = await this.productRepository.find(input.id);
      const product = new Product(productDefault.id, productDefault.name, productDefault.price);

      product.changeName(input.name);
      product.changePrice(input.price);

      await this.productRepository.update(product);
  
      return {
        id: product.id,
        name: product.name,
        price: product.price,
      };
    }
  }