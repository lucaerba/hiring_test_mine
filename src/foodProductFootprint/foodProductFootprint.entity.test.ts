import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { FoodProduct } from "../foodProduct/foodProduct.entity";
import { IngredientQuantity } from "../foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { getTestIngredientQuantity } from "../seed-dev-data";
import { FoodProductFootprint } from "./foodProductFootprint.entity";

let chickenPizzaFoodProduct: FoodProduct;
let savedChickenIngredientQuantity: IngredientQuantity;
let savedFlourIngredientQuantity: IngredientQuantity;
let savedOliveOilIngredientQuantity: IngredientQuantity;
let chickenPizzaFoodProductFootPrint: FoodProductFootprint;

beforeAll(async () => {
    await dataSource.initialize();
    savedChickenIngredientQuantity = await getTestIngredientQuantity("chicken", 1, "kg");
    savedFlourIngredientQuantity = await getTestIngredientQuantity("flour", 1, "kg");
    savedOliveOilIngredientQuantity = await getTestIngredientQuantity("oliveOil", 1, "kg");

    chickenPizzaFoodProduct = new FoodProduct({
        name: "chickenPizza",
        ingredientQuantities: [savedChickenIngredientQuantity, savedFlourIngredientQuantity, savedOliveOilIngredientQuantity],
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