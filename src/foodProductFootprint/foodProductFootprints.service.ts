import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { CreateFoodProductDto } from "../foodProduct/dto/create-foodProduct.dto";
import { FoodProductsService } from "../foodProduct/foodProducts.service";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientFootprintsService } from "../ingredientFootprint/ingredientFootprints.service";
import { CreateFoodProductFootprintDto } from "./dto/create-foodProductFootprint.dto";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
@Injectable()
export class FoodProductFootprintsService {
    constructor(
        @InjectRepository(FoodProductFootprint)
        private foodProductFootPrintRepository: Repository<FoodProductFootprint>,
        private carbonEmissionFactorsService: CarbonEmissionFactorsService,
        private ingredientFootPrintsService: IngredientFootprintsService,
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

            const foodProductFootPrint = new CreateFoodProductFootprintDto();
            foodProductFootPrint.foodProduct = foodProductNew!;
            foodProductFootPrint.score = score;

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
            for (const ingredientDto of foodProduct.ingredients) {
                const ingredient = new Ingredient(ingredientDto);
                let ingredientFootPrint = await this.ingredientFootPrintsService.findOneByName(ingredient.name);

                if (ingredientFootPrint) {
                    console.log(`IngredientFootPrint for ${ingredient.name} already exists`);
                    score += ingredientFootPrint.score;
                    continue;
                }

                ingredientFootPrint = await this.ingredientFootPrintsService.computeSaveFootPrint(ingredient);
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
            .leftJoinAndSelect("foodProduct.ingredients", "ingredients")
            .where("foodProduct.name = :name", { name })
            .getOne();

        return foodProductFound;
    }

}