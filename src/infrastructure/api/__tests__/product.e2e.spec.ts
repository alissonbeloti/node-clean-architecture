import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Crocs",
        price: 120,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Crocs");
    expect(response.body.price).toBe(120);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Crocs",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Crocs confort",
        price: 135,
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Crocs Sport",
        price: 150,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);
    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("Crocs confort");
    expect(customer.price).toBe(135);
    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Crocs Sport");
    expect(customer2.price).toBe(150);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Crocs confort</name>`);
    expect(listResponseXML.text).toContain(`<price>135</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>Crocs Sport</name>`);
    expect(listResponseXML.text).toContain(`<price>150</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
    

    
  });
});
