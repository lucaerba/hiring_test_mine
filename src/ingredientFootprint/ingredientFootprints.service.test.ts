import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { CreateIngredientDto } from "../ingredient/dto/create-ingredient.dto";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { getTestEmissionFactor, getTestIngredient } from "../seed-dev-data";
import { IngredientFootprint } from "./ingredientFootprint.entity";
import { IngredientFootprintsService } from "./ingredientFootprints.service";

let chickenIngredient = getTestIngredient("chicken");
let flourIngredient = getTestIngredient("flour");
let oliveOilIngredient = getTestIngredient("oliveOil");
let chickenEmisionFactor = getTestEmissionFactor("chicken");
let flourEmisionFactor = getTestEmissionFactor("flour");
let oliveOilEmisionFactor = getTestEmissionFactor("oliveOil");

let ingredientService: IngredientsService;
let carbonEmissionFactorsService: CarbonEmissionFactorsService;
let ingredientFootPrintsService: IngredientFootprintsService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    carbonEmissionFactorsService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
    ingredientFootPrintsService = new IngredientFootprintsService(
        dataSource.getRepository(IngredientFootprint),
        ingredientService,
        carbonEmissionFactorsService
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    await dataSource
        .getRepository(Ingredient)
        .save(oliveOilIngredient);
    await dataSource
        .getRepository(CarbonEmissionFactor)
        .save([oliveOilEmisionFactor, flourEmisionFactor, chickenEmisionFactor]);

});

afterAll(async () => {
    await dataSource.destroy();
});

describe("IngredientFootPrints.service", () => {
    it("should give error if ingredient is missing something during save", async () => {
        await expect(ingredientFootPrintsService.save({
            ingredient: {
                name: "",
                unit: "kg",
                quantity: 1.2
            },
            score: 1.2
        })).rejects.toThrow(
            `Error saving ingredientFootPrint`
        );
    });

    it("should compute and save new ingredientFootPrints", async () => {

        const chickenFootPrint = await ingredientFootPrintsService.computeSaveFootPrint(chickenIngredient);
        const flourFootPrint = await ingredientFootPrintsService.computeSaveFootPrint(flourIngredient);
        const oliveOilFootPrint = await ingredientFootPrintsService.computeSaveFootPrint(oliveOilIngredient);

        expect(chickenFootPrint).not.toBeNull();
        expect(flourFootPrint).not.toBeNull();
        expect(oliveOilFootPrint).not.toBeNull();

        const chickenScore = getTestEmissionFactor("chicken").emissionCO2eInKgPerUnit * chickenIngredient.quantity;
        const flourScore = getTestEmissionFactor("flour").emissionCO2eInKgPerUnit * flourIngredient.quantity;
        const oliveOilScore = getTestEmissionFactor("oliveOil").emissionCO2eInKgPerUnit * oliveOilIngredient.quantity;

        expect(chickenFootPrint?.score).toBe(chickenScore);
        expect(flourFootPrint?.score).toBe(flourScore);
        expect(oliveOilFootPrint?.score).toBe(oliveOilScore);
    });

    it("should retrieve ingredientFootPrints", async () => {
        await dataSource.getRepository(Ingredient).save([chickenIngredient, flourIngredient]);
        await dataSource.getRepository(IngredientFootprint).save([
            new IngredientFootprint({
                ingredient: chickenIngredient,
                score: 1.2
            }),
            new IngredientFootprint({
                ingredient: flourIngredient,
                score: 1.5
            }),
            new IngredientFootprint({
                ingredient: oliveOilIngredient,
                score: 1.8
            })
        ]);
        const ingredientFootPrints = await ingredientFootPrintsService.findAll();
        expect(ingredientFootPrints).toHaveLength(3);
    });

    it("should retrieve ingredientFootPrints by name", async () => {
        const ingredientFootPrint = await ingredientFootPrintsService.findOneByName("oliveOil");
        expect(ingredientFootPrint?.ingredient).not.toBeNull();
    });

    it("should return existing ingredientFootPrint if it already exists", async () => {
        await dataSource.getRepository(Ingredient).save([chickenIngredient, flourIngredient]);
        await dataSource.getRepository(IngredientFootprint).save([
            new IngredientFootprint({
                ingredient: chickenIngredient,
                score: 1.2
            }),
            new IngredientFootprint({
                ingredient: flourIngredient,
                score: 1.5
            }),
            new IngredientFootprint({
                ingredient: oliveOilIngredient,
                score: 1.8
            })
        ]);
        const existingFootPrint = await ingredientFootPrintsService.computeSaveFootPrint(oliveOilIngredient);
        expect(existingFootPrint).not.toBeNull();
        expect(existingFootPrint?.ingredient.name).toBe("oliveOil");
    });

    it("should handle errors during save operation", async () => {
        const invalidIngredient = new CreateIngredientDto();
        invalidIngredient.name = "";
        invalidIngredient.unit = "kg";
        invalidIngredient.quantity = 1.2;

        await expect(ingredientFootPrintsService.computeSaveFootPrint(invalidIngredient))
            .rejects.toThrow(
                `Error saving ingredientFootPrint `
            );
    });

    it("should compute the footprint correctly", async () => {
        await carbonEmissionFactorsService.save([oliveOilEmisionFactor]);
        const score = await ingredientFootPrintsService.calulateFootPrint(oliveOilIngredient);
        expect(score).toBeGreaterThan(0);
    });

    it("should handle errors during footprint computation", async () => {
        const invalidIngredient = new Ingredient({
            name: "invalidIngredient",
            unit: "kg",
            quantity: 1.2,
        });

        await expect(ingredientFootPrintsService.calulateFootPrint(invalidIngredient)).rejects.toThrow(
            `Carbon Emission Factor for ${invalidIngredient.name} not found`
        );
    });
});

