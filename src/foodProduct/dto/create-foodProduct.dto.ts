import { CreateIngredientQuantityDto } from "../ingredientQuantity/dto/create-ingredientQuantity.dto";

export class CreateFoodProductDto {
  name: string;
  ingredientQuantities: CreateIngredientQuantityDto[];
}