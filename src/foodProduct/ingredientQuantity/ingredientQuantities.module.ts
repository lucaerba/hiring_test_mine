import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../../ingredient/ingredient.entity';
import { IngredientsModule } from '../../ingredient/ingredients.module';
import { IngredientsService } from '../../ingredient/ingredients.service';
import { IngredientQuantitiesService } from './ingredientQuantities.service';
import { IngredientQuantity } from './ingredientQuantity.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IngredientQuantity,
            Ingredient
        ]),
        IngredientsModule,
    ],
    providers: [
        IngredientQuantitiesService,
        IngredientsService
    ],
    controllers: [],
    exports: [IngredientQuantitiesService], // Export the service
})
export class IngredientQuantitiesModule { }