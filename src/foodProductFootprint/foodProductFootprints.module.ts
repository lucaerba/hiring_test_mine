import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionFactorsModule } from '../carbonEmissionFactor/carbonEmissionFactors.module';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { FoodProduct } from '../foodProduct/foodProduct.entity';
import { FoodProductsModule } from '../foodProduct/foodProducts.module';
import { FoodProductsService } from '../foodProduct/foodProducts.service';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientsModule } from '../ingredient/ingredients.module';
import { IngredientFootprint } from '../ingredientFootprint/ingredientFootprint.entity';
import { IngredientFootprintsModule } from '../ingredientFootprint/ingredientFootprints.module';
import { IngredientFootprintsService } from '../ingredientFootprint/ingredientFootprints.service';
import { FoodProductFootprint } from './foodProductFootprint.entity';
import { FoodProductFootprintsController } from './foodProductFootprints.controller';
import { FoodProductFootprintsService } from './foodProductFootprints.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FoodProductFootprint,
            FoodProduct,
            Ingredient,
            IngredientFootprint,
            CarbonEmissionFactor
        ]),
        IngredientFootprintsModule,
        FoodProductsModule,
        IngredientsModule,
        CarbonEmissionFactorsModule,
    ],
    providers: [FoodProductFootprintsService, IngredientFootprintsService, FoodProductsService, CarbonEmissionFactorsService],
    controllers: [FoodProductFootprintsController],
})
export class FoodProductFootprintsModule { }