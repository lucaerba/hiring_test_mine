import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";

@Injectable()
export class CarbonEmissionFactorsService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>
  ) { }

  findAll(): Promise<CarbonEmissionFactor[]> {
    return this.carbonEmissionFactorRepository.find();
  }

  async save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[]
  ): Promise<CarbonEmissionFactor[] | null> {
    try {
      const carbonEmissionFactorsNew = await Promise.all(
        carbonEmissionFactor.map(async (carbonEmissionFactor) => {
          const carbonEmissionFactorExist = await this.findOneByName(carbonEmissionFactor.name);
          if (carbonEmissionFactorExist !== null) {
            return carbonEmissionFactorExist;
          }
          const carbonEmissionFactorNew = new CarbonEmissionFactor({
            name: carbonEmissionFactor.name,
            unit: carbonEmissionFactor.unit,
            emissionCO2eInKgPerUnit: carbonEmissionFactor.emissionCO2eInKgPerUnit,
            source: carbonEmissionFactor.source,
          });
          return this.carbonEmissionFactorRepository.create(carbonEmissionFactorNew);
        })
      );
      return this.carbonEmissionFactorRepository.save(carbonEmissionFactorsNew);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOneByName(
    name: string
  ): Promise<CarbonEmissionFactor | null> {
    return this.carbonEmissionFactorRepository.findOne({
      where: {
        name: name,
      },
    });
  }
}
