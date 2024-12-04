import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "../ingredient/ingredient.entity";
import { FoodProduct } from "./foodProduct.entity";

let chickenPizzaFoodProduct: FoodProduct;

let chickenIngredient: Ingredient;
let flourIngredient: Ingredient;
let oliveOilIngredient: Ingredient;

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
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("constructor", () => {
    it("should create a new FoodProduct", () => {
        expect(chickenPizzaFoodProduct.name).toBe("chickenPizza");
        expect(chickenPizzaFoodProduct.ingredients).toHaveLength(3);
    });

    it("should throw an error if name is empty", () => {
        expect(() => new FoodProduct({ name: "", ingredients: [chickenIngredient] })).toThrow(
            "Name cannot be empty"
        );
    });

    it("should throw an error if ingredients are invalid", () => {
        expect(() => new FoodProduct({
            name: "chickenPizza", ingredients: [
                new Ingredient({ name: "", unit: "kg", quantity: 1.2 }),
            ]
        })).toThrow(
            "Name cannot be empty"
        );
    });
});

afterAll(async () => {
    await dataSource.destroy();
});
