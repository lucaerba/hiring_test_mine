import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { getTestIngredient } from "../seed-dev-data";
import { Ingredient } from "./ingredient.entity";
import { IngredientsService } from "./ingredients.service";

let chickenIngredient = getTestIngredient("chicken");
let flourIngredient = getTestIngredient("flour");
let oliveOilIngredient = getTestIngredient("oliveOil");
let ingredientService: IngredientsService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    await dataSource
        .getRepository(Ingredient)
        .save(oliveOilIngredient);
});

describe("Ingredient.service", () => {
    it("should save new ingredients", async () => {
        await ingredientService.save(chickenIngredient);
        await ingredientService.save(flourIngredient);
        const retrieveChickenIngredient = await dataSource
            .getRepository(Ingredient)
            .findOne({ where: { name: "chicken" } });
        await expect(retrieveChickenIngredient).not.toBeNull();
    });

    it("should retrieve ingredients", async () => {
        const ingredients = await ingredientService.findAll();
        await expect(ingredients).toHaveLength(1);
    });

    it("should retrieve existing ingredients", async () => {
        await ingredientService.save(chickenIngredient);
        const ingredients = await ingredientService.findAll();
        await expect(ingredients).toHaveLength(2);
    });

    it("should retrieve an existing ingredient", async () => {
        const savedIngtedien = await ingredientService.save(chickenIngredient);
        const ingredient = await ingredientService.save(chickenIngredient);
        await expect(ingredient).toEqual(savedIngtedien);
    });

    it("should throw an error if ingredient name is empty", async () => {
        await expect(
            ingredientService.save({ name: "" })
        ).rejects.toThrow("Error saving ingredient ");
    });
});

afterAll(async () => {
    await dataSource.destroy();
});