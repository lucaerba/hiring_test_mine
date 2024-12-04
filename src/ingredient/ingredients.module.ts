import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './ingredient.entity';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientsService],
  controllers: [],
  exports: [IngredientsService],
})
export class IngredientsModule { }