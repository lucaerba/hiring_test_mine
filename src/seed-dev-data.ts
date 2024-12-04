import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "./foodProduct/foodProduct.entity";
import { FoodProductFootprint } from "./foodProductFootprint/foodProductFootprint.entity";
import { Ingredient } from "./ingredient/ingredient.entity";

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.18,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
  {
    name: "chicken",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.16,
    source: "Agrybalise",
  },
  {
    name: "pork",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.17,
    source: "Agrybalise",
  }
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const TEST_INGREDIENTS = [
  {
    name: "ham",
    unit: "kg",
    quantity: 0.1,
  },
  {
    name: "cheese",
    unit: "kg",
    quantity: 0.2,
  },
  {
    name: "tomato",
    unit: "kg",
    quantity: 0.3,
  },
  {
    name: "flour",
    unit: "kg",
    quantity: 0.4,
  },
  {
    name: "blueCheese",
    unit: "kg",
    quantity: 0.5,
  },
  {
    name: "vinegar",
    unit: "kg",
    quantity: 0.6,
  },
  {
    name: "beef",
    unit: "kg",
    quantity: 0.7,
  },
  {
    name: "oliveOil",
    unit: "kg",
    quantity: 0.8,
  },
  {
    name: "chicken",
    unit: "kg",
    quantity: 0.9,
  },
  {
    name: "pork",
    unit: "kg",
    quantity: 1.0,
  }
].map((args) => {
  return new Ingredient({
    name: args.name,
    unit: args.unit,
    quantity: args.quantity,
  });
});

export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

export const getTestIngredient = (name: string) => {
  const ingredient = TEST_INGREDIENTS.find(
    (i) => i.name === name
  );
  if (!ingredient) {
    throw new Error(
      `test ingredient with name ${name} could not be found`
    );
  }
  return ingredient;
};

export const TEST_FOOD_PRODUCTS = [
  {
    name: "hamPizza",
    ingredients: [
      getTestIngredient("ham"),
      getTestIngredient("cheese"),
      getTestIngredient("tomato"),
      getTestIngredient("flour"),
    ],
  },
  {
    name: "blueCheeseSalad",
    ingredients: [
      getTestIngredient("blueCheese"),
      getTestIngredient("vinegar"),
    ],
  },
  {
    name: "beefBurger",
    ingredients: [
      getTestIngredient("beef"),
      getTestIngredient("oliveOil"),
    ],
  },
  {
    name: "chickenPizza",
    ingredients: [
      getTestIngredient("chicken"),
      getTestIngredient("cheese"),
      getTestIngredient("tomato"),
      getTestIngredient("flour"),
    ],
  },
  {
    name: "porkBurger",
    ingredients: [
      getTestIngredient("pork"),
      getTestIngredient("oliveOil"),
    ],
  }
].map((args) => {
  return new FoodProduct({
    name: args.name,
    ingredients: args.ingredients,
  });
});

export const getTestFoodProduct = (name: string) => {
  const foodProduct = TEST_FOOD_PRODUCTS.find(
    (fp) => fp.name === name
  );
  if (!foodProduct) {
    throw new Error(
      `test food product with name ${name} could not be found`
    );
  }
  return foodProduct;
}

export const TEST_FOOD_PRODUCTS_FOOTPRINTS = [
  {
    foodProduct: getTestFoodProduct("hamPizza"),
    score: 3.1,
  },
  {
    foodProduct: getTestFoodProduct("blueCheeseSalad"),
    score: 2.2,
  },
  {
    foodProduct: getTestFoodProduct("beefBurger"),
    score: 1.8,
  },
].map((args) => {
  return new FoodProductFootprint({
    foodProduct: args.foodProduct,
    score: args.score,
  });
});

export const getTestFoodProductFootPrint = (name: string) => {
  const foodProductFootPrint = TEST_FOOD_PRODUCTS_FOOTPRINTS.find(
    (fp) => fp.foodProduct.name === name
  );
  if (!foodProductFootPrint) {
    throw new Error(
      `test food product foot print with name ${name} could not be found`
    );
  }
  return foodProductFootPrint;
}

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};

export const seedTestIngredients = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const ingredientService = dataSource.getRepository(Ingredient);

  await ingredientService.save(TEST_INGREDIENTS);
};

export const seedTestFoodProducts = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const foodProductService = dataSource.getRepository(FoodProduct);

  await foodProductService.save(TEST_FOOD_PRODUCTS);
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
  seedTestIngredients().catch((e) => console.error(e));
  //seedTestFoodProducts().catch((e) => console.error(e));
}
