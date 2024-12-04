import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";

@Entity("ingredient_foot_prints")
export class IngredientFootprint extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Ingredient, ingredient => ingredient.ingredientFootPrint,
        {
            cascade: ["insert"],
        }
    )
    @JoinColumn()
    ingredient: Ingredient;

    @Column({
        type: "float",
        nullable: false,
    })
    score: number;

    sanitize() {

        if (this.score === 0) {
            throw new Error("Score cannot be 0");
        }
    }

    constructor(props: {
        ingredient: Ingredient;
        score: number;
    }) {
        super();

        this.ingredient = props?.ingredient;
        this.score = props?.score;
        this.sanitize();
    }
}
