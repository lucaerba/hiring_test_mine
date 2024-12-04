import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { FoodProduct } from "../foodProduct/foodProduct.entity";
import { FoodProductsService } from "../foodProduct/foodProducts.service";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { IngredientFootprint } from "../ingredientFootprint/ingredientFootprint.entity";
import { IngredientFootprintsService } from "../ingredientFootprint/ingredientFootprints.service";
import { getTestEmissionFactor, getTestFoodProduct, getTestIngredient } from "../seed-dev-data";
import { UnitConverterService } from "../unitConverter/unitConverter.service";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { FoodProductFootprintsService } from "./foodProductFootprints.service";

let ingredientService: IngredientsService;
let ingredientFootPrintsService: IngredientFootprintsService;
let foodProductsService: FoodProductsService;
let foodProductFootPrintsService: FoodProductFootprintsService;
let carbonEmissionFactorsService: CarbonEmissionFactorsService;
let unitConverterService: UnitConverterService;

let savedChickenIngredient: Ingredient | null;
let savedFlourIngredient: Ingredient | null;
let savedOliveOilIngredient: Ingredient | null;
let savedHamIngredient: Ingredient | null;

let savedChickenPizzaFoodProduct: FoodProduct | null;
let chickenPizzaFoodProductFootPrint: FoodProductFootprint;
beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    carbonEmissionFactorsService = new CarbonEmissionFactorsService(
        dataSource.getRepository(CarbonEmissionFactor)
    );
    unitConverterService = new UnitConverterService();

    ingredientFootPrintsService = new IngredientFootprintsService(
        dataSource.getRepository(IngredientFootprint),
        ingredientService,
        carbonEmissionFactorsService,
        unitConverterService
    );
    foodProductsService = new FoodProductsService(
        dataSource.getRepository(FoodProduct),
        ingredientService
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

});

afterAll(async () => {
    await dataSource.destroy();
});

describe("FoodProductFootPrints.service", () => {
    it("should save new foodProductFootPrints", async () => {
        const chickenHamPizzaFoodProduct = new FoodProduct({
            name: "chickenHamPizza",
            ingredients: [savedChickenIngredient!, savedFlourIngredient!, savedOliveOilIngredient!, savedHamIngredient!],
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
            .findOne({ where: { foodProduct: savedChickenHamPizza }, relations: ["foodProduct", "foodProduct.ingredients"] });
        expect(retrieveChickenHamPizzaFoodProductFootPrint?.foodProduct).not.toBeNull();
        expect(retrieveChickenHamPizzaFoodProductFootPrint?.foodProduct.ingredients).toHaveLength(4);
    });

    it("should retrieve foodProductFootPrints", async () => {

        const foodProductFootPrints = await foodProductFootPrintsService.findAll();
        expect(foodProductFootPrints).toHaveLength(1);
    });

    it("should retrieve foodProductFootPrints by name", async () => {
        const foodProductFootPrints = await foodProductFootPrintsService.findOneByFoodProductName("chickenPizza");
        expect(foodProductFootPrints).not.toBeNull();
        expect(foodProductFootPrints?.foodProduct.ingredients).toHaveLength(4);
    });

    it("should compute and save foodProductFootPrint", async () => {
        const foodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "chickenHamPizza",
                ingredients: [savedChickenIngredient!, savedFlourIngredient!, savedOliveOilIngredient!, savedHamIngredient!],
            }
        );
        expect(foodProductFootPrint).not.toBeNull();
        const chickenContribution = getTestEmissionFactor("chicken").emissionCO2eInKgPerUnit * getTestIngredient("chicken").quantity;
        const flourContribution = getTestEmissionFactor("flour").emissionCO2eInKgPerUnit * getTestIngredient("flour").quantity;
        const oliveOilContribution = getTestEmissionFactor("oliveOil").emissionCO2eInKgPerUnit * getTestIngredient("oliveOil").quantity;
        const hamContribution = getTestEmissionFactor("ham").emissionCO2eInKgPerUnit * getTestIngredient("ham").quantity;

        expect(foodProductFootPrint?.score).toBe(chickenContribution + flourContribution + oliveOilContribution + hamContribution);

    });

    it("should compute foodProductFootPrint score", async () => {
        const score = await foodProductFootPrintsService.computeFootPrint(
            {
                name: "chickenPizza",
                ingredients: [savedChickenIngredient!, savedFlourIngredient!, savedOliveOilIngredient!],
            }
        );
        expect(score).toBeGreaterThan(0);
    });

    it("should handle errors during compute and save operation", async () => {

        await expect(foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "",
                ingredients: [savedChickenIngredient!, savedFlourIngredient!, savedOliveOilIngredient!],
            }
        )).rejects.toThrow(
            `Error saving foodProductFootPrint `
        );
    });

    it("should return existing foodProductFootPrint if it already exists", async () => {
        const existingFoodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            {
                name: "chickenPizza",
                ingredients: [savedChickenIngredient!, savedFlourIngredient!, savedOliveOilIngredient!],
            }
        );
        expect(existingFoodProductFootPrint).not.toBeNull();
        expect(existingFoodProductFootPrint?.foodProduct.name).toBe("chickenPizza");
    });

    it("should link to existing foodProduct", async () => {
        const beefIngredient = getTestIngredient("beef");
        await dataSource.getRepository(Ingredient).save(beefIngredient);
        const beefBurgerFoodProduct = new FoodProduct({
            name: "beefBurger",
            ingredients: [beefIngredient, savedOliveOilIngredient!],
        });
        await dataSource.getRepository(FoodProduct).save(beefBurgerFoodProduct);

        const foodProductFootPrint = await foodProductFootPrintsService.computeSaveFootPrint(
            getTestFoodProduct("beefBurger")
        );
        expect(foodProductFootPrint).not.toBeNull();
        expect(foodProductFootPrint?.foodProduct.name).toBe("beefBurger");
        expect(foodProductFootPrint?.foodProduct.ingredients).toHaveLength(2);
        expect(foodProductFootPrint?.score).toBeGreaterThan(0);
    });

    it("should calculate and save FoodProductFootprint with saved ingredientFootprint", async () => {
        await dataSource.getRepository(CarbonEmissionFactor).save([
            getTestEmissionFactor("blueCheese"),
            getTestEmissionFactor("vinegar"),
        ]);
        await dataSource.getRepository(IngredientFootprint).save({
            ingredient: getTestIngredient("vinegar"),
            score: 0.5,
        });
        const footprint = await foodProductFootPrintsService.computeSaveFootPrint({
            name: "blueCheeseSalad",
            ingredients: [
                { name: "blueCheese", unit: "kg", quantity: 0.5 },
                { name: "vinegar", unit: "kg", quantity: 0.6 },
                { name: "oliveOil", unit: "kg", quantity: 0.3 },
            ],
        });
        console.log(footprint);
        expect(footprint).not.toBeNull()
        expect(footprint?.foodProduct.name).toBe("blueCheeseSalad");
        expect(footprint?.foodProduct.ingredients).toHaveLength(3);
        expect(footprint?.score).toBe(
            0.5 * getTestEmissionFactor("blueCheese").emissionCO2eInKgPerUnit +
            0.5 +
            0.3 * getTestEmissionFactor("oliveOil").emissionCO2eInKgPerUnit
        );
    });

    it("should handle errors during compute operation", async () => {
        await expect(foodProductFootPrintsService.computeFootPrint({
            name: "blueCheeseSalad",
            ingredients: [
                { name: "", unit: "kg", quantity: 0.5 },
                { name: "vinegar", unit: "kg", quantity: 0.6 },
                { name: "oliveOil", unit: "kg", quantity: 0.3 },
            ],
        })).rejects.toThrow(
            `Error computing foodProductFootPrint `
        );
    });
});

