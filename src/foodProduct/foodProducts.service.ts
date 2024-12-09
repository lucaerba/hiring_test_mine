import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
import { IngredientQuantitiesService } from "./ingredientQuantity/ingredientQuantities.service";

@Injectable()
export class FoodProductsService {

    constructor(
        @InjectRepository(FoodProduct)
        private foodProductRepository: Repository<FoodProduct>,
        private ingredientQuantitiesService: IngredientQuantitiesService,
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
            if (foodProduct.ingredientQuantities.length === 0) {
                console.log(`FoodProduct ${foodProduct.name} has no ingredients`);
                throw new Error(`FoodProduct ${foodProduct.name} has no ingredients`);
            }
            const validIngredientQuantities = await Promise.all(
                foodProduct.ingredientQuantities.map(async (ingredientQuantityDto) => {
                    try {
                        const ingredientQuantity = await this.ingredientQuantitiesService.save(ingredientQuantityDto);
                        return ingredientQuantity;
                    } catch (error) {
                        console.log(`Error saving ingredientQuantity ${ingredientQuantityDto.ingredient.name}`);
                        return null;
                    }
                })
            );

            const foodProductNew = new FoodProduct({
                name: foodProduct.name,
                ingredientQuantities: validIngredientQuantities.map((ingredientQuantity) => {
                    return ingredientQuantity!;
                }),
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
            .leftJoinAndSelect("foodProduct.ingredientQuantities", "ingredientQuantity")
            .leftJoinAndSelect("ingredientQuantity.ingredient", "ingredient")
            .where("foodProduct.name = :name", { name })
            .getOne();
    }


}