import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { User } from "../src/auth/user/user.entity";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});
const loginUser = {
  username: "test",
  password: "test"
};
let token: string;
describe("CarbonEmissionFactorsController", () => {
  let app: INestApplication;
  let defaultCarbonEmissionFactors: CarbonEmissionFactor[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    GreenlyDataSource.cleanDatabase();
    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([getTestEmissionFactor("ham"), getTestEmissionFactor("beef")]);

    defaultCarbonEmissionFactors = await dataSource
      .getRepository(CarbonEmissionFactor)
      .find();

    await dataSource.getRepository(User).save(loginUser);
    const response = await request(app.getHttpServer())
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginUser)
      .expect(201);
    token = response.body.token;
  });

  it("GET /carbon-emission-factors", async () => {

    return request(app.getHttpServer())
      .get("/carbon-emission-factors")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultCarbonEmissionFactors);
      });
  });

  it("POST /carbon-emission-factors", async () => {
    const carbonEmissionFactorArgs = {
      name: "Test Carbon Emission Factor",
      unit: "kg",
      emissionCO2eInKgPerUnit: 12,
      source: "Test Source",
    };
    return request(app.getHttpServer())
      .post("/carbon-emission-factors")
      .set("Authorization", `Bearer ${token}`)
      .send([carbonEmissionFactorArgs])
      .expect(201)
      .expect(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0]).toMatchObject(carbonEmissionFactorArgs);
      });
  });

  it("POST /carbon-emission-factors should return null if name/source is empty", async () => {
    return request(app.getHttpServer())
      .post("/carbon-emission-factors")
      .set("Authorization", `Bearer ${token}`)
      .send([{ name: "", unit: "kg", emissionCO2eInKgPerUnit: 12, source: "" }])
      .expect(400);
  });

  it("POST /carbon-emission-factors should return null if name/source is empty", async () => {
    return request(app.getHttpServer())
      .post("/carbon-emission-factors")
      .set("Authorization", `Bearer ${token}`)
      .send([
        { name: "Test Carbon Emission Factor", unit: "kg", emissionCO2eInKgPerUnit: 12, source: "source" },
        { name: "", unit: "kg", emissionCO2eInKgPerUnit: 12, source: "" },
      ])
      .expect(400);
  });
});
