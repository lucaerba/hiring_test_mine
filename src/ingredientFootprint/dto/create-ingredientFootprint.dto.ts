import { CreateIngredientDto } from "../../ingredient/dto/create-ingredient.dto";

export class CreateIngredientFootprintDto {
    ingredient: CreateIngredientDto;
    score: number;
}