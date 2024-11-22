import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@Controller('ingredients')
export class IngredientController {
  constructor(
    private readonly ingredientService: IngredientService
  ) { }

  @Get()
  getIngredients(): Promise<Ingredient[]> {
    Logger.log(
      `[ingredients] [GET] Ingredient: getting all Ingredients`
    );
    return this.ingredientService.findAll();
  }

  @Post()
  createIngredient(
    @Body() ingredient: CreateIngredientDto
  ): Promise<Ingredient | null> {
    Logger.log(`[ingredient] [POST] Ingredient: ${ingredient} created`);
    return this.ingredientService.save(ingredient);
  }
}