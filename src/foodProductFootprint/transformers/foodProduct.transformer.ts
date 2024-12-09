import { CreateFoodProductDto } from '../../foodProduct/dto/create-foodProduct.dto';
import { CreateIngredientQuantityDto } from '../../foodProduct/ingredientQuantity/dto/create-ingredientQuantity.dto';
import { CreateIngredientDto } from '../../ingredient/dto/create-ingredient.dto';
import { FoodProductInputDto } from '../dto/input-foodProduct.dto';

export function transformToCreateFoodProductDto(input: FoodProductInputDto): CreateFoodProductDto {
    return {
        name: input.name,
        ingredientQuantities: input.ingredients.map(ingredient => {
            const ingredientQuantity = new CreateIngredientQuantityDto();
            const ingredint = new CreateIngredientDto();

            ingredint.name = ingredient.name;
            ingredientQuantity.ingredient = ingredient;
            ingredientQuantity.unit = ingredient.unit;
            ingredientQuantity.quantity = ingredient.quantity;

            return ingredientQuantity;
        }),
    };
}