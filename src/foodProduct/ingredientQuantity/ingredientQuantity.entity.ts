import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IngredientQuantityFootprint } from "../../foodProductFootprint/ingredientQuantityFootprint/ingredientQuantityFootprint.entity";
import { Ingredient } from "../../ingredient/ingredient.entity";
import { FoodProduct } from "../foodProduct.entity";

@Entity("ingredient_quantities")
export class IngredientQuantity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => FoodProduct, foodProduct => foodProduct.ingredientQuantities,
        {
            cascade: true,
        }
    )
    foodProducts: FoodProduct[];

    @ManyToOne(() => Ingredient, ingredient => ingredient.ingredientQuantities, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn()
    ingredient: Ingredient;


    @OneToOne(() => IngredientQuantityFootprint, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    ingredientQuantityFootprint: IngredientQuantityFootprint;

    @Column({
        type: "float",
        nullable: false,
    })
    quantity: number;


    @Column({
        nullable: false,
    })
    unit: string;

    sanitize() {
        if (this.quantity <= 0) {
            throw new Error("Quantity cannot be negative");
        }
        if (this.unit === "") {
            throw new Error("Unit cannot be empty");
        }
        if (this.ingredient)
            this.ingredient.sanitize();
    }
    constructor(props: {
        ingredient: Ingredient;
        quantity: number;
        unit: string;
    }) {
        super();
        this.ingredient = props?.ingredient;
        this.quantity = props?.quantity;
        this.unit = props?.unit;

        this.sanitize();

    }

}