import { BaseEntity, Column, Entity, Index, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FoodProduct } from "../foodProduct/foodProduct.entity";
import { IngredientFootprint } from "../ingredientFootprint/ingredientFootprint.entity";

@Entity("ingredients")
//make name, unit, quantity unique
@Index(["name", "unit", "quantity"], { unique: true })
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  unit: string;

  @Column({
    type: "float",
    nullable: false,
  })
  quantity: number;

  @OneToOne(() => IngredientFootprint, ingredientFootprint => ingredientFootprint.ingredient,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  ingredientFootPrint: IngredientFootprint;

  @ManyToMany(type => FoodProduct, foodProduct => foodProduct.ingredients,
    {
      cascade: true,
    }
  )
  foodProducts: FoodProduct[];

  sanitize() {
    if (this.name === "") {
      throw new Error("Name cannot be empty");
    }

    if (this.unit === "") {
      throw new Error("Unit cannot be empty");
    }

    if (this.quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
  }

  constructor(props: {
    name: string;
    unit: string;
    quantity: number;
  }) {
    super();

    this.name = props?.name;
    this.unit = props?.unit;
    this.quantity = props?.quantity;
    this.sanitize();
  }
}