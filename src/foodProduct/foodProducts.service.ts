import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
@Injectable()
export class FoodProductsService {

    constructor(
        @InjectRepository(FoodProduct)
        private foodProductRepository: Repository<FoodProduct>,
        private ingredientsService: IngredientsService
    ) { }

    findAll(): Promise<FoodProduct[]> {
        return this.foodProductRepository.find();
    }

    async save(
        foodProduct: CreateFoodProductDto
    ): Promise<FoodProduct | null> {
        try {
            const foodProductExist = await this.findOneByName(foodProduct.name);
            if (foodProductExist !== null) {
                console.log(`FoodProduct for ${foodProduct.name} already exists`);
                return foodProductExist;
            }
            if (foodProduct.ingredients.length === 0) {
                console.log(`FoodProduct ${foodProduct.name} has no ingredients`);
                throw new Error(`FoodProduct ${foodProduct.name} has no ingredients`);
            }
            const ingredientsPromise = foodProduct.ingredients.map(async (ingredient) => {
                return this.ingredientsService.save(ingredient);
            });

            const ingredients = await Promise.all(ingredientsPromise);
            const validIngredients = ingredients.filter(
                (ingredient): ingredient is Ingredient => ingredient !== null
            );

            if (validIngredients.length !== foodProduct.ingredients.length) {
                console.log(`Error saving foodProduct ${foodProduct.name}`);
                throw new Error(`Error saving foodProduct ${foodProduct.name}`);
            }

            const foodProductNew = new FoodProduct({
                name: foodProduct.name,
                ingredients: validIngredients,
            });

            return this.foodProductRepository.save(foodProductNew);
        } catch (e) {
            console.log(e);
            throw new Error(`Error saving foodProduct ${foodProduct.name}`);
        }
    }

    findOneByName(
        name: string
    ): Promise<FoodProduct | null> {
        return this.foodProductRepository.createQueryBuilder("foodProduct")
            .leftJoinAndSelect("foodProduct.ingredients", "ingredient")
            .where("foodProduct.name = :name", { name })
            .getOne();
    }


}