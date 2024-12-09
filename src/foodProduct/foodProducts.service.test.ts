
import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { getTestIngredient, getTestIngredientQuantity } from "../seed-dev-data";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductsService } from "./foodProducts.service";
import { IngredientQuantitiesService } from "./ingredientQuantity/ingredientQuantities.service";
import { IngredientQuantity } from "./ingredientQuantity/ingredientQuantity.entity";

let chickenIngredient = getTestIngredient("chicken");
let flourIngredient = getTestIngredient("flour");
let oliveOilIngredient = getTestIngredient("oliveOil");
let beefIngredient = getTestIngredient("beef");
let chickenIngredientQuantity = getTestIngredientQuantity(chickenIngredient.name, 1.2, "kg");
let flourIngredientQuantity = getTestIngredientQuantity(flourIngredient.name, 1.2, "kg");
let oliveOilIngredientQuantity = getTestIngredientQuantity(oliveOilIngredient.name, 1.2, "kg");
let beefIngredientQuantity = getTestIngredientQuantity(beefIngredient.name, 1.2, "kg");

let ingredientService: IngredientsService;
let ingredientQuantitiesService: IngredientQuantitiesService;
let chickenPizzaFoodProduct: FoodProduct;
let foodProductsService: FoodProductsService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    ingredientQuantitiesService = new IngredientQuantitiesService(
        dataSource.getRepository(IngredientQuantity),
        ingredientService
    );
    foodProductsService = new FoodProductsService(
        dataSource.getRepository(FoodProduct),
        ingredientQuantitiesService
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();


    chickenPizzaFoodProduct = new FoodProduct({
        name: "chickenPizza",
        ingredientQuantities: [chickenIngredientQuantity, flourIngredientQuantity, oliveOilIngredientQuantity],
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("FoodProducts.service", () => {
    it("should save new foodProducts", async () => {
        await foodProductsService.save(chickenPizzaFoodProduct);

        const retrieveChickenPizzaFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .createQueryBuilder("foodProduct")
            .leftJoinAndSelect("foodProduct.ingredientQuantities", "ingredientQuantity")
            .leftJoinAndSelect("ingredientQuantity.ingredient", "ingredient")
            .where("foodProduct.name = :name", { name: "chickenPizza" })
            .getOne();

        console.log(retrieveChickenPizzaFoodProduct);

        expect(retrieveChickenPizzaFoodProduct).not.toBeNull();
        expect(retrieveChickenPizzaFoodProduct?.name).toBe("chickenPizza");
        expect(retrieveChickenPizzaFoodProduct?.ingredientQuantities).toHaveLength(3);
    });

    it("should retrieve foodProducts", async () => {
        await foodProductsService.save(chickenPizzaFoodProduct);
        const retrieveChickenPizzaFoodProduct = await foodProductsService.findAll();
        expect(retrieveChickenPizzaFoodProduct).toHaveLength(1);
    });

    it("should retrieve foodProducts by name", async () => {
        await foodProductsService.save(chickenPizzaFoodProduct);
        const retrieveChickenPizzaFoodProduct = await foodProductsService.findOneByName("chickenPizza");
        expect(retrieveChickenPizzaFoodProduct).not.toBeNull();
        expect(retrieveChickenPizzaFoodProduct?.name).toBe("chickenPizza");
        expect(retrieveChickenPizzaFoodProduct?.ingredientQuantities).toHaveLength(3);
        expect(retrieveChickenPizzaFoodProduct?.ingredientQuantities[0].ingredient.name).toBe("chicken");
    });

    it("should return existing foodProduct if it already exists", async () => {
        await foodProductsService.save(chickenPizzaFoodProduct);
        const existingFoodProduct = await foodProductsService.save(chickenPizzaFoodProduct);
        //print the existing foodProducts with its ingredients
        dataSource.getRepository(FoodProduct).createQueryBuilder("foodProduct")
            .leftJoinAndSelect("foodProduct.ingredientQuantities", "ingredientQuantity")
            .leftJoinAndSelect("ingredientQuantity.ingredient", "ingredient")
            .getMany()
            .then((foodProducts) => {
                console.log(foodProducts);
            });
        expect(existingFoodProduct).not.toBeNull();
        expect(existingFoodProduct?.name).toBe("chickenPizza");
        expect(existingFoodProduct?.ingredientQuantities).toHaveLength(3);


    });

    it("should throw an error if foodProduct name is empty", async () => {
        await expect(foodProductsService.save({
            name: "",
            ingredientQuantities: [chickenIngredientQuantity],
        })).rejects.toThrow("Error saving foodProduct ");
    });

    it("should save new foodProducts with beef ingredient", async () => {

        const beefPizzaFoodProduct = new CreateFoodProductDto();
        beefPizzaFoodProduct.name = "beefPizza";
        beefPizzaFoodProduct.ingredientQuantities = [beefIngredientQuantity, flourIngredientQuantity, oliveOilIngredientQuantity];
        await foodProductsService.save(beefPizzaFoodProduct);

        const retrieveBeefPizzaFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .findOne(
                {
                    where: {
                        name: "beefPizza"
                    },
                    relations: [
                        "ingredientQuantities",
                        "ingredientQuantities.ingredient"
                    ]
                });

        expect(retrieveBeefPizzaFoodProduct?.name).toBe("beefPizza")
        expect(retrieveBeefPizzaFoodProduct?.ingredientQuantities).toHaveLength(3);
    });

    it("should throw an error if ingredients is empty", async () => {
        await expect(foodProductsService.save({
            name: "beefPizza",
            ingredientQuantities: [],
        })).rejects.toThrow("Error saving foodProduct beefPizza");
    });

    it("should throw an error if some ingredient quantities are invalid", async () => {
        await expect(foodProductsService.save({
            name: "invalidPizza",
            ingredientQuantities: [
                chickenIngredientQuantity,
                flourIngredientQuantity,
                {
                    ingredient: new Ingredient({ name: "invalidIngredient" }),
                    quantity: -1,
                    unit: "kg",
                },
            ],
        })).rejects.toThrow("Error saving foodProduct invalidPizza");
    });

});

