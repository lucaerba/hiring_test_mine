import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { CarbonEmissionFactor } from "../../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../../carbonEmissionFactor/carbonEmissionFactors.service";
import { IngredientQuantitiesService } from "../../foodProduct/ingredientQuantity/ingredientQuantities.service";
import { IngredientQuantity } from "../../foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { Ingredient } from "../../ingredient/ingredient.entity";
import { IngredientsService } from "../../ingredient/ingredients.service";
import { getTestEmissionFactor, getTestIngredient, getTestIngredientQuantity } from "../../seed-dev-data";
import { IngredientQuantityFootprint } from "./ingredientQuantityFootprint.entity";
import { IngredientQuantityFootprintsService } from "./ingredientQuantityFootprints.service";
import { UnitConverterService } from "./unitConverter/unitConverter.service";

let chickenIngredient = getTestIngredient("chicken");
let flourIngredient = getTestIngredient("flour");
let oliveOilIngredient = getTestIngredient("oliveOil");
let chickenIngredientQuantity = getTestIngredientQuantity(chickenIngredient.name, 1.2, "kg");
let flourIngredientQuantity = getTestIngredientQuantity(flourIngredient.name, 1.2, "kg");
let oliveOilIngredientQuantity = getTestIngredientQuantity(oliveOilIngredient.name, 1.2, "kg");

let chickenEmisionFactor = getTestEmissionFactor("chicken");
let flourEmisionFactor = getTestEmissionFactor("flour");
let oliveOilEmisionFactor = getTestEmissionFactor("oliveOil");

let ingredientService: IngredientsService;
let ingredientQuantitiesService: IngredientQuantitiesService;
let carbonEmissionFactorsService: CarbonEmissionFactorsService;
let ingredientQuantityFootprintsService: IngredientQuantityFootprintsService;
let unitConverterService: UnitConverterService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    carbonEmissionFactorsService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
    unitConverterService = new UnitConverterService();
    ingredientQuantitiesService = new IngredientQuantitiesService(
        dataSource.getRepository(IngredientQuantity),
        ingredientService,
    );
    ingredientQuantityFootprintsService = new IngredientQuantityFootprintsService(
        dataSource.getRepository(IngredientQuantityFootprint),
        ingredientQuantitiesService,
        carbonEmissionFactorsService,
        unitConverterService
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

describe("IngredientQuantityFootprints.service", () => {
    it("should give error if ingredient is missing something during save", async () => {
        await expect(ingredientQuantityFootprintsService.save({
            ingredientQuantity: {
                ingredient: getTestIngredient("ham"),
                quantity: 1.2,
                unit: ""
            },
            score: 1.2
        })).rejects.toThrow(
            new Error(`Error saving IngredientQuantityFootprint`)
        );
    });

    it("should compute and save new IngredientQuantityFootprints", async () => {
        const chickenFootPrint = await ingredientQuantityFootprintsService.computeSaveFootPrint(chickenIngredientQuantity);
        const flourFootPrint = await ingredientQuantityFootprintsService.computeSaveFootPrint(flourIngredientQuantity);
        const oliveOilFootPrint = await ingredientQuantityFootprintsService.computeSaveFootPrint(oliveOilIngredientQuantity);

        expect(chickenFootPrint).not.toBeNull();
        expect(flourFootPrint).not.toBeNull();
        expect(oliveOilFootPrint).not.toBeNull();

        const chickenScore = getTestEmissionFactor("chicken").emissionCO2eInKgPerUnit * chickenIngredientQuantity.quantity;
        const flourScore = getTestEmissionFactor("flour").emissionCO2eInKgPerUnit * flourIngredientQuantity.quantity;
        const oliveOilScore = getTestEmissionFactor("oliveOil").emissionCO2eInKgPerUnit * oliveOilIngredientQuantity.quantity;

        expect(chickenFootPrint?.score).toBe(chickenScore);
        expect(flourFootPrint?.score).toBe(flourScore);
        expect(oliveOilFootPrint?.score).toBe(oliveOilScore);
    });

    it("should retrieve IngredientQuantityFootprints", async () => {
        await dataSource.getRepository(Ingredient).save([chickenIngredient, flourIngredient]);
        await dataSource.getRepository(IngredientQuantityFootprint).save([
            new IngredientQuantityFootprint({
                ingredientQuantity: chickenIngredientQuantity,
                score: 1.2
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: flourIngredientQuantity,
                score: 1.5
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: oliveOilIngredientQuantity,
                score: 1.8
            })
        ]);
        const ingredientQuantityFootprints = await ingredientQuantityFootprintsService.findAll();
        expect(ingredientQuantityFootprints).toHaveLength(3);
    });

    it("should retrieve IngredientQuantityFootprints by name", async () => {
        await dataSource.getRepository(Ingredient).save([chickenIngredient, flourIngredient]);
        await dataSource.getRepository(IngredientQuantityFootprint).save([
            new IngredientQuantityFootprint({
                ingredientQuantity: chickenIngredientQuantity,
                score: 1.2
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: flourIngredientQuantity,
                score: 1.5
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: oliveOilIngredientQuantity,
                score: 1.8
            })
        ]);
        const ingredientQuantityFootprint = await ingredientQuantityFootprintsService.findOneByNameQuantity(oliveOilIngredientQuantity);
        expect(ingredientQuantityFootprint?.ingredientQuantity.ingredient.name).toBe("oliveOil");
    });

    it("should return existing IngredientQuantityFootprint if it already exists", async () => {
        await dataSource.getRepository(Ingredient).save([chickenIngredient, flourIngredient]);
        await dataSource.getRepository(IngredientQuantityFootprint).save([
            new IngredientQuantityFootprint({
                ingredientQuantity: chickenIngredientQuantity,
                score: 1.2
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: flourIngredientQuantity,
                score: 1.5
            }),
            new IngredientQuantityFootprint({
                ingredientQuantity: oliveOilIngredientQuantity,
                score: 1.8
            })
        ]);
        const existingFootPrint = await ingredientQuantityFootprintsService.computeSaveFootPrint(oliveOilIngredientQuantity);
        expect(existingFootPrint).not.toBeNull();
        expect(existingFootPrint?.ingredientQuantity.ingredient.name).toBe("oliveOil");
    });

    it("should handle errors during save operation", async () => {


        await expect(ingredientQuantityFootprintsService.computeSaveFootPrint(
            {
                ingredient: getTestIngredient("ham"),
                quantity: 1.2,
                unit: ""
            }
        ))
            .rejects.toThrow(
                `Error saving IngredientQuantityFootprint `
            );
    });

    it("should compute the footprint correctly", async () => {
        const score = await ingredientQuantityFootprintsService.calulateFootPrint(oliveOilIngredientQuantity);
        expect(score).toBeGreaterThan(0);
    });

    it("should handle errors during footprint computation", async () => {
        const invalidIngredientQuantity = new IngredientQuantity({
            ingredient: new Ingredient({
                name: "ollare",
            }),
            quantity: 1.2,
            unit: "kg"
        });

        await expect(ingredientQuantityFootprintsService.calulateFootPrint(invalidIngredientQuantity)).rejects.toThrow(
            `Carbon Emission Factor for ${invalidIngredientQuantity.ingredient.name} not found`
        );
    });
});

