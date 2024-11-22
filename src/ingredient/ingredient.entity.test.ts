import { Ingredient } from "./ingredient";

describe("Ingredient Entity", () => {
  it("should create an ingredient with valid properties", () => {
    const ingredient = new Ingredient({
      name: "Sugar",
      unit: "grams",
      quantity: 100,
    });

    expect(ingredient.name).toBe("Sugar");
    expect(ingredient.unit).toBe("grams");
    expect(ingredient.quantity).toBe(100);
  });

  it("should throw an error if name is empty", () => {
    expect(() => {
      new Ingredient({
        name: "",
        unit: "grams",
        quantity: 100,
      });
    }).toThrowError("Name cannot be empty");
  });

  it("should throw an error if unit is empty", () => {
    expect(() => {
      new Ingredient({
        name: "Sugar",
        unit: "",
        quantity: 100,
      });
    }).toThrowError("Unit cannot be empty");
  });

  it("should throw an error if quantity is negative", () => {
    expect(() => {
      new Ingredient({
        name: "Sugar",
        unit: "grams",
        quantity: -100,
      });
    }).toThrowError("Quantity cannot be negative");
  });
});