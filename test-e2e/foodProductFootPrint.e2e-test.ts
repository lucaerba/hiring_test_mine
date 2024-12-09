import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { User } from "../src/auth/user/user.entity";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "../src/foodProduct/foodProduct.entity";
import { IngredientQuantity } from "../src/foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { FoodProductFootprint } from "../src/foodProductFootprint/foodProductFootprint.entity";
import { Ingredient } from "../src/ingredient/ingredient.entity";
import { getTestEmissionFactor, getTestFoodProduct, getTestFoodProductFootPrint, getTestIngredient, getTestIngredientQuantity, getTestInputFoodProduct } from "../src/seed-dev-data";

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
            .getRepository(IngredientQuantity)
            .save([
                getTestIngredientQuantity("ham", 0.1, "kg"),
                getTestIngredientQuantity("cheese", 0.2, "kg"),
                getTestIngredientQuantity("tomato", 0.3, "kg"),
                getTestIngredientQuantity("flour", 0.4, "kg"),
            ]);
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
                expect(body.foodProduct.ingredientQuantities).toEqual(getTestFoodProductFootPrint("hamPizza").foodProduct.ingredientQuantities)
                expect(body.score).toEqual(getTestFoodProductFootPrint("hamPizza").score);
            });
    });

    it("POST /food-product-foot-prints", async () => {
        const newFoodProduct = getTestInputFoodProduct("hamCheesePizza");
        const score = newFoodProduct.ingredients.reduce((acc, ingredient) => {
            return acc + ingredient.quantity * getTestEmissionFactor(ingredient.name).emissionCO2eInKgPerUnit;
        }, 0);
        const response = await request(app.getHttpServer())
            .post("/food-product-foot-prints")
            .set("Authorization", `Bearer ${token}`)
            .send(newFoodProduct)
            .expect(201);

        expect(response.body).not.toBeNull();
        expect(response.body.foodProduct.name).toBe(newFoodProduct.name);

        response.body.foodProduct.ingredientQuantities = response.body.foodProduct.ingredientQuantities.map((iq: IngredientQuantity) => {
            return {
                ingredient: { name: iq.ingredient.name },
                quantity: iq.quantity,
                unit: iq.unit,
            };
        });

        expect(response.body.foodProduct.ingredientQuantities.length).toBe(newFoodProduct.ingredients.length);
        expect(response.body.foodProduct.ingredientQuantities[0].ingredient.name).toBe(newFoodProduct.ingredients[0].name);
        expect(response.body.foodProduct.ingredientQuantities[0].quantity).toBe(newFoodProduct.ingredients[0].quantity);
        expect(response.body.foodProduct.ingredientQuantities[0].unit).toBe(newFoodProduct.ingredients[0].unit);
        expect(response.body.foodProduct.ingredientQuantities[1].ingredient.name).toBe(newFoodProduct.ingredients[1].name);
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

