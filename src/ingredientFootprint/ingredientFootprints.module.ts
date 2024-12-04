import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarbonEmissionFactor } from '../carbonEmissionFactor/carbonEmissionFactor.entity';
import { CarbonEmissionFactorsModule } from '../carbonEmissionFactor/carbonEmissionFactors.module';
import { CarbonEmissionFactorsService } from '../carbonEmissionFactor/carbonEmissionFactors.service';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientsModule } from '../ingredient/ingredients.module';
import { IngredientsService } from '../ingredient/ingredients.service';
import { IngredientFootprint } from './ingredientFootprint.entity';
import { IngredientFootprintsService } from './ingredientFootprints.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IngredientFootprint,
            Ingredient,
            CarbonEmissionFactor]),

        IngredientsModule,
        CarbonEmissionFactorsModule,
    ],
    providers: [
        IngredientFootprintsService,
        IngredientsService,
        CarbonEmissionFactorsService],
    controllers: [],
    exports: [IngredientFootprintsService],
})
export class IngredientFootprintsModule { }
