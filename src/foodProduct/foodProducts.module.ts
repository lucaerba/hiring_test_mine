import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from '../ingredient/ingredients.module';
import { FoodProduct } from './foodProduct.entity';
import { FoodProductsService } from './foodProducts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FoodProduct]),
        IngredientsModule,],
    providers: [FoodProductsService],
    controllers: [],
    exports: [FoodProductsService], // Export the service
})
export class FoodProductsModule { }