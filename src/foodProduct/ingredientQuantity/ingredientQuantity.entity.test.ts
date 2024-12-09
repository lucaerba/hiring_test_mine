import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { Ingredient } from "../../ingredient/ingredient.entity";
import { IngredientQuantity } from "./ingredientQuantity.entity";

let chickenIngredient: Ingredient;
let ingredientQuantity: IngredientQuantity;

beforeAll(async () => {
    await dataSource.initialize();
    chickenIngredient = new Ingredient({
        name: "chicken",
    });
    await dataSource.getRepository(Ingredient).save(chickenIngredient);
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    ingredientQuantity = new IngredientQuantity({
        ingredient: chickenIngredient,
        quantity: 1,
        unit: "kg",
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("IngredientQuantity Entity", () => {
    it("should create a new IngredientQuantity", () => {
        expect(ingredientQuantity.ingredient.name).toBe("chicken");
        expect(ingredientQuantity.quantity).toBe(1);
        expect(ingredientQuantity.unit).toBe("kg");
    });

    it("should throw an error if quantity is negative", () => {
        expect(() => new IngredientQuantity({
            ingredient: chickenIngredient,
            quantity: -1,
            unit: "kg",
        })).toThrow("Quantity cannot be negative");
    });

    it("should throw an error if unit is empty", () => {
        expect(() => new IngredientQuantity({
            ingredient: chickenIngredient,
            quantity: 1,
            unit: "",
        })).toThrow("Unit cannot be empty");
    });

});
