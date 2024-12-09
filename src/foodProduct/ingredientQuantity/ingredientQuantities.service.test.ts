import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { Ingredient } from "../../ingredient/ingredient.entity";
import { IngredientsService } from "../../ingredient/ingredients.service";
import { getTestIngredient, getTestIngredientQuantity } from "../../seed-dev-data";
import { CreateIngredientQuantityDto } from "./dto/create-ingredientQuantity.dto";
import { IngredientQuantitiesService } from "./ingredientQuantities.service";
import { IngredientQuantity } from "./ingredientQuantity.entity";

let ingredientService: IngredientsService;
let ingredientQuantitiesService: IngredientQuantitiesService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    ingredientQuantitiesService = new IngredientQuantitiesService(
        dataSource.getRepository(IngredientQuantity),
        ingredientService
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    await dataSource
        .getRepository(Ingredient)
        .save(getTestIngredient("oliveOil"));
    await dataSource
        .getRepository(Ingredient)
        .save(getTestIngredient("flour"));
    await dataSource
        .getRepository(IngredientQuantity)
        .save(getTestIngredientQuantity("flour", 1, "kg"));
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("IngredientQuantitiesService", () => {
    it("should be defined", () => {
        expect(ingredientQuantitiesService).toBeDefined();
    });

    describe("findAll", () => {
        it("should return an array of ingredient quantities", async () => {

            const ingredientQuantities = await ingredientQuantitiesService.findAll();
            expect(ingredientQuantities).toHaveLength(1);
            expect(ingredientQuantities[0]).toBeInstanceOf(IngredientQuantity);
        });
    });

    describe("findOneByNameQuantityUnit", () => {
        it("should return a single ingredient quantity", async () => {
            const ingredient = new Ingredient({ name: "chicken" });
            const ingredientQuantity = new IngredientQuantity({
                ingredient: ingredient,
                quantity: 1,
                unit: "kg",
            });
            await dataSource.getRepository(Ingredient).save(ingredient);
            await dataSource.getRepository(IngredientQuantity).save(ingredientQuantity);

            const foundIngredientQuantity = await ingredientQuantitiesService.findOneByNameQuantityUnit("chicken", 1, "kg");
            expect(foundIngredientQuantity).toBeInstanceOf(IngredientQuantity);
            expect(foundIngredientQuantity?.ingredient.name).toBe("chicken");
            expect(foundIngredientQuantity?.quantity).toBe(1);
            expect(foundIngredientQuantity?.unit).toBe("kg");
        });

        it("should return null if ingredient quantity is not found", async () => {
            const ingredientQuantity = await ingredientQuantitiesService.findOneByNameQuantityUnit("nonexistent", 1, "kg");
            expect(ingredientQuantity).toBeNull();
        });
    });

    describe("save", () => {
        it("should save and return a new ingredient quantity", async () => {
            const ingredient = new Ingredient({ name: "chicken" });
            const ingredientQuantityDto: CreateIngredientQuantityDto = {
                ingredient: ingredient,
                quantity: 1,
                unit: "kg",
            };

            const savedIngredientQuantity = await ingredientQuantitiesService.save(ingredientQuantityDto);
            expect(savedIngredientQuantity).toBeInstanceOf(IngredientQuantity);
            expect(savedIngredientQuantity?.ingredient.name).toBe("chicken");
            expect(savedIngredientQuantity?.quantity).toBe(1);
            expect(savedIngredientQuantity?.unit).toBe("kg");
        });

        it("should return existing ingredient quantity if it already exists", async () => {
            const ingredient = new Ingredient({ name: "chicken" });
            const ingredientQuantityDto: CreateIngredientQuantityDto = {
                ingredient: ingredient,
                quantity: 1,
                unit: "kg",
            };

            await ingredientQuantitiesService.save(ingredientQuantityDto);
            const existingIngredientQuantity = await ingredientQuantitiesService.save(ingredientQuantityDto);
            expect(existingIngredientQuantity).toBeInstanceOf(IngredientQuantity);
            expect(existingIngredientQuantity?.ingredient.name).toBe("chicken");
            expect(existingIngredientQuantity?.quantity).toBe(1);
            expect(existingIngredientQuantity?.unit).toBe("kg");
        });

        it("should throw an error if ingredient name is empty", async () => {
            try {
                await ingredientQuantitiesService.save(
                    {
                        ingredient: new Ingredient({ name: "" }),
                        quantity: 1,
                        unit: "kg",
                    }
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe("Name cannot be empty");
            }
        });

        it("should throw an error if ingredient quantity is zero", async () => {
            const ingredientQuantityDto: CreateIngredientQuantityDto = {
                ingredient: getTestIngredient("chicken"),
                quantity: 0,
                unit: "kg",
            };

            await expect(ingredientQuantitiesService.save(ingredientQuantityDto))
                .rejects.toThrow("Error saving ingredientQuantity");
        });

        it("should throw an error if ingredient unit is empty", async () => {
            const ingredientQuantityDto: CreateIngredientQuantityDto = {
                ingredient: getTestIngredient("chicken"),
                quantity: 1,
                unit: "",
            };

            await expect(ingredientQuantitiesService.save(ingredientQuantityDto))
                .rejects.toThrow("Error saving ingredientQuantity");
        });
    });
});
