import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "../ingredient/ingredient.entity";
import { FoodProduct } from "./foodProduct.entity";
import { IngredientQuantity } from "./ingredientQuantity/ingredientQuantity.entity";

let chickenPizzaFoodProduct: FoodProduct;

let chickenIngredient: Ingredient;
let flourIngredient: Ingredient;
let oliveOilIngredient: Ingredient;

let chickenIngredientQuantity: IngredientQuantity;
let flourIngredientQuantity: IngredientQuantity;
let oliveOilIngredientQuantity: IngredientQuantity;

beforeAll(async () => {
    await dataSource.initialize();
    chickenIngredient = new Ingredient({
        name: "chicken",
    });
    flourIngredient = new Ingredient({
        name: "flour",
    });
    oliveOilIngredient = new Ingredient({
        name: "oliveOil",
    });
    chickenIngredientQuantity = new IngredientQuantity({
        ingredient: chickenIngredient,
        quantity: 1,
        unit: "kg",
    });
    flourIngredientQuantity = new IngredientQuantity({
        ingredient: flourIngredient,
        quantity: 1,
        unit: "kg",
    });
    oliveOilIngredientQuantity = new IngredientQuantity({
        ingredient: oliveOilIngredient,
        quantity: 1,
        unit: "kg",
    });
    chickenPizzaFoodProduct = new FoodProduct({
        name: "chickenPizza",
        ingredientQuantities: [chickenIngredientQuantity, flourIngredientQuantity, oliveOilIngredientQuantity],

    });
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("constructor", () => {
    it("should create a new FoodProduct", () => {
        expect(chickenPizzaFoodProduct.name).toBe("chickenPizza");
        expect(chickenPizzaFoodProduct.ingredientQuantities).toHaveLength(3);
    });

    it("should throw an error if name is empty", () => {
        expect(() => new FoodProduct({ name: "", ingredientQuantities: [chickenIngredientQuantity] })).toThrow(
            "Name cannot be empty"
        );
    });

    it("should throw an error if ingredients are invalid", () => {
        expect(() => new FoodProduct({
            name: "chickenPizza",
            ingredientQuantities: [
                chickenIngredientQuantity,
                flourIngredientQuantity,
                oliveOilIngredientQuantity,
                new IngredientQuantity({
                    ingredient: new Ingredient({
                        name: "",
                    }),
                    quantity: 1,
                    unit: "kg",
                })
            ]

        })).toThrow(
            "Name cannot be empty"
        );
    });
});

afterAll(async () => {
    await dataSource.destroy();
});
