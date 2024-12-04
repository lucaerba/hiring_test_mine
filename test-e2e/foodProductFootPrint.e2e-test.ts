import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { User } from "../src/auth/user/user.entity";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "../src/foodProduct/foodProduct.entity";
import { FoodProductFootprint } from "../src/foodProductFootprint/foodProductFootprint.entity";
import { Ingredient } from "../src/ingredient/ingredient.entity";
import { getTestEmissionFactor, getTestFoodProduct, getTestFoodProductFootPrint, getTestIngredient } from "../src/seed-dev-data";

beforeAll(async () => {
    await dataSource.initialize();
});

afterAll(async () => {
    await dataSource.destroy();
});

let token: string;
const loginUser = {
    username: 'test',
    password: 'test'
};
describe("FoodProductFootPrintController", () => {
    let app: INestApplication;
    let defaultFoodProductFootPrints: FoodProductFootprint[];

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        await GreenlyDataSource.cleanDatabase();
        await dataSource
            .getRepository(CarbonEmissionFactor)
            .save([
                getTestEmissionFactor("ham"),
                getTestEmissionFactor("beef"),
                getTestEmissionFactor("flour"),
                getTestEmissionFactor("cheese"),
                getTestEmissionFactor("tomato"),
                getTestEmissionFactor("blueCheese"),
                getTestEmissionFactor("vinegar"),
            ]);
        await dataSource
            .getRepository(Ingredient)
            .save(getTestIngredient("ham"));

        await dataSource
            .getRepository(Ingredient)
            .save(getTestIngredient("flour"));

        await dataSource
            .getRepository(Ingredient)
            .save(getTestIngredient("cheese"));

        await dataSource
            .getRepository(Ingredient)
            .save(getTestIngredient("tomato"));

        await dataSource
            .getRepository(FoodProduct)
            .save([getTestFoodProduct("hamPizza")]);

        await dataSource
            .getRepository(FoodProductFootprint)
            .save(getTestFoodProductFootPrint("hamPizza"));

        defaultFoodProductFootPrints = await dataSource
            .getRepository(FoodProductFootprint)
            .find();

        await dataSource.getRepository(User).save(loginUser);
        const response = await request(app.getHttpServer())
            .post('/login')
            .set('Accept', 'application/json')
            .send(loginUser)
            .expect(201);
        token = response.body.token;

    });

    it("GET /food-product-foot-prints", async () => {
        return request(app.getHttpServer())
            .get("/food-product-foot-prints")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect(({ body }) => {
                expect(body).toEqual(defaultFoodProductFootPrints);
            });
    });

    it("GET /food-product-foot-prints/:name", async () => {
        return request(app.getHttpServer())
            .get("/food-product-foot-prints/hamPizza")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect(({ body }) => {
                body = JSON.parse(JSON.stringify(body));
                expect(body.foodProduct.ingredients).toEqual(getTestFoodProductFootPrint("hamPizza").foodProduct.ingredients)
                expect(body.score).toEqual(getTestFoodProductFootPrint("hamPizza").score);
            });
    });

    it("POST /food-product-foot-prints", async () => {
        const newFoodProduct = {
            name: "blueCheeseSalad",
            ingredients: [
                { name: "blueCheese", unit: "kg", quantity: 0.5 },
                { name: "vinegar", unit: "kg", quantity: 0.6 },
            ],
        };
        const score =
            newFoodProduct.ingredients[0].quantity * getTestEmissionFactor("blueCheese").emissionCO2eInKgPerUnit +
            newFoodProduct.ingredients[1].quantity * getTestEmissionFactor("vinegar").emissionCO2eInKgPerUnit;
        const response = await request(app.getHttpServer())
            .post("/food-product-foot-prints")
            .set("Authorization", `Bearer ${token}`)
            .send(newFoodProduct)
            .expect(201);

        expect(response.body).not.toBeNull();
        expect(response.body.foodProduct.name).toBe("blueCheeseSalad");

        response.body.foodProduct.ingredients = response.body.foodProduct.ingredients.map((ingredient: Ingredient) => {
            const { id, ...ingredientWithoutId } = ingredient;
            return ingredientWithoutId;
        });
        expect(response.body.foodProduct.ingredients).toEqual(newFoodProduct.ingredients);
        expect(response.body.score).toBe(score);
        return;
    });

    it("POST /food-product-foot-prints should return null if name is empty", async () => {
        return request(app.getHttpServer())
            .post("/food-product-foot-prints")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "",
                ingredients: [
                    { name: "blueCheese", unit: "kg", quantity: 0.5 },
                    { name: "vinegar", unit: "kg", quantity: 0.6 },
                ],
            })
            .expect(400);
    });

    it("POST /food-product-foot-prints should return null if ingredients are invalid", async () => {
        return request(app.getHttpServer())
            .post("/food-product-foot-prints")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "blueCheeseSalad",
                ingredients: [
                    { name: "", unit: "kg", quantity: 0.5 },
                    { name: "vinegar", unit: "kg", quantity: 0.6 },
                ],
            })
            .expect(400);
    });

});

