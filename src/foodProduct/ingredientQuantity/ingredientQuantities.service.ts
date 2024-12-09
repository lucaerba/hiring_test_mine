import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IngredientsService } from "../../ingredient/ingredients.service";
import { CreateIngredientQuantityDto } from "./dto/create-ingredientQuantity.dto";
import { IngredientQuantity } from "./ingredientQuantity.entity";

@Injectable()
export class IngredientQuantitiesService {
    constructor(
        @InjectRepository(IngredientQuantity)
        private ingredientQuantityRepository: Repository<IngredientQuantity>,
        private ingredientsService: IngredientsService
    ) { }

    findAll(): Promise<IngredientQuantity[]> {
        return this.ingredientQuantityRepository.find();
    }

    findOneByNameQuantityUnit(
        name: string,
        quantity: number,
        unit: string
    ): Promise<IngredientQuantity | null> {
        return this.ingredientQuantityRepository.findOne({
            where: {
                ingredient: {
                    name: name,
                },
                quantity: quantity,
                unit: unit,
            },
            relations: ["ingredient"],
        });
    }

    async save(
        ingredientQuantity: CreateIngredientQuantityDto
    ): Promise<IngredientQuantity | null> {
        try {
            const ingredientQuantityExist = await this.findOneByNameQuantityUnit(
                ingredientQuantity.ingredient.name,
                ingredientQuantity.quantity,
                ingredientQuantity.unit
            );
            if (ingredientQuantityExist !== null) {
                return ingredientQuantityExist;
            }
            let ingredientExist = await this.ingredientsService.findOneByName(
                ingredientQuantity.ingredient.name
            );
            if (ingredientExist === null) {
                ingredientExist = await this.ingredientsService.save(ingredientQuantity.ingredient);
            }
            let newIngredientQuantity = new IngredientQuantity({
                ingredient: ingredientExist!,
                quantity: ingredientQuantity.quantity,
                unit: ingredientQuantity.unit,
            });
            return this.ingredientQuantityRepository.save(newIngredientQuantity);
        } catch (error) {
            console.log(error);
            throw new Error(`Error saving ingredientQuantity ${ingredientQuantity.ingredient.name}`);
        }
    }
}