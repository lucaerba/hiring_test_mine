import { CreateIngredientDto } from "../../../ingredient/dto/create-ingredient.dto";

export class CreateIngredientQuantityDto {
    ingredient: CreateIngredientDto;
    quantity: number;
    unit: string;
}