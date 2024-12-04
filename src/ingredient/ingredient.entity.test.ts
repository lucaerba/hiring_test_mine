import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "./ingredient.entity";


let chickenIngredient: Ingredient;
beforeAll(async () => {
  await dataSource.initialize();
  chickenIngredient = new Ingredient({
    name: "chicken",
    unit: "kg",
    quantity: 1.2,
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
afterAll(async () => {
  await dataSource.destroy();
});

describe("constructor", () => {
  it("should create a new Ingredient", () => {
    expect(chickenIngredient.name).toBe("chicken");
    expect(chickenIngredient.unit).toBe("kg");
    expect(chickenIngredient.quantity).toBe(1.2);
  });

  it("should throw an error if name is empty", () => {
    expect(() => new Ingredient({ name: "", unit: "kg", quantity: 1.2 })).toThrow(
      "Name cannot be empty"
    );
  });

  it("should throw an error if unit is empty", () => {
    expect(() => new Ingredient({ name: "chicken", unit: "", quantity: 1.2 })).toThrow(
      "Unit cannot be empty"
    );
  });

  it("should throw an error if quantity is negative", () => {
    expect(() => new Ingredient({ name: "chicken", unit: "kg", quantity: -1.2 })).toThrow(
      "Quantity cannot be negative"
    );
  });

});

