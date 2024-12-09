import { Ingredient } from "../../../ingredient/ingredient.entity";

export class CreateIngredientQuantityDto {
    ingredient: Ingredient;
    quantity: number;
    unit: string;
}