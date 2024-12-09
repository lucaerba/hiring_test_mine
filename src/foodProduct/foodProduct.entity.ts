import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { IngredientQuantity } from "./ingredientQuantity/ingredientQuantity.entity";

@Entity("food_products")
@Index(["name"], { unique: true })
export class FoodProduct extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @ManyToMany(type => IngredientQuantity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
    })
    @JoinTable()
    ingredientQuantities: IngredientQuantity[];

    sanitize() {
        if (this.name === "") {
            throw new Error("Name cannot be empty");
        }

        if (this.ingredientQuantities)
            this.ingredientQuantities.forEach(IngredientQuantity => {
                IngredientQuantity.sanitize();
            });

    }

    constructor(props: {
        name: string;
        ingredientQuantities: IngredientQuantity[];
    }) {
        super();

        this.name = props?.name;
        this.ingredientQuantities = props?.ingredientQuantities;
        this.sanitize();
    }
}