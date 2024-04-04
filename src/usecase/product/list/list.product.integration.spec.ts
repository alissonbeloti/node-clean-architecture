import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test list products use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  
    it("should list a products", async () => {
      const productRepository = new ProductRepository();
      const usecase = new ListProductUseCase(productRepository);
      const product1 = new Product("123", "Product 1", 100);
      const product2 = new Product("125", "Product 2", 200);
      
      await productRepository.create(product1);
      await productRepository.create(product2);

      const input = { };
  
      const output = [product1, product2];
  
      const result = await usecase.execute(input);
  
      expect(result.products.length).toEqual(output.length);
      expect(result.products[0].id).toEqual(output[0].id);
      expect(result.products[0].name).toEqual(output[0].name);
      expect(result.products[0].price).toEqual(output[0].price);
      expect(result.products[1].id).toEqual(output[1].id);
      expect(result.products[1].name).toEqual(output[1].name);
      expect(result.products[1].price).toEqual(output[1].price);
    });
  });