import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IngredientQuantity } from "../foodProduct/ingredientQuantity/ingredientQuantity.entity";

@Entity("ingredients")
//make name, unit, quantity unique
@Index(["name",], { unique: true })
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @OneToMany(() => IngredientQuantity, ingredientQuantity => ingredientQuantity.ingredient,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  )
  ingredientQuantities: IngredientQuantity[];

  sanitize() {
    if (this.name === "") {
      throw new Error("Name cannot be empty");
    }

  }

  constructor(props: {
    name: string;
  }) {
    super();

    this.name = props?.name;
    this.sanitize();
  }
}