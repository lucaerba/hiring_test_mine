import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionFactorsModule } from '../../carbonEmissionFactor/carbonEmissionFactors.module';
import { CarbonEmissionFactorsService } from '../../carbonEmissionFactor/carbonEmissionFactors.service';
import { IngredientQuantitiesModule } from '../../foodProduct/ingredientQuantity/ingredientQuantities.module';
import { IngredientQuantitiesService } from '../../foodProduct/ingredientQuantity/ingredientQuantities.service';
import { IngredientQuantity } from '../../foodProduct/ingredientQuantity/ingredientQuantity.entity';
import { Ingredient } from '../../ingredient/ingredient.entity';
import { IngredientsModule } from '../../ingredient/ingredients.module';
import { IngredientsService } from '../../ingredient/ingredients.service';
import { IngredientQuantityFootprint } from './ingredientQuantityFootprint.entity';
import { IngredientQuantityFootprintsService } from './ingredientQuantityFootprints.service';
import { UnitConverterModule } from './unitConverter/unitConverter.module';
import { UnitConverterService } from './unitConverter/unitConverter.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IngredientQuantityFootprint,
            Ingredient,
            CarbonEmissionFactor,
            IngredientQuantity]),

        IngredientsModule,
        CarbonEmissionFactorsModule,
        IngredientQuantitiesModule,
        UnitConverterModule
    ],
    providers: [
        IngredientQuantityFootprintsService,
        IngredientsService,
        IngredientQuantitiesService,
        CarbonEmissionFactorsService,
        UnitConverterService
    ],
    controllers: [],
    exports: [IngredientQuantityFootprintsService],
})
export class IngredientQuantityFootprintsModule { }
