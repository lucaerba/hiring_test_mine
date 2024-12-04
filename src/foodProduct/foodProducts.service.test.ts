import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { getTestIngredient } from "../seed-dev-data";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
import { FoodProductsService } from "./foodProducts.service";

let chickenIngredient = getTestIngredient("chicken");
let flourIngredient = getTestIngredient("flour");
let oliveOilIngredient = getTestIngredient("oliveOil");
let beefIngredient = getTestIngredient("beef");

let ingredientService: IngredientsService;
let chickenPizzaFoodProduct: FoodProduct;
let foodProductsService: FoodProductsService;

beforeAll(async () => {
    await dataSource.initialize();
    ingredientService = new IngredientsService(
        dataSource.getRepository(Ingredient)
    );
    foodProductsService = new FoodProductsService(
        dataSource.getRepository(FoodProduct),
        ingredientService
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();

    chickenPizzaFoodProduct = new FoodProduct({
        name: "chickenPizza",
        ingredients: [chickenIngredient, flourIngredient, oliveOilIngredient]
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
            .leftJoinAndSelect("foodProduct.ingredients", "ingredient")
            .where("foodProduct.name = :name", { name: "chickenPizza" })
            .getOne();

        console.log(retrieveChickenPizzaFoodProduct);

        expect(retrieveChickenPizzaFoodProduct).not.toBeNull();
        expect(retrieveChickenPizzaFoodProduct?.name).toBe("chickenPizza");
        expect(retrieveChickenPizzaFoodProduct?.ingredients).toHaveLength(3);
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
    });

    it("should return existing foodProduct if it already exists", async () => {
        await foodProductsService.save(chickenPizzaFoodProduct);
        const existingFoodProduct = await foodProductsService.save(chickenPizzaFoodProduct);
        //print the existing foodProducts with its ingredients
        dataSource.getRepository(FoodProduct).createQueryBuilder("foodProduct")
            .leftJoinAndSelect("foodProduct.ingredients", "ingredient")
            .getMany()
            .then((foodProducts) => {
                console.log(foodProducts);
            });
        expect(existingFoodProduct).not.toBeNull();
        expect(existingFoodProduct?.name).toBe("chickenPizza");
        expect(existingFoodProduct?.ingredients).toHaveLength(3);


    });

    it("should throw an error if foodProduct name is empty", async () => {
        await expect(foodProductsService.save({
            name: "",
            ingredients: [chickenIngredient],
        })).rejects.toThrow("Error saving foodProduct ");
    });

    it("should throw an error if foodProduct ingredients are invalid", async () => {
        await expect(foodProductsService.save({
            name: "chickenPizza",
            ingredients: [
                { name: "", unit: "kg", quantity: 1.2 },
            ],
        })).rejects.toThrow("Error saving foodProduct chickenPizza");
    });

    it("should save new foodProducts with beef ingredient", async () => {

        const beefPizzaFoodProduct = new CreateFoodProductDto();
        beefPizzaFoodProduct.name = "beefPizza";
        beefPizzaFoodProduct.ingredients = [beefIngredient, flourIngredient, oliveOilIngredient];
        await foodProductsService.save(beefPizzaFoodProduct);

        const retrieveBeefPizzaFoodProduct = await dataSource
            .getRepository(FoodProduct)
            .findOne({ where: { name: "beefPizza" } });

        expect(retrieveBeefPizzaFoodProduct?.name).toBe("beefPizza");
    });

    it("should throw an error if ingredients is empty", async () => {
        await expect(foodProductsService.save({
            name: "beefPizza",
            ingredients: [],
        })).rejects.toThrow("Error saving foodProduct beefPizza");
    });


});

