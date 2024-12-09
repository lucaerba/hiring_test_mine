import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "../foodProduct/foodProduct.entity";
import { FoodProductsService } from "../foodProduct/foodProducts.service";
import { IngredientQuantitiesService } from "../foodProduct/ingredientQuantity/ingredientQuantities.service";
import { IngredientQuantity } from "../foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { getTestEmissionFactor, getTestFoodProduct, getTestIngredient, getTestIngredientQuantity } from "../seed-dev-data";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { FoodProductFootprintsService } from "./foodProductFootprints.service";
import { IngredientQuantityFootprint } from "./ingredientQuantityFootprint/ingredientQuantityFootprint.entity";
import { IngredientQuantityFootprintsService } from "./ingredientQuantityFootprint/ingredientQuantityFootprints.service";
import { UnitConverterService } from "./ingredientQuantityFootprint/unitConverter/unitConverter.service";

let ingredientService: IngredientsService;
let ingredientQuantitiesService: IngredientQuantitiesService;
let ingredientFootPrintsService: IngredientQuantityFootprintsService;
let foodProductsService: FoodProductsService;
let foodProductFootPrintsService: FoodProductFootprintsService;
let carbonEmissionFactorsService: CarbonEmissionFactorsService;
let unitConverterService: UnitConverterService;

let savedChickenIngredient: Ingredient | null;
let savedFlourIngredient: Ingredient | null;
let savedOliveOilIngredient: Ingredient | null;
let savedHamIngredient: Ingredient | null;

let savedChickenIngredientQuantity: IngredientQuantity | null;
let savedFlourIngredientQuantity: IngredientQuantity | null;
let savedOliveOilIngredientQuantity: IngredientQuantity | null;
let savedHamIngredientQuantity: IngredientQuantity | null;

let savedChickenPizzaFoodProduct: FoodProduct | null;
let chickenPizzaFoodProductFootPrint: FoodProductFootprint;
beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    ingredientQuantitiesService = new IngredientQuantitiesService(
        dataSource.getRepository(IngredientQuantity),
        ingredientService
    );
    carbonEmissionFactorsService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
    unitConverterService = new UnitConverterService();

    ingredientFootPrintsService = new IngredientQuantityFootprintsService(
        dataSource.getRepository(IngredientQuantityFootprint),
        ingredientQuantitiesService,
        carbonEmissionFactorsService,
        unitConverterService
    );
    foodProductsService = new FoodProductsService(
        dataSource.getRepository(FoodProduct),
        ingredientQuantitiesService
    );
    foodProductFootPrintsService = new FoodProductFootprintsService(
        dataSource.getRepository(FoodProductFootprint),
        carbonEmissionFactorsService,
        ingredientFootPrintsService,
        foodProductsService
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
    savedChickenIngredient = await ingredientService.save(getTestIngredient("chicken"));
    savedFlourIngredient = await ingredientService.save(getTestIngredient("flour"));
    savedOliveOilIngredient = await ingredientService.save(getTestIngredient("oliveOil"));
    savedHamIngredient = await ingredientService.save(getTestIngredient("ham"));
    savedChickenPizzaFoodProduct = await foodProductsService.save(getTestFoodProduct("chickenPizza"));

    chickenPizzaFoodProductFootPrint = new FoodProductFootprint({
        foodProduct: savedChickenPizzaFoodProduct!,
        score: 4.75,
    });
    await dataSource
        .getRepository(FoodProductFootprint).save(chickenPizzaFoodProductFootPrint);
    await dataSource
        .getRepository(CarbonEmissionFactor).save([
            getTestEmissionFactor("ham"),
            getTestEmissionFactor("flour"),
            getTestEmissionFactor("oliveOil"),
            getTestEmissionFactor("chicken"),
            getTestEmissionFactor("beef"),
        ]);
    savedChickenIngredientQuantity = await ingredientQuantitiesService.save(getTestIngredientQuantity(savedChickenIngredient!.name, 1, "kg"));
    savedFlourIngredientQuantity = await ingredientQuantitiesService.save(getTestIngredientQuantity(savedFlourIngredient!.name, 0.5, "kg"));
    savedOliveOilIngredientQuantity = await ingredientQuantitiesService.save(getTestIngredientQuantity(savedOliveOilIngredient!.name, 0.3, "kg"));
    savedHamIngredientQuantity = await ingredientQuantitiesService.save(getTestIngredientQuantity(savedHamIngredient!.name, 0.2, "kg"));
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("FoodProductFootPrints.service", () => {
    it("should save new foodProductFootPrints", async () => {
        const chickenHamPizzaFoodProduct = new FoodProduct({
            name: "chickenHamPizza",
            ingredientQuantities: [
                savedChickenIngredientQuantity!,
                savedFlourIngredientQuantity!,
                savedOliveOilIngredientQuantity!,
                savedHamIngredientQuantity!
            ],
        });
        const savedChickenHamPizza = await foodProductsService.save(chickenHamPizzaFoodProduct);
        if (!savedChickenHamPizza) {
            throw new Error("Failed to save chickenHamPizza food product");
        }
        const chickenHamPizzaFoodProductFootPrint = new FoodProductFootprint({
            foodProduct: savedChickenHamPizza,
            score: 4.75,
        });
        await foodProductFootPrintsService.save(chickenHamPizzaFoodProductFootPrint);

        const retrieveChickenHamPizzaFoodProductFootPrint = await dataSource
            .getRepository(FoodProductFootprint)
            .findOne({ where: { foodProduct: savedChickenHamPizza }, relations: ["foodProduct", "foodProduct.ingredientQuantities"] });
        expect(retrieveChickenHamPizzaFoodProductFootPrint?.foodProduct).not.toBeNull();
        expect(retrieveChickenHamPizzaFoodProductFootPrint?.foodProduct.ingredientQuantities).toHaveLength(4);
    });

    it("should retrieve foodProductFootPrints", async () => {
        const foodProductFootPrints = await foodProductFootPrintsService.findAll();
        expect(foodProductFootPrints).toHaveLength(1);
    });

    it("should retrieve foodProductFootPrints by name", async () => {
        const foodProductFootPrints = await foodProductFootPrintsService.findOneByFoodProductName("chickenPizza");
        expect(foodProductFootPrints).not.toBeNull();
        expect(foodProductFootPrints?.foodProduct.ingredientQuantities).toHaveLength(3);
    });

    it("should compute and save foodProductFootPrint", async () => {
        const foodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "chickenHamPizza",
                ingredientQuantities: [
                    savedChickenIngredientQuantity!,
                    savedFlourIngredientQuantity!,
                    savedOliveOilIngredientQuantity!,
                    savedHamIngredientQuantity!
                ],
            }
        );
        expect(foodProductFootPrint).not.toBeNull();
        const chickenContribution = getTestEmissionFactor("chicken").emissionCO2eInKgPerUnit * getTestIngredientQuantity("chicken", 1, "kg").quantity;
        const flourContribution = getTestEmissionFactor("flour").emissionCO2eInKgPerUnit * getTestIngredientQuantity("flour", 0.5, "kg").quantity;
        const oliveOilContribution = getTestEmissionFactor("oliveOil").emissionCO2eInKgPerUnit * getTestIngredientQuantity("oliveOil", 0.3, "kg").quantity;
        const hamContribution = getTestEmissionFactor("ham").emissionCO2eInKgPerUnit * getTestIngredientQuantity("ham", 0.2, "kg").quantity;

        expect(foodProductFootPrint?.score).toBe(chickenContribution + flourContribution + oliveOilContribution + hamContribution);
    });

    it("should compute foodProductFootPrint score", async () => {
        const score = await foodProductFootPrintsService.computeFootPrint(
            {
                name: "chickenPizza",
                ingredientQuantities: [
                    savedChickenIngredientQuantity!,
                    savedFlourIngredientQuantity!,
                    savedOliveOilIngredientQuantity!,
                ],
            }
        );
        expect(score).toBeGreaterThan(0);
    });

    it("should handle errors during compute and save operation", async () => {
        await expect(foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "",
                ingredientQuantities: [
                    savedChickenIngredientQuantity!,
                    savedFlourIngredientQuantity!,
                    savedOliveOilIngredientQuantity!,
                ],
            }
        )).rejects.toThrow(
            `Error saving foodProductFootPrint `
        );
    });

    it("should return existing foodProductFootPrint if it already exists", async () => {
        const existingFoodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "chickenPizza",
                ingredientQuantities: [
                    savedChickenIngredientQuantity!,
                    savedFlourIngredientQuantity!,
                    savedOliveOilIngredientQuantity!,
                ],
            }
        );
        expect(existingFoodProductFootPrint).not.toBeNull();
        expect(existingFoodProductFootPrint?.foodProduct.name).toBe("chickenPizza");
    });

    it("should link to existing foodProduct", async () => {
        const beefIngredient = getTestIngredient("beef");
        const beefIngredientQuantity = getTestIngredientQuantity(beefIngredient.name, 0.5, "kg");
        await dataSource.getRepository(Ingredient).save(beefIngredient);
        await dataSource.getRepository(IngredientQuantity).save(beefIngredientQuantity);
        const beefBurgerFoodProduct = new FoodProduct({
            name: "beefBurger",
            ingredientQuantities: [
                beefIngredientQuantity,
                savedOliveOilIngredientQuantity!,
            ],
        });
        await dataSource.getRepository(FoodProduct).save(beefBurgerFoodProduct);

        const foodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            getTestFoodProduct("beefBurger")
        );
        expect(foodProductFootPrint).not.toBeNull();
        expect(foodProductFootPrint?.foodProduct.name).toBe("beefBurger");
        expect(foodProductFootPrint?.foodProduct.ingredientQuantities).toHaveLength(2);
        expect(foodProductFootPrint?.score).toBeGreaterThan(0);
    });

    it("should calculate and save FoodProductFootprint with saved ingredientFootprint", async () => {
        await dataSource.getRepository(CarbonEmissionFactor).save([
            getTestEmissionFactor("blueCheese"),
            getTestEmissionFactor("vinegar"),
        ]);
        await dataSource.getRepository(Ingredient).save([
            getTestIngredient("blueCheese"),
        ]);
        await dataSource.getRepository(IngredientQuantity).save([
            getTestIngredientQuantity("blueCheese", 0.5, "kg"),
        ]);
        await dataSource.getRepository(IngredientQuantityFootprint).save({
            ingredientQuantity: getTestIngredientQuantity("blueCheese", 0.5, "kg"),
            score: 1.2,
        }
        );

        const footprint = await foodProductFootPrintsService.computeSaveFootPrint({
            name: "blueCheeseSalad",
            ingredientQuantities: [
                getTestIngredientQuantity("blueCheese", 0.5, "kg"),
                getTestIngredientQuantity("vinegar", 0.5, "kg"),
            ],
        });
        console.log(footprint);
        expect(footprint).not.toBeNull()
        expect(footprint?.foodProduct.name).toBe("blueCheeseSalad");
        expect(footprint?.foodProduct.ingredientQuantities).toHaveLength(2);
        expect(footprint?.score).toBe(
            1.2 +
            getTestEmissionFactor("vinegar").emissionCO2eInKgPerUnit * 0.5
        );
    });

    it("should handle errors during compute operation", async () => {
        await expect(foodProductFootPrintsService.computeFootPrint({
            name: "blueCheeseSalad",
            ingredientQuantities: [
                getTestIngredientQuantity("vinegar", 0.5, "kg"),
                getTestIngredientQuantity("blueCheese", 0.5, "kg"),
            ],
        })).rejects.toThrow(
            `Error computing foodProductFootPrint `
        );
    });
});

