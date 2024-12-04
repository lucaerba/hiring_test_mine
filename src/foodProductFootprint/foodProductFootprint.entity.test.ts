import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { FoodProduct } from "../foodProduct/foodProduct.entity";
import { Ingredient } from "../ingredient/ingredient.entity";
import { FoodProductFootprint } from "./foodProductFootprint.entity";

let chickenPizzaFoodProduct: FoodProduct;
let chickenIngredient: Ingredient;
let flourIngredient: Ingredient;
let oliveOilIngredient: Ingredient;
let chickenPizzaFoodProductFootPrint: FoodProductFootprint;

beforeAll(async () => {
    await dataSource.initialize();
    chickenIngredient = new Ingredient({
        name: "chicken",
        unit: "kg",
        quantity: 1.2,
    });
    flourIngredient = new Ingredient({
        name: "flour",
        unit: "kg",
        quantity: 1.2,
    });
    oliveOilIngredient = new Ingredient({
        name: "oliveOil",
        unit: "kg",
        quantity: 1.2,
    });
    chickenPizzaFoodProduct = new FoodProduct({
        name: "chickenPizza",
        ingredients: [chickenIngredient, flourIngredient, oliveOilIngredient],
    });
    chickenPizzaFoodProductFootPrint = new FoodProductFootprint({
        foodProduct: chickenPizzaFoodProduct,
        score: 100,
    });
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("constructor", () => {
    it("should create a new FoodProductFootPrint", () => {
        expect(chickenPizzaFoodProductFootPrint.foodProduct).toBe(chickenPizzaFoodProduct);
        expect(chickenPizzaFoodProductFootPrint.score).toBe(100);
    });

    it("should throw an error if score is 0", () => {
        expect(() => new FoodProductFootprint({ foodProduct: chickenPizzaFoodProduct, score: 0 })).toThrow(
            "Score cannot be 0"
        );
    });

});

afterAll(async () => {
    await dataSource.destroy();
});