import { BadRequestException, Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateFoodProductDto } from '../foodProduct/dto/create-foodProduct.dto';
import { FoodProductFootprint } from './foodProductFootprint.entity';
import { FoodProductFootprintsService } from './foodProductFootprints.service';

@Controller('food-product-foot-prints')
export class FoodProductFootprintsController {
    constructor(
        private readonly foodProductFootsPrintService: FoodProductFootprintsService
    ) { }

    @Get()
    getFoodProductFootPrints(): Promise<FoodProductFootprint[]> {
        Logger.log(
            `[food-product-foot-prints] [GET] FoodProductFootPrint: getting all FoodProductFootPrints`
        );
        return this.foodProductFootsPrintService.findAll();
    }

    @Get(':name')
    async getFoodProductFootprint(@Param('name') name: string): Promise<FoodProductFootprint | null> {
        Logger.log(
            `[food-product-foot-prints] [GET] FoodProductFootPrint: getting all FoodProductFootPrints by FoodProduct`
        );
        return this.foodProductFootsPrintService.findOneByFoodProductName(name);
    }

    @Post()
    async createFoodProductFootPrints(
        @Body() foodProductDto: CreateFoodProductDto
    ): Promise<FoodProductFootprint | null> {
        try {
            console.log(`[food-product-foot-prints] [POST] FoodProductFootPrint: ${foodProductDto.name} created`);
            Logger.log(
                `[food-product-foot-prints] [POST] FoodProductFootPrint: ${foodProductDto} created`
            );
            const result = await this.foodProductFootsPrintService.computeSaveFootPrint(foodProductDto);
            return result;
        } catch (e) {
            console.log(e);
            throw new BadRequestException(`Error creating FoodProductFootPrint: ${foodProductDto.name}`);
        }
    }
}
