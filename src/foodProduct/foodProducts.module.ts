import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from '../ingredient/ingredients.module';
import { FoodProduct } from './foodProduct.entity';
import { FoodProductsService } from './foodProducts.service';
import { IngredientQuantitiesModule } from './ingredientQuantity/ingredientQuantities.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([FoodProduct]),
        IngredientsModule,
        IngredientQuantitiesModule,
    ],
    providers: [FoodProductsService],
    controllers: [],
    exports: [FoodProductsService], // Export the service
})
export class FoodProductsModule { }