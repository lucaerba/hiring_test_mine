import { BadRequestException } from "@nestjs/common";
import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { getTestEmissionFactor } from "../seed-dev-data";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";

let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let oliveOilEmissionFactor = getTestEmissionFactor("oliveOil");
let carbonEmissionFactorService: CarbonEmissionFactorsService;
let porkEmissionFactor = getTestEmissionFactor("pork");

beforeAll(async () => {
  await dataSource.initialize();
  carbonEmissionFactorService = new CarbonEmissionFactorsService(
    dataSource.getRepository(CarbonEmissionFactor)
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(oliveOilEmissionFactor);
});

describe("CarbonEmissionFactors.service", () => {
  it("should save new emissionFactors", async () => {
    await carbonEmissionFactorService.save([
      hamEmissionFactor,
      flourEmissionFactor,
    ]);
    const retrieveFlourEmissionFactor = await dataSource
      .getRepository(CarbonEmissionFactor)
      .findOne({ where: { name: "flour" } });
    expect(retrieveFlourEmissionFactor?.name).toBe("flour");
  });

  it("should retrieve emission Factors", async () => {
    const carbonEmissionFactors = await carbonEmissionFactorService.findAll();
    expect(carbonEmissionFactors).toHaveLength(1);
  });

  it("should retrieve emission Factors by name", async () => {
    await carbonEmissionFactorService.save([hamEmissionFactor]);
    const carbonEmissionFactor = await carbonEmissionFactorService.findOneByName(
      "ham"
    );
    expect(carbonEmissionFactor).toHaveProperty("name", "ham");
  });

  it("should return existing emission factors if they already exist", async () => {
    await carbonEmissionFactorService.save([oliveOilEmissionFactor]);
    const newEmissionFactors = [
      oliveOilEmissionFactor,
      porkEmissionFactor,
    ];
    const savedEmissionFactors = await carbonEmissionFactorService.save(newEmissionFactors);
    expect(savedEmissionFactors).not.toBeNull();
    if (savedEmissionFactors) {
      expect(savedEmissionFactors).toHaveLength(2);
      expect(savedEmissionFactors[0]).toHaveProperty("name", "oliveOil");
      expect(savedEmissionFactors[1]).toHaveProperty("name", "pork");
    }
  });

  it("should throw BadRequestException when an error occurs", async () => {
    const invalidEmissionFactor = { name: "", unit: "kg", emissionCO2eInKgPerUnit: 0, source: "" };

    await expect(carbonEmissionFactorService.save([invalidEmissionFactor])).rejects.toThrow(BadRequestException);
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
