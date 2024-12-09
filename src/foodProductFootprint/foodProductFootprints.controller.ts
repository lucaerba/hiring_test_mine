import { BadRequestException, Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoodProductInputDto } from './dto/input-foodProduct.dto';
import { FoodProductFootprint } from './foodProductFootprint.entity';
import { FoodProductFootprintsService } from './foodProductFootprints.service';
import { transformToCreateFoodProductDto } from './transformers/foodProduct.transformer';

@Controller('food-product-foot-prints')
export class FoodProductFootprintsController {
    constructor(
        private readonly foodProductFootsPrintService: FoodProductFootprintsService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getFoodProductFootPrints(): Promise<FoodProductFootprint[]> {
        Logger.log(
            `[food-product-foot-prints] [GET] FoodProductFootPrint: getting all FoodProductFootPrints`
        );
        return this.foodProductFootsPrintService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':name')
    async getFoodProductFootprint(@Param('name') name: string): Promise<FoodProductFootprint | null> {
        Logger.log(
            `[food-product-foot-prints] [GET] FoodProductFootPrint: getting all FoodProductFootPrints by FoodProduct`
        );
        return this.foodProductFootsPrintService.findOneByFoodProductName(name);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createFoodProductFootPrints(
        @Body() foodProductInputDto: FoodProductInputDto
    ): Promise<FoodProductFootprint | null> {
        try {
            console.log(foodProductInputDto);
            const foodProductDto = transformToCreateFoodProductDto(foodProductInputDto);
            console.log(foodProductDto);
            const result = await this.foodProductFootsPrintService.computeSaveFootPrint(foodProductDto);
            Logger.log(
                `[food-product-foot-prints] [POST] FoodProductFootPrint: ${foodProductDto.name} created`
            );
            return result;
        } catch (e) {
            console.log(e);
            throw new BadRequestException(`Error creating FoodProductFootPrint: ${foodProductInputDto.name}`);
        }
    }
}


