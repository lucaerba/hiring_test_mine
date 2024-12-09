import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { Ingredient } from "./ingredient.entity";


let chickenIngredient: Ingredient;
beforeAll(async () => {
  await dataSource.initialize();
  chickenIngredient = new Ingredient({
    name: "chicken",
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
  });

  it("should throw an error if name is empty", () => {
    expect(() => new Ingredient({ name: "", })).toThrow(
      "Name cannot be empty"
    );
  });

});

