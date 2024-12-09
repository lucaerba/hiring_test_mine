import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { IngredientQuantity } from "../../foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { Ingredient } from "../../ingredient/ingredient.entity";
import { IngredientQuantityFootprint } from "./ingredientQuantityFootprint.entity";


let chickenIngredient: Ingredient;
let chickenIngredientQuantity: IngredientQuantity;
let chickenFootPrint: IngredientQuantityFootprint;
beforeAll(async () => {
    await dataSource.initialize();
    chickenIngredient = new Ingredient({
        name: "chicken",
    });
    chickenIngredientQuantity = new IngredientQuantity({
        ingredient: chickenIngredient,
        quantity: 1,
        unit: "kg",
    });
    chickenFootPrint = new IngredientQuantityFootprint({
        ingredientQuantity: chickenIngredientQuantity,
        score: 1.2,
    });
});
beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("constructor", () => {
    it("should create a new IngredientFootPrint", () => {
        expect(chickenFootPrint.ingredientQuantity).toBe(chickenIngredientQuantity);
        expect(chickenFootPrint.ingredientQuantity.ingredient).toBe(chickenIngredient);
        expect(chickenFootPrint.score).toBe(1.2);
    });

    it("should throw an error if score is 0", () => {
        expect(() => new IngredientQuantityFootprint({
            ingredientQuantity: chickenIngredientQuantity,
            score: 0,
        })).toThrow(
            "Score cannot be 0"
        );
    });

});

afterAll(async () => {
    await dataSource.destroy();
});

