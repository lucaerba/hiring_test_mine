import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProduct } from "./foodProduct/foodProduct.entity";
import { IngredientQuantity } from "./foodProduct/ingredientQuantity/ingredientQuantity.entity";
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


export const TEST_INGREDIENTS = [
  {
    name: "ham",
  },
  {
    name: "cheese",
  },
  {
    name: "tomato",
  },
  {
    name: "flour",
  },
  {
    name: "blueCheese",
  },
  {
    name: "vinegar",
  },
  {
    name: "beef",
  },
  {
    name: "oliveOil",
  },
  {
    name: "chicken",
  },
  {
    name: "pork",
  }
].map((args) => {
  return new Ingredient({
    name: args.name,
  });
});

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

export const TEST_INGREDIENT_QUANTITIES = [
  {
    ingredient: getTestIngredient("ham"),
    quantity: 0.1,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("ham"),
    quantity: 0.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("cheese"),
    quantity: 0.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("tomato"),
    quantity: 0.3,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("flour"),
    quantity: 0.4,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("flour"),
    quantity: 0.5,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("flour"),
    quantity: 1.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("flour"),
    quantity: 1,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("blueCheese"),
    quantity: 0.5,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("vinegar"),
    quantity: 0.6,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("vinegar"),
    quantity: 0.5,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("beef"),
    quantity: 0.7,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("beef"),
    quantity: 0.5,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("beef"),
    quantity: 1.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("oliveOil"),
    quantity: 0.8,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("oliveOil"),
    quantity: 1.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("oliveOil"),
    quantity: 0.3,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("oliveOil"),
    quantity: 1,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("chicken"),
    quantity: 0.9,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("chicken"),
    quantity: 1,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("chicken"),
    quantity: 1.2,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("chicken"),
    quantity: 0.5,
    unit: "kg",
  },
  {
    ingredient: getTestIngredient("pork"),
    quantity: 1.0,
    unit: "kg",
  }
].map((args) => {
  return new IngredientQuantity({
    ingredient: args.ingredient,
    quantity: args.quantity,
    unit: args.unit,
  });
});

export const getTestIngredientQuantity = (name: string, quantity: number, unit: string) => {
  const ingredientQuantity = TEST_INGREDIENT_QUANTITIES.find(
    (iq) => iq.ingredient.name === name && iq.quantity === quantity && iq.unit === unit
  );
  if (!ingredientQuantity) {
    throw new Error(
      `test ingredient quantity with name ${name}, quantity ${quantity}, and unit ${unit} could not be found`
    );
  }
  return ingredientQuantity;
};


export const TEST_FOOD_PRODUCTS = [
  {
    name: "hamPizza",
    ingredientQuantities: [
      getTestIngredientQuantity("ham", 0.1, "kg"),
      getTestIngredientQuantity("cheese", 0.2, "kg"),
      getTestIngredientQuantity("tomato", 0.3, "kg"),
      getTestIngredientQuantity("flour", 0.4, "kg"),
    ],
  },
  {
    name: "blueCheeseSalad",
    ingredientQuantities: [
      getTestIngredientQuantity("blueCheese", 0.5, "kg"),
      getTestIngredientQuantity("vinegar", 0.6, "kg"),
    ],
  },
  {
    name: "beefBurger",
    ingredientQuantities: [
      getTestIngredientQuantity("beef", 0.7, "kg"),
      getTestIngredientQuantity("oliveOil", 0.8, "kg"),
    ],
  },
  {
    name: "chickenPizza",
    ingredientQuantities: [
      getTestIngredientQuantity("chicken", 0.9, "kg"),
      getTestIngredientQuantity("oliveOil", 0.8, "kg"),
      getTestIngredientQuantity("flour", 0.4, "kg"),
    ],
  },
  {
    name: "porkBurger",
    ingredientQuantities: [
      getTestIngredientQuantity("pork", 1.0, "kg"),
      getTestIngredientQuantity("oliveOil", 0.8, "kg"),
    ],
  }
].map((args) => {
  return new FoodProduct({
    name: args.name,
    ingredientQuantities: args.ingredientQuantities,
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

export const seedTestIngredientQuantities = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const ingredientService = dataSource.getRepository(Ingredient);
  const ingredientQuantityService = dataSource.getRepository(IngredientQuantity)

  await ingredientQuantityService.save(TEST_INGREDIENT_QUANTITIES);
};

export const seedTestFoodProducts = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const foodProductService = dataSource.getRepository(FoodProduct);
  const ingredientService = dataSource.getRepository(Ingredient);
  const ingredientQuantityService = dataSource.getRepository(IngredientQuantity);

  await ingredientQuantityService.save(TEST_INGREDIENT_QUANTITIES);
  await foodProductService.save(TEST_FOOD_PRODUCTS);
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
  seedTestIngredients().catch((e) => console.error(e));
  seedTestIngredientQuantities().catch((e) => console.error(e));
  seedTestFoodProducts().catch((e) => console.error(e));
}
