import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { CreateFoodProductDto } from "../foodProduct/dto/create-foodProduct.dto";
import { FoodProductsService } from "../foodProduct/foodProducts.service";
import { CreateFoodProductFootprintDto } from "./dto/create-foodProductFootprint.dto";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { IngredientQuantityFootprintsService } from "./ingredientQuantityFootprint/ingredientQuantityFootprints.service";

@Injectable()
export class FoodProductFootprintsService {
    constructor(
        @InjectRepository(FoodProductFootprint)
        private foodProductFootPrintRepository: Repository<FoodProductFootprint>,
        private carbonEmissionFactorsService: CarbonEmissionFactorsService,
        private ingredientFootPrintsService: IngredientQuantityFootprintsService,
        private foodProductsService: FoodProductsService,
    ) { }

    findAll(): Promise<FoodProductFootprint[]> {
        return this.foodProductFootPrintRepository.find();
    }

    save(
        foodProductFootPrint: CreateFoodProductFootprintDto
    ): Promise<FoodProductFootprint | null> {
        return this.foodProductFootPrintRepository.save(foodProductFootPrint);
    }

    async computeSaveFootPrint(
        foodProduct: CreateFoodProductDto
    ): Promise<FoodProductFootprint | null> {
        try {
            const foodProductFootPrintExist = await this.findOneByFoodProductName(foodProduct.name);
            if (foodProductFootPrintExist !== null) {
                console.log(`FoodProductFootPrint for ${foodProduct.name} already exists`);
                return foodProductFootPrintExist;
            }

            const foodProductExist = await this.foodProductsService.findOneByName(foodProduct.name);
            if (foodProductExist !== null) {
                const score = await this.computeFootPrint(foodProduct);
                const foodProductFootPrint = new FoodProductFootprint({
                    foodProduct: foodProductExist,
                    score: score,
                });
                return this.save(foodProductFootPrint);
            }

            const foodProductNew = await this.foodProductsService.save(foodProduct);

            const score = await this.computeFootPrint(foodProduct);

            const foodProductFootPrint = new FoodProductFootprint(
                {
                    foodProduct: foodProductNew!,
                    score: score,
                }
            );

            return this.save(foodProductFootPrint);
        } catch (error) {
            console.log(`Error saving foodProductFootPrint ${foodProduct.name}: ${error}`);
            throw new Error(`Error saving foodProductFootPrint ${foodProduct.name}: ${error}`);
        }
    }

    async computeFootPrint(
        foodProduct: CreateFoodProductDto
    ): Promise<number> {
        try {
            let score = 0;
            for (const ingredientQuantityDto of foodProduct.ingredientQuantities) {

                let ingredientFootPrint = await this.ingredientFootPrintsService.findOneByNameQuantity(ingredientQuantityDto);

                if (ingredientFootPrint) {
                    console.log(`IngredientFootPrint for ${ingredientQuantityDto.ingredient.name} already exists`);
                    score += ingredientFootPrint.score;
                    continue;
                }

                ingredientFootPrint = await this.ingredientFootPrintsService.computeSaveFootPrint(ingredientQuantityDto);
                score += ingredientFootPrint!.score;
            }
            return score;
        } catch (error) {
            console.log(`Error computing foodProductFootPrint ${foodProduct.name}`);
            throw new Error(`Error computing foodProductFootPrint ${foodProduct.name}`);
        }
    }

    async findOneByFoodProductName(
        name: string
    ): Promise<FoodProductFootprint | null> {
        const foodProductFound = await this.foodProductFootPrintRepository.createQueryBuilder("foodProductFootPrint")
            .leftJoinAndSelect("foodProductFootPrint.foodProduct", "foodProduct")
            .leftJoinAndSelect("foodProduct.ingredientQuantities", "ingredientQuantity")
            .leftJoinAndSelect("ingredientQuantity.ingredient", "ingredient")
            .where("foodProduct.name = :name", { name })
            .getOne();

        return foodProductFound;
    }

}