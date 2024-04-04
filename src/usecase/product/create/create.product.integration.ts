import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";


describe("Test create product use case (Integration).", () => {
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
  
    it("should create a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new CreateProductUseCase(productRepository);
      const product = {
        type: "a",
        name: "JPS",
        price: 100,
      };
      
      const output = {
        name: "JPS",
        price: 100,
      };
  
      const result = await usecase.execute(product);
  
      expect(result.name).toEqual(output.name);
      expect(result.price).toEqual(output.price);
      expect(result.id).toBeDefined();
    });
  });