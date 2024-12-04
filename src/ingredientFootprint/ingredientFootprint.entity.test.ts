import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientFootprint } from "./ingredientFootprint.entity";


let chickenIngredient: Ingredient;
let chickenFootPrint: IngredientFootprint;
beforeAll(async () => {
    await dataSource.initialize();
    chickenIngredient = new Ingredient({
        name: "chicken",
        unit: "kg",
        quantity: 1.2,
    });
    chickenFootPrint = new IngredientFootprint({
        ingredient: chickenIngredient,
        score: 1.2,
    });
});
beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe("constructor", () => {
    it("should create a new IngredientFootPrint", () => {
        expect(chickenFootPrint.ingredient).toBe(chickenIngredient);
        expect(chickenFootPrint.score).toBe(1.2);
    });

    it("should throw an error if score is 0", () => {
        expect(() => new IngredientFootprint({ ingredient: chickenIngredient, score: 0 })).toThrow(
            "Score cannot be 0"
        );
    });

});

afterAll(async () => {
    await dataSource.destroy();
});

