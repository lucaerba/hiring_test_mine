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

  findOneByNameQuantity(
    name: string,
    quantity: number
  ): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: {
        name: name,
        quantity: quantity,
      },
    });
  }

  async save(
    ingredient: CreateIngredientDto
  ): Promise<Ingredient | null> {
    try {
      const ingredientExist = await this.findOneByNameQuantity(ingredient.name, ingredient.quantity);
      if (ingredientExist !== null) {
        return ingredientExist;
      }
      const ingredientNew = new Ingredient({
        name: ingredient.name,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
      });
      return await this.ingredientRepository.save(ingredientNew);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}