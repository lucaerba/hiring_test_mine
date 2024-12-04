import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../carbonEmissionFactor/carbonEmissionFactors.service";
import { CreateIngredientDto } from "../ingredient/dto/create-ingredient.dto";
import { Ingredient } from "../ingredient/ingredient.entity";
import { IngredientsService } from "../ingredient/ingredients.service";
import { UnitConverterService } from "../unitConverter/unitConverter.service";
import { CreateIngredientFootprintDto } from "./dto/create-ingredientFootprint.dto";
import { IngredientFootprint } from "./ingredientFootprint.entity";

@Injectable()
export class IngredientFootprintsService {
    constructor(
        @InjectRepository(IngredientFootprint)
        private ingredientFootPrintRepository: Repository<IngredientFootprint>,
        private ingredientService: IngredientsService,
        private carbonEmissionFactorsService: CarbonEmissionFactorsService,
        private unitConverterService: UnitConverterService,
    ) { }

    findAll(): Promise<IngredientFootprint[]> {
        return this.ingredientFootPrintRepository.find();
    }

    async computeSaveFootPrint(
        ingredient: CreateIngredientDto
    ): Promise<IngredientFootprint | null> {
        try {
            const ingredientFootPrintExist = await this.findOneByName(ingredient.name);
            if (ingredientFootPrintExist) {
                console.log(`IngredientFootPrint for ${ingredient.name} already exists`);
                return ingredientFootPrintExist;
            }
            const ingredientExist = await this.ingredientService.findOneByNameQuantity(ingredient.name, ingredient.quantity);
            let newIngredient: Ingredient;
            if (!ingredientExist) {
                newIngredient = new Ingredient(ingredient);
            } else {
                newIngredient = ingredientExist;
            }
            const score = await this.calulateFootPrint(newIngredient);
            const ingredientFootPrint = new IngredientFootprint({
                ingredient: newIngredient,
                score: score,
            });
            return this.save(ingredientFootPrint);
        } catch (e) {
            throw new Error(`Error saving ingredientFootPrint ${ingredient.name}`);
        }
    }

    async save(
        ingredientFootPrint: CreateIngredientFootprintDto
    ): Promise<IngredientFootprint | null> {
        try {
            let savedIngredient = await this.ingredientService.save(ingredientFootPrint.ingredient);

            if (savedIngredient) {
                ingredientFootPrint.ingredient = savedIngredient;
            } else {
                throw new Error(`Error saving ingredient: savedIngredient is null`);
            }
            return this.ingredientFootPrintRepository.save(ingredientFootPrint);
        } catch (e) {
            throw new Error(`Error saving ingredientFootPrint`);
        }
    }

    async calulateFootPrint(
        ingredient: Ingredient
    ): Promise<number> {
        let score = 0;
        let carbon_emission_factor: CarbonEmissionFactor | null = null;

        carbon_emission_factor = await this.carbonEmissionFactorsService.findOneByName(ingredient.name);

        if (carbon_emission_factor) {

            score = this.unitConverterService.convert(
                ingredient.quantity,
                ingredient.unit,
                carbon_emission_factor.unit)
                * carbon_emission_factor.emissionCO2eInKgPerUnit;

        } else {
            console.log(`Carbon Emission Factor for ${ingredient.name} not found`)
            throw new Error(`Carbon Emission Factor for ${ingredient.name} not found`);
        }

        return score;
    }

    async findOneByName(
        name: string
    ): Promise<IngredientFootprint | null> {
        return this.ingredientFootPrintRepository.findOne({
            where: {
                ingredient: {
                    name: name,
                },
            },
            relations: ['ingredient'],
        })
    }
}