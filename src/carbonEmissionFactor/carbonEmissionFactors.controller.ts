import { BadRequestException, Body, Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Controller("carbon-emission-factors")
export class CarbonEmissionFactorsController {
  constructor(
    private readonly carbonEmissionFactorService: CarbonEmissionFactorsService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    Logger.log(
      `[carbon-emission-factors] [GET] CarbonEmissionFactor: getting all CarbonEmissionFactors`
    );
    return this.carbonEmissionFactorService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    ``;
    Logger.log(
      `[carbon-emission-factors] [POST] CarbonEmissionFactor: ${carbonEmissionFactors} created`
    );
    try {
      return this.carbonEmissionFactorService.save(carbonEmissionFactors) || Promise.resolve(null);
    } catch (e) {
      Logger.error(`[carbon-emission-factors] [POST] Error: ${e.message}`);
      throw new BadRequestException('Invalid data provided');
    }

  }
}
