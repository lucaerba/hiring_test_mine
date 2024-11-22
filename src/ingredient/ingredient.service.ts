import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { Ingredient } from "./ingredient.entity";

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>
  ) { }

  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepository.find();
  }

  save(ingredient: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientRepository.save(ingredient);
  }
}