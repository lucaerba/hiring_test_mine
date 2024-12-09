import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionFactorsModule } from '../carbonEmissionFactor/carbonEmissionFactors.module';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { FoodProduct } from '../foodProduct/foodProduct.entity';
import { FoodProductsModule } from '../foodProduct/foodProducts.module';
import { FoodProductsService } from '../foodProduct/foodProducts.service';
import { IngredientQuantitiesModule } from '../foodProduct/ingredientQuantity/ingredientQuantities.module';
import { IngredientQuantitiesService } from '../foodProduct/ingredientQuantity/ingredientQuantities.service';
import { IngredientQuantity } from '../foodProduct/ingredientQuantity/ingredientQuantity.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientsModule } from '../ingredient/ingredients.module';
import { FoodProductFootprint } from './foodProductFootprint.entity';
import { FoodProductFootprintsController } from './foodProductFootprints.controller';
import { FoodProductFootprintsService } from './foodProductFootprints.service';
import { IngredientQuantityFootprint } from './ingredientQuantityFootprint/ingredientQuantityFootprint.entity';
import { IngredientQuantityFootprintsModule } from './ingredientQuantityFootprint/ingredientQuantityFootprints.module';
import { IngredientQuantityFootprintsService } from './ingredientQuantityFootprint/ingredientQuantityFootprints.service';
import { UnitConverterModule } from './ingredientQuantityFootprint/unitConverter/unitConverter.module';
import { UnitConverterService } from './ingredientQuantityFootprint/unitConverter/unitConverter.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FoodProductFootprint,
            FoodProduct,
            Ingredient,
            IngredientQuantity,
            IngredientQuantityFootprint,
            CarbonEmissionFactor
        ]),
        IngredientQuantityFootprintsModule,
        FoodProductsModule,
        IngredientsModule,
        CarbonEmissionFactorsModule,
        UnitConverterModule,
        IngredientQuantitiesModule
    ],
    providers: [
        FoodProductFootprintsService,
        IngredientQuantityFootprintsService,
        IngredientQuantitiesService,
        FoodProductsService,
        CarbonEmissionFactorsService,
        UnitConverterService
    ],
    controllers: [FoodProductFootprintsController],
})
export class FoodProductFootprintsModule { }