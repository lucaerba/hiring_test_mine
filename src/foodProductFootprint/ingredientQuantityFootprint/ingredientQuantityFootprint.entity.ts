import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IngredientQuantity } from "../../foodProduct/ingredientQuantity/ingredientQuantity.entity";

@Entity("ingredient_quantity_foot_prints")
export class IngredientQuantityFootprint extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => IngredientQuantity, ingredientQuantity => ingredientQuantity.ingredientQuantityFootprint,
        {
            cascade: ["insert"],
        }
    )
    @JoinColumn()
    ingredientQuantity: IngredientQuantity;

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
        ingredientQuantity: IngredientQuantity;
        score: number;
    }) {
        super();

        this.ingredientQuantity = props?.ingredientQuantity;
        this.score = props?.score;
        this.sanitize();
    }
}
