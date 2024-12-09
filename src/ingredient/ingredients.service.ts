import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { Ingredient } from "./ingredient.entity";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>
  ) { }

  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepository.find();
  }

  findOneByName(
    name: string,
  ): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async save(
    ingredient: CreateIngredientDto
  ): Promise<Ingredient | null> {
    try {
      const ingredientExist = await this.findOneByName(ingredient.name);

      if (ingredientExist !== null) {
        return ingredientExist;
      }
      const ingredientNew = new Ingredient({
        name: ingredient.name,
      });
      return await this.ingredientRepository.save(ingredientNew);
    } catch (error) {
      console.log(error);
      throw new Error(`Error saving ingredient ${ingredient.name}`);
    }
  }
}