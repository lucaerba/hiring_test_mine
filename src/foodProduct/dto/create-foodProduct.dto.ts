import { CreateIngredientDto } from "../../ingredient/dto/create-ingredient.dto";

export class CreateFoodProductDto {
  name: string;
  ingredients: CreateIngredientDto[];
}