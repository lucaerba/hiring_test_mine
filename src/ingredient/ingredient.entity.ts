import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ingredients")
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