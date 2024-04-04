import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test update product use case (Integration).", () => {
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
  
    it("should update a product", async () => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUseCase(productRepository);
      const usecaseCreate = new CreateProductUseCase(productRepository);
      const productCreate = {
        type: "a",
        name: "Produto",
        price: 120,
      };

      var outProductCreated = await usecaseCreate.execute(productCreate);

      const productUpdate = {
        id: outProductCreated.id,
        name: "Produto Alterado",
        price: 130,
      };
      
       
      const result = await usecase.execute(productUpdate);
  
      expect(result.name).toEqual(productUpdate.name);
      expect(result.price).toEqual(productUpdate.price);
      expect(result.id).toEqual(productUpdate.id);
    });
  });