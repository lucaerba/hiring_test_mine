import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "../../carbonEmissionFactor/carbonEmissionFactors.service";
import { CreateIngredientQuantityDto } from "../../foodProduct/ingredientQuantity/dto/create-ingredientQuantity.dto";
import { IngredientQuantitiesService } from "../../foodProduct/ingredientQuantity/ingredientQuantities.service";
import { IngredientQuantity } from "../../foodProduct/ingredientQuantity/ingredientQuantity.entity";
import { CreateIngredientQuantityFootprintDto } from "./dto/create-ingredientQuantityFootprint.dto";
import { IngredientQuantityFootprint } from "./ingredientQuantityFootprint.entity";
import { UnitConverterService } from "./unitConverter/unitConverter.service";

@Injectable()
export class IngredientQuantityFootprintsService {
    constructor(
        @InjectRepository(IngredientQuantityFootprint)
        private IngredientQuantityFootprintRepository: Repository<IngredientQuantityFootprint>,
        private ingredientQuantitiesService: IngredientQuantitiesService,
        private carbonEmissionFactorsService: CarbonEmissionFactorsService,
        private unitConverterService: UnitConverterService,
    ) { }

    findAll(): Promise<IngredientQuantityFootprint[]> {
        return this.IngredientQuantityFootprintRepository.find();
    }

    async computeSaveFootPrint(
        ingredientQuantity: CreateIngredientQuantityDto
    ): Promise<IngredientQuantityFootprint | null> {
        try {
            const IngredientQuantityFootprintExist = await this.findOneByNameQuantity(ingredientQuantity);
            if (IngredientQuantityFootprintExist) {
                console.log(`IngredientQuantityFootprint for ${ingredientQuantity.ingredient.name} already exists`);
                return IngredientQuantityFootprintExist;
            }
            const ingredientQuantityExist = await this.ingredientQuantitiesService.findOneByNameQuantityUnit(
                ingredientQuantity.ingredient.name,
                ingredientQuantity.quantity,
                ingredientQuantity.unit
            );
            let newIngredientQuantity: IngredientQuantity | null;
            if (!ingredientQuantityExist) {
                newIngredientQuantity = await this.ingredientQuantitiesService.save(ingredientQuantity);
            } else {
                newIngredientQuantity = ingredientQuantityExist;
            }
            const score = await this.calulateFootPrint(newIngredientQuantity!);
            const ingredientQuantityFootprint = new IngredientQuantityFootprint({
                ingredientQuantity: newIngredientQuantity!,
                score: score,
            });
            return this.save(ingredientQuantityFootprint);
        } catch (e) {
            throw new Error(`Error saving IngredientQuantityFootprint ${ingredientQuantity.ingredient.name}`);
        }
    }

    async save(
        IngredientQuantityFootprint: CreateIngredientQuantityFootprintDto
    ): Promise<IngredientQuantityFootprint | null> {
        try {
            let savedIngredientQuantity = await this.ingredientQuantitiesService.save(IngredientQuantityFootprint.ingredientQuantity);

            IngredientQuantityFootprint.ingredientQuantity = savedIngredientQuantity!;

            return this.IngredientQuantityFootprintRepository.save(IngredientQuantityFootprint);
        } catch (e) {
            throw new Error(`Error saving IngredientQuantityFootprint`);
        }
    }

    async calulateFootPrint(
        ingredientQuantity: IngredientQuantity
    ): Promise<number> {
        let score = 0;
        let carbon_emission_factor: CarbonEmissionFactor | null = null;

        carbon_emission_factor = await this.carbonEmissionFactorsService.findOneByName(ingredientQuantity.ingredient.name);

        if (carbon_emission_factor) {

            score = this.unitConverterService.convert(
                ingredientQuantity.quantity,
                ingredientQuantity.unit,
                carbon_emission_factor.unit)
                * carbon_emission_factor.emissionCO2eInKgPerUnit;

        } else {
            console.log(`Carbon Emission Factor for ${ingredientQuantity.ingredient.name} not found`)
            throw new Error(`Carbon Emission Factor for ${ingredientQuantity.ingredient.name} not found`);
        }

        return score;
    }

    async findOneByNameQuantity(
        ingredientQuantity: CreateIngredientQuantityDto
    ): Promise<IngredientQuantityFootprint | null> {
        return this.IngredientQuantityFootprintRepository.createQueryBuilder("IngredientQuantityFootprint")
            .leftJoinAndSelect("IngredientQuantityFootprint.ingredientQuantity", "ingredientQuantity")
            .leftJoinAndSelect("ingredientQuantity.ingredient", "ingredient")
            .where("ingredient.name = :name", { name: ingredientQuantity.ingredient.name })
            .andWhere("ingredientQuantity.quantity = :quantity", { quantity: ingredientQuantity.quantity })
            .andWhere("ingredientQuantity.unit = :unit", { unit: ingredientQuantity.unit })
            .getOne();

    }
}